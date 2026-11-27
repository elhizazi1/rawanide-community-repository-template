// Tests of the build tooling itself: the packer and rules shared with the SDK, and GitHub/GitLab detection.
// Run: node --test tools/tests/builder.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { collectFiles, makeZip } from '../lib/zip.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const fixture = path.join(root, 'tools/tests/fixtures/parity-extension')
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex')
const normalized = (file) => Buffer.from(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n'), 'utf8')

// These two files are byte-identical copies of the SDK's lib/zip.mjs and community-rules.json.
// Change them in the SDK first, then copy them here and update these constants (the SDK tests hold the same values).
const ZIP_MODULE_SHA256 = '539b2c718a5d1e13185a54ff55e41386ef82d1370a7f7408d6369bc42613c72f'
const COMMUNITY_RULES_SHA256 = '2a23b9b056d7e5ced2a486f40ee1c6a3acda45bd85bbe76318583214958fd38f'

test('shared packer and rules match the SDK fingerprints', () => {
  assert.equal(sha(normalized('tools/lib/zip.mjs')), ZIP_MODULE_SHA256)
  assert.equal(sha(normalized('tools/community-rules.json')), COMMUNITY_RULES_SHA256)
})

test('build.mjs uses the shared packer and rules instead of its own copies', () => {
  const source = fs.readFileSync(path.join(root, 'tools/build.mjs'), 'utf8')
  assert.match(source, /from '\.\/lib\/zip\.mjs'/)
  assert.match(source, /tools\/community-rules\.json/)
  assert.doesNotMatch(source, /function makeZip|deflateRawSync/)
})

test('packing is deterministic and ignores .DS_Store', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rawanide-packer-'))
  try {
    fs.cpSync(fixture, temp, { recursive: true })
    const first = makeZip(collectFiles(temp))
    fs.writeFileSync(path.join(temp, '.DS_Store'), 'junk')
    assert.ok(makeZip(collectFiles(temp)).equals(first))
  } finally { fs.rmSync(temp, { recursive: true, force: true }) }
})

// ---- end-to-end builds in a temporary copy of this template ----
const CI_VARS = /^(GITHUB_|GITLAB_|CI_|CI$|RAWANIDE_SDK_|RAWANIDE_TEST_SDK_)/
const PLATFORM_ENV = {
  github: { GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'test/repo', GITHUB_REF_NAME: 'main' },
  gitlab: { GITLAB_CI: 'true', CI_PROJECT_PATH: 'test/repo', CI_DEFAULT_BRANCH: 'main', CI_PAGES_URL: 'https://test.gitlab.io/repo', CI_PROJECT_URL: 'https://gitlab.com/test/repo' },
  none: {},
}
function build({ env = 'none', config = {}, mutateManifest } = {}) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rawanide-repo-'))
  fs.cpSync(root, temp, { recursive: true, filter: (src) => !/[\\/](node_modules|extensions|\.git)([\\/]|$)/.test(src) })
  // This is a fresh fixture repository, not a copy of the publisher's release history.
  fs.rmSync(path.join(temp, 'repository.json'), { force: true })
  const cfg = JSON.parse(fs.readFileSync(path.join(temp, 'repo.config.json'), 'utf8'))
  Object.assign(cfg, { owner: 'test', repo: 'repo' }, config)
  cfg.extensions = [{ src: 'extension-src/parity-extension', releaseDate: '2026-11-20', changelog: { en: 'Test.' }, tags: [] }]
  fs.writeFileSync(path.join(temp, 'repo.config.json'), JSON.stringify(cfg, null, 2))
  fs.cpSync(fixture, path.join(temp, 'extension-src/parity-extension'), { recursive: true })
  if (mutateManifest) {
    const file = path.join(temp, 'extension-src/parity-extension/manifest.json')
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8')); mutateManifest(manifest); fs.writeFileSync(file, JSON.stringify(manifest, null, 2))
  }
  const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !CI_VARS.test(k)))
  const result = spawnSync(process.execPath, ['tools/build.mjs'], { cwd: temp, encoding: 'utf8', env: { ...clean, ...PLATFORM_ENV[env] } })
  const archive = path.join(temp, 'extensions/local.parity-fixture/1.0.0/local.parity-fixture-1.0.0.r1')
  const catalog = fs.existsSync(path.join(temp, 'repository.json')) ? JSON.parse(fs.readFileSync(path.join(temp, 'repository.json'), 'utf8')) : null
  return { result, catalog, archive: fs.existsSync(archive) ? fs.readFileSync(archive) : null, cleanup: () => fs.rmSync(temp, { recursive: true, force: true }) }
}

test('GitHub and GitLab builds produce the same archive as the shared packer', () => {
  const expected = makeZip(collectFiles(fixture))
  const github = build({ env: 'github' }), gitlab = build({ env: 'gitlab' })
  try {
    assert.equal(github.result.status, 0, github.result.stderr)
    assert.equal(gitlab.result.status, 0, gitlab.result.stderr)
    assert.ok(github.archive.equals(expected), 'GitHub build equals makeZip output')
    assert.ok(gitlab.archive.equals(expected), 'GitLab build equals makeZip output')
    assert.match(github.catalog.repositoryUrl, /^https:\/\/github\.com\/test\/repo$/)
    assert.match(github.catalog.extensions[0].downloadUrl, /^https:\/\/raw\.githubusercontent\.com\/test\/repo\/main\//)
    assert.match(gitlab.catalog.repositoryUrl, /^https:\/\/gitlab\.com\/test\/repo$/)
    assert.match(gitlab.catalog.extensions[0].downloadUrl, /^https:\/\/test\.gitlab\.io\/repo\//)
  } finally { github.cleanup(); gitlab.cleanup() }
})

test('platform comes from repo.config.json when no CI is running', () => {
  const gitlab = build({ config: { platform: 'gitlab' } })
  try {
    assert.equal(gitlab.result.status, 0, gitlab.result.stderr)
    assert.equal(gitlab.catalog.repositoryUrl, 'https://gitlab.com/test/repo')
  } finally { gitlab.cleanup() }
})

test('a build without any platform information fails clearly', () => {
  const none = build({ config: { platform: undefined } })
  try {
    assert.notEqual(none.result.status, 0)
    assert.match(none.result.stderr, /Set "platform" to "github" or "gitlab"/)
  } finally { none.cleanup() }
})

test('the builder enforces the same community rules as the SDK', () => {
  const cases = [
    ['missing localizedMetadata', (m) => { delete m.localizedMetadata }, /localizedMetadata\.en is required/],
    ['blocked permission', (m) => { m.permissions = ['UI_ACCESS', 'TERMINAL_ACCESS'] }, /sensitive permissions are not allowed/],
    ['preview-js runtime', (m) => { m.runtime = 'preview-js' }, /community repositories allow only/],
    ['missing icon file', (m) => { m.icon = 'assets/missing.svg' }, /icon "assets\/missing\.svg" not found/],
  ]
  for (const [label, mutateManifest, pattern] of cases) {
    const run = build({ env: 'github', mutateManifest })
    try {
      assert.notEqual(run.result.status, 0, label + ' should fail')
      assert.match(run.result.stderr, pattern, label)
    } finally { run.cleanup() }
  }
})

test('fresh GitHub template can publish, claim, rebuild and preserve identity', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'rawanide-claim-'))
  try {
    fs.cpSync(root, temp, { recursive: true, filter: src => !/[\\/](\.git|node_modules|extensions)([\\/]|$)/.test(src) })
    const read = file => JSON.parse(fs.readFileSync(path.join(temp, file), 'utf8'))
    const save = cfg => fs.writeFileSync(path.join(temp, 'repo.config.json'), JSON.stringify(cfg))
    const run = (repo = 'test/new-repo') => spawnSync(process.execPath, ['tools/build.mjs'], { cwd: temp, encoding: 'utf8', env: { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => !CI_VARS.test(k))), ...PLATFORM_ENV.github, GITHUB_REPOSITORY: repo } })
    const ok = result => assert.equal(result.status, 0, result.stderr)
    ok(run())
    const initial = read('repository.json')
    assert.notEqual(initial.id, 'community.example.repository')
    assert.match(initial.id, /^[a-z0-9][a-z0-9._-]{2,63}$/)
    assert.equal(initial.id, read('repo.config.json').repository.id)
    assert.equal(initial.repositoryUrl, 'https://github.com/test/new-repo')
    assert.equal(initial.verification, undefined)
    const cfg = read('repo.config.json')
    cfg.verification = 'rwm-' + 'A'.repeat(24); save(cfg)
    ok(run()); ok(run())
    assert.equal(read('repository.json').verification, cfg.verification)
    assert.equal(read('repository.json').id, initial.id)
    cfg.verification = 'rwm-' + 'B'.repeat(24); save(cfg)
    assert.notEqual(run().status, 0)
    assert.equal(read('repository.json').verification, 'rwm-' + 'A'.repeat(24))
    cfg.verification = 'rwm-' + 'A'.repeat(24); cfg.repository.id = 'community.changed'; save(cfg)
    assert.notEqual(run().status, 0)
    assert.equal(read('repository.json').id, initial.id)
  } finally { fs.rmSync(temp, { recursive: true, force: true }) }
})

// Integration checks use temporary repositories; no published files are changed.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const sdk = process.env.RAWANIDE_TEST_SDK_COMMAND
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(GITHUB_|GITLAB_|CI_|CI$|RAWANIDE_SDK_|RAWANIDE_TEST_SDK_)/.test(key)))
function repository(kind = 'search', apiVersion) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rawanide-sdk-alignment-'))
  fs.cpSync(root, dir, { recursive: true, filter: source => !/[\\/](node_modules|extensions|\.git|public|dist)([\\/]|$)/.test(source) })
  // Synthetic builds must not inherit a real publisher's pinned release catalog.
  fs.rmSync(path.join(dir, 'repository.json'), { force: true })
  const src = path.join(dir, 'extension-src/example')
  fs.cpSync(path.join(root, kind === 'search' ? 'examples/hosted-js-project-search' : 'tools/tests/fixtures/parity-extension'), src, { recursive: true })
  const manifest = JSON.parse(fs.readFileSync(path.join(src, 'manifest.json'), 'utf8'))
  if (apiVersion) { manifest.apiVersion = apiVersion; fs.writeFileSync(path.join(src, 'manifest.json'), JSON.stringify(manifest, null, 2)) }
  const config = JSON.parse(fs.readFileSync(path.join(dir, 'repo.config.json'), 'utf8'))
  config.verification = 'rwm-' + 'A'.repeat(24); config.repository.id = 'community.sdk-test.rawanide'; config.owner = 'example'; config.repo = 'extensions'; config.branch = 'main'
  config.extensions = [{ src: 'extension-src/example', releaseDate: '2026-11-22', changelog: { en: 'Compatibility check.', ar: 'فحص التوافق.' }, tags: [] }]
  fs.writeFileSync(path.join(dir, 'repo.config.json'), JSON.stringify(config, null, 2))
  const run = (args, extra = {}) => spawnSync(process.execPath, args, { cwd: dir, encoding: 'utf8', env: { ...cleanEnv(), ...extra } })
  const configured = run(['tools/build.mjs','--configure']); assert.equal(configured.status,0,configured.stderr)
  const archive = path.join(dir, 'extensions', manifest.id, manifest.version, `${manifest.id}-${manifest.version}.r1`)
  return { dir, src, manifest, archive, run, dispose: () => fs.rmSync(dir, { recursive: true, force: true }) }
}

test('API 1.0 and API 1.1 remain distinct in the unchanged repository protocol', () => {
  for (const [kind, version] of [['legacy', '1.0'], ['search', '1.1']]) {
    const repo = repository(kind)
    try {
      const built = repo.run(['tools/build.mjs']); assert.equal(built.status, 0, built.stderr)
      const catalog = JSON.parse(fs.readFileSync(path.join(repo.dir, 'repository.json'), 'utf8'))
      assert.equal(catalog.protocol, '1.0'); assert.equal(catalog.extensions[0].apiVersion, version)
      assert.equal(catalog.extensions[0].version, repo.manifest.version)
      const verified = repo.run(['tools/tests/verify-build.mjs']); assert.equal(verified.status, 0, verified.stderr)
      const before = fs.readFileSync(repo.archive)
      const again = repo.run(['tools/build.mjs']); assert.equal(again.status, 0, again.stderr)
      assert.ok(fs.readFileSync(repo.archive).equals(before), 'published archive bytes must be reused')
      const file = path.join(repo.src, repo.manifest.entrypoint)
      fs.appendFileSync(file, '\n// changed after publication\n')
      const changed = repo.run(['tools/build.mjs']); assert.notEqual(changed.status, 0)
      assert.ok(fs.readFileSync(repo.archive).equals(before), 'a changed source must not overwrite a published version')
    } finally { repo.dispose() }
  }
})

test('project search example has bilingual metadata, license and replaceable icon', () => {
  const folder = path.join(root, 'examples/hosted-js-project-search')
  const manifest = JSON.parse(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8'))
  assert.equal(manifest.apiVersion, '1.1'); assert.ok(manifest.permissions.includes('FILE_READ'))
  assert.ok(manifest.localizedMetadata.en.name); assert.ok(manifest.localizedMetadata.ar.name)
  for (const file of ['LICENSE', 'README.md', 'README.ar.md', manifest.icon, manifest.entrypoint]) assert.ok(fs.existsSync(path.join(folder, file)))
})

test('enabled SDK validation applies repository rules and preserves exact SDK archive bytes', { skip: !sdk && 'Set RAWANIDE_TEST_SDK_COMMAND to an SDK 1.1.0 executable' }, () => {
  for (const kind of ['legacy', 'search']) {
    const repo = repository(kind)
    try {
      const built = repo.run(['tools/build.mjs'], { RAWANIDE_SDK_VALIDATE: '1', RAWANIDE_SDK_COMMAND: sdk })
      assert.equal(built.status, 0, built.stderr + built.stdout)
      assert.match(built.stdout, /and community repository rules/)
      const output = path.join(repo.dir, 'sdk-output.r1')
      const packed = spawnSync(sdk, ['pack', repo.src, output, '--repository'], { cwd: repo.dir, encoding: 'utf8', env: cleanEnv(), shell: false })
      assert.equal(packed.status, 0, packed.stderr + packed.stdout)
      assert.ok(fs.readFileSync(output).equals(fs.readFileSync(repo.archive)), 'SDK and repository packers must produce identical archives')
    } finally { repo.dispose() }
  }
})

test('enabled SDK validation rejects a future API before packaging a release', { skip: !sdk && 'Set RAWANIDE_TEST_SDK_COMMAND to an SDK 1.1.0 executable' }, () => {
  const repo = repository('search', '1.2')
  try {
    const built = repo.run(['tools/build.mjs'], { RAWANIDE_SDK_VALIDATE: '1', RAWANIDE_SDK_COMMAND: sdk })
    assert.notEqual(built.status, 0); assert.match(built.stderr + built.stdout, /SDK validation failed/)
    assert.equal(fs.existsSync(repo.archive), false)
  } finally { repo.dispose() }
})

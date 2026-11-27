# SDK 1.1.0 integration

[العربية](SDK_INTEGRATION.ar.md)

The template builds a community repository. The SDK builds and checks extensions. API Explorer checks the host environment and saved extension sources inside RawanIDE. These are separate responsibilities; neither the SDK nor API Explorer is bundled with the repository website.

| Number | Meaning |
| --- | --- |
| SDK `1.1.0` | Developer CLI/templates/types used for this alignment |
| Manifest `apiVersion: "1.1"` | Minimum host API when using project search |
| Manifest `apiVersion: "1.0"` | Still correct for extensions using only baseline interfaces |
| Catalog `protocol: "1.0"` | Existing repository protocol, unchanged |
| `.r1` format `1` | Existing archive format, unchanged |
| Extension `version` | Publisher-controlled release version, independent of the above |

Installing SDK 1.1.0 does not upgrade the user's Android host. Requiring API 1.1 excludes API 1.0-only hosts for that extension. Do not force API 1.1 on extensions that do not need it, and never edit or repack an already published version.

## Local checks and repository build

Install SDK 1.1.0 using the npm command below. For offline environments, install a downloaded archive with `npm install --global /path/to/elhizazi1-extension-sdk-1.1.0.tgz`. Hosted CI installation requires registry access or an archive accessible to the runner.

```sh
npm install --global @elhizazi1/extension-sdk@1.1.0
rawanide-sdk help
rawanide-sdk validate extension-src/my-extension --repository
rawanide-sdk audit extension-src/my-extension --repository
RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs --extensions
node --test tools/tests/*.test.mjs
node tools/tests/verify-build.mjs
node tools/identity-guard.mjs
```

The SDK must be on PATH. On Termux, use the normal SDK command installed for your environment. `RAWANIDE_SDK_COMMAND` can point to a different executable; it is an executable path/name, not a shell command with arguments. When enabled, the builder runs `rawanide-sdk validate <source> --repository` with no shell. Validator failure or an unavailable executable stops the build. Without `RAWANIDE_SDK_VALIDATE=1`, SDK installation remains optional; the builder still enforces its community rules and immutable archive checks, but does not replace full host-contract validation.

The repository accepts source folders under `extension-src/`. Add each intended source to `repo.config.json` with `src`, `releaseDate`, `changelog.en` and `tags`; see the root README. The builder creates deterministic packages and reuses existing matching archives. Do not copy a prepacked `.r1` over a published version. Review your ID, publisher, license, icon and English/Arabic metadata before first publication. Keep existing `repository.id`, published archives, hashes, URLs and release history when updating the tooling in an existing repository.

## Optional CI validation

- GitHub: set the repository Actions variable `RAWANIDE_SDK_VALIDATE` to `1` under Settings → Secrets and variables → Actions → Variables. The workflow installs exactly `@elhizazi1/extension-sdk@1.1.0` before building.
- GitLab: set a project CI/CD variable `RAWANIDE_SDK_VALIDATE=1`. The build job installs the same pinned package before building.

No token is required to install the public npm package. Both pipelines run the tooling tests and generated-output verification. SDK installation is optional and disabled by default. CI installation requires npm connectivity; verify the platform workflow and deployment independently of local tests.

## Project search example

`examples/hosted-js-project-search/` is the SDK 1.1.0 example, including a replaceable icon, license, bilingual metadata and README. It is outside `extension-src/` and not configured for publication. Copy it into `extension-src/` only when you want to publish your own adapted extension; replace its example ID/publisher and review its license and version first.

It requires `apiVersion: "1.1"`, `FILE_READ`, and `UI_ACCESS` for the results panel. `workspace.findFiles` finds saved files and `workspace.findText` searches literal text in saved UTF-8 project files, including closed documents. They do not search unsaved buffers, execute matches, open the manual search UI, or grant arbitrary device-file access. Handle `ok`, cancellation, partial results and skipped files. See the exact [English contract](workspace-search-1.1.md) or [Arabic contract](workspace-search-1.1.ar.md), for SDK 1.1.0.

## API Explorer development checks

Use a host supporting API 1.1, install the extension under development, and use the current API Explorer's environment check to inspect actual host capabilities. For source checks, open the extension project and save changes before scanning. Finding a method name or TODO in a source file is static inspection; it does not prove import/execution, successful API calls, or an absence of defects. Counts may be limited or include skipped files. API Explorer is not a repository dependency, and the community repository does not add itself to the Marketplace automatically.

A meaningful device check invokes the example command on a test project containing a known saved TODO in a closed `.js` file. Check that the results point to that file and that language follows the app selection. Test missing-project/permission failures as appropriate. SDK validation, repository tests, and archive parity do not substitute for this host runtime test.

## Shared files and archive parity

`tools/community-rules.json` and `tools/lib/zip.mjs` are byte-identical to the SDK 1.1.0 rules and packer. Their fingerprints are tested. Change them upstream first, then update both templates and the fingerprint tests together. Community rules restrict the host contract: `preview-js`, terminal/process and arbitrary device-file permissions are not allowed here, and English metadata plus an existing icon are required.

For a source-checkout integration run with an SDK executable on PATH:

```sh
RAWANIDE_TEST_SDK_COMMAND=rawanide-sdk node --test tools/tests/sdk-1.1.test.mjs
```

The optional SDK integration test validates API 1.0 and API 1.1 sources, compares SDK and repository archive bytes, and checks that SDK failures stop publication. Without the explicit test command variable, those external-tool checks are skipped; offline builder regression tests still run. Tests work in temporary directories and do not publish or alter existing releases.

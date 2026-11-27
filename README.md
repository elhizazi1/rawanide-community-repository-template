<div align="center">

# RawanIDE Community Repository — GitHub Template

🚀 **Publish RawanIDE `.r1` extensions on GitHub.**

<p align="center">
<img alt="Platform: GitHub" src="https://img.shields.io/badge/Platform-GitHub-243452?style=for-the-badge" />
<img alt="Publishing: GitHub Pages" src="https://img.shields.io/badge/Pages-GitHub%20Pages-c9a45b?style=for-the-badge" />
<img alt="Automation: GitHub Actions" src="https://img.shields.io/badge/CI-GitHub%20Actions-19b9ad?style=for-the-badge" />
<img alt="Extension format: .r1" src="https://img.shields.io/badge/Extensions-.r1-555?style=for-the-badge" />
</p>

[العربية](README.ar.md) · **English**

[Overview](#overview) · [Use it in RawanIDE](#use-a-published-repository-in-rawanide) · [Quick start](#quick-start) · [Add an extension](#add-an-extension) · [Build and verify](#build-and-verify) · [Publish on GitHub](#publish-on-github) · [Safety](#identity-and-published-packages)

</div>

---

<a id="overview"></a>

## 🌟 Overview

An open starting point for publishing and cataloging RawanIDE `.r1` extensions on **GitHub**. It builds a catalog (`repository.json`), one packaged `.r1` for every extension version, and a customizable website with extension pages and an About page. `setup.html` is a local editor for the public profile, and GitHub Actions automates publishing. No new Android app is required.

> 🧩 Build with the SDK ➜ 📁 put the source in `extension-src/` ➜ 🔨 `node tools/build.mjs --extensions` ➜ 🚀 publish ➜ 📲 users add your repository

| You are… | Read |
| :-- | :-- |
| 👤 A RawanIDE user | [Use a published repository in RawanIDE](#use-a-published-repository-in-rawanide) |
| 🧑‍💻 An extension developer | Build and validate the extension with the [RawanIDE Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk), then [Add an extension](#add-an-extension) |
| 🗂️ A repository publisher | [Quick start](#quick-start), then [Publish on GitHub](#publish-on-github) |
| 🤝 A contributor to this template | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [Build and verify](#build-and-verify) |

<a id="use-a-published-repository-in-rawanide"></a>

## 📲 Use a published repository in RawanIDE

For people who want to install extensions from a repository made with this template. If you adapt this README for your own repository, keep or edit this section.

1. In RawanIDE, open **Extensions**, then the **Repositories** tab.
2. Tap **Add repository** and paste the repository link shown on the repository's website. It is the project address, `https://github.com/<owner>/<repo>`.
3. Open the repository and install the extension you want. If you already have the `.r1` file, use **Install .r1** instead.

Add a repository only if you trust its publisher, and review the permissions listed on each extension's page before installing.

<a id="quick-start"></a>

## ⚡ Quick start

1. Create a public repository using **Use this template** and wait for **Initialize Repository**; run it manually once if it does not start automatically.
2. Follow [Marketplace registration](#marketplace-registration) to customize the ID, add the verification code and configure the catalog. No extensions are needed yet.
3. After verification, follow [Add an extension](#add-an-extension) and choose GitHub Actions or a local terminal to build.

> 💡 **Tip:** the builder has no npm dependencies, so Node.js alone is enough, even in Termux.

**Configuration boundaries:** `developer.json` controls display information (names, description, avatar, and the `website`, `github`, `gitlab`, and `email` links). `repo.config.json` controls repository identity, the extension list, and hosting; its `platform` value (`github` or `gitlab`) is already set for this template, and the CI that runs the build takes precedence. Editing the profile does **not** change `repository.id` or Marketplace verification.

<a id="add-an-extension"></a>

## 🧩 Add an extension

1. Build and check the extension with the [RawanIDE Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) (`rawanide-sdk init`, `validate`, `audit`).
2. Copy the extension's **source folder** to `extension-src/<name>/`. Do not copy a `.r1` made by `rawanide-sdk pack`: this builder packs the folder itself, deterministically, and records the SHA-256.
3. Make sure the manifest meets the requirements below. `rawanide-sdk validate extension-src/<name> --repository` checks them for you.
4. Add an entry to `extensions` in `repo.config.json`:

```json
{
  "extensions": [
    {
      "src": "extension-src/my-extension",
      "releaseDate": "2026-11-20",
      "changelog": { "en": "First release." },
      "tags": ["tools"]
    }
  ]
}
```

| Entry field | Required | Meaning |
| :-- | :-- | :-- |
| `src` | yes | A folder like `extension-src/<name>` that contains `manifest.json` |
| `releaseDate` | yes | Release date as `YYYY-MM-DD` |
| `changelog.en` | yes | Release notes in English |
| `tags` | yes | An array of strings (it may be empty) |
| `license` | no | A short license ID shown in the listing, such as `MIT` |
| `screenshots` | no | Up to 8 images placed in `extensions/<id>/screenshots/` (png, webp, jpg; 2 MB each), listed by file name with optional captions. They live outside the package, so adding them never changes the `.r1` |
| `runtimeOverride` | no | The runtime to list when it must differ from the packaged manifest |

**Manifest requirements of this builder:**

- `localizedMetadata.en` with `name` and `description` (add `localizedMetadata.ar` for the Arabic pages), and an `icon` that points to an existing file. Fill in `publisher`, `description`, and `category` too: they appear in the catalog.
- `runtime` must be `declarative` or `hosted-js` (or omitted). `preview-js` is not accepted.
- These permissions are not allowed: `TERMINAL_ACCESS`, `PROCESS_EXECUTION`, `DEVICE_FILES_READ`, `DEVICE_FILES_WRITE`.
- A unique `id`, and a new `version` for every release. A published `.r1` is never rewritten.

```json
"localizedMetadata": {
  "en": { "name": "My Extension", "description": "What it does." },
  "ar": { "name": "إضافتي", "description": "ماذا تفعل." }
}
```

**Releasing a new version:** bump `version` in the extension's manifest, then update `releaseDate` and `changelog` for it in `repo.config.json`. Earlier versions stay listed, and their `.r1` files are never touched.

<a id="build-and-verify"></a>

## 🔨 Build and verify

Node.js 22 is recommended (the CI uses it); the builder has no npm dependencies. From the repository root:

```sh
node tools/build.mjs --extensions
node tools/tests/verify-build.mjs
```

The builder generates `repository.json`, one `.r1` per extension version, and the site pages:

```text
repository.json
index.html, about/index.html        (embedded data refreshed)
extensions/<id>/index.html          (redirect to the latest version)
extensions/<id>/<version>/<id>-<version>.r1
extensions/<id>/<version>/marketplace.json, icon, index.html
```

If an existing `.r1` no longer matches its source, the build stops and asks you to bump the version. A newly generated `repository.json` is not automatically registered with the Marketplace. When you manually run the workflow, it commits the generated files for you. If you also build locally, commit the generated files as well.

To audit identity and package integrity without changing any file, run `node tools/identity-guard.mjs`.

<a id="optional-sdk-validation"></a>

### 🔌 Optional SDK validation

The RawanIDE Extension SDK is a **separate npm tool**. This template is aligned with **SDK 1.1.0 / host API 1.1**, while retaining API 1.0 extensions and repository protocol 1.0. Install the pinned SDK to validate each source with `--repository` before packaging:

Install SDK 1.1.0 from the public npm registry using the command below. An offline installation can use a downloaded SDK archive: `npm install --global /path/to/elhizazi1-extension-sdk-1.1.0.tgz`. Replace the example path with the archive location.

```sh
npm install --global @elhizazi1/extension-sdk@1.1.0
rawanide-sdk help
RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs --extensions
node tools/tests/verify-build.mjs
```

The environment-variable syntax works in Termux and other POSIX shells. SDK validation is **off by default**, a failure stops the build, and the builder still packages the `.r1` files itself. See [`docs/SDK_INTEGRATION.md`](docs/SDK_INTEGRATION.md).

<a id="publish-on-github"></a>

## 🚀 Publish on GitHub

### Marketplace registration

1. Create a public repository using **Use this template**. Wait for **Initialize Repository** to finish; if GitHub does not dispatch the initial push, run it manually once. It only fills owner, repo, branch and hosting URLs in `repo.config.json`.
2. Replace `example` in `community.example.rawanide` (or choose another unique ID). Customize `developer.json` for display identity. Sign in to Marketplace with Google and link GitHub. In **Your repositories**, enter the chosen ID and public GitHub repository URL; no initial build is needed.
3. Put the issued `rwm-...` code in the root `verification` field of `repo.config.json`, commit all edits, then choose **Configure Repository** on main or the local terminal method below. It updates repository identity and preserves the extension list.
4. Check the root `repository.json`, then select **Verify now** in Marketplace. Pages is not required.
5. Develop extensions, commit and push, then choose **Build Extensions** or the local terminal method below. It updates packages, extension listings and embedded page data without changing catalog identity.
6. Optional website: Settings → Pages → Source → **GitHub Actions**, then manually run **Deploy Website**. No build or source commit occurs during deployment.

All workflows share a concurrency group. Wait for completion before editing; if new commits arrive, the writing workflow refuses to overwrite them. Pull generated commits locally (`git pull --ff-only`). See [platform guide](docs/PLATFORM.md).


### 💻 Termux or desktop terminal — alternative to GitHub Actions

Install Git and Node.js (22 recommended), then clone your repository after initialization finishes. On Termux, use `pkg install git nodejs` (the available Node.js version may vary). The Node and Git commands also work in Windows, Linux and macOS terminals. Run from the repository root on main; do not run a writing workflow concurrently.

Before editing, ensure your working tree is clean and run `git pull --ff-only origin main`. If it fails, review the divergence; never force push.

**Configure once:** after editing the ID and verification code in `repo.config.json` and customizing `developer.json` if needed:

```sh
node tools/build.mjs --configure
```

Review `git diff`, then commit and push the configuration and generated files:

```sh
git add -- repo.config.json developer.json repository.json index.html about
git commit -m "Configure repository"
git push origin main
```

After the push succeeds, select **Verify now** in Marketplace. Do not run Configure Repository again just to update extensions.

**Build extensions:** after verification, edit extension sources and their entries in `repo.config.json`, then run:

```sh
node tools/build.mjs --extensions
node tools/tests/verify-build.mjs
```

Review changes and stage sources, generated packages and pages (and any other intended assets), then commit and push:

```sh
git add -- repo.config.json extension-src extensions repository.json index.html about
git commit -m "Update extensions"
git push origin main
```

Do not run Build Extensions again after a local build. A push does not automatically build or deploy. Website deployment remains optional via Deploy Website. If Git rejects a push because newer commits arrived, review and integrate them, then regenerate as needed.

<a id="customize-the-website"></a>

## 🎨 Customize the website

Use `setup.html` to edit the profile and export `developer.json`. The public website can be redesigned independently of the `repository.json` protocol; edit `assets/site.css`, `index.html`, `about/index.html`, and `tools/extension-page.template.html`, and keep the `<!--DATA-->` markers on pages that need embedded offline data. `setup.html` is a local authoring tool, not a public profile page or an administration portal; the public About page uses the exported developer data. The website uses the Maghribi Assile font (`assets/fonts/maghribi-assile.ttf`), licensed under the SIL Open Font License 1.1 (see [`assets/fonts/FONT_LICENSE.md`](assets/fonts/FONT_LICENSE.md)); keep that notice if you redistribute the font, or replace it in `assets/site.css`.

<a id="identity-and-published-packages"></a>

## 🔐 Identity and published packages

- Never reuse another publisher's `repository.id` or verification token.
- When you claim the repository in the RawanIDE Marketplace, put the verification code you receive in `verification` in `repo.config.json`. Add the code before the first Configure Repository run; run Configure Repository and wait for the generated `repository.json` to be published before verifying. Do not edit `repository.json` manually. After registration, do **not** change the repository ID or the verification token. Follow the current Marketplace registration process.
- Previously published `.r1` packages must remain byte-identical; changing them breaks their SHA-256 integrity.
- Keep this template specific to GitHub; do not copy configuration from another platform.

<a id="troubleshooting"></a>

## 🩺 Troubleshooting

| Symptom | Check first |
| :-- | :-- |
| `Configure a valid …` (`owner`, `repo`, `branch`, or GitLab namespace) | Placeholders such as `YOUR_…` remain and the identity could not be detected; set `owner` and `repo`, or add the Git `origin` remote |
| `localizedMetadata.en is required`, or another manifest error | The extension's manifest lacks something this builder requires; see [Add an extension](#add-an-extension) |
| `… already exists and … has changed` | A published `.r1` is immutable: bump `version` in the extension's manifest |
| Missing extensions | The `extensions` list in `repo.config.json` and each `src` path |
| Incorrect profile or avatar | Regenerate `developer.json` with `setup.html`, then rebuild |
| Wrong site or package URLs | Owner, repository, and branch, and the `hosting` settings; in CI the URLs come from the CI environment |
| The website shows 404 | GitHub Pages is not enabled or has not finished deploying; see `docs/PLATFORM.md` |
| SDK validation error | Run `rawanide-sdk validate extension-src/<name>` and fix the manifest |
| Integrity or identity-guard failure | Restore the exact previously published `.r1` or `repository.json`; do not silently repack |

**For contributors:** submit changes through the repository's normal review process. Keep each extension's license and documentation accurate, avoid secrets in committed files, and never reuse another publisher's verification credentials.

<a id="documentation"></a>

## 📚 Documentation

| File | Purpose |
| :-- | :-- |
| [`docs/PLATFORM.md`](docs/PLATFORM.md) | GitHub publishing: one-time setup, URLs, releases |
| [`docs/SDK_INTEGRATION.md`](docs/SDK_INTEGRATION.md) | Optional SDK validation, and what the builder checks beyond it |
| [`docs/IDENTITY_SAFETY.md`](docs/IDENTITY_SAFETY.md) | Repository identity and package integrity |
| [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md) | Profile and configuration |
| [`docs/DESIGN_CUSTOMIZATION.md`](docs/DESIGN_CUSTOMIZATION.md) | Website design |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the pieces fit |
| [`docs/RELEASE_TESTS.md`](docs/RELEASE_TESTS.md) | Build verification |

<a id="license"></a>

## 📄 License

This template is released under the MIT license; see [LICENSE](LICENSE). The bundled font keeps its own license, described in [`assets/fonts/FONT_LICENSE.md`](assets/fonts/FONT_LICENSE.md).

---

<div align="center">

💚 **RawanIDE Community · GitHub**

</div>

The full bundled font license is included as [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt), with upstream credits in [`assets/fonts/AUTHORS.txt`](assets/fonts/AUTHORS.txt). Preserve these files in redistributed templates and published sites.

## SDK 1.1 and API Explorer

Use the lowest API your extension requires: keep `apiVersion: "1.0"` for baseline extensions; use `"1.1"` when calling `workspace.findFiles` or `workspace.findText`, with `FILE_READ`. SDK version `1.1.0`, host API `1.1`, repository protocol `1.0` and each extension's version have different purposes. Do not bump old package versions or rewrite published archives merely to refresh this template.

### Six official starter templates

The `examples/` directory contains exact copies of the SDK 1.1.0 templates. Copy a starter into a separate source directory, customize its extension ID, publisher and metadata, then register its source path in `repo.config.json`. Examples are not built or published automatically; the new repository starts with an empty `extensions` list.

| Template | Purpose |
|---|---|
| [`declarative`](examples/declarative/README.md) | Declarative contributions without JavaScript |
| [`hosted-js`](examples/hosted-js/README.md) | JavaScript command and toast |
| [`hosted-js-panel`](examples/hosted-js-panel/README.md) | Offline HTML panel |
| [`hosted-js-selection-panel`](examples/hosted-js-selection-panel/README.md) | Read-only selected-text panel |
| [`hosted-js-safe-edit`](examples/hosted-js-safe-edit/README.md) | Confirmed selection replacement |
| [`hosted-js-project-search`](examples/hosted-js-project-search/README.md) | Workspace file and text search (API 1.1) |

See [SDK integration and the complete test flow](docs/SDK_INTEGRATION.md), [search contract](docs/workspace-search-1.1.md), and [Arabic integration guide](docs/SDK_INTEGRATION.ar.md). API Explorer is an optional app-side development aid, not a repository dependency, certification, or proof that scanned source code executed successfully.

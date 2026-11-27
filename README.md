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

> 🧩 Build with the SDK ➜ 📁 put the source in `extension-src/` ➜ 🔨 `node tools/build.mjs` ➜ 🚀 publish ➜ 📲 users add your repository

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

1. Create a **new GitHub repository/project** from this template (or import the files). Keep the repository public: RawanIDE downloads `repository.json` and the packages from `raw.githubusercontent.com` without signing in.
2. Edit `repo.config.json`: optionally set `repository.id` to a **unique ID** before first publication (3–64 lowercase letters, digits, `.`, `_`, `-`; reserved Marketplace IDs are not allowed). If left at the template default, the first build generates and saves an ID from the actual repository identity. `owner`, `repo`, and `branch` are detected from GitHub Actions or from the Git `origin` remote; the values in the file are only a fallback (for example when building from a downloaded ZIP). If you do need to set them, `owner` is your GitHub username or organization and `repo` is your repository name.
3. Open `setup.html` locally in a browser, enter the developer and repository display information, export `developer.json`, and put it in the repository root. For the avatar, use a file under `assets/` or an HTTPS link.
4. Add your extensions: see [Add an extension](#add-an-extension).
5. [Build and verify](#build-and-verify), then [publish](#publish-on-github).

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
node tools/build.mjs
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

If an existing `.r1` no longer matches its source, the build stops and asks you to bump the version. A newly generated `repository.json` is not automatically registered with the Marketplace. When you push to your main branch, the workflow commits the generated files for you. If you also build locally, commit the generated files as well.

To audit identity and package integrity without changing any file, run `node tools/identity-guard.mjs`.

<a id="optional-sdk-validation"></a>

### 🔌 Optional SDK validation

The RawanIDE Extension SDK is a **separate npm tool**. This template is aligned with **SDK 1.1.0 / host API 1.1**, while retaining API 1.0 extensions and repository protocol 1.0. Install the pinned SDK to validate each source with `--repository` before packaging:

Install SDK 1.1.0 from the public npm registry using the command below. An offline installation can use a downloaded SDK archive: `npm install --global /path/to/elhizazi1-extension-sdk-1.1.0.tgz`. Replace the example path with the archive location.

```sh
npm install --global @elhizazi1/extension-sdk@1.1.0
rawanide-sdk help
RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs
node tools/tests/verify-build.mjs
```

The environment-variable syntax works in Termux and other POSIX shells. SDK validation is **off by default**, a failure stops the build, and the builder still packages the `.r1` files itself. See [`docs/SDK_INTEGRATION.md`](docs/SDK_INTEGRATION.md).

<a id="publish-on-github"></a>

## 🚀 Publish on GitHub

Pushing to `main` (or running the workflow manually) triggers `.github/workflows/publish.yml`. It builds the repository, verifies the catalog and archives, commits the generated files, and writes the GitHub Pages status to the job summary.

**One-time setup:** enable GitHub Pages under **Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save**. The workflow cannot change this setting for you.

URLs, releases, and troubleshooting are in [`docs/PLATFORM.md`](docs/PLATFORM.md).

<a id="customize-the-website"></a>

## 🎨 Customize the website

Use `setup.html` to edit the profile and export `developer.json`. The public website can be redesigned independently of the `repository.json` protocol; edit `assets/site.css`, `index.html`, `about/index.html`, and `tools/extension-page.template.html`, and keep the `<!--DATA-->` markers on pages that need embedded offline data. `setup.html` is a local authoring tool, not a public profile page or an administration portal; the public About page uses the exported developer data. The website uses the Maghribi Assile font (`assets/fonts/maghribi-assile.ttf`), licensed under the SIL Open Font License 1.1 (see [`assets/fonts/FONT_LICENSE.md`](assets/fonts/FONT_LICENSE.md)); keep that notice if you redistribute the font, or replace it in `assets/site.css`.

<a id="identity-and-published-packages"></a>

## 🔐 Identity and published packages

- Never reuse another publisher's `repository.id` or verification token.
- When you claim the repository in the RawanIDE Marketplace, put the verification code you receive in `verification` in `repo.config.json`. The first code can be added after the initial build; run the workflow again and wait for the generated `repository.json` to be published before verifying. Do not edit `repository.json` manually. After registration, do **not** change the repository ID or the verification token. Follow the current Marketplace registration process.
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

The opt-in [project search example](examples/hosted-js-project-search/README.md) is copied from SDK 1.1.0. It is not listed in `repo.config.json` and will not be published automatically. See [SDK integration and the complete test flow](docs/SDK_INTEGRATION.md), [search contract](docs/workspace-search-1.1.md), and [Arabic integration guide](docs/SDK_INTEGRATION.ar.md). API Explorer is an optional app-side development aid, not a repository dependency, certification, or proof that scanned source code executed successfully.

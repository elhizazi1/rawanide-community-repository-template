# Customizing your repository website

The website is **not** the repository protocol. RawanIDE reads `repository.json` and downloads `.r1` files through the URLs it contains.

- Change `assets/site.css`, `index.html`, `about/index.html`, and `tools/extension-page.template.html` to customize the presentation.
- You may replace the frontend entirely (plain HTML, Vue, Nuxt, etc.) as long as your deployment exposes the JSON and extension archives at their declared URLs.
- `tools/build.mjs` injects offline JSON between `<!--DATA-->` and `<!--/DATA-->` markers. Preserve these markers on pages that need offline embedded data; pages without them remain possible, but generate a warning.
- The generated `repository.json`, `extensions/<id>/<version>/*.r1`, SHA-256 hashes and version history are protocol data: do not hand-edit or discard them.
- For custom hosts, set `hosting.rawBaseUrl`, `hosting.repositoryUrl` and `hosting.homepageUrl` in `repo.config.json`. The raw base must serve the complete repository tree with correct public URLs.

No particular frontend framework is required.

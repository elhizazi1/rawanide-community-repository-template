# Default repository design

The default `index.html` uses the same layout, stylesheet and browser scripts as the reference RawanIDE community repository, but does not embed its identity, verification token or published extension data.

The build injects the current `repository.json` into the `<!--DATA-->` section. Do not remove this section if you customize the page. Keep `data-repo-name`, `data-ext-list`, and other data attributes if you want the provided renderer to continue working.

You may replace the entire frontend with your own design; keep `repository.json`, the extension package structure and download links compatible with RawanIDE.

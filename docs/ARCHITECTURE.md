# Community repository architecture


## Responsibilities

- `extension-src/`: extension source owned by the publisher.
- `tools/build.mjs`: current repository builder, package history, metadata, SHA-256, and generated website data.
- `repository.json` and `extensions/`: machine-readable outputs consumed by RawanIDE.
- `index.html`, `about/`, `assets/`: replaceable presentation. Keep the `<!--DATA-->` markers if relying on embedded offline data.
- `.github/workflows/` or `.gitlab-ci.yml`: platform-specific automation, not part of the repository protocol.
- Extension SDK: optional development and validation tooling. With `RAWANIDE_SDK_VALIDATE=1` the builder runs `rawanide-sdk validate --repository` on each source extension (see `SDK_INTEGRATION.md`). The builder still packages extensions itself and does not use `rawanide-sdk pack`.

## Custom hosting (first compatibility step)

`repo.config.json` may contain a `hosting` object with `rawBaseUrl`, `repositoryUrl`, and `homepageUrl`. These override generated URLs while keeping the platform's default URLs. `rawBaseUrl` must point to a public URL directory containing `repository.json`, `icon.svg`, and `extensions/` paths; its contents must be hosted as static files.

Example:

```json
"hosting": {
  "rawBaseUrl": "https://example.org/rawanide",
  "repositoryUrl": "https://example.org/source",
  "homepageUrl": "https://example.org/extensions/"
}
```


## UI customization

You may replace HTML, CSS, and JavaScript. Preserve the public JSON schema and generated package URLs. If the builder must embed JSON for offline pages, retain the `<!--DATA-->` markers in pages that need that feature.

## Compatibility

The RawanIDE app can package an extension through its file manager; SDK installation is not assumed to be mandatory for that path. Full validation parity between app, SDK and repository builder is pending source-level verification.

SDK 1.1.0 / host API 1.1 alignment: see [SDK integration](SDK_INTEGRATION.md) and the [Arabic guide](SDK_INTEGRATION.ar.md). `examples/` contains opt-in sources, never automatically published. Repository protocol 1.0 and `.r1` format 1 remain unchanged.

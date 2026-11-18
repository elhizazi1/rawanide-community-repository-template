# RawanIDE Community Repository Template

A **starter repository**, not a collection of the template author's extensions. Your repository starts with **zero published extensions**. The repository format and builder are adapted from the RawanIDE community example; the template contains no example `.r1` packages.

## Quick start (GitHub)

1. Create a repository from this template (GitHub **Use this template**) or copy these files into a new repository.
2. Clone your new repository on Android/Termux or your computer.
3. Edit `repo.config.json`: set your actual `owner`, `repo`, `branch`, and `repository` identity. Keep `extensions: []` until your first release. The repository ID must be unique; do not reuse the example ID.
4. Develop and test your extension locally using the [RawanIDE Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) and its current instructions. The SDK and this repository serve different purposes.
5. Copy your **extension source** (including `manifest.json` and the icon) into `extension-src/<your-name>/`. Add an entry to `repo.config.json` → `extensions` with `src`, `releaseDate`, `tags`, `changelog.en`, and optional `license`. The existing builder packages that source into `.r1` and publishes it. **Do not copy anyone else's sample extensions.**
6. Run `node tools/build.mjs` (Node 18+). Review the generated `repository.json` and `extensions/` files. Commit and push your changes.
7. GitHub Actions runs the same build and commits generated output. Under **Settings → Pages**, select **Deploy from a branch**, `main`, `/ (root)` to publish the site. Add the raw `repository.json` URL to Marketplace using the procedure supported by your Marketplace version.

**Important:** If your Marketplace issues a repository verification token, set `verification` to that token before publishing; do not copy another publisher's token. The exact claim/verification process must be checked against the deployed Marketplace documentation.

### Example config entry (not published by default)

```json
{
  "src": "extension-src/my-extension",
  "releaseDate": "2026-11-18",
  "tags": ["utility"],
  "changelog": { "en": "Initial release" },
  "license": "MIT"
}
```

### Notes

- Every published `.r1` version is immutable; increment the version in your manifest for changes.
- The builder rejects several sensitive permissions and checks source structure, but **this is not a complete security audit**.
- The GitHub workflow needs permission to write repository contents; adjust repository Actions permissions if GitHub denies its push.
- Pages availability, Marketplace registration, and runtime compatibility require a real deployment test.
- This is a GitHub starter; GitLab CI requires a separate implementation.

## Related projects

[RawanIDE Android](https://github.com/elhizazi1/RawanIDE) · [Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) · [Marketplace](https://rawanide.elhizazi.me/repositories)

## Typeface

This starter includes the Maghribi Assile font and keeps a Moroccan-inspired palette. Confirm redistribution rights before publicly publishing the font file.

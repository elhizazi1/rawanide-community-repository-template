# Published identity and package safety

Never use a verified Marketplace repository as a deployment test fixture. Use an isolated clone with a new repository ID and no verification token, and never push that clone to the original remote.

Before every build, `tools/identity-guard.mjs` reads the existing `repository.json` and checks its repository ID and verification token against `repo.config.json`. It also verifies existing `.r1` files against the SHA-256 and size recorded in the published catalog, and checks available per-version metadata IDs. The build aborts before writing anything if checks fail.

Run `node tools/identity-guard.mjs` to audit without changing files. The guard does not contact Marketplace and cannot guarantee Marketplace registration. Never change a published repository ID or extension ID in place; create a separate repository for an intentional migration. Never repackage already published `.r1` bytes.

The template's `community.example.repository` is a placeholder for **new repositories only**, not a replacement for an existing Marketplace identity. For an existing repository, preserve its own config and published catalog; do not overwrite them with template defaults.

The first Marketplace verification code may be added to `repo.config.json` after initial publication. Once a nonempty code is published, changing or removing it is blocked. A fresh template automatically replaces its placeholder ID and saves the generated ID in the config; GitHub Actions commits both files together.

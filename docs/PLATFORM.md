# GitHub workflow lifecycle

| Workflow | Trigger | Writes |
|---|---|---|
| Initialize Repository | Initial main branch creation push; manual fallback | repo.config.json only, once while owner/repo are placeholders |
| Configure Repository | Manual | repository.json identity and embedded profile pages; preserves extensions |
| Build Extensions | Manual | packages, extension catalog list and embedded pages; preserves catalog identity |
| Deploy Website | Manual | Pages artifact only |

Follow [Marketplace registration](../README.md#marketplace-registration) or [Arabic instructions](../README.ar.md). Use Settings → Pages → Source → GitHub Actions for manual deployment. The public catalog is served at `https://raw.githubusercontent.com/<owner>/<repo>/main/repository.json` independently of Pages. Workflow permissions must allow contents writes for the first three jobs. Never force push generated commits. All jobs share one concurrency group; GitHub can replace a pending run, so wait for each to finish. Initialization does not run on ordinary pushes; if the template creation event is not delivered, use the manual fallback.

Local commands: `node tools/build.mjs --configure` then `node tools/build.mjs --extensions`. The latter requires a configured catalog with a verification code, but does not query Marketplace for actual verification status. Never change a published ID, token or package bytes.

# Publishing on GitHub

This template targets GitHub only. For the overall flow see the [README](../README.md).

## What the workflow does

`.github/workflows/publish.yml` runs on every push to `main` and can be started manually (`workflow_dispatch`). It:

1. runs `node tools/build.mjs` (Node.js 22) and `node tools/tests/verify-build.mjs`;
2. commits the generated files (`repository.json`, `index.html`, `about/`, `extensions/`) as `github-actions[bot]` with `[skip ci]`;
3. writes the GitHub Pages status to the job summary (it warns if Pages could not be confirmed).

## One-time setup

1. Create a **public** repository from the template. RawanIDE downloads `repository.json` and the packages from `raw.githubusercontent.com` without signing in.
2. Fill in `repo.config.json`, `developer.json`, and your extensions (see the README), then push to `main`.
3. Enable GitHub Pages: **Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save**. The workflow cannot change this setting. Until Pages has deployed, the website can show 404 even though the build succeeded.
4. If the commit step fails with a permission error, check **Settings → Actions → General → Workflow permissions**: the workflow needs to push to the repository.

## URLs

| What | Address |
| :-- | :-- |
| Repository link (shown on the website, used in the app) | `https://github.com/<owner>/<repo>` |
| Catalog file | `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/repository.json` |
| Website | `https://<owner>.github.io/<repo>/` (owner in lowercase) |

`owner`, `repo`, and `branch` come from GitHub Actions (or the Git `origin` remote when building locally). `hosting` in `repo.config.json` can override the generated URLs.

## Releasing a new version

Bump `version` in the extension's manifest, update `releaseDate` and `changelog` for it in `repo.config.json`, and push. The new `.r1` is created once; earlier versions stay listed and are never rewritten. Never edit a published `.r1`.

## Registering with the RawanIDE Marketplace

Put the verification code you receive when claiming the repository in `verification` in `repo.config.json`. After registration, never change `repository.id` or the verification code. See [`IDENTITY_SAFETY.md`](IDENTITY_SAFETY.md).

---

## بالعربية

- **سير العمل:** يعمل `.github/workflows/publish.yml` عند كل دفع إلى `main` أو يدويًا: يبني ويتحقق، ثم يودِع الملفات المولَّدة (`repository.json` و`index.html` و`about/` و`extensions/`)، ويكتب حالة GitHub Pages في ملخص المهمة.
- **الإعداد لمرة واحدة:** أنشئ مستودعًا **عامًا**، واملأ `repo.config.json` و`developer.json` والإضافات، وادفع إلى `main`، ثم فعّل Pages من **Settings ← Pages ← Deploy from a branch ← `main` ← `/(root)` ← Save**. قد يظهر الموقع بخطأ 404 إلى أن ينتهي نشر Pages. وإذا فشلت خطوة الإيداع بخطأ صلاحيات فراجع **Settings ← Actions ← General ← Workflow permissions**.
- **الروابط:** رابط المستودع `https://github.com/<owner>/<repo>`؛ ملف الفهرس `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/repository.json`؛ الموقع `https://<owner>.github.io/<repo>/`.
- **إصدار جديد:** ارفع `version` في Manifest الإضافة، وحدّث `releaseDate` و`changelog` في `repo.config.json`، وادفع. لا تعدّل `.r1` منشورًا أبدًا.
- **التسجيل في Marketplace:** ضع رمز التوثيق في `verification` داخل `repo.config.json`، ولا تغيّر `repository.id` أو الرمز بعد التسجيل.

# Updating a community repository / تحديث مستودع قائم

For a new repository, use this complete template and follow its README. For an existing published repository, merge the tooling update instead of replacing your repository configuration with the example files.

لإنشاء مستودع جديد استخدم القالب كاملًا واتبع README. لتحديث مستودع منشور ادمج تحديث الأدوات ولا تستبدل بياناتك ببيانات القالب التجريبية.

Copy/merge these updated files / انسخ أو ادمج الملفات المحدثة:

- `tools/build.mjs`
- `tools/tests/builder.test.mjs` and `tools/tests/sdk-1.1.test.mjs`
- `.github/workflows/ (remove obsolete publish.yml)` for GitHub, or `.gitlab-ci.yml` for GitLab; preserve your custom CI settings
- `docs/SDK_INTEGRATION.md`, `docs/SDK_INTEGRATION.ar.md`, `docs/workspace-search-1.1.md`, `docs/workspace-search-1.1.ar.md`, `docs/ARCHITECTURE.md`, `docs/RELEASE_TESTS.md`
- The `examples/hosted-js-project-search/` folder and updated README sections if wanted

Keep your `repo.config.json`, `developer.json`, `repository.json`, extension sources, `extensions/` archives, icons/screenshots, custom assets and published release history. If your HTML pages are customized, do not overwrite them with the template.

احتفظ بملفات إعدادك وبيانات المطوّر وفهرس المستودع ومصادر إضافاتك والحزم المنشورة والأيقونات واللقطات وسجل الإصدارات. لا تستبدل صفحاتك المخصصة بصفحات القالب.

Run / شغّل:

```sh
node --test tools/tests/*.test.mjs
node tools/build.mjs --extensions
node tools/tests/verify-build.mjs
node tools/identity-guard.mjs
```

SDK remains optional. After SDK 1.1.0 becomes available to the CI runner, enable `RAWANIDE_SDK_VALIDATE=1` if you want host-contract and community-rule validation before packaging. For local checks with a downloaded SDK archive, see the integration guide. The default build does not fetch npm packages.

يبقى SDK اختياريًا. فعّل `RAWANIDE_SDK_VALIDATE=1` بعد توفر الإصدار 1.1.0 في بيئة CI إذا أردت فحص عقد المضيف وقواعد المجتمع قبل التغليف. يوضح دليل التكامل التثبيت من أرشيف SDK محمّل مسبقًا للاختبار المحلي. البناء الافتراضي لا يجلب حزم npm.

Template updates do not call for bumping all extension versions. If validation finds a problem in an already-published package, preserve that version and publish a separately versioned correction when appropriate; do not edit pinned bytes.

لا يتطلب تحديث القالب رفع إصدارات الإضافات كلها. إذا كشف الفحص مشكلة في حزمة منشورة، احتفظ ببايتاتها وانشر التصحيح كإصدار مستقل عند الحاجة.

Font licensing completion: merge `assets/fonts/OFL.txt`, `assets/fonts/AUTHORS.txt` and `assets/fonts/FONT_LICENSE.md`; keep the bundled TTF unchanged. أُرفق ترخيص الخط الكامل وبيانات المؤلفين؛ أبقِها مع الخط عند إعادة التوزيع.

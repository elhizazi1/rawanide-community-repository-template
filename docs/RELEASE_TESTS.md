# Release verification / التحقق قبل النشر

Run `node tools/build.mjs --extensions` then `node tools/tests/verify-build.mjs`. To test the build tooling itself (shared packer, community rules, GitHub/GitLab detection), run `node --test tools/tests/*.test.mjs`.

SDK validation is optional for legacy packages. Install the **actual** RawanIDE Extension SDK and run `RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs --extensions` for SDK-compatible manifests. Validation failure blocks publication. Do not silently modify old published archives to satisfy newer validation.


## بالعربية

شغّل البناء ثم اختبار سلامة الفهرس والحزم. اختبار SDK اختياري للإضافات القديمة؛ لا تعدّل إصدارًا منشورًا لتجاوز اختلافات التحقق. اختبر نشر Pages على المنصة الحقيقية قبل اعتبار القالب مستقرًا.

## SDK 1.1.0 alignment

For the real SDK integration checks, install SDK 1.1.0 and run `RAWANIDE_TEST_SDK_COMMAND=rawanide-sdk node --test tools/tests/*.test.mjs`. This exercises both API 1.0 and 1.1, SDK/repository archive parity, immutable releases and rejection of unsupported API requirements. The external SDK tests are explicitly skipped without that variable. All fixture repositories use temporary directories and start without a copied publisher catalog; real releases are never rewritten by these tests. CI with `RAWANIDE_SDK_VALIDATE=1` enables the external checks too. See [English](SDK_INTEGRATION.md) / [العربية](SDK_INTEGRATION.ar.md).

لفحص التكامل، شغّل الاختبارات مع تحديد مسار SDK كما هو موضح أعلاه. اختبر الإضافة داخل RawanIDE وAPI Explorer، وتحقق من نشر Pages في بيئته؛ فالتحقق الساكن لا يثبت تنفيذ الإضافة.

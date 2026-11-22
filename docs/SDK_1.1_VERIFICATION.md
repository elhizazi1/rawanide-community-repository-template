# SDK integration verification / التحقق من تكامل SDK

Run the repository tooling tests before publishing extensions:

```sh
node --test tools/tests/*.test.mjs
```

For SDK integration checks, install SDK 1.1.0 and set its executable explicitly:

```sh
npm install --global @elhizazi1/extension-sdk@1.1.0 --registry=https://registry.npmjs.org/
RAWANIDE_TEST_SDK_COMMAND=rawanide-sdk node --test tools/tests/*.test.mjs
```

The integration checks cover API 1.0 and 1.1 manifests, SDK/repository archive parity, preservation of published releases, and rejection of unsupported API requirements. External SDK checks are explicitly skipped when `RAWANIDE_TEST_SDK_COMMAND` is absent. Tests use temporary fixture repositories.

Then build the repository and verify its generated outputs:

```sh
node tools/build.mjs
node tools/tests/verify-build.mjs
```

Repository protocol 1.0 and `.r1` format 1 are independent of SDK 1.1.0 and host API 1.1. Use API 1.0 for extensions that need only baseline capabilities; project search requires API 1.1 and the documented permissions.

Static validation does not execute extensions or certify their security. Test generated `.r1` packages in RawanIDE, and verify the platform's publishing workflow and Pages deployment separately.

## بالعربية

شغّل اختبارات أدوات المستودع بالأمر الأول. لفحص التكامل مع SDK، ثبّت الإصدار 1.1.0 ثم شغّل الاختبارات مع تحديد `RAWANIDE_TEST_SDK_COMMAND` كما في المثال. عند غياب المتغير تُتجاوز اختبارات SDK الخارجية بصورة صريحة، وتعمل الاختبارات على مستودعات مؤقتة.

يشمل الفحص بيانات API 1.0 و1.1، وتطابق الحزم بين SDK وأدوات المستودع، وحماية الإصدارات المنشورة، ورفض متطلبات API غير المدعومة. شغّل البناء وفحص المخرجات بعد الاختبارات.

بروتوكول المستودع 1.0 وصيغة `.r1` رقم 1 مستقلان عن إصدار SDK وAPI. لا يتطلب استخدام الميزات الأساسية رفع API إلى 1.1؛ تتطلبه ميزة البحث في المشروع مع الصلاحيات الموثقة.

التحقق الساكن لا ينفذ الإضافة ولا يمنح شهادة أمان. اختبر الحزمة داخل RawanIDE، وتحقق بصورة مستقلة من سير النشر وموقع Pages على المنصة المستخدمة.

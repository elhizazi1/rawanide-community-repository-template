<div align="center">

# قالب مستودع مجتمع RawanIDE — GitHub

🚀 **انشر إضافات RawanIDE بصيغة `.r1` على GitHub.**

<p align="center">
<img alt="Platform: GitHub" src="https://img.shields.io/badge/Platform-GitHub-243452?style=for-the-badge" />
<img alt="Publishing: GitHub Pages" src="https://img.shields.io/badge/Pages-GitHub%20Pages-c9a45b?style=for-the-badge" />
<img alt="Automation: GitHub Actions" src="https://img.shields.io/badge/CI-GitHub%20Actions-19b9ad?style=for-the-badge" />
<img alt="Extension format: .r1" src="https://img.shields.io/badge/Extensions-.r1-555?style=for-the-badge" />
</p>

**العربية** · [English](README.md)

[نظرة عامة](#نظرة-عامة) · [الاستخدام في RawanIDE](#استخدام-مستودع-منشور-في-rawanide) · [بداية سريعة](#بداية-سريعة) · [إضافة إضافة](#إضافة-إضافة) · [البناء والتحقق](#البناء-والتحقق) · [النشر على GitHub](#النشر-على-github) · [الحماية](#هوية-المستودع-والحزم-المنشورة)

</div>

---

<a id="نظرة-عامة"></a>

## 🌟 نظرة عامة

مشروع مفتوح لنشر إضافات RawanIDE بصيغة `.r1` وفهرستها على **GitHub**. يبني فهرسًا (`repository.json`) وحزمة `.r1` لكل إصدار من كل إضافة، وموقعًا قابلًا للتخصيص يضم صفحات الإضافات وصفحة «عن المطور». وتتيح `setup.html` تحرير الملف الشخصي العام محليًا، وتتولى GitHub Actions أتمتة النشر. لا يتطلب إنشاء تطبيق Android جديد.

> 🧩 ابنِ بالـ SDK ➜ 📁 ضع المصدر في `extension-src/` ➜ 🔨 `node tools/build.mjs` ➜ 🚀 انشر ➜ 📲 يضيف المستخدمون مستودعك

| أنت… | اقرأ |
| :-- | :-- |
| 👤 مستخدم RawanIDE | [استخدام مستودع منشور في RawanIDE](#استخدام-مستودع-منشور-في-rawanide) |
| 🧑‍💻 مطوّر إضافات | ابنِ الإضافة وتحقق منها بـ [RawanIDE Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) ثم [إضافة إضافة](#إضافة-إضافة) |
| 🗂️ ناشر مستودع | [بداية سريعة](#بداية-سريعة) ثم [النشر على GitHub](#النشر-على-github) |
| 🤝 مساهم في هذا القالب | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) و[البناء والتحقق](#البناء-والتحقق) |

<a id="استخدام-مستودع-منشور-في-rawanide"></a>

## 📲 استخدام مستودع منشور في RawanIDE

لمن يريد تثبيت إضافات من مستودع أُنشئ بهذا القالب. وإذا عدّلت هذا الملف لمستودعك الخاص، فأبقِ هذا القسم أو عدّله.

1. افتح **الإضافات** في RawanIDE ثم تبويب **المستودعات**.
2. اضغط **إضافة مستودع** والصق رابط المستودع الظاهر في موقعه، وهو عنوان المشروع `https://github.com/<owner>/<repo>`.
3. افتح المستودع وثبّت الإضافة التي تريدها. وإن كان عندك ملف `.r1` فيمكنك تثبيته يدويًا من زر **تثبيت .r1**.

أضف مستودعًا فقط إذا كنت تثق بناشره، وراجع الصلاحيات المعروضة في صفحة كل إضافة قبل تثبيتها.

<a id="بداية-سريعة"></a>

## ⚡ بداية سريعة

1. أنشئ **مستودعًا/مشروعًا جديدًا على GitHub** باستخدام القالب أو استيراد ملفاته. أبقِ المستودع عامًا: ينزّل RawanIDE الملف `repository.json` والحزم من `raw.githubusercontent.com` دون تسجيل دخول.
2. افتح `repo.config.json` ويمكنك ضبط `repository.id` على **معرّف فريد** قبل أول نشر (من 3 إلى 64 حرفًا إنجليزيًا صغيرًا أو رقمًا أو `.` أو `_` أو `-`، دون المعرّفات المحجوزة). إذا تركت القيمة الافتراضية، يولّد البناء الأول معرّفًا من هوية المستودع الفعلية ويحفظه تلقائيًا. يُكتشف `owner` و`repo` و`branch` من GitHub Actions أو من المستودع البعيد `origin` في Git؛ أما القيم في الملف فمجرد احتياط (مثلًا عند البناء من ملف ZIP منزَّل). وإذا احتجت إلى ضبطها فاستخدم `owner` لـ اسم حسابك أو مؤسستك في GitHub و`repo` لـ اسم المستودع.
3. افتح `setup.html` محليًا في المتصفح، وأدخل بيانات المطور والمستودع المعروضة، ثم صدّر `developer.json` وضعه في جذر المشروع. وللصورة الشخصية استخدم ملفًا داخل `assets/` أو رابط HTTPS.
4. أضف إضافاتك: راجع [إضافة إضافة](#إضافة-إضافة).
5. [ابنِ وتحقق](#البناء-والتحقق) ثم [انشر](#النشر-على-github).

> 💡 **نصيحة:** لا تحتاج أداة البناء إلى حزم npm، فيكفي Node.js وحده حتى على Termux.

**فصل المسؤوليات:** يتحكم `developer.json` في بيانات العرض (الأسماء والوصف والصورة والروابط؛ وروابط `website` و`github` و`gitlab` و`email`). ويتحكم `repo.config.json` في هوية المستودع وقائمة الإضافات والاستضافة؛ وقيمة `platform` فيه (`github` أو `gitlab`) مضبوطة أصلًا لهذا القالب، وتتقدم عليها المنصة التي تشغّل البناء. تغيير بيانات الملف الشخصي **لا يغيّر** `repository.id` أو توثيق Marketplace.

<a id="إضافة-إضافة"></a>

## 🧩 إضافة إضافة

1. ابنِ الإضافة وتحقق منها بواسطة [RawanIDE Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) (`rawanide-sdk init` و`validate` و`audit`).
2. انسخ **مجلد مصدر** الإضافة إلى `extension-src/<name>/`. لا تنسخ ملف `.r1` الناتج عن `rawanide-sdk pack`؛ فأداة البناء هنا تغلّف المجلد بنفسها بطريقة حتمية وتسجّل بصمة SHA-256.
3. تأكد أن Manifest يحقق الشروط أدناه. والأمر `rawanide-sdk validate extension-src/<name> --repository` يفحصها لك.
4. أضف عنصرًا إلى `extensions` في `repo.config.json`:

```json
{
  "extensions": [
    {
      "src": "extension-src/my-extension",
      "releaseDate": "2026-11-20",
      "changelog": { "en": "First release." },
      "tags": ["tools"]
    }
  ]
}
```

| حقل العنصر | مطلوب | معناه |
| :-- | :-- | :-- |
| `src` | نعم | مجلد مثل `extension-src/<name>` يحتوي `manifest.json` |
| `releaseDate` | نعم | تاريخ الإصدار بصيغة `YYYY-MM-DD` |
| `changelog.en` | نعم | ملاحظات الإصدار بالإنجليزية |
| `tags` | نعم | مصفوفة نصوص (يجوز أن تكون فارغة) |
| `license` | لا | معرّف ترخيص قصير يظهر في القائمة، مثل `MIT` |
| `screenshots` | لا | حتى 8 صور في `extensions/<id>/screenshots/` (png وwebp وjpg؛ بحجم أقصى 2 ميغابايت) تُذكر بأسماء ملفاتها مع تعليقات اختيارية. وهي خارج الحزمة، فإضافتها لا تغيّر `.r1` أبدًا |
| `runtimeOverride` | لا | بيئة التشغيل المعروضة حين يجب أن تختلف عما في Manifest المغلَّف |

**شروط Manifest في أداة البناء هذه:**

- وجود `localizedMetadata.en` مع `name` و`description` (وأضف `localizedMetadata.ar` للصفحات العربية)، وأن يشير `icon` إلى ملف موجود. واملأ `publisher` و`description` و`category` أيضًا فهي تظهر في الفهرس.
- يجب أن يكون `runtime` هو `declarative` أو `hosted-js` (أو محذوفًا). ولا يُقبل `preview-js`.
- هذه الصلاحيات غير مسموحة: `TERMINAL_ACCESS` و`PROCESS_EXECUTION` و`DEVICE_FILES_READ` و`DEVICE_FILES_WRITE`.
- `id` فريد، ورقم `version` جديد لكل إصدار. فلا يُعاد كتابة `.r1` منشور أبدًا.

```json
"localizedMetadata": {
  "en": { "name": "My Extension", "description": "What it does." },
  "ar": { "name": "إضافتي", "description": "ماذا تفعل." }
}
```

**إصدار نسخة جديدة:** ارفع `version` في Manifest الإضافة، ثم حدّث `releaseDate` و`changelog` لها في `repo.config.json`. وتبقى الإصدارات السابقة مدرجة، ولا تُمسّ ملفات `.r1` الخاصة بها.

<a id="البناء-والتحقق"></a>

## 🔨 البناء والتحقق

يُنصح باستخدام Node.js 22 (وهو ما يستخدمه CI)؛ ولا تحتاج أداة البناء إلى حزم npm. من جذر المشروع شغّل:

```sh
node tools/build.mjs
node tools/tests/verify-build.mjs
```

تنشئ أداة البناء `repository.json` وملف `.r1` لكل إصدار من كل إضافة وصفحات الموقع:

```text
repository.json
index.html, about/index.html        (تُحدَّث البيانات المضمَّنة)
extensions/<id>/index.html          (تحويل إلى أحدث إصدار)
extensions/<id>/<version>/<id>-<version>.r1
extensions/<id>/<version>/marketplace.json, icon, index.html
```

وإذا لم يعد `.r1` موجود يطابق مصدره، يتوقف البناء ويطلب منك رفع رقم الإصدار. ملف `repository.json` المولَّد حديثًا لا يُسجَّل تلقائيًا في Marketplace. عند الدفع إلى الفرع الرئيسي يعمل سير العمل على إيداع (commit) الملفات المولَّدة نيابةً عنك. وإن بنيت محليًا أيضًا فأودِع الملفات المولَّدة كذلك.

ولتدقيق الهوية وسلامة الحزم دون تغيير أي ملف، شغّل `node tools/identity-guard.mjs`.

<a id="التحقق-الاختياري-باستخدام-sdk"></a>

### 🔌 التحقق الاختياري باستخدام SDK

RawanIDE Extension SDK **أداة npm مستقلة**. ثبّتها أولًا للتحقق من كل إضافة مصدرية قبل التغليف:

```sh
npm install --global @elhizazi1/extension-sdk@1.1.0
rawanide-sdk help
RAWANIDE_SDK_VALIDATE=1 node tools/build.mjs
node tools/tests/verify-build.mjs
```

تعمل صيغة متغير البيئة أعلاه على Termux وواجهات POSIX. التحقق عبر SDK **معطّل افتراضيًا**، وأي فشل فيه يوقف البناء، وتظل أداة البناء هي من يغلّف ملفات `.r1`. راجع [`docs/SDK_INTEGRATION.md`](docs/SDK_INTEGRATION.md).

<a id="النشر-على-github"></a>

## 🚀 النشر على GitHub

يؤدي الدفع إلى `main` (أو تشغيل سير العمل يدويًا) إلى تشغيل `.github/workflows/publish.yml`. فيبني المستودع، ويتحقق من الفهرس والأرشيفات، ويودِع الملفات المولَّدة، ويكتب حالة GitHub Pages في ملخص المهمة.

**إعداد لمرة واحدة:** فعّل GitHub Pages من **Settings ← Pages ← Deploy from a branch ← `main` ← `/(root)` ← Save**. لا يستطيع سير العمل تغيير هذا الإعداد نيابةً عنك.

الروابط والإصدارات واستكشاف المشكلات في [`docs/PLATFORM.md`](docs/PLATFORM.md).

<a id="تخصيص-الموقع"></a>

## 🎨 تخصيص الموقع

استخدم `setup.html` لتعديل الملف الشخصي وتصدير `developer.json`. يمكن إعادة تصميم الموقع العام دون تغيير بروتوكول `repository.json`؛ عدّل `assets/site.css` و`index.html` و`about/index.html` و`tools/extension-page.template.html`، وأبقِ علامات `<!--DATA-->` في الصفحات التي تحتاج بيانات مضمَّنة للعمل دون اتصال. صفحة `setup.html` أداة محلية لإعداد البيانات، وليست صفحة ملف شخصي عامة ولا لوحة إدارة؛ وتستمد صفحة «عن المطور» العامة بياناتها من ملف المطور المصدَّر. ويستخدم الموقع خط «مغربي أصيل» (`assets/fonts/maghribi-assile.ttf`) المرخَّص بموجب SIL Open Font License 1.1 (راجع [`assets/fonts/FONT_LICENSE.md`](assets/fonts/FONT_LICENSE.md))؛ أبقِ هذا الإشعار إذا أعدت توزيع الخط، أو استبدل الخط في `assets/site.css`.

<a id="هوية-المستودع-والحزم-المنشورة"></a>

## 🔐 هوية المستودع والحزم المنشورة

- لا تستخدم `repository.id` أو رمز توثيق خاصًا بناشر آخر.
- عندما تطالب بمستودعك في RawanIDE Marketplace، ضع رمز التوثيق الذي تتلقاه في الحقل `verification` داخل `repo.config.json`. يمكن إضافة الرمز لأول مرة بعد البناء الأول؛ أعد تشغيل البناء وانتظر نشر `repository.json` قبل التحقق. لا تعدّل الملف المولّد يدويًا. وبعد التسجيل **لا تغيّر** معرّف المستودع أو رمز التوثيق. واتبع إجراءات التسجيل الحالية في Marketplace.
- يجب أن تبقى حزم `.r1` المنشورة سابقًا مطابقة بايتًا ببايت، وإلا ستختلف بصمة SHA-256.
- حافظ على تخصيص هذا القالب لمنصة GitHub، ولا تنسخ إعدادات منصة أخرى.

<a id="استكشاف-المشكلات"></a>

## 🩺 استكشاف المشكلات

| المشكلة | ما ينبغي التحقق منه أولًا |
| :-- | :-- |
| `Configure a valid …` (`owner` أو `repo` أو `branch` أو GitLab namespace) | ما زالت قيم مثل `YOUR_…` موجودة ولم تُكتشف الهوية؛ اضبط `owner` و`repo` أو أضف المستودع البعيد `origin` في Git |
| `localizedMetadata.en is required` أو خطأ آخر في Manifest | ينقص Manifest الإضافة ما تشترطه أداة البناء؛ راجع [إضافة إضافة](#إضافة-إضافة) |
| `… already exists and … has changed` | الملف `.r1` المنشور غير قابل للتعديل: ارفع `version` في Manifest الإضافة |
| عدم ظهور الإضافات | قائمة `extensions` في `repo.config.json` ومسار `src` لكل إضافة |
| بيانات مطور أو صورة غير صحيحة | أعد تصدير `developer.json` من `setup.html` ثم ابنِ من جديد |
| روابط موقع أو حزم خاطئة | المالك والمستودع والفرع وإعدادات `hosting`؛ وفي CI تأتي الروابط من بيئة CI |
| يظهر الموقع بخطأ 404 | لم يُفعَّل GitHub Pages أو لم ينتهِ نشره؛ راجع `docs/PLATFORM.md` |
| فشل التحقق عبر SDK | شغّل `rawanide-sdk validate extension-src/<name>` وأصلح Manifest |
| فشل سلامة الحزمة أو حارس الهوية | استعد ملف `.r1` أو `repository.json` المنشور نفسه حرفيًا، ولا تعِد التغليف بصمت |

**للمساهمين:** أرسل التغييرات عبر آلية مراجعة المشروع، واحرص على صحة تراخيص الإضافات وتوثيقها، ولا تضع أسرارًا في الملفات المودَعة، ولا تستخدم بيانات توثيق ناشر آخر.

<a id="الوثائق"></a>

## 📚 الوثائق

| الملف | الغرض |
| :-- | :-- |
| [`docs/PLATFORM.md`](docs/PLATFORM.md) | النشر على GitHub: الإعداد لمرة واحدة والروابط والإصدارات |
| [`docs/SDK_INTEGRATION.md`](docs/SDK_INTEGRATION.md) | التحقق الاختياري عبر SDK وما تفحصه أداة البناء زيادةً عليه |
| [`docs/IDENTITY_SAFETY.md`](docs/IDENTITY_SAFETY.md) | هوية المستودع وسلامة الحزم |
| [`docs/CUSTOMIZATION.md`](docs/CUSTOMIZATION.md) | بيانات المطور والإعدادات |
| [`docs/DESIGN_CUSTOMIZATION.md`](docs/DESIGN_CUSTOMIZATION.md) | تصميم الموقع |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | كيف تتكامل الأجزاء |
| [`docs/RELEASE_TESTS.md`](docs/RELEASE_TESTS.md) | التحقق من البناء |

<a id="الترخيص"></a>

## 📄 الترخيص

يصدر هذا القالب بترخيص MIT؛ راجع [LICENSE](LICENSE). ويحتفظ الخط المضمَّن بترخيصه الخاص الموضح في [`assets/fonts/FONT_LICENSE.md`](assets/fonts/FONT_LICENSE.md).

---

<div align="center">

💚 **مجتمع RawanIDE · GitHub**

</div>

أُرفق ترخيص الخط كاملًا في [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)، وبيانات المؤلفين في [`assets/fonts/AUTHORS.txt`](assets/fonts/AUTHORS.txt). أبقِ هذه الملفات مع القالب والموقع عند إعادة توزيعهما.

## مواءمة SDK 1.1 وAPI Explorer

هذا القالب متوافق مع **SDK 1.1.0 وAPI المضيف 1.1** مع الحفاظ على إضافات API 1.0 وبروتوكول المستودع 1.0 وصيغة الحزم الحالية. عند تفعيل `RAWANIDE_SDK_VALIDATE=1` تستدعي أداة البناء `rawanide-sdk validate <source> --repository` قبل التغليف. يبقى التحقق الخارجي اختياريًا حتى لا يُفرض تثبيت SDK على المستودعات القديمة.

احتفظ بأقل API تحتاجه الإضافة: `apiVersion: "1.0"` للواجهات الأساسية، و`"1.1"` لاستخدام `workspace.findFiles` و`workspace.findText` مع صلاحية `FILE_READ`. لا يُرفع إصدار الإضافات القديمة ولا تُعاد كتابة حزمها المنشورة لمجرد تحديث القالب. إصدار SDK وإصدار API وبروتوكول المستودع وإصدار الإضافة أرقام مستقلة تؤدي أغراضًا مختلفة.

[مثال البحث في المشروع](examples/hosted-js-project-search/README.ar.md) من SDK 1.1.0 موجود للتجربة فقط؛ لا يُنشر تلقائيًا ولا يضاف إلى `repo.config.json`. اقرأ [دليل التكامل العربي](docs/SDK_INTEGRATION.ar.md) و[عقد البحث](docs/workspace-search-1.1.ar.md). API Explorer أداة اختيارية داخل التطبيق لفحص بيئة المضيف والمصادر؛ ليس اعتمادًا في القالب أو شهادة أمان أو إثباتًا أن الاستدعاءات التي وجدها في المصدر نُفذت بنجاح.

ثبّت SDK 1.1.0 من سجل npm العام. للتثبيت دون اتصال يمكن استخدام أرشيف SDK محمّل مسبقًا: `npm install --global /path/to/elhizazi1-extension-sdk-1.1.0.tgz` مع استبدال المسار بمكان الملف.

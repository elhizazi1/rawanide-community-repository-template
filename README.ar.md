# قالب مستودع مجتمع RawanIDE

هذا **قالب مستقل وفارغ**، ولا يتضمن إضافات جمال الحزازي أو أي حزم `.r1` منشورة مسبقًا.

## خطوات الاستخدام

1. أنشئ مستودع GitHub جديدًا باستخدام القالب، ثم استنسخه إلى هاتفك أو حاسوبك.
2. عدّل `repo.config.json` وأدخل `owner` و`repo` و`branch` وبيانات مستودعك الفريدة داخل `repository`.
3. استخدم [Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) لتطوير إضافتك واختبارها محليًا.
4. انسخ **مصدر الإضافة** مع `manifest.json` والأيقونة إلى `extension-src/<name>/`، وأضف بياناتها إلى مصفوفة `extensions`.
5. شغّل `node tools/build.mjs` محليًا للتحقق من البناء وإنشاء `.r1` و`repository.json` والصفحات.
6. ارفع الملفات إلى GitHub؛ يقوم Workflow بإعادة البناء وتسجيل المخرجات المتغيرة.
7. فعّل GitHub Pages من الفرع `main` والجذر `/`، ثم اربط رابط `repository.json` مع Marketplace وفق آلية الإصدار المستخدم.

**مهم:** يبدأ المستودع دون إضافات؛ لا تُنشر أي إضافة إلا إذا أدرجها المطور عمدًا. لا تستخدم رمز تحقق خاصًا بناشر آخر. لا تعدّل حزمة `.r1` منشورة دون زيادة رقم إصدارها.

المشروع يعتمد على بنية البناء المستخلصة من مستودع مجتمع RawanIDE، مع فصل هوية الناشر عن القالب. يلزم اختبار النشر الفعلي والتوافق مع Marketplace قبل اعتباره إصدارًا نهائيًا.

[تطبيق RawanIDE](https://github.com/elhizazi1/RawanIDE) · [Extension SDK](https://github.com/elhizazi1/rawanide-extension-sdk) · [Marketplace](https://rawanide.elhizazi.me/repositories)

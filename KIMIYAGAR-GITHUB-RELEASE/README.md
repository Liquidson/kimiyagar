# KIMIYAGAR v1 — کیمیاگری با حروف

یک برنامه وب فارسی و راست‌به‌چپ برای اجرای روش‌ها، محاسبهٔ مستحصله، ابزارهای محاسباتی و نگهداری تاریخچهٔ نتایج در مرورگر.

<p align="center">
  <a href="assets/Banner/Banner.png">
    <img src="assets/Banner/Banner.png" alt="بنر KIMIYAGAR" width="100%">
  </a>
</p>

<p align="center">
  <a href="assets/logo/logo.jpg">
    <img src="assets/logo/logo.jpg" alt="لوگوی KIMIYAGAR" width="180">
  </a>
</p>

## رسانه‌های پروژه

- [مشاهدهٔ بنر اصلی](assets/Banner/Banner.png)
- [مشاهدهٔ لوگو](assets/logo/logo.jpg)
- [اینفوگرافی ۱](assets/Infographic/Infographic%201.jpg)
- [اینفوگرافی ۲](assets/Infographic/Infographic%202.jpg)
- [اینفوگرافی ۳](assets/Infographic/Infographic%203.jpg)
- [اینفوگرافی ۴](assets/Infographic/Infographic%204.jpg)
- [اینفوگرافی ۵](assets/Infographic/Infographic%205.jpg)

همهٔ تصاویر بالا داخل همین مخزن نگهداری می‌شوند و لینک‌ها در GitHub به‌صورت نسبی باز می‌شوند.

## وضعیت این بسته

- نسخهٔ موجود در این مخزن: **v1**
- مرجع رفتار محاسباتی: پیاده‌سازی ماژولار Legacy v1
- روش‌های فعال جلد اول: ۳ روش
- محاسبهٔ مستحصله: جلد اول و جلد دوم
- ابزارهای محاسبه: جلد اول و جلد دوم با هفت موتور مشترک
- گزینه‌های خوانش و تفسیر هوشمند و چت هوش مصنوعی: غیرفعال
- Workspace جداگانهٔ React/TypeScript v2 در فایل منبعی که این بسته از آن ساخته شده وجود نداشت و بنابراین داخل این Release قرار نگرفته است.

## اجرای برنامه

این برنامه به Build نیاز ندارد. به‌دلیل Service Worker و محدودیت‌های مرورگر، آن را با یک HTTP server محلی باز کنید.

### Python

```bash
python -m http.server 4173
```

سپس باز کنید:

```text
http://127.0.0.1:4173/
```

### Node.js

می‌توانید از هر static server دلخواه نیز استفاده کنید.

## اجرای تست‌ها

نیازمندی: Node.js 18 یا جدیدتر.

```bash
npm test
```

یا هر Suite به‌صورت جداگانه:

```bash
npm run test:mostahsela
npm run test:golden
npm run test:mostahsela-v2
npm run test:auto-spacing
npm run test:volume2
npm run test:calculation-tools
```

## ساختار اصلی

```text
index.html                 پوسته و صفحهٔ اصلی برنامه
css/                       استایل‌های ماژولار و RTL
js/methods/                سه روش فعال جلد اول
js/core/mostahsela/        موتور مستحصله جلد اول
js/core/mostahsela-v2/     موتور مستحصله جلد دوم
js/core/calculation-tools/ هفت موتور ابزار محاسبه
js/tools/                  کنترلرهای UI ابزارها
js/ui/                     ناوبری، Canvas، اشتراک و Toast
tests/                     تست‌های Node.js و Golden fixtures
references/                مرجع تک‌فایلی پروژه برای تست Parity جلد دوم
assets/                    آیکون‌ها و دارایی‌های بصری
```

## نکات مهم

- داده‌های History و تنظیمات رابط در مرورگر نگهداری می‌شوند.
- فونت‌های Google در حالت آنلاین بارگیری می‌شوند؛ در حالت آفلاین از فونت‌های جایگزین سیستم استفاده می‌شود.
- Service Worker فعلی حداقلی است و Cache آفلاین کامل یا Installability رسمی PWA را فراهم نمی‌کند.
- فایل `references/kimiyagar-v1-volume2-single-file-clean.html` یک مرجع پروژه‌ای برای تست Integration است و در Runtime بارگیری نمی‌شود.
- این بسته شامل PDFهای کتاب، Backupها، Cacheها، تنظیمات محلی AI و اطلاعات خصوصی نیست.

## مجوز

فایل License در منبع ارائه‌شده وجود نداشت. این مخزن مجوز استفاده، تغییر یا بازتوزیع مشخصی اعطا نمی‌کند؛ پیش از استفادهٔ مجدد، مجوز مناسب باید توسط مالک پروژه تعیین شود.

## گزارش انتشار

- [Release manifest](RELEASE_MANIFEST.md)
- [Release QA report](RELEASE_QA_REPORT.md)
- [Migration plan](docs/MIGRATION_PLAN.md)

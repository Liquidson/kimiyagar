# معماری KIMIYAGAR v1

KIMIYAGAR v1 یک برنامهٔ ماژولار HTML/CSS/JavaScript است. فایل `index.html` پوستهٔ Runtime و ترتیب بارگذاری ماژول‌ها را تعریف می‌کند.

## لایه‌ها

- `js/core.js`: ابزارهای پایه و مشترک
- `js/registry.js`: منبع مرکزی معرفی روش‌ها و ابزارها
- `js/methods/`: روش‌های محاسباتی جلد اول
- `js/core/mostahsela/`: موتور مستقل مستحصله جلد اول
- `js/core/mostahsela-v2/`: موتور مستقل مستحصله جلد دوم
- `js/core/calculation-tools/`: هفت موتور محاسباتی مشترک بین دو جلد
- `js/tools/`: کنترلرهای اتصال UI به Engineها
- `js/ui/`: مدیریت صفحات، منو، Canvas، Toast و Share
- `js/history.js`: ذخیره و بازیابی Resultها در مرورگر

موتورهای محاسباتی از کنترلرهای رابط جدا نگه داشته شده‌اند. Registry منبع اصلی نمایش روش‌ها و ابزارها است. فایل مرجع جلد دوم فقط در تست Integration استفاده می‌شود و در Runtime بارگیری نمی‌شود.

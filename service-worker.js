const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/index.html', // تأكد من تعديل هذا إلى اسم ملف HTML الخاص بك
    '/style.css', // إذا كان لديك ملف CSS خارجي
    '/script.js', // إذا كان لديك ملف JavaScript خارجي
    // أضف أي ملفات أخرى تحتاجها
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// استجابة الطلبات
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إذا كان هناك استجابة في الكاش، استخدمها
                if (response) {
                    return response;
                }
                // إذا لم يكن هناك استجابة، قم بتحميلها من الشبكة
                return fetch(event.request);
            })
    );
});

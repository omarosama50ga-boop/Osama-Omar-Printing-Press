const CACHE_NAME = 'al-israa-press-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('All resources have been cached');
        return self.skipWaiting();
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing Old Cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// خدمة الطلبات
self.addEventListener('fetch', function(event) {
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إذا وجدت في الكاش، أرجعها
        if (response) {
          return response;
        }
        
        // إذا لم توجد، أحضر من الشبكة
        return fetch(event.request)
          .then(function(response) {
            // تأكد أن الرد صالح للتخزين
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // استنسخ الرد
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(function(error) {
            console.log('Fetch failed:', error);
            // يمكنك عرض صفحة بديلة هنا إذا أردت
          });
      })
  );
});

// استقبال الرسائل
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
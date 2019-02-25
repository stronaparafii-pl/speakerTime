var cacheName = 'speakerTime-v0.4.4';

var filesToCache = [
    './',
    './apple-touch-icon.png',
    './browserconfig.xml',
    './css',
    './css/main.css',
    './favicon-16x16.png',
    './favicon-32x32.png',
    './favicon.ico',
    './img',
    './img/icon-128x128.png',
    './img/icon-144x144.png',
    './img/icon-192x192.png',
    './img/icon-48x48.png',
    './img/icon-512x512.png',
    './img/icon-96x96.png',
    './img/icon.png',
    './img/icon-raw.svg',
    './img/icon.svg',
    './index.html',
    './js',
    './js/main.js',
    './manifest.json',
    './mstile-144x144.png',
    './mstile-150x150.png',
    './mstile-310x150.png',
    './mstile-310x310.png',
    './mstile-70x70.png',
    './safari-pinned-tab.svg',
];


self.addEventListener('install', function (event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('Opened cache');
                for (let i = 0, len = filesToCache.length; i < len; i++) {
                    var myRequest = new Request(filesToCache[i]);
                    fetch(myRequest).then(function (response) {
                        if (response.status != 200) {
                            console.log(filesToCache[i] + ' ' + response.status);
                        }
                    });
                }
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                console.log('[ServiceWorker] Check old cache', key);
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('[ServiceWorker] Fetch');
    event.respondWith(
        fetch(event.request).catch(function () {
            console.log(event.request);
            return caches.match(event.request);
        })
    );
});

var cacheName = 'speakerTime-v0.4.2';

var filesToCache = [
    './',
    './index.html',
    './js/main.js',
    './img/icon.png',
    './img/icon-raw.svg',
    './img/icon-128x128.png',
    './img/icon-144x144.png',
    './img/icon-192x192.png',
    './img/icon-48x48.png',
    './img/icon-512x512.png',
    './img/icon-96x96.png',
    './manifest.json'
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

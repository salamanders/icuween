/*jshint esversion: 6 */
/*jshint worker:true */
/*jshint unused:true */
/*globals caches */
const VERSION = '005';
const CURRENT_CACHE = 'my-site-cache-v' + VERSION;


// TODO: Uncomment when ready to pre-cache
const URLS_TO_CATCH = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',

  '/css/icuween.css',

  '/img/eye1.jpg',
  '/img/eye2.jpg',
  '/img/eye3.jpg',
  '/img/eye4.jpg',
  '/img/eyes_144.png',
  '/img/eyes_192.png',
  '/img/eyes_48.png',
  '/img/eyes_512.png',

  '/js/three.min.js',
  '/js/Tween.min.js',
  '/js/icuween.js'
];

addEventListener('install', event => {
  console.info('Service Worker: install');
  event.waitUntil(() => {

    caches.keys()
      .filter(cacheName => cacheName != CURRENT_CACHE)
      .forEach(badCacheName => {
        console.info(`Service Worker: deleting old cache ${badCacheName}`);
        caches.delete(badCacheName);
      });

    caches.open(CURRENT_CACHE)
      .then(cache => cache.addAll(URLS_TO_CATCH))
      .then(()=>{ console.info(`All ${URLS_TO_CATCH.length} URLs cached.`);})
      .then(() => self.skipWaiting());
  });
});

self.addEventListener('activate', event => {
  console.log('Service Worker: activated.');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log(`Service Worker: event.request.url: ${event.request.url}`);
  event.respondWith(
    caches.open(CURRENT_CACHE).then(cache => cache.match(event.request, {
      ignoreSearch: true
    }).then(response => {
      if (response) {
        console.info('Service Worker: Cache hit.');
        return response;
      }
      console.warn('Service Worker: Cache miss.');
      return fetch(event.request).then(response => {
        console.info('Service Worker: Caching after miss.');
        cache.put(event.request, response.clone());
        return response;
      });
    }))
  );
});

console.info('Service Worker: sw.js done.');
// Service Worker for PWA functionality and performance caching
const CACHE_NAME = 'nasa-explorer-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/planets.html',
    '/missions.html', 
    '/gallery.html',
    '/about.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/particles.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

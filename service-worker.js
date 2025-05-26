const CACHE_NAME = 'presupuesto-store-v1';

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/presupuestogame/',
        '/presupuestogame/index.html',
        '/presupuestogame/styles.css',
        '/presupuestogame/app.js',
        '/presupuestogame/manifest.json',
        '/presupuestogame/icon-192.png',
        '/presupuestogame/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

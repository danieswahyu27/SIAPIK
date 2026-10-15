/* ============================================
   SIAPIK — sw.js (Service Worker sederhana)
   Strategi: cache-first untuk asset lokal.
   Request ke luar (API cuaca, tile peta) dibiarkan lewat jaringan.
   ⚠️ Ubah CACHE_NAME (naikkan versi) setiap kali update file,
      supaya browser tidak menyajikan versi lama.
   ============================================ */

const CACHE_NAME = 'siapik-v6';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/theme.css',
  './css/style.css',
  './css/chat.css',
  './js/app.js',
  './js/data.js',
  './js/map.js',
  './js/weather.js',
  './js/report.js',
  './js/chatbot.js',
  './js/stats.js',
  './data/hotspots.json',
  './data/knowledge.json',
  './assets/icons/icon.svg'
];

// Install: simpan asset ke cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: hapus cache versi lama
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first khusus request same-origin (asset kita).
// Request ke domain lain (Open-Meteo, tile peta) langsung ke jaringan.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Hanya tangani GET dan same-origin
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Simpan salinan ke cache
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => cached);
    })
  );
});

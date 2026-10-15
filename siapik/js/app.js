/* ============================================
   SIAPIK — js/app.js
   Init utama: koordinasi semua modul
   ============================================ */

document.addEventListener('DOMContentLoaded', init);

async function init() {
  initMap();
  const hotspots = await DataStore.load();

  renderHotspots(hotspots);
  renderStats(hotspots);
  initReportForm();
  initChatbot();
  initModals();
  initSearch();
  initGeolocationButton();
  registerServiceWorker();
}

/* ---- Modal helpers ---- */
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function initModals() {
  document.getElementById('btn-lapor').addEventListener('click', () => openModal('modal-report'));
  document.getElementById('btn-chat').addEventListener('click', () => openModal('modal-chat'));

  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
  });

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.add('hidden'); });
  });
}

/* ---- Tombol "Lokasi Saya" ---- */
function initGeolocationButton() {
  const btn = document.getElementById('btn-lokasi');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '… mencari';
    cariLokasiSaya((ok, msg) => {
      btn.disabled = false;
      btn.textContent = '📍 Lokasi Saya';
      if (ok) tampilkanToast('Lokasi kamu ditandai di peta.');
      else tampilkanToast(msg || 'Lokasi tidak tersedia.', true);
    });
  });
}

/* ---- Toast (notifikasi kecil) ---- */
let toastTimer;
function tampilkanToast(pesan, error = false) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = pesan;
  t.className = 'toast show' + (error ? ' toast-error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = 'toast'; }, 4000);
}

/* ---- PWA: registrasi service worker ---- */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('[pwa] service worker terdaftar:', reg.scope))
        .catch(err => console.warn('[pwa] gagal daftar service worker:', err));
    });
  }
}


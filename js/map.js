/* ============================================
   SIAPIK — js/map.js
   Setup Leaflet, marker divIcon, legenda, dot lokasi user
   ============================================ */

let map;
let markerLayer;
let userLayer;
const markersById = {};   // simpan referensi marker per id hotspot

function initMap() {
  map = L.map('map-container', {
    zoomControl: true,
    attributionControl: true,
    // Kunci peta jadi 1 dunia saja (cegah ke-repeat saat zoom out)
    maxBounds: [[-85, -180], [85, 180]],   // pagar batas geser
    maxBoundsViscosity: 1.0,               // geseran "lengket", nggak bisa lewat batas
    worldCopyJump: true,                   // marker ikut pindah ke dunia yang terlihat
    minZoom: 3                             // batas zoom out (jangan terlalu kecil)
  }).setView([-2.5, 118], 5); // pusat Indonesia

  // ---- Basemap: CITRA SATELIT Esri "World Imagery" (gratis, tanpa API key) ----
  // Layer DASAR (paling bawah). Perhatikan urutan {z}/{y}/{x} — Esri pakai y dulu!
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics, GIS User Community',
    maxZoom: 19,
    noWrap: true   // jangan ulang tile secara horizontal (cegah dunia ke-repeat)
  }).addTo(map);

  // ---- Overlay LABEL nama kota/daerah (transparan) DI ATAS satelit ----
  // Ditambahkan SETELAH satelit → tergambar di atasnya, jadi tulisan tetap kebaca.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, Maxar, Earthstar Geographics, GIS User Community',
    maxZoom: 19,
    zIndex: 2,
    noWrap: true   // jangan ulang tile secara horizontal (cegah dunia ke-repeat)
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
  userLayer   = L.layerGroup().addTo(map);

  addLegend();
  console.log('[map] init selesai');
}

// Ambil warna CSS var sesuai tingkat
function warnaTingkat(tingkat) {
  const t = (tingkat || '').toLowerCase();
  const root = getComputedStyle(document.documentElement);
  if (t === 'berat')  return root.getPropertyValue('--level-berat').trim()  || '#ff3b3b';
  if (t === 'sedang') return root.getPropertyValue('--level-sedang').trim() || '#ff7a00';
  return root.getPropertyValue('--level-ringan').trim() || '#ffd23b';
}

// Buat divIcon besar beremoji api, warna sesuai tingkat
function buatIconApi(tingkat) {
  const warna = warnaTingkat(tingkat);
  return L.divIcon({
    className: 'marker-api-wrap',
    html: `<div class="marker-api" style="--warna:${warna}">🔥</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 44],   // anchor di bawah-tengah (ujung pin)
    popupAnchor: [0, -44]
  });
}

function renderHotspots(hotspots) {
  if (!map || !markerLayer) return;
  markerLayer.clearLayers();
  Object.keys(markersById).forEach(k => delete markersById[k]);

  hotspots.forEach(h => {
    const marker = L.marker([h.lat, h.lon], { icon: buatIconApi(h.tingkat) });

    // Tombol "Lihat Sumber" hanya jika field sumber ada & tidak kosong
    const tombolSumber = (h.sumber && h.sumber.trim())
      ? `<a class="btn-sumber" href="${h.sumber}" target="_blank" rel="noopener noreferrer">🔗 Lihat Sumber</a>`
      : '';

    marker.bindPopup(`
      <div class="popup">
        <h3>${h.lokasi}</h3>
        <div class="popup-meta">${h.provinsi} · <span class="badge-tingkat" style="--warna:${warnaTingkat(h.tingkat)}">${h.tingkat}</span></div>
        <div id="wx-${h.id}">${cuacaLoadingHTML()}</div>
        ${tombolSumber}
      </div>
    `);

    marker.on('popupopen', async () => {
      const el = document.getElementById('wx-' + h.id);
      if (!el) return;
      const data = await getWeather(h.lat, h.lon);
      el.innerHTML = formatWeather(data);
    });

    marker.addTo(markerLayer);
    markersById[h.id] = marker;   // simpan referensi buat dipanggil dari daftar
  });

  console.log('[map] render', hotspots.length, 'titik api');
}

// Terbang ke satu titik + buka popup (dipakai dari daftar & search)
function fokusKeHotspot(id) {
  const marker = markersById[id];
  if (!marker) return;
  const latlng = marker.getLatLng();
  map.flyTo(latlng, 9, { duration: 1.2 });
  // Buka popup setelah animasi selesai
  map.once('moveend', () => marker.openPopup());
}

// ---- Legenda ----
function addLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
      <h4>Tingkat Keparahan</h4>
      <div class="legend-row"><span class="dot" style="background:var(--level-berat)"></span>Berat</div>
      <div class="legend-row"><span class="dot" style="background:var(--level-sedang)"></span>Sedang</div>
      <div class="legend-row"><span class="dot" style="background:var(--level-ringan)"></span>Ringan</div>`;
    return div;
  };
  legend.addTo(map);
}

// ---- Lokasi Saya (geolocation) ----
function cariLokasiSaya(onResult) {
  if (!navigator.geolocation) {
    onResult(false, 'Browser kamu tidak mendukung fitur lokasi.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      userLayer.clearLayers();

      // Lingkaran akurasi
      L.circle([latitude, longitude], {
        radius: accuracy, color: 'var(--user-dot)', weight: 1,
        fillColor: 'var(--user-dot)', fillOpacity: 0.12
      }).addTo(userLayer);

      // Dot biru
      L.circleMarker([latitude, longitude], {
        radius: 8, color: '#fff', weight: 2,
        fillColor: 'var(--user-dot)', fillOpacity: 1
      }).addTo(userLayer).bindPopup('📍 Kamu di sini');

      map.flyTo([latitude, longitude], 12, { duration: 1.2 });
      onResult(true);
    },
    (err) => {
      let msg = 'Gagal mendapatkan lokasi.';
      if (err.code === err.PERMISSION_DENIED) msg = 'Kamu menolak izin lokasi. Tidak apa-apa, peta tetap bisa dipakai.';
      else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Lokasi tidak terdeteksi. Coba lagi ya.';
      else if (err.code === err.TIMEOUT) msg = 'Pencarian lokasi terlalu lama. Coba lagi.';
      onResult(false, msg);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}


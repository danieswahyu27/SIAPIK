/* ============================================
   SIAPIK — js/stats.js
   Statistik + daftar titik api (badge status) + search
   ============================================ */

let _allHotspots = [];   // simpan semua data buat filter

function renderStats(hotspots) {
  _allHotspots = hotspots;
  const total = hotspots.length;

  const perProvinsi = {};
  hotspots.forEach(h => {
    perProvinsi[h.provinsi] = (perProvinsi[h.provinsi] || 0) + 1;
  });
  const urut = Object.entries(perProvinsi).sort((a, b) => b[1] - a[1]);
  const top = urut[0];

  const elTotal = document.getElementById('stat-total');
  const elProv  = document.getElementById('stat-provinsi');
  if (elTotal) elTotal.textContent = total;
  if (elProv)  elProv.textContent  = top ? `${top[0]} (${top[1]})` : '-';

  renderBarChart(urut);
  renderHotspotList(hotspots);
}

function renderBarChart(urut) {
  const chart = document.getElementById('stats-chart');
  if (!chart) return;
  if (!urut.length) { chart.innerHTML = '<p class="muted">Belum ada data.</p>'; return; }

  const max = urut[0][1] || 1;
  chart.innerHTML = urut.map(([prov, jumlah]) => {
    const pct = Math.round((jumlah / max) * 100);
    return `
      <div class="bar-row">
        <span class="bar-label" title="${prov}">${prov}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <span class="bar-value">${jumlah}</span>
      </div>`;
  }).join('');
}

// ---- Hitung badge status dari field waktu ----
function hitungStatus(waktuStr) {
  const tgl = new Date(waktuStr);
  const now = new Date();
  const selisihJam = (now - tgl) / (1000 * 60 * 60);

  if (selisihJam < 0) return { kode: 'baru', label: 'BARU' };        // waktu di masa depan → anggap baru
  if (selisihJam <= 24) return { kode: 'baru', label: 'BARU' };

  const samaHari = tgl.getFullYear() === now.getFullYear()
    && tgl.getMonth() === now.getMonth()
    && tgl.getDate() === now.getDate();
  if (samaHari) return { kode: 'hari-ini', label: 'HARI INI' };

  return { kode: 'lama', label: 'LAMA' };
}

function formatTanggal(waktuStr) {
  const tgl = new Date(waktuStr);
  return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderHotspotList(hotspots) {
  const list = document.getElementById('hotspot-list');
  if (!list) return;

  if (!hotspots.length) {
    list.innerHTML = '<li class="muted" style="padding:12px">Tidak ada titik yang cocok.</li>';
    return;
  }

  // Urut terbaru dulu
  const sorted = [...hotspots].sort((a, b) => new Date(b.waktu) - new Date(a.waktu));

  list.innerHTML = sorted.map(h => {
    const st = hitungStatus(h.waktu);
    return `
      <li class="hotspot-item" data-id="${h.id}">
        <span class="dot" style="background:${warnaTingkat(h.tingkat)}"></span>
        <div class="hotspot-info">
          <strong>${h.lokasi}</strong>
          <span class="muted">${h.provinsi} · ${formatTanggal(h.waktu)}</span>
        </div>
        <span class="badge-status badge-${st.kode}">${st.label}</span>
      </li>`;
  }).join('');

  list.querySelectorAll('.hotspot-item').forEach(item => {
    item.addEventListener('click', () => fokusKeHotspot(Number(item.dataset.id)));
  });
}

// ---- Search / filter ----
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { renderHotspotList(_allHotspots); return; }
    const hasil = _allHotspots.filter(h =>
      h.provinsi.toLowerCase().includes(q) || h.lokasi.toLowerCase().includes(q)
    );
    renderHotspotList(hasil);
  });
}



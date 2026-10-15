/* ============================================
   SIAPIK — js/weather.js
   Ambil cuaca per titik api via Open-Meteo (gratis, tanpa API key)
   Docs: https://open-meteo.com/en/docs
   ============================================ */

// Cache sederhana biar tidak fetch berulang untuk koordinat sama
const _weatherCache = new Map();

async function getWeather(lat, lon) {
  const key = `${lat},${lon}`;
  if (_weatherCache.has(key)) return _weatherCache.get(key);

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&timezone=Asia%2FJakarta`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    _weatherCache.set(key, data);
    return data;
  } catch (err) {
    console.error('[weather] gagal ambil cuaca:', err);
    return null;
  }
}

// Mapping kode cuaca WMO → deskripsi singkat
function kodeCuaca(code) {
  const map = {
    0: 'Cerah', 1: 'Cerah berawan', 2: 'Berawan', 3: 'Mendung',
    45: 'Berkabut', 48: 'Kabut beku',
    51: 'Gerimis ringan', 53: 'Gerimis', 55: 'Gerimis lebat',
    61: 'Hujan ringan', 63: 'Hujan', 65: 'Hujan lebat',
    80: 'Hujan lokal', 81: 'Hujan lokal lebat', 82: 'Hujan sangat lebat',
    95: 'Badai petir', 96: 'Badai petir + hujan es', 99: 'Badai petir hebat'
  };
  return map[code] || 'Tidak diketahui';
}

function formatWeather(data) {
  if (!data || !data.current) {
    return '<em class="muted">Data cuaca tidak tersedia</em>';
  }
  const c = data.current;
  const hujan = [51,53,55,61,63,65,80,81,82,95,96,99].includes(c.weather_code);
  // Angin kencang menambah risiko penyebaran api
  const anginBahaya = c.wind_speed_10m >= 20;

  return `
    <div class="wx">
      <div class="wx-row"><span>Suhu</span><strong>${c.temperature_2m}°C</strong></div>
      <div class="wx-row"><span>Kelembapan</span><strong>${c.relative_humidity_2m}%</strong></div>
      <div class="wx-row"><span>Angin</span><strong>${c.wind_speed_10m} km/j</strong></div>
      <div class="wx-row"><span>Kondisi</span><strong>${kodeCuaca(c.weather_code)}</strong></div>
      ${hujan ? '<div class="wx-note ok">Ada hujan — membantu meredam api</div>' : ''}
      ${anginBahaya ? '<div class="wx-note warn">Angin kencang — api berisiko menyebar</div>' : ''}
    </div>`;
}

// HTML kerangka yang langsung tampil di popup saat data cuaca masih dimuat
function cuacaLoadingHTML() {
  return '<div class="wx-loading">Memuat cuaca…</div>';
}


# 🔥 SIAPIK — Peta Kebakaran Hutan & Lahan Indonesia

Web statis (HTML/CSS/JS, tanpa backend) untuk memantau titik api, cuaca, laporan warga, dan tanya jawab seputar kebakaran.

## Fitur
1. **Peta interaktif (Leaflet)** — titik-titik kebakaran.
2. **Info cuaca** — data Open-Meteo di titik api.
3. **Form laporan warga** — tersimpan di `localStorage` (demo).
4. **Chatbot** — rule-based, jawaban dari `data/knowledge.json`.
5. **Statistik** — jumlah titik api & provinsi terbanyak.

## Struktur
```
siapik/
├── index.html
├── css/    (theme, style, chat)
├── js/     (app, map, weather, report, chatbot, stats, data)
├── data/   (hotspots.json, knowledge.json)
└── assets/ (icons, img)
```

## Cara Menjalankan
Karena memuat file JSON via `fetch`, buka lewat server lokal (bukan `file://`):
```bash
# pilih salah satu
python -m http.server 8080
npx serve
```
Lalu buka http://localhost:8080

## Yang Perlu Dilanjutkan (TODO)
- [ ] `map.js` — inisialisasi Leaflet & marker (masih placeholder).
- [ ] `weather.js` — panggil Open-Meteo & tampilkan di popup.
- [ ] `stats.js` — isi daftar `#hotspot-list` & chart.
- [ ] Ganti `data/hotspots.json` dengan sumber hotspot nyata bila ada.

## Disclaimer
Proyek ini untuk pembelajaran. Laporan **tidak** dikirim ke instansi mana pun.
Untuk keadaan darurat hubungi **119**.

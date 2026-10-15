# AI_LOGBOOK - SIAPIK

## Tahap 1: Eksplorasi Ide & Perancangan
**Contoh prompt:**
- "Bikin web statis SIAPIK — peta kebakaran hutan/lahan Indonesia, HTML/CSS/JS tanpa backend."
- Data: 5 titik api (hotspots) + cuaca Open-Meteo di popup.
- Fitur MVP: peta Leaflet, form laporan warga (localStorage), panel statistik, chatbot.
- Tema visual: "Nightwatch" (gelap + aksen oranye).
- Lanjut upgrade MVP ke level lanjut: marker besar, sidebar daftar hotspot, PWA, AI chatbot, perbaikan peta.

**Jawaban AI (ringkas):**
- Menyusun struktur folder: `index.html`, `css/` (style, theme, chat), `js/` (app, map, data, weather, report, stats, chatbot), `data/` (hotspots.json, knowledge.json).
- Menyarankan tema gelap-oranye "Nightwatch" dan alur modular satu fitur per file JS.
- Chatbot awal dibikin rule-based (cocokkan keyword dari knowledge.json).

**Bayangan hasil akhir (tujuan):**
- Web peta interaktif titik api Indonesia + info cuaca per titik.
- Warga bisa lapor kejadian (tersimpan lokal) dan ada panel statistik.
- Ada pencarian, tombol "Lokasi Saya", mode PWA bisa di-install.
- Chatbot asisten kebakaran yang menjawab pertanyaan warga.

**Pemahaman saya:**
(TODO: isi sendiri)

**Validasi & Modifikasi Mandiri:**
(TODO: isi sendiri)

---

## Tahap 2: Penyusunan Kerangka Kode
**Contoh prompt:**
- "Susun kerangka kode: peta Leaflet + 5 titik api, popup cuaca, form laporan, statistik, chatbot, tema Nightwatch."
- "Upgrade MVP: marker divIcon 🔥 besar berwarna per tingkat, sidebar daftar hotspot badge BARU/HARI INI/LAMA, klik item → flyTo + popup, legenda, search."
- "Tambah tombol 'Lokasi Saya' (geolocation) + dot biru, PWA (manifest.json + sw.js + icon.svg), tombol 'Lihat Sumber' muncul kondisional."

**Jawaban AI (ringkas):**
- `js/app.js` punya `init()` utama yang memanggil: initMap(), DataStore.load(), renderHotspots(), renderStats(), initReportForm(), initChatbot(), initModals(), initSearch(), initGeolocationButton(), registerServiceWorker().
- `js/map.js` untuk peta: marker divIcon 🔥 besar, warna per tingkat, legenda, flyTo + popup saat item sidebar diklik.
- `js/data.js` memuat data/hotspots.json; `js/weather.js` ambil cuaca Open-Meteo; `js/report.js` simpan laporan ke localStorage; `js/stats.js` hitung statistik.
- PWA: manifest.json, sw.js (cache offline), assets/icons/icon.svg.
- Chip pertanyaan cepat chatbot dibaca dari data/knowledge.json.

**Pemahaman saya:**
(TODO: isi sendiri)

**Validasi & Modifikasi Mandiri:**
(TODO: isi sendiri)

---

## Tahap 3: Pemecahan Masalah & Debugging
**Contoh prompt:**
- "Basemap CartoDB muncul tulisan 'API KEY REQUIRED' / peta gelap. Ganti basemap gratis tanpa API key."
- "Aku pakai Esri World_Imagery, tapi basemapnya jadi gelap. Kenapa?"
- "Peta ke-repeat/berulang pas di-zoom out. Gimana ngunci biar nggak dobel?"
- "Chatbot jawab template terus, padahal aku mau jawaban dari AI beneran."

**Bug 1 — Basemap CartoDB "API KEY REQUIRED" → ganti ke Esri:**
- Masalah: basemap CartoDB yang dipakai ternyata deprecated / butuh API key → muncul pesan error di tile.
- Solusi: ganti ke basemap Esri gratis tanpa key (World_Imagery), tambah overlay label World_Dark_Gray_Reference (transparan, label saja) di atasnya dengan zIndex: 2.
- Catatan penting: urutan URL Esri pakai pola `{z}/{y}/{x}` (bukan `{z}/{x}/{y}`) — kalau kebalik, tile tidak muncul.
- Layer Leaflet ditumpuk sesuai urutan addTo(); yang terakhir digambar tampil paling atas.

**Bug 2 — Peta ke-repeat saat zoom out → maxBounds + noWrap:**
- Masalah: saat di-zoom out, peta terkadang tampil berulang (kembar/dobel).
- Solusi: pasang 3 lapis pencegahan sekaligus:
  1. maxBounds di peta (+ minZoom: 3) supaya peta nggak bisa digeser keluar batas.
  2. worldCopyJump: true biar perpindahan dunia mulus.
  3. noWrap: true di KEDUA tileLayer (basemap & overlay) supaya tile nggak digambar berulang.

**Jawaban AI (ringkas):**
- Ganti sumber tile dari CartoDB ke Esri, balikin tampilan pakai CSS filter brightness(0.85) saturate(0.9) pada tile.
- Tuliskan maxBounds + minZoom: 3 + worldCopyJump + noWrap: true di js/map.js.
- Verifikasi: konsol tidak ada error, tile tampil sekali saja.

**Pemahaman saya:**
(TODO: isi sendiri)

**Validasi & Modifikasi Mandiri:**
(TODO: isi sendiri)

---

## Tahap 4: Refleksi & Penjelasan Kode
**Contoh prompt:**
- "Ganti chatbot rule-based di js/chatbot.js jadi AI beneran pakai Groq API (llama-3.1-8b-instant), key di localStorage, jangan hardcode."
- "Jelaskan alurnya: ketik → fetch → response → tampil, baru kode + komentar."
- "Ganti dari Groq ke Pollinations.ai biar nggak perlu API key: GET ke text.pollinations.ai/<prompt>, hapus kolom key & logic localStorage, tetap ada loading indicator & error handling."
- Minta bantuan isi AI_LOGBOOK.md ini berdasarkan riwayat percakapan.

**Jawaban AI (ringkas):**
- Menjelaskan alur chatbot: input user → tampilkan bubble → loading indicator → fetch ke API → terima response → tampilkan jawaban (atau error yang sopan).
- Menjelaskan kenapa API key tidak boleh di-hardcode (repo GitHub publik → key bisa dicuri) → disimpan di localStorage saja.
- Menjelaskan encodeURIComponent penting saat menyusun URL, AbortController untuk timeout 20 detik, dan bahwa Pollinations membalikkan teks biasa (bukan JSON).
- chatHistory dihapus karena endpoint GET berbasis satu string prompt (jawaban mandiri per pertanyaan).
- Menyusun isi AI_LOGBOOK.md sesuai kerangka, kolom pribadi dikosongkan (placeholder).

**Refleksi alur pengerjaan (keseluruhan):**
- Tahap 1: menyusun ide + struktur + tema.
- Tahap 2: menyusun kerangka kode per modul + upgrade fitur (marker, sidebar, PWA).
- Tahap 3: debugging peta (basemap & tile repeat).
- Tahap 4: membangun & memindahkan chatbot AI, lalu merefleksikan alurnya ke log ini.

**Pemahaman saya:**
(TODO: isi sendiri)

**Validasi & Modifikasi Mandiri:**
(TODO: isi sendiri)


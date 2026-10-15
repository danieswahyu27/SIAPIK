# 🤝 Cara Kontribusi

Terima kasih sudah mau berkontribusi ke **SIAPIK**! 🎉

## Alur Singkat

1. **Fork** repo ini.
2. Buat branch baru: `git checkout -b fitur/nama-fitur`.
3. Lakukan perubahan, lalu **commit**: `git commit -m "feat: deskripsi singkat"`.
4. **Push** ke fork-mu: `git push origin fitur/nama-fitur`.
5. Buka **Pull Request** ke branch `master`.

## Menjalankan Secara Lokal

```bash
python -m http.server 8080
# buka http://localhost:8080
```

Cek dulu: pastikan **Console browser bersih** (tidak ada error) sebelum kirim PR.

## Konvensi Commit

Pakai format sederhana **Conventional Commits**:

| Prefix | Untuk |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `style:` | Format CSS/penataan (bukan ubah perilaku) |
| `refactor:` | Rombak kode tanpa ubah perilaku |
| `chore:` | Hal teknis (config, dsb.) |

Contoh: `fix: perbaiki peta ke-repeat saat zoom out`

## Gaya Kode

- **JavaScript** — vanilla, tanpa framework/build. Jaga modul tetap terpisah (`map.js`, `weather.js`, dst.).
- **CSS** — pakai variabel dari `css/theme.css`, jangan hardcode warna.
- **Komentar** — tulis singkat dalam bahasa Indonesia, jelaskan **kenapa**, bukan sekadar **apa**.
- **API key** — ❌ **JANGAN** pernah hardcode API key di kode. Selalu ambil dari input user / `localStorage`.

## Checklist Pull Request

- [ ] Tidak ada error di Console browser.
- [ ] Tidak ada API key / rahasia yang ter-commit.
- [ ] Sudah update `README.md` bila menambah fitur.

## Melaporkan Bug

Buka **Issue** dan sertakan:
- Langkah untuk mereproduksi
- Yang diharapkan vs yang terjadi
- Pesan error di Console (bila ada)
- Browser & versinya

Terima kasih! ❤️

/* ============================================
   SIAPIK — js/report.js
   Logic form laporan warga (simpan ke localStorage)
   ============================================ */

function initReportForm() {
  const form = document.getElementById('form-report');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const report = {
      lokasi:    fd.get('lokasi'),
      tingkat:   fd.get('tingkat'),
      deskripsi: fd.get('deskripsi'),
      waktu:     new Date().toISOString()
    };

    DataStore.addReport(report);
    console.log('[report] tersimpan:', report);
    alert('Laporan tersimpan di browser kamu (demo). Darurat? Hubungi 119.');
    form.reset();
    closeModal('modal-report');
  });
}

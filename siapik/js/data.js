/* ============================================
   SIAPIK — js/data.js
   Load data hotspot dari data/hotspots.json
   ============================================ */

const DataStore = {
  hotspots: [],

  async load() {
    try {
      const res = await fetch('data/hotspots.json');
      this.hotspots = await res.json();
      console.log('[data] hotspot dimuat:', this.hotspots.length);
      return this.hotspots;
    } catch (err) {
      console.error('[data] gagal memuat hotspot:', err);
      this.hotspots = [];
      return [];
    }
  },

  // Ambil laporan warga dari localStorage
  getReports() {
    try {
      return JSON.parse(localStorage.getItem('siapik_reports') || '[]');
    } catch { return []; }
  },

  addReport(report) {
    const all = this.getReports();
    all.push(report);
    localStorage.setItem('siapik_reports', JSON.stringify(all));
  }
};

// TODO: sesuaikan struktur data dengan sumber nyata (API hotspot, dsb.)

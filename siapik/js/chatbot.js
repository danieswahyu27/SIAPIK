/* ============================================
   SIAPIK — js/chatbot.js
   Chatbot AI beneran via Groq API (Llama 3.1 8B).
   API key diambil dari localStorage — JANGAN hardcode di kode!
   ============================================ */

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const KEY_STORAGE = 'siapik_groq_key';

const SYSTEM_PROMPT =
  'Kamu asisten kesiapsiagaan kebakaran hutan & lahan buat warga Indonesia. ' +
  'Jawab pakai bahasa Indonesia, singkat, jelas. Selalu sertakan: ' +
  '(1) langkah keselamatan pertama, (2) nomor darurat damkar 113 / darurat 112, ' +
  '(3) ingetin buat hubungi pihak berwenang. Jangan kasih diagnosis medis.';

// Riwayat percakapan (biar konteks nyambung). Groq bersifat stateless.
let chatHistory = [];

// ---- Chip pertanyaan cepat dari knowledge.json (jawaban tetap dari AI) ----
async function loadChips() {
  const container = document.getElementById('chat-quick');
  if (!container) return;
  try {
    const res = await fetch('data/knowledge.json');
    const items = await res.json();
    container.innerHTML = items.map(it =>
      `<button class="chip" data-q="${it.pertanyaan}">${it.keywords[0]}</button>`
    ).join('');
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => kirimPesan(chip.dataset.q));
    });
  } catch (err) {
    console.warn('[chatbot] gagal memuat chip:', err);
  }
}

// knowledge.json tetap dipakai buat chip pertanyaan cepat (bukan jawaban)
function initChatbot() {
  const form    = document.getElementById('form-chat');
  const log     = document.getElementById('chat-log');
  const keyInput = document.getElementById('groq-key');
  if (!form) return;

  // Muat key yang tersimpan (kalau ada)
  const saved = localStorage.getItem(KEY_STORAGE);
  if (saved && keyInput) keyInput.value = saved;

  // Simpan key saat diubah
  if (keyInput) {
    keyInput.addEventListener('change', () => {
      const v = keyInput.value.trim();
      if (v) localStorage.setItem(KEY_STORAGE, v);
      else   localStorage.removeItem(KEY_STORAGE);
    });
  }

  // Submit form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[name="pesan"]');
    const text  = input.value.trim();
    if (!text) return;
    input.value = '';
    kirimPesan(text);
  });

  // Chip pertanyaan cepat (diisi async dari knowledge.json)
  loadChips();
}

// ---- Alur utama: tampilkan pesan user -> loading -> fetch -> tampilkan ----
async function kirimPesan(text) {
  appendChat('user', text);
  chatHistory.push({ role: 'user', content: text });

  const key = (localStorage.getItem(KEY_STORAGE) || '').trim();
  if (!key) {
    appendChat('bot', 'Kamu belum mengisi API Key Groq. Isi dulu di kolom atas ya (gratis di console.groq.com). 🙂');
    chatHistory.pop();
    return;
  }

  const loadingEl = appendLoading();

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory
        ],
        temperature: 0.4,
        max_tokens: 500
      })
    });

    loadingEl.remove();

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('[chatbot] Groq error', res.status, errText);
      appendChat('bot', pesanError(res.status));
      chatHistory.pop();
      return;
    }

    const data = await res.json();
    const jawaban = data?.choices?.[0]?.message?.content?.trim()
      || 'Maaf, aku belum bisa menjawab itu. Kalau darurat, hubungi 113/112 ya.';

    appendChat('bot', jawaban);
    chatHistory.push({ role: 'assistant', content: jawaban });

  } catch (err) {
    loadingEl.remove();
    console.error('[chatbot] gagal fetch:', err);
    appendChat('bot', 'Gagal terhubung ke server AI. Cek koneksi internet kamu, lalu coba lagi. Kalau darurat, langsung hubungi 113/112.');
    chatHistory.pop();
  }
}

// Pesan error yang sopan sesuai status
function pesanError(status) {
  if (status === 401 || status === 403)
    return 'API Key Groq-nya kayaknya salah atau nggak valid. Cek lagi di kolom atas ya. Kalau darurat, hubungi 113/112.';
  if (status === 429)
    return 'Server AI lagi rame (kena rate limit). Tunggu sebentar, lalu coba lagi. Kalau darurat, jangan nunggu — hubungi 113/112 sekarang.';
  if (status >= 500)
    return 'Server AI-nya sedang gangguan. Coba lagi nanti. Kalau darurat, hubungi 113/112.';
  return `Terjadi masalah (kode ${status}). Coba lagi ya. Kalau darurat, hubungi 113/112.`;
}

// Tampilkan bubble chat
function appendChat(role, text) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + role;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// Loading indicator (tiga titik berdenyut), dikembalikan biar bisa dihapus
function appendLoading() {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'chat-msg bot chat-loading';
  div.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  return div;
}


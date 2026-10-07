/* =========================================================
   API / DATA SERVICE LAYER
   ---------------------------------------------------------
   This is the ONLY place that touches storage. Right now it
   reads/writes localStorage (mock mode). To switch to the
   PHP + MySQL backend (XAMPP), flip USE_BACKEND to true and
   the methods will call /api/*.php instead. The rest of the
   app does not change.
   ========================================================= */

const USE_BACKEND = false;              // <-- set true when running on XAMPP with PHP+MySQL
const API_BASE = "api";                 // relative path to PHP endpoints

function _autoReply() {
  const lang = (localStorage.getItem("mp_lang") || "id");
  const id = [
    "Halo! Terima kasih sudah menghubungi. Boleh cerita lebih detail soal timnya?",
    "Oke menarik! Aku tertarik gabung. Kapan kita bisa diskusi?",
    "Sip, kebetulan aku lagi cari partner juga. Lanjut via kontak ya!",
  ];
  const en = [
    "Hi! Thanks for reaching out. Could you tell me more about the team?",
    "Interesting! I'm keen to join. When can we discuss?",
    "Great, I'm looking for a partner too. Let's continue via contact!",
  ];
  const arr = lang === "en" ? en : id;
  return arr[Math.floor(Math.random() * arr.length)];
}

async function _get(url) {
  const res = await fetch(`${API_BASE}/${url}`, { credentials: "include" });
  return res.json();
}
async function _post(url, body) {
  const res = await fetch(`${API_BASE}/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return res.json();
}

const API = {
  /* ---------- EVENTS ---------- */
  async getEvents() {
    if (USE_BACKEND) return _get("events.php");
    return JSON.parse(localStorage.getItem("mp_events") || "[]");
  },

  /* ---------- MATCHES ---------- */
  async getMatches() {
    if (USE_BACKEND) return _get("matches.php");
    return JSON.parse(localStorage.getItem("mp_matches") || "[]");
  },
  async addMatch(match) {
    if (USE_BACKEND) return _post("matches.php", match);
    const list = JSON.parse(localStorage.getItem("mp_matches") || "[]");
    match.id = Date.now();
    list.unshift(match);
    localStorage.setItem("mp_matches", JSON.stringify(list));
    return match;
  },
  async getMatch(id) {
    const list = await API.getMatches();
    return list.find(m => String(m.id) === String(id)) || null;
  },

  /* ---------- MESSAGES (mock, localStorage) ---------- */
  getConversations() {
    return JSON.parse(localStorage.getItem("mp_messages") || "{}");
  },
  getThread(peerId) {
    const all = API.getConversations();
    return all[peerId] || [];
  },
  sendMessage(peerId, peerName, text) {
    const all = API.getConversations();
    if (!all[peerId]) all[peerId] = [];
    all[peerId].push({ from: "me", text, ts: Date.now() });
    localStorage.setItem("mp_messages", JSON.stringify(all));
    localStorage.setItem("mp_peer_" + peerId, peerName || "");
    // simulate an auto-reply so the thread feels alive
    setTimeout(() => {
      const cur = API.getConversations();
      if (!cur[peerId]) cur[peerId] = [];
      cur[peerId].push({ from: "them", text: _autoReply(), ts: Date.now() });
      localStorage.setItem("mp_messages", JSON.stringify(cur));
      window.dispatchEvent(new CustomEvent("mp:newmessage", { detail: { peerId } }));
    }, 1200);
    return all[peerId];
  },
  peerName(peerId) {
    return localStorage.getItem("mp_peer_" + peerId) || "";
  },

  /* ---------- USER / PROFILE ---------- */
  async getUser() {
    if (USE_BACKEND) return _get("profile.php");
    return JSON.parse(localStorage.getItem("mp_user") || "null");
  },
  async updateUser(patch) {
    if (USE_BACKEND) return _post("profile.php", patch);
    const user = JSON.parse(localStorage.getItem("mp_user") || "{}");
    Object.assign(user, patch);
    localStorage.setItem("mp_user", JSON.stringify(user));
    return user;
  },

  /* ---------- CERTIFICATES ---------- */
  async addCertificate(cert) {
    const user = await API.getUser();
    cert.id = Date.now();
    user.certificates = user.certificates || [];
    user.certificates.push(cert);
    return API.updateUser({ certificates: user.certificates });
  },
  async deleteCertificate(certId) {
    const user = await API.getUser();
    user.certificates = (user.certificates || []).filter(c => c.id !== certId);
    return API.updateUser({ certificates: user.certificates });
  },

  /* ---------- AUTH (mock) ---------- */
  async login(email, password) {
    if (USE_BACKEND) return _post("auth.php?action=login", { email, password });
    const user = JSON.parse(localStorage.getItem("mp_user") || "null");
    if (user && user.email === email && user.password === password) {
      localStorage.setItem("mp_session", "1");
      return { ok: true, user };
    }
    return { ok: false, error: "Email atau password salah." };
  },
  async register(fullname, email, password) {
    if (USE_BACKEND) return _post("auth.php?action=register", { fullname, email, password });
    const user = { ...SEED_USER, fullname, email, password, certificates: [], skills: [] };
    localStorage.setItem("mp_user", JSON.stringify(user));
    localStorage.setItem("mp_session", "1");
    return { ok: true, user };
  },
  logout() {
    localStorage.removeItem("mp_session");
    if (USE_BACKEND) fetch(`${API_BASE}/auth.php?action=logout`, { credentials: "include" });
  },
  isLoggedIn() {
    return localStorage.getItem("mp_session") === "1";
  },

  async changeEmail(newEmail) {
    return API.updateUser({ email: newEmail });
  },
  async changePassword(current, next) {
    const user = await API.getUser();
    if (user.password !== current) return { ok: false, error: "Password saat ini salah." };
    await API.updateUser({ password: next });
    return { ok: true };
  },
};

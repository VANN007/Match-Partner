/* =========================================================
   API / DATA SERVICE LAYER
   ---------------------------------------------------------
   This is the ONLY place that touches storage. Right now it
   reads/writes localStorage (mock mode). To switch to the
   PHP + MySQL backend (XAMPP), flip USE_BACKEND to true and
   the methods will call /api/*.php instead. The rest of the
   app does not change.

   Roles: "participant" | "organizer" | "admin"
   Organizer status: "active" | "pending" (needs admin approval)
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

/* ---------- local storage user helpers (mock mode) ---------- */
function _users() {
  return JSON.parse(localStorage.getItem("mp_users") || "[]");
}
function _saveUsers(list) {
  localStorage.setItem("mp_users", JSON.stringify(list));
}
function _currentId() {
  const id = localStorage.getItem("mp_session");
  return id ? parseInt(id, 10) : null;
}
function _stripPw(u) {
  if (!u) return u;
  const { password, ...rest } = u;
  return rest;
}

const API = {
  /* ---------- EVENTS ---------- */
  async getEvents() {
    if (USE_BACKEND) return _get("events.php");
    return JSON.parse(localStorage.getItem("mp_events") || "[]");
  },
  async getEvent(id) {
    const list = await API.getEvents();
    return list.find(e => String(e.id) === String(id)) || null;
  },
  async getMyEvents() {
    if (USE_BACKEND) return _get("events.php?mine=1");
    const uid = _currentId();
    const list = await API.getEvents();
    return list.filter(e => String(e.ownerId) === String(uid));
  },
  async addEvent(ev) {
    if (USE_BACKEND) return _post("events.php", ev);
    const list = await API.getEvents();
    ev.id = Date.now();
    ev.ownerId = _currentId();
    list.push(ev);
    localStorage.setItem("mp_events", JSON.stringify(list));
    return ev;
  },
  async updateEvent(id, patch) {
    if (USE_BACKEND) return _post("events.php?id=" + encodeURIComponent(id), patch);
    const list = await API.getEvents();
    const ev = list.find(e => String(e.id) === String(id));
    if (ev) { Object.assign(ev, patch); localStorage.setItem("mp_events", JSON.stringify(list)); }
    return ev;
  },
  async deleteEvent(id) {
    if (USE_BACKEND) return _post("events.php?action=delete&id=" + encodeURIComponent(id), {});
    let list = await API.getEvents();
    list = list.filter(e => String(e.id) !== String(id));
    localStorage.setItem("mp_events", JSON.stringify(list));
    return { ok: true };
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
  async deleteMatch(id) {
    if (USE_BACKEND) return _post("matches.php?action=delete&id=" + encodeURIComponent(id), {});
    let list = await API.getMatches();
    list = list.filter(m => String(m.id) !== String(id));
    localStorage.setItem("mp_matches", JSON.stringify(list));
    return { ok: true };
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
    const uid = _currentId();
    const u = _users().find(x => x.id === uid);
    return u ? _stripPw(u) : null;
  },
  async updateUser(patch) {
    if (USE_BACKEND) return _post("profile.php", patch);
    const uid = _currentId();
    const list = _users();
    const u = list.find(x => x.id === uid);
    if (u) { Object.assign(u, patch); _saveUsers(list); }
    return _stripPw(u);
  },

  /* ---------- CERTIFICATES ---------- */
  async addCertificate(cert) {
    if (USE_BACKEND) { const u = await API.getUser(); const certs = (u.certificates||[]).concat([{...cert, id: Date.now()}]); return _post("profile.php", { certificates: certs }); }
    const user = await API.getUser();
    cert.id = Date.now();
    const certs = (user.certificates || []).concat([cert]);
    return API.updateUser({ certificates: certs });
  },
  async deleteCertificate(certId) {
    const user = await API.getUser();
    const certs = (user.certificates || []).filter(c => c.id !== certId);
    return API.updateUser({ certificates: certs });
  },

  /* ---------- AUTH ---------- */
  async login(email, password) {
    if (USE_BACKEND) return _post("auth.php?action=login", { email, password });
    const u = _users().find(x => x.email === email && x.password === password);
    if (!u) return { ok: false, error: "Email atau password salah." };
    localStorage.setItem("mp_session", String(u.id));
    return { ok: true, user: _stripPw(u) };
  },
  async register(fullname, email, password, role) {
    role = role || "participant";
    if (USE_BACKEND) return _post("auth.php?action=register", { fullname, email, password, role });
    const list = _users();
    if (list.some(x => x.email === email)) return { ok: false, error: "Email sudah terdaftar." };
    const user = {
      id: Date.now(),
      fullname, email, password, role,
      status: role === "organizer" ? "pending" : "active",
      headline: "", bio: "", skills: [], certificates: [],
    };
    list.push(user);
    _saveUsers(list);
    localStorage.setItem("mp_session", String(user.id));
    return { ok: true, user: _stripPw(user) };
  },
  logout() {
    localStorage.removeItem("mp_session");
    if (USE_BACKEND) fetch(`${API_BASE}/auth.php?action=logout`, { credentials: "include" });
  },
  isLoggedIn() {
    if (USE_BACKEND) return localStorage.getItem("mp_session") === "1";
    return _currentId() !== null && !!_users().find(x => x.id === _currentId());
  },

  async changeEmail(newEmail) {
    return API.updateUser({ email: newEmail });
  },
  async changePassword(current, next) {
    if (USE_BACKEND) return _post("profile.php", { _action: "password", current, next });
    const uid = _currentId();
    const list = _users();
    const u = list.find(x => x.id === uid);
    if (!u || u.password !== current) return { ok: false, error: "Password saat ini salah." };
    u.password = next;
    _saveUsers(list);
    return { ok: true };
  },

  /* ---------- ADMIN ---------- */
  async getAllUsers() {
    if (USE_BACKEND) return _get("admin.php?resource=users");
    return _users().map(_stripPw);
  },
  async setUserRole(id, role) {
    if (USE_BACKEND) return _post("admin.php?resource=users&id=" + encodeURIComponent(id), { role });
    const list = _users();
    const u = list.find(x => String(x.id) === String(id));
    if (u) { u.role = role; _saveUsers(list); }
    return _stripPw(u);
  },
  async setUserStatus(id, status) {
    if (USE_BACKEND) return _post("admin.php?resource=users&id=" + encodeURIComponent(id), { status });
    const list = _users();
    const u = list.find(x => String(x.id) === String(id));
    if (u) { u.status = status; _saveUsers(list); }
    return _stripPw(u);
  },
  async deleteUser(id) {
    if (USE_BACKEND) return _post("admin.php?resource=users&action=delete&id=" + encodeURIComponent(id), {});
    let list = _users().filter(x => String(x.id) !== String(id));
    _saveUsers(list);
    return { ok: true };
  },
  async getStats() {
    if (USE_BACKEND) return _get("admin.php?resource=stats");
    const users = _users();
    const events = await API.getEvents();
    const matches = await API.getMatches();
    return {
      users: users.length,
      organizers: users.filter(u => u.role === "organizer").length,
      pending: users.filter(u => u.role === "organizer" && u.status === "pending").length,
      events: events.length,
      matches: matches.length,
    };
  },
};

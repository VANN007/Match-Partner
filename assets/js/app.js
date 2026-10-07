/* =========================================================
   SHARED APP HELPERS
   - renders navbar + footer
   - toast + modal utilities
   - page bootstrap
   ========================================================= */

function navbar(active) {
  const loggedIn = API.isLoggedIn();
  return `
  <nav class="nav">
    <div class="container nav-inner">
      <a class="brand" href="index.html">
        <span class="mark"></span>
        <span class="name">MATCH<b>PARTNER</b></span>
      </a>
      <div class="nav-links">
        <a class="nav-link ${active==='home'?'active':''}" href="index.html" data-i18n="nav.home">Beranda</a>
        <a class="nav-link ${active==='match'?'active':''}" href="match.html" data-i18n="nav.match">Cari Partner</a>
        <a class="nav-link ${active==='events'?'active':''}" href="events.html" data-i18n="nav.events">Lomba</a>
        <a class="nav-link ${active==='messages'?'active':''}" href="messages.html" data-i18n="nav.messages">Pesan</a>
        <a class="nav-link ${active==='profile'?'active':''}" href="profile.html" data-i18n="nav.profile">Profil</a>
        <a class="nav-link ${active==='settings'?'active':''}" href="settings.html" data-i18n="nav.settings">Pengaturan</a>
        ${loggedIn
          ? `<a class="nav-link" href="#" id="logoutBtn" data-i18n="nav.logout">Keluar</a>`
          : `<a class="nav-link" href="login.html" data-i18n="nav.login">Masuk</a>`}
      </div>
    </div>
  </nav>`;
}

function footer() {
  return `
  <footer class="footer">
    <div class="container flex justify-between items-center" style="flex-wrap:wrap;gap:10px">
      <span data-i18n="footer.text">Match Partner — Sistem Pencarian Partner Lomba.</span>
      <span class="font-mono text-mute">v1.0 // STATUS: ONLINE</span>
    </div>
  </footer>`;
}

function mountChrome(active) {
  const nav = document.getElementById("navbar");
  const foot = document.getElementById("footer");
  if (nav) nav.innerHTML = navbar(active);
  if (foot) foot.innerHTML = footer();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      API.logout();
      toast(getLang()==="id" ? "Berhasil keluar." : "Logged out.");
      setTimeout(() => (location.href = "login.html"), 500);
    });
  }
  applyI18n();
}

/* ---------- toast ---------- */
function toast(msg, type = "") {
  let wrap = document.getElementById("toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; }, 2600);
  setTimeout(() => el.remove(), 3000);
}

/* ---------- modal ---------- */
function openModal(id) { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

/* ---------- auth guard ---------- */
function requireAuth() {
  if (!API.isLoggedIn()) {
    location.href = "login.html";
    return false;
  }
  return true;
}

/* ---------- utils ---------- */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  const lang = getLang();
  return d.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", { day: "2-digit", month: "short", year: "numeric" });
}
function daysLeft(iso) {
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(iso + "T00:00:00");
  return Math.round((d - now) / 86400000);
}

/* =========================================================
   SHARED APP HELPERS
   - renders navbar + footer
   - toast + modal utilities
   - page bootstrap
   ========================================================= */

/* ---------- THEME (light / dark) ---------- */
function getTheme() {
  return localStorage.getItem("mp_theme") || "dark";
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", getTheme());
}
function setTheme(theme) {
  localStorage.setItem("mp_theme", theme);
  applyTheme();
}
// apply immediately (before DOM paint) to avoid flash
applyTheme();

function navbar(active, user) {
  const loggedIn = API.isLoggedIn();
  const role = user ? user.role : null;
  const roleLinks = `
    ${role === "organizer" ? `<a class="nav-link ${active==='organizer'?'active':''}" href="organizer.html" data-i18n="nav.organizer">Dashboard</a>` : ""}
    ${role === "admin" ? `<a class="nav-link ${active==='admin'?'active':''}" href="admin.html" data-i18n="nav.admin">Admin</a>` : ""}`;
  return `
  <nav class="nav">
    <div class="container nav-inner">
      <a class="brand" href="index.html">
        <span class="mark"></span>
        <span class="name">MATCH<b>PARTNER</b></span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="navLinks">
        <a class="nav-link ${active==='home'?'active':''}" href="index.html" data-i18n="nav.home">Beranda</a>
        <a class="nav-link ${active==='match'?'active':''}" href="match.html" data-i18n="nav.match">Cari Partner</a>
        <a class="nav-link ${active==='events'?'active':''}" href="events.html" data-i18n="nav.events">Lomba</a>
        ${loggedIn ? `<a class="nav-link ${active==='messages'?'active':''}" href="messages.html" data-i18n="nav.messages">Pesan</a>` : ""}
        ${roleLinks}
        ${loggedIn ? `<a class="nav-link ${active==='profile'?'active':''}" href="profile.html" data-i18n="nav.profile">Profil</a>` : ""}
        ${loggedIn ? `<a class="nav-link ${active==='settings'?'active':''}" href="settings.html" data-i18n="nav.settings">Pengaturan</a>` : ""}
        ${loggedIn
          ? `<a class="nav-link" href="#" id="logoutBtn" data-i18n="nav.logout">Keluar</a>`
          : `<a class="nav-link" href="login.html" data-i18n="nav.login">Masuk</a>`}
        ${role ? `<span class="role-badge role-${role}">${roleLabel(role)}</span>` : ""}
      </div>
    </div>
  </nav>`;
}

function roleLabel(role) {
  const lang = getLang();
  const map = {
    id: { participant: "Peserta", organizer: "Penyelenggara", admin: "Admin" },
    en: { participant: "Participant", organizer: "Organizer", admin: "Admin" },
  };
  return (map[lang] && map[lang][role]) || role;
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

let CURRENT_USER = null;

async function mountChrome(active) {
  applyTheme();
  CURRENT_USER = API.isLoggedIn() ? await API.getUser() : null;
  const nav = document.getElementById("navbar");
  const foot = document.getElementById("footer");
  if (nav) nav.innerHTML = navbar(active, CURRENT_USER);
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

  // mobile hamburger toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    navLinks.querySelectorAll(".nav-link").forEach(a => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
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
/* role guard: pass one or more allowed roles. Redirects if not allowed. */
async function requireRole(...roles) {
  if (!API.isLoggedIn()) { location.href = "login.html"; return false; }
  const u = await API.getUser();
  if (!u || !roles.includes(u.role)) {
    location.href = "index.html";
    return false;
  }
  return u;
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

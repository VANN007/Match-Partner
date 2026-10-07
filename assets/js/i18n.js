/* =========================================================
   i18n — Internationalization (ID / EN)
   Usage: add data-i18n="key" to any element.
   Call applyI18n() after DOM load and on language change.
   ========================================================= */

const I18N = {
  id: {
    // nav
    "nav.home": "Beranda",
    "nav.match": "Cari Partner",
    "nav.events": "Lomba",
    "nav.profile": "Profil",
    "nav.settings": "Pengaturan",
    "nav.login": "Masuk",
    "nav.logout": "Keluar",

    // home / hero
    "home.tag": "SISTEM PENCARIAN PARTNER 001",
    "home.title1": "TEMUKAN",
    "home.title2": "PARTNER LOMBA",
    "home.title3": "TERBAIKMU",
    "home.subtitle": "Platform untuk mencari rekan tim lomba. Posting kebutuhanmu, temukan talenta, dan menangkan kompetisi bersama.",
    "home.cta.find": "Cari Partner",
    "home.cta.events": "Lihat Lomba",
    "home.feat.title": "FITUR UTAMA",
    "home.feat.sub": "Semua yang kamu butuhkan untuk membentuk tim pemenang",
    "home.f1.title": "Match Partner",
    "home.f1.desc": "Posting kebutuhan partner atau jelajahi daftar peserta yang mencari rekan tim.",
    "home.f2.title": "Info Lomba",
    "home.f2.desc": "Pantau lomba yang akan datang lengkap dengan tanggal, kategori, dan deadline.",
    "home.f3.title": "Profil & Sertifikat",
    "home.f3.desc": "Bangun profil profesional dengan skill dan sertifikat seperti portofolio.",
    "home.upcoming": "LOMBA TERDEKAT",
    "home.viewall": "Lihat Semua",

    // match
    "match.title": "CARI PARTNER",
    "match.sub": "Jelajahi peserta yang mencari rekan tim lomba",
    "match.post": "+ Posting Kebutuhan",
    "match.search": "Cari berdasarkan nama, skill, atau lomba...",
    "match.filter.all": "Semua Kategori",
    "match.looking": "Mencari",
    "match.contact": "Hubungi",
    "match.skills": "Keahlian",
    "match.empty": "Tidak ada hasil ditemukan.",
    "match.modal.title": "Posting Kebutuhan Partner",
    "match.modal.name": "Nama / Tim",
    "match.modal.event": "Lomba yang Diikuti",
    "match.modal.cat": "Kategori",
    "match.modal.looking": "Partner yang Dicari",
    "match.modal.skills": "Keahlian (pisahkan dengan koma)",
    "match.modal.contact": "Kontak (email / WhatsApp / Discord)",
    "match.modal.submit": "Posting",

    // events
    "events.title": "UPCOMING LOMBA",
    "events.sub": "Daftar kompetisi yang akan datang",
    "events.filter.all": "Semua Kategori",
    "events.deadline": "Deadline Daftar",
    "events.date": "Tanggal Lomba",
    "events.detail": "Detail",
    "events.register": "Daftar",
    "events.open": "DIBUKA",
    "events.closed": "DITUTUP",
    "events.empty": "Belum ada lomba.",

    // profile
    "profile.title": "PROFIL",
    "profile.edit": "Edit Profil",
    "profile.save": "Simpan",
    "profile.cancel": "Batal",
    "profile.about": "Tentang",
    "profile.skills": "Keahlian",
    "profile.certs": "Sertifikat & Lisensi",
    "profile.addcert": "+ Tambah Sertifikat",
    "profile.fullname": "Nama Lengkap",
    "profile.headline": "Headline",
    "profile.bio": "Bio",
    "profile.skills.input": "Keahlian (pisahkan dengan koma)",
    "profile.cert.name": "Nama Sertifikat",
    "profile.cert.org": "Diterbitkan Oleh",
    "profile.cert.date": "Tanggal Terbit",
    "profile.cert.id": "ID Kredensial (opsional)",
    "profile.cert.add": "Tambah",
    "profile.cert.issued": "Diterbitkan",
    "profile.cert.credid": "ID Kredensial",
    "profile.cert.empty": "Belum ada sertifikat. Tambahkan untuk memperkuat profilmu.",

    // settings
    "settings.title": "PENGATURAN",
    "settings.sub": "Kelola akun dan preferensimu",
    "settings.lang": "Bahasa",
    "settings.lang.desc": "Pilih bahasa tampilan website",
    "settings.account": "Akun",
    "settings.email": "Ubah Email",
    "settings.email.new": "Email Baru",
    "settings.email.current": "Email Saat Ini",
    "settings.password": "Ubah Password",
    "settings.password.current": "Password Saat Ini",
    "settings.password.new": "Password Baru",
    "settings.password.confirm": "Konfirmasi Password Baru",
    "settings.save": "Simpan Perubahan",
    "settings.danger": "Zona Berbahaya",
    "settings.logout": "Keluar dari Akun",

    // auth
    "auth.login": "Masuk",
    "auth.register": "Daftar",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Nama Lengkap",
    "auth.confirm": "Konfirmasi Password",
    "auth.login.btn": "Masuk",
    "auth.register.btn": "Buat Akun",
    "auth.tagline": "Sistem Pencarian Partner Lomba",

    // common
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.delete": "Hapus",
    "common.close": "Tutup",
    "common.saved": "Perubahan tersimpan.",
    "common.deleted": "Berhasil dihapus.",
    "common.required": "Mohon lengkapi semua kolom.",
    "common.back": "Kembali",
    "footer.text": "Match Partner — Sistem Pencarian Partner Lomba. Dibuat untuk para kompetitor.",

    // match detail / profile view
    "match.detail": "Lihat Detail",
    "match.message": "Kirim Pesan",
    "detail.about": "Tentang",
    "detail.lookingfor": "Mencari Partner",
    "detail.skills": "Keahlian",
    "detail.certs": "Sertifikat",
    "detail.event": "Lomba",
    "detail.contact": "Kontak",
    "detail.notfound": "Data tidak ditemukan.",

    // chat
    "chat.title": "PESAN",
    "chat.sub": "Percakapan dengan peserta lain",
    "chat.empty": "Belum ada percakapan. Mulai dari halaman Cari Partner.",
    "chat.placeholder": "Tulis pesan...",
    "chat.send": "Kirim",
    "chat.select": "Pilih percakapan untuk mulai mengobrol.",
    "chat.with": "Dengan",
    "nav.messages": "Pesan",
  },

  en: {
    "nav.home": "Home",
    "nav.match": "Find Partner",
    "nav.events": "Events",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.logout": "Logout",

    "home.tag": "PARTNER MATCHING SYSTEM 001",
    "home.title1": "FIND YOUR",
    "home.title2": "COMPETITION",
    "home.title3": "PARTNER",
    "home.subtitle": "A platform to find competition teammates. Post your needs, discover talent, and win contests together.",
    "home.cta.find": "Find Partner",
    "home.cta.events": "View Events",
    "home.feat.title": "CORE FEATURES",
    "home.feat.sub": "Everything you need to build a winning team",
    "home.f1.title": "Match Partner",
    "home.f1.desc": "Post your partner needs or browse participants looking for teammates.",
    "home.f2.title": "Event Info",
    "home.f2.desc": "Track upcoming competitions with dates, categories, and deadlines.",
    "home.f3.title": "Profile & Certificates",
    "home.f3.desc": "Build a professional profile with skills and certificates like a portfolio.",
    "home.upcoming": "UPCOMING EVENTS",
    "home.viewall": "View All",

    "match.title": "FIND PARTNER",
    "match.sub": "Browse participants looking for competition teammates",
    "match.post": "+ Post a Request",
    "match.search": "Search by name, skill, or event...",
    "match.filter.all": "All Categories",
    "match.looking": "Looking for",
    "match.contact": "Contact",
    "match.skills": "Skills",
    "match.empty": "No results found.",
    "match.modal.title": "Post Partner Request",
    "match.modal.name": "Name / Team",
    "match.modal.event": "Event",
    "match.modal.cat": "Category",
    "match.modal.looking": "Partner Wanted",
    "match.modal.skills": "Skills (comma separated)",
    "match.modal.contact": "Contact (email / WhatsApp / Discord)",
    "match.modal.submit": "Post",

    "events.title": "UPCOMING EVENTS",
    "events.sub": "List of upcoming competitions",
    "events.filter.all": "All Categories",
    "events.deadline": "Registration Deadline",
    "events.date": "Event Date",
    "events.detail": "Details",
    "events.register": "Register",
    "events.open": "OPEN",
    "events.closed": "CLOSED",
    "events.empty": "No events yet.",

    "profile.title": "PROFILE",
    "profile.edit": "Edit Profile",
    "profile.save": "Save",
    "profile.cancel": "Cancel",
    "profile.about": "About",
    "profile.skills": "Skills",
    "profile.certs": "Certificates & Licenses",
    "profile.addcert": "+ Add Certificate",
    "profile.fullname": "Full Name",
    "profile.headline": "Headline",
    "profile.bio": "Bio",
    "profile.skills.input": "Skills (comma separated)",
    "profile.cert.name": "Certificate Name",
    "profile.cert.org": "Issuing Organization",
    "profile.cert.date": "Issue Date",
    "profile.cert.id": "Credential ID (optional)",
    "profile.cert.add": "Add",
    "profile.cert.issued": "Issued",
    "profile.cert.credid": "Credential ID",
    "profile.cert.empty": "No certificates yet. Add one to strengthen your profile.",

    "settings.title": "SETTINGS",
    "settings.sub": "Manage your account and preferences",
    "settings.lang": "Language",
    "settings.lang.desc": "Choose the display language",
    "settings.account": "Account",
    "settings.email": "Change Email",
    "settings.email.new": "New Email",
    "settings.email.current": "Current Email",
    "settings.password": "Change Password",
    "settings.password.current": "Current Password",
    "settings.password.new": "New Password",
    "settings.password.confirm": "Confirm New Password",
    "settings.save": "Save Changes",
    "settings.danger": "Danger Zone",
    "settings.logout": "Log Out",

    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.confirm": "Confirm Password",
    "auth.login.btn": "Sign In",
    "auth.register.btn": "Create Account",
    "auth.tagline": "Competition Partner Matching System",

    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.close": "Close",
    "common.saved": "Changes saved.",
    "common.deleted": "Deleted successfully.",
    "common.required": "Please fill in all fields.",
    "common.back": "Back",
    "footer.text": "Match Partner — Competition Partner Matching System. Built for competitors.",

    "match.detail": "View Details",
    "match.message": "Send Message",
    "detail.about": "About",
    "detail.lookingfor": "Looking For Partner",
    "detail.skills": "Skills",
    "detail.certs": "Certificates",
    "detail.event": "Event",
    "detail.contact": "Contact",
    "detail.notfound": "Data not found.",

    "chat.title": "MESSAGES",
    "chat.sub": "Conversations with other participants",
    "chat.empty": "No conversations yet. Start from the Find Partner page.",
    "chat.placeholder": "Type a message...",
    "chat.send": "Send",
    "chat.select": "Select a conversation to start chatting.",
    "chat.with": "With",
    "nav.messages": "Messages",
  }
};

function getLang() {
  return localStorage.getItem("mp_lang") || "id";
}
function setLang(lang) {
  localStorage.setItem("mp_lang", lang);
  applyI18n();
}
function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N.id[key]) || key;
}
function applyI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
  });
}

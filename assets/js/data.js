/* =========================================================
   MOCK DATA + persistence helpers
   Seeds localStorage on first load. Later, api.js can be
   switched to call PHP endpoints instead of localStorage.
   ========================================================= */

const SEED_EVENTS = [
  {
    id: 1,
    title: "Gemastik XVIII",
    category: "IT / Programming",
    organizer: "Kemdikbud",
    date: "2026-11-20",
    deadline: "2026-10-25",
    location: "Online + Final Offline",
    color: "#f5d300",
    desc: "Pagelaran Mahasiswa Nasional bidang TIK. Banyak divisi: pemrograman, data mining, keamanan siber, UX, dan lainnya.",
  },
  {
    id: 2,
    title: "National Business Plan Competition",
    category: "Business",
    organizer: "Universitas Indonesia",
    date: "2026-12-05",
    deadline: "2026-11-10",
    location: "Jakarta",
    color: "#4db8ff",
    desc: "Kompetisi rencana bisnis tingkat nasional untuk mahasiswa. Tim 2-3 orang.",
  },
  {
    id: 3,
    title: "Hackathon Merdeka 4.0",
    category: "IT / Programming",
    organizer: "Komunitas Developer ID",
    date: "2026-10-18",
    deadline: "2026-10-10",
    location: "Online",
    color: "#d4ff3f",
    desc: "48 jam membangun solusi digital untuk masalah nyata. Tim maksimal 4 orang.",
  },
  {
    id: 4,
    title: "Lomba Debat Bahasa Inggris Nasional",
    category: "Debate",
    organizer: "Kemenpora",
    date: "2026-11-30",
    deadline: "2026-11-01",
    location: "Bandung",
    color: "#ff8c4d",
    desc: "Kompetisi debat format Asian Parliamentary. Tim beranggotakan 3 orang.",
  },
  {
    id: 5,
    title: "UI/UX Design Challenge",
    category: "Design",
    organizer: "Dribbble ID Community",
    date: "2026-12-15",
    deadline: "2026-11-20",
    location: "Online",
    color: "#c77dff",
    desc: "Tantangan mendesain produk digital dalam waktu terbatas. Boleh solo atau duo.",
  },
  {
    id: 6,
    title: "Olimpiade Matematika Mahasiswa",
    category: "Science",
    organizer: "IMO Society",
    date: "2027-01-10",
    deadline: "2026-12-15",
    location: "Yogyakarta",
    color: "#4dff91",
    desc: "Olimpiade matematika tingkat perguruan tinggi se-Indonesia.",
  },
];

const SEED_MATCHES = [
  {
    id: 1,
    name: "Rafi Pratama",
    event: "Gemastik XVIII",
    category: "IT / Programming",
    looking: "Backend developer & UI designer",
    skills: ["React", "Node.js", "Figma", "Public speaking"],
    contact: "rafi.p@email.com",
    headline: "Fullstack Developer | Mahasiswa Ilmu Komputer",
    bio: "Sudah 3x ikut Gemastik, pernah masuk 10 besar nasional. Mencari partner yang serius dan konsisten.",
    certificates: [
      { id: 11, name: "Finalis Gemastik 2024 - Pemrograman", org: "Kemdikbud", date: "2024-11-01", credId: "GMS-24-0391" },
    ],
  },
  {
    id: 2,
    name: "Tim Nebula",
    event: "National Business Plan Competition",
    category: "Business",
    looking: "Anggota dengan background finance",
    skills: ["Financial modeling", "Pitch deck", "Market research"],
    contact: "wa: 0812-3456-7890",
    headline: "Tim bisnis lintas jurusan",
    bio: "Tim beranggotakan 2 orang (marketing & operasional), butuh 1 orang finance untuk melengkapi.",
    certificates: [],
  },
  {
    id: 3,
    name: "Sarah Lint",
    event: "Hackathon Merdeka 4.0",
    category: "IT / Programming",
    looking: "Full-stack dev untuk tim beranggotakan 2 orang",
    skills: ["Python", "Flask", "ML", "PostgreSQL"],
    contact: "discord: sarahl#2048",
    headline: "ML Engineer | Data Enthusiast",
    bio: "Fokus di machine learning & backend. Butuh partner yang kuat di frontend untuk hackathon.",
    certificates: [
      { id: 31, name: "TensorFlow Developer Certificate", org: "Google", date: "2025-03-01", credId: "TF-DEV-7781" },
    ],
  },
  {
    id: 4,
    name: "Dimas A.",
    event: "UI/UX Design Challenge",
    category: "Design",
    looking: "Partner riset & copywriting",
    skills: ["UX research", "Prototyping", "Design system"],
    contact: "dimas.ux@email.com",
    headline: "Product Designer",
    bio: "Senang riset pengguna dan membangun design system. Mencari partner yang kuat di konten/copy.",
    certificates: [],
  },
];

/* ---------- USERS (multi-account with roles) ----------
   role: "participant" | "organizer" | "admin"
   status: "active" | "pending"  (organizer needs admin approval)
*/
const SEED_USERS = [
  {
    id: 1,
    fullname: "Pengguna Demo",
    email: "demo@matchpartner.id",
    password: "demo123",
    role: "participant",
    status: "active",
    headline: "Mahasiswa Informatika | Kompetitor Hackathon",
    bio: "Senang membangun produk dan ikut lomba. Mencari partner yang solid untuk kompetisi IT dan desain.",
    skills: ["JavaScript", "React", "UI Design", "Problem Solving"],
    certificates: [
      { id: 1, name: "Juara 2 Hackathon Nasional 2025", org: "Komunitas Developer ID", date: "2025-08-01", credId: "HCK-2025-0472" },
      { id: 2, name: "Google UX Design Certificate", org: "Coursera", date: "2024-11-01", credId: "CRS-UX-99812" },
    ],
  },
  {
    id: 2,
    fullname: "Admin Match Partner",
    email: "admin@matchpartner.id",
    password: "admin123",
    role: "admin",
    status: "active",
    headline: "System Administrator",
    bio: "Mengelola platform Match Partner.",
    skills: [],
    certificates: [],
  },
  {
    id: 3,
    fullname: "Panitia Gemastik",
    email: "organizer@matchpartner.id",
    password: "org123",
    role: "organizer",
    status: "active",
    headline: "Penyelenggara Lomba",
    bio: "Tim penyelenggara kompetisi tingkat nasional.",
    skills: [],
    certificates: [],
  },
  {
    id: 4,
    fullname: "Calon Penyelenggara",
    email: "pending@matchpartner.id",
    password: "org123",
    role: "organizer",
    status: "pending",
    headline: "Penyelenggara (menunggu verifikasi)",
    bio: "",
    skills: [],
    certificates: [],
  },
];

/* conversations: keyed storage. Each message: {from:"me"|"them", text, ts} */
const SEED_MESSAGES = {};

/* give the first 3 events to the organizer (id 3) so the demo has data */
SEED_EVENTS.forEach((e, i) => { e.ownerId = i < 3 ? 3 : 3; });

function seedIfNeeded() {
  if (!localStorage.getItem("mp_events")) localStorage.setItem("mp_events", JSON.stringify(SEED_EVENTS));
  if (!localStorage.getItem("mp_matches")) localStorage.setItem("mp_matches", JSON.stringify(SEED_MATCHES));
  if (!localStorage.getItem("mp_users")) localStorage.setItem("mp_users", JSON.stringify(SEED_USERS));
  if (!localStorage.getItem("mp_messages")) localStorage.setItem("mp_messages", JSON.stringify(SEED_MESSAGES));
}

/* bump version when seed shape changes, to re-seed cleanly */
const SEED_VERSION = "3";
if (localStorage.getItem("mp_seed_version") !== SEED_VERSION) {
  localStorage.removeItem("mp_events");
  localStorage.removeItem("mp_matches");
  localStorage.removeItem("mp_users");
  localStorage.removeItem("mp_user");      // old single-user key
  localStorage.removeItem("mp_session");   // force re-login with new accounts
  localStorage.setItem("mp_seed_version", SEED_VERSION);
}
seedIfNeeded();

/* ---------- Event logo generator (inline SVG, no external files) ---------- */
function eventLogo(ev, size = 64) {
  const color = ev.color || "#f5d300";
  const initials = (ev.title || "?").split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join("").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${color}" stop-opacity="0.9"/>
          <stop offset="1" stop-color="${color}" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <polygon points="0,0 54,0 64,10 64,64 10,64 0,54" fill="#16181e" stroke="${color}" stroke-width="1.5"/>
      <polygon points="0,0 20,0 0,20" fill="${color}"/>
      <text x="32" y="40" font-family="'Share Tech Mono', monospace" font-size="22" font-weight="700"
            fill="${color}" text-anchor="middle">${initials}</text>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

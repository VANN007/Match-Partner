# Match Partner 🎯

Website untuk **mencari partner lomba** + info **upcoming lomba** + **profil dengan sertifikat** (ala LinkedIn) + **pengaturan akun** (ubah email, password, bahasa).

Tema visual terinspirasi gaya **Arknights** — sci-fi industrial, dark mode, aksen kuning amber, sudut tegas.

---

## ✨ Fitur

| Halaman | Fitur |
|---|---|
| **Beranda** (`index.html`) | Hero, fitur utama, lomba terdekat (dengan logo) |
| **Cari Partner** (`match.html`) | Jelajah & cari partner, filter kategori, posting kebutuhan |
| **Detail Partner** (`partner.html`) | Profil lengkap peserta: headline, bio, skill, sertifikat, kontak |
| **Pesan** (`messages.html`) | Chat antar peserta (daftar percakapan + thread + balasan otomatis) |
| **Lomba** (`events.html`) | Daftar lomba + **logo**, filter, detail, status buka/tutup pendaftaran |
| **Profil** (`profile.html`) | Edit profil + skill + **sertifikat (tambah/hapus)** ala LinkedIn |
| **Pengaturan** (`settings.html`) | **Ganti bahasa (ID/EN)**, **light/dark mode**, ubah email, ubah password, logout |
| **Dashboard Penyelenggara** (`organizer.html`) | Buat / edit / hapus lomba milik sendiri |
| **Panel Admin** (`admin.html`) | Statistik, kelola user & role, verifikasi penyelenggara, kelola semua lomba |
| **Masuk/Daftar** (`login.html`) | Login & register (pilih peran: peserta / penyelenggara) |

> 🖼️ **Logo lomba** dibuat otomatis sebagai SVG (berdasarkan inisial + warna tiap lomba), jadi tidak butuh file gambar eksternal — tetap jalan offline & di XAMPP.
> 🌓 **Light/Dark mode** bisa diganti di Pengaturan, tersimpan otomatis.

## 👥 Peran (Role) & Akun Demo

Ada 3 peran: **Peserta**, **Penyelenggara** (bisa kelola lomba, perlu disetujui admin), dan **Admin**.

| Peran | Email | Password |
|---|---|---|
| Peserta | `demo@matchpartner.id` | `demo123` |
| Admin | `admin@matchpartner.id` | `admin123` |
| Penyelenggara (aktif) | `organizer@matchpartner.id` | `org123` |
| Penyelenggara (menunggu verifikasi) | `pending@matchpartner.id` | `org123` |

- **Peserta** daftar bisa langsung aktif.
- **Penyelenggara** yang baru daftar berstatus *pending* dan harus **disetujui admin** dulu sebelum bisa membuat lomba.
- **Admin** bisa mengubah role user, menyetujui/menolak penyelenggara, serta menghapus user & lomba.

🌐 **Bilingual**: Indonesia & English, bisa diganti di Pengaturan (tersimpan otomatis).

---

## 🚀 Cara Menjalankan

### Mode 1 — Cepat (tanpa setup, data mock di browser)
Website langsung jalan pakai data contoh yang disimpan di `localStorage` browser.

1. Buka folder `match-partner/`
2. Double-click `index.html`, **atau** taruh di `htdocs` XAMPP lalu buka `http://localhost/match-partner/`

> Akun demo: **demo@matchpartner.id** / **demo123**

### Mode 2 — Full (XAMPP + PHP + MySQL)
Untuk menyimpan data beneran di database.

1. **Copy** folder `match-partner/` ke `C:\xampp\htdocs\`
2. Nyalakan **Apache** + **MySQL** di XAMPP Control Panel
3. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`) → tab **Import** → pilih file `database/schema.sql` → **Go**
   (atau via terminal: `mysql -u root < database/schema.sql`)
4. Cek kredensial DB di `api/db.php` (default XAMPP: user `root`, password kosong — sudah sesuai)
5. **Jalankan setup sekali**: buka `http://localhost/match-partner/api/setup.php` di browser.
   Ini mengubah password akun demo menjadi hash yang aman. Harus muncul pesan `OK`.
6. Buka `assets/js/api.js` dan ubah baris:
   ```js
   const USE_BACKEND = false;   // ubah jadi true
   ```
   menjadi:
   ```js
   const USE_BACKEND = true;
   ```
7. Buka `http://localhost/match-partner/` dan login dengan akun demo di atas.

Sekarang register/login (dengan role), profil, sertifikat, posting partner, lomba (CRUD oleh penyelenggara), dan panel admin tersimpan di MySQL. 🎉

---

## 📁 Struktur

```
match-partner/
├── index.html          # beranda
├── match.html          # cari partner
├── partner.html        # detail partner
├── messages.html       # pesan antar peserta
├── events.html         # upcoming lomba
├── profile.html        # profil + sertifikat
├── settings.html       # pengaturan (bahasa, tema, email, password)
├── organizer.html      # dashboard penyelenggara (CRUD lomba)
├── admin.html          # panel admin (user, role, approve, lomba)
├── login.html          # masuk / daftar (pilih role)
├── assets/
│   ├── css/theme.css   # tema Arknights-style + light/dark + responsive
│   └── js/
│       ├── i18n.js     # terjemahan ID/EN
│       ├── data.js     # data mock + seeding (users, events, matches)
│       ├── api.js      # layer data (mock <-> PHP). Flip USE_BACKEND di sini
│       └── app.js      # navbar, tema, role guard, toast, modal, helper
├── api/                # backend PHP (dipakai saat USE_BACKEND=true)
│   ├── db.php          # koneksi MySQL (edit kredensial di sini)
│   ├── setup.php       # jalankan sekali: hash password akun demo
│   ├── auth.php        # login / register / logout (role-aware)
│   ├── events.php      # lomba: list + CRUD + ownership
│   ├── matches.php     # list + posting partner
│   ├── messages.php    # pesan antar peserta
│   ├── profile.php     # profil + sertifikat + ganti email/password
│   └── admin.php       # statistik + kelola user/role + approve
└── database/
    └── schema.sql      # skema MySQL + data awal (users, roles, events)
```

## 🎨 Catatan
- Styling pakai CSS kustom (tanpa build step). Font dari Google Fonts (Rajdhani + Share Tech Mono).
- Semua akses data lewat satu file `api.js`, jadi pindah dari mock ke MySQL cukup ganti 1 flag.
- Password di backend di-hash pakai `password_hash()` PHP (aman).

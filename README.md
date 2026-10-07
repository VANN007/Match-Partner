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
| **Pengaturan** (`settings.html`) | **Ganti bahasa (ID/EN)**, ubah email, ubah password, logout |
| **Masuk/Daftar** (`login.html`) | Login & register |

> 🖼️ **Logo lomba** dibuat otomatis sebagai SVG (berdasarkan inisial + warna tiap lomba), jadi tidak butuh file gambar eksternal — tetap jalan offline & di XAMPP.

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
5. Buka `assets/js/api.js` dan ubah baris:
   ```js
   const USE_BACKEND = false;   // ubah jadi true
   ```
   menjadi:
   ```js
   const USE_BACKEND = true;
   ```
6. Buka `http://localhost/match-partner/`

Sekarang register/login, profil, sertifikat, dan posting partner tersimpan di MySQL. 🎉

---

## 📁 Struktur

```
match-partner/
├── index.html          # beranda
├── match.html          # cari partner
├── events.html         # upcoming lomba
├── profile.html        # profil + sertifikat
├── settings.html       # pengaturan (bahasa, email, password)
├── login.html          # masuk / daftar
├── assets/
│   ├── css/theme.css   # tema Arknights-style
│   └── js/
│       ├── i18n.js     # terjemahan ID/EN
│       ├── data.js     # data mock + seeding
│       ├── api.js      # layer data (mock <-> PHP). Flip USE_BACKEND di sini
│       └── app.js      # navbar, toast, modal, helper
├── api/                # backend PHP (dipakai saat USE_BACKEND=true)
│   ├── db.php          # koneksi MySQL (edit kredensial di sini)
│   ├── auth.php        # login / register / logout
│   ├── events.php      # list lomba
│   ├── matches.php     # list + posting partner
│   └── profile.php     # profil + sertifikat + ganti email/password
└── database/
    └── schema.sql      # skema MySQL + data awal
```

## 🎨 Catatan
- Styling pakai CSS kustom (tanpa build step). Font dari Google Fonts (Rajdhani + Share Tech Mono).
- Semua akses data lewat satu file `api.js`, jadi pindah dari mock ke MySQL cukup ganti 1 flag.
- Password di backend di-hash pakai `password_hash()` PHP (aman).

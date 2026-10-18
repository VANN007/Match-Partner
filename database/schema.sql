-- =========================================================
-- MATCH PARTNER — MySQL schema (for XAMPP / phpMyAdmin)
-- Import this via phpMyAdmin or: mysql -u root < schema.sql
-- =========================================================

CREATE DATABASE IF NOT EXISTS match_partner
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE match_partner;

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  fullname   VARCHAR(120) NOT NULL,
  email      VARCHAR(160) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,          -- stored as password_hash()
  role       ENUM('participant','organizer','admin') DEFAULT 'participant',
  status     ENUM('active','pending') DEFAULT 'active',
  headline   VARCHAR(200) DEFAULT '',
  bio        TEXT,
  skills     TEXT,                            -- comma-separated or JSON
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- CERTIFICATES ----------
CREATE TABLE IF NOT EXISTS certificates (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       VARCHAR(200) NOT NULL,
  org        VARCHAR(200) NOT NULL,
  issue_date DATE,
  cred_id    VARCHAR(120) DEFAULT '',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- EVENTS (lomba) ----------
CREATE TABLE IF NOT EXISTS events (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  owner_id   INT,                             -- organizer who created it
  title      VARCHAR(200) NOT NULL,
  category   VARCHAR(80) NOT NULL,
  organizer  VARCHAR(160),
  event_date DATE,
  deadline   DATE,
  location   VARCHAR(160),
  color      VARCHAR(16) DEFAULT '#f5d300',
  description TEXT,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- MATCHES (partner requests) ----------
CREATE TABLE IF NOT EXISTS matches (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,                             -- optional link to poster
  name       VARCHAR(120) NOT NULL,
  event      VARCHAR(200) NOT NULL,
  category   VARCHAR(80) NOT NULL,
  looking    VARCHAR(255) NOT NULL,
  skills     TEXT,
  contact    VARCHAR(160) NOT NULL,
  headline   VARCHAR(200) DEFAULT '',
  bio        TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- MESSAGES ----------
CREATE TABLE IF NOT EXISTS messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  sender_id  INT NOT NULL,                    -- logged-in user
  peer_id    INT NOT NULL,                    -- match/user they chat with
  direction  ENUM('me','them') DEFAULT 'me',
  body       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- SEED DATA
-- =========================================================

-- Seed accounts. Passwords are set as PLAINTEXT markers prefixed with "plain:".
-- Run  api/setup.php  ONCE after import to convert them into secure bcrypt
-- hashes (password_hash). See README. Login then works with:
--   demo@matchpartner.id / demo123        (participant)
--   admin@matchpartner.id / admin123       (admin)
--   organizer@matchpartner.id / org123     (organizer, active)
--   pending@matchpartner.id / org123       (organizer, pending approval)
INSERT INTO users (id, fullname, email, password, role, status, headline, bio, skills) VALUES
(1, 'Pengguna Demo', 'demo@matchpartner.id', 'plain:demo123', 'participant', 'active',
 'Mahasiswa Informatika | Kompetitor Hackathon',
 'Senang membangun produk dan ikut lomba. Mencari partner yang solid untuk kompetisi IT dan desain.',
 'JavaScript,React,UI Design,Problem Solving'),
(2, 'Admin Match Partner', 'admin@matchpartner.id', 'plain:admin123', 'admin', 'active',
 'System Administrator', 'Mengelola platform Match Partner.', ''),
(3, 'Panitia Gemastik', 'organizer@matchpartner.id', 'plain:org123', 'organizer', 'active',
 'Penyelenggara Lomba', 'Tim penyelenggara kompetisi tingkat nasional.', ''),
(4, 'Calon Penyelenggara', 'pending@matchpartner.id', 'plain:org123', 'organizer', 'pending',
 'Penyelenggara (menunggu verifikasi)', '', '');

INSERT INTO certificates (user_id, name, org, issue_date, cred_id) VALUES
(1, 'Juara 2 Hackathon Nasional 2025', 'Komunitas Developer ID', '2025-08-01', 'HCK-2025-0472'),
(1, 'Google UX Design Certificate', 'Coursera', '2024-11-01', 'CRS-UX-99812');

-- all demo events owned by the organizer (user id 3)
INSERT INTO events (owner_id, title, category, organizer, event_date, deadline, location, color, description) VALUES
(3, 'Gemastik XVIII', 'IT / Programming', 'Kemdikbud', '2026-11-20', '2026-10-25', 'Online + Final Offline', '#f5d300', 'Pagelaran Mahasiswa Nasional bidang TIK.'),
(3, 'National Business Plan Competition', 'Business', 'Universitas Indonesia', '2026-12-05', '2026-11-10', 'Jakarta', '#4db8ff', 'Kompetisi rencana bisnis tingkat nasional.'),
(3, 'Hackathon Merdeka 4.0', 'IT / Programming', 'Komunitas Developer ID', '2026-10-18', '2026-10-10', 'Online', '#d4ff3f', '48 jam membangun solusi digital.'),
(3, 'Lomba Debat Bahasa Inggris Nasional', 'Debate', 'Kemenpora', '2026-11-30', '2026-11-01', 'Bandung', '#ff8c4d', 'Kompetisi debat format Asian Parliamentary.'),
(3, 'UI/UX Design Challenge', 'Design', 'Dribbble ID Community', '2026-12-15', '2026-11-20', 'Online', '#c77dff', 'Tantangan mendesain produk digital.'),
(3, 'Olimpiade Matematika Mahasiswa', 'Science', 'IMO Society', '2027-01-10', '2026-12-15', 'Yogyakarta', '#4dff91', 'Olimpiade matematika tingkat perguruan tinggi.');

INSERT INTO matches (user_id, name, event, category, looking, skills, contact, headline, bio) VALUES
(NULL, 'Rafi Pratama', 'Gemastik XVIII', 'IT / Programming', 'Backend developer & UI designer', 'React,Node.js,Figma,Public speaking', 'rafi.p@email.com', 'Fullstack Developer | Mahasiswa Ilmu Komputer', 'Sudah 3x ikut Gemastik, pernah masuk 10 besar nasional.'),
(NULL, 'Tim Nebula', 'National Business Plan Competition', 'Business', 'Anggota dengan background finance', 'Financial modeling,Pitch deck,Market research', 'wa: 0812-3456-7890', 'Tim bisnis lintas jurusan', 'Tim 2 orang (marketing & operasional), butuh 1 orang finance.'),
(NULL, 'Sarah Lint', 'Hackathon Merdeka 4.0', 'IT / Programming', 'Full-stack dev untuk tim 2 orang', 'Python,Flask,ML,PostgreSQL', 'discord: sarahl#2048', 'ML Engineer | Data Enthusiast', 'Fokus di machine learning & backend.');

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
  title      VARCHAR(200) NOT NULL,
  category   VARCHAR(80) NOT NULL,
  organizer  VARCHAR(160),
  event_date DATE,
  deadline   DATE,
  location   VARCHAR(160),
  description TEXT
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

-- demo user (password = "demo123", hashed)
INSERT INTO users (fullname, email, password, headline, bio, skills) VALUES
('Pengguna Demo', 'demo@matchpartner.id',
 '$2y$10$e0NR5m1Yd3qvQ0e8m3q0GOe0y0qQ8Qb8m8pQdQ8Qb8m8pQdQ8Qb8', -- replace via register for a real hash
 'Mahasiswa Informatika | Kompetitor Hackathon',
 'Senang membangun produk dan ikut lomba. Mencari partner yang solid untuk kompetisi IT dan desain.',
 'JavaScript,React,UI Design,Problem Solving');

INSERT INTO certificates (user_id, name, org, issue_date, cred_id) VALUES
(1, 'Juara 2 Hackathon Nasional 2025', 'Komunitas Developer ID', '2025-08-01', 'HCK-2025-0472'),
(1, 'Google UX Design Certificate', 'Coursera', '2024-11-01', 'CRS-UX-99812');

INSERT INTO events (title, category, organizer, event_date, deadline, location, description) VALUES
('Gemastik XVIII', 'IT / Programming', 'Kemdikbud', '2026-11-20', '2026-10-25', 'Online + Final Offline', 'Pagelaran Mahasiswa Nasional bidang TIK.'),
('National Business Plan Competition', 'Business', 'Universitas Indonesia', '2026-12-05', '2026-11-10', 'Jakarta', 'Kompetisi rencana bisnis tingkat nasional.'),
('Hackathon Merdeka 4.0', 'IT / Programming', 'Komunitas Developer ID', '2026-10-18', '2026-10-10', 'Online', '48 jam membangun solusi digital.'),
('Lomba Debat Bahasa Inggris Nasional', 'Debate', 'Kemenpora', '2026-11-30', '2026-11-01', 'Bandung', 'Kompetisi debat format Asian Parliamentary.'),
('UI/UX Design Challenge', 'Design', 'Dribbble ID Community', '2026-12-15', '2026-11-20', 'Online', 'Tantangan mendesain produk digital.'),
('Olimpiade Matematika Mahasiswa', 'Science', 'IMO Society', '2027-01-10', '2026-12-15', 'Yogyakarta', 'Olimpiade matematika tingkat perguruan tinggi.');

INSERT INTO matches (user_id, name, event, category, looking, skills, contact, headline, bio) VALUES
(NULL, 'Rafi Pratama', 'Gemastik XVIII', 'IT / Programming', 'Backend developer & UI designer', 'React,Node.js,Figma,Public speaking', 'rafi.p@email.com', 'Fullstack Developer | Mahasiswa Ilmu Komputer', 'Sudah 3x ikut Gemastik, pernah masuk 10 besar nasional.'),
(NULL, 'Tim Nebula', 'National Business Plan Competition', 'Business', 'Anggota dengan background finance', 'Financial modeling,Pitch deck,Market research', 'wa: 0812-3456-7890', 'Tim bisnis lintas jurusan', 'Tim 2 orang (marketing & operasional), butuh 1 orang finance.'),
(NULL, 'Sarah Lint', 'Hackathon Merdeka 4.0', 'IT / Programming', 'Full-stack dev untuk tim 2 orang', 'Python,Flask,ML,PostgreSQL', 'discord: sarahl#2048', 'ML Engineer | Data Enthusiast', 'Fokus di machine learning & backend.');

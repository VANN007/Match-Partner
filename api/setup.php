<?php
/* =========================================================
   SETUP — run ONCE after importing schema.sql.
   Converts seed "plain:xxx" passwords into secure bcrypt
   hashes. Safe to run multiple times (idempotent).
   Open in browser:  http://localhost/match-partner/api/setup.php
   ========================================================= */
require __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    $rows = db()->query("SELECT id, password FROM users WHERE password LIKE 'plain:%'")->fetchAll();
    $up = db()->prepare('UPDATE users SET password = ? WHERE id = ?');
    $count = 0;
    foreach ($rows as $r) {
        $plain = substr($r['password'], 6);
        $up->execute([password_hash($plain, PASSWORD_DEFAULT), $r['id']]);
        $count++;
    }
    echo "OK — $count seed password(s) hashed.\n";
    echo "You can now log in with the demo accounts (see README).\n";
    echo "It is safe to delete this file after setup.\n";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Database error: " . $e->getMessage() . "\n";
    echo "Make sure you imported database/schema.sql and the DB credentials in api/db.php are correct.\n";
}

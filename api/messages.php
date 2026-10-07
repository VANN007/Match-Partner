<?php
/* =========================================================
   MESSAGES endpoint
   GET  ?peer=N   -> thread with that peer
   GET  (no peer) -> list of conversations (distinct peers)
   POST { peer, text } -> send a message (stores + auto-reply)
   ========================================================= */
require __DIR__ . '/db.php';
boot();
require_login();
$uid = current_user_id();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $in = body();
    $peer = (int)($in['peer'] ?? 0);
    $text = trim($in['text'] ?? '');
    if (!$peer || $text === '') json(['ok' => false, 'error' => 'Missing fields'], 400);

    $ins = db()->prepare('INSERT INTO messages (sender_id, peer_id, direction, body) VALUES (?, ?, ?, ?)');
    $ins->execute([$uid, $peer, 'me', $text]);

    // simple canned auto-reply so threads feel alive
    $replies = ['Halo! Terima kasih sudah menghubungi.', 'Menarik, aku tertarik gabung!', 'Sip, lanjut via kontak ya.'];
    $ins->execute([$uid, $peer, 'them', $replies[array_rand($replies)]]);

    json(['ok' => true]);
}

if (isset($_GET['peer'])) {
    $stmt = db()->prepare('SELECT direction AS `from`, body AS text, UNIX_TIMESTAMP(created_at)*1000 AS ts FROM messages WHERE sender_id = ? AND peer_id = ? ORDER BY id ASC');
    $stmt->execute([$uid, (int)$_GET['peer']]);
    json($stmt->fetchAll());
}

// list distinct peers for this user
$stmt = db()->prepare('SELECT peer_id FROM messages WHERE sender_id = ? GROUP BY peer_id ORDER BY MAX(id) DESC');
$stmt->execute([$uid]);
json($stmt->fetchAll(PDO::FETCH_COLUMN));

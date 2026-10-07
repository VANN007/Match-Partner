<?php
/* GET list of partner requests (or ?id=N for one), POST a new one */
require __DIR__ . '/db.php';
boot();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $in = body();
    $skills = is_array($in['skills'] ?? null) ? implode(',', $in['skills']) : ($in['skills'] ?? '');
    $stmt = db()->prepare('INSERT INTO matches (user_id, name, event, category, looking, skills, contact, headline, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        current_user_id(),
        $in['name'] ?? '', $in['event'] ?? '', $in['category'] ?? '',
        $in['looking'] ?? '', $skills, $in['contact'] ?? '',
        $in['headline'] ?? '', $in['bio'] ?? ''
    ]);
    json(['id' => db()->lastInsertId()]);
}

/* single match */
if (isset($_GET['id'])) {
    $stmt = db()->prepare('SELECT id, name, event, category, looking, skills, contact, headline, bio FROM matches WHERE id = ?');
    $stmt->execute([$_GET['id']]);
    $r = $stmt->fetch();
    if (!$r) json(null, 404);
    $r['skills'] = $r['skills'] ? array_map('trim', explode(',', $r['skills'])) : [];
    $r['certificates'] = [];
    json($r);
}

$rows = db()->query('SELECT id, name, event, category, looking, skills, contact, headline, bio FROM matches ORDER BY created_at DESC')->fetchAll();
foreach ($rows as &$r) {
    $r['skills'] = $r['skills'] ? array_map('trim', explode(',', $r['skills'])) : [];
}
json($rows);

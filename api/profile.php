<?php
/* GET current user profile (+certs), POST to update profile/certs/email/password */
require __DIR__ . '/db.php';
boot();
require_login();
$uid = current_user_id();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $in = body();

    // password change
    if (isset($in['_action']) && $in['_action'] === 'password') {
        $stmt = db()->prepare('SELECT password FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($in['current'] ?? '', $row['password'])) {
            json(['ok' => false, 'error' => 'Password saat ini salah.'], 400);
        }
        db()->prepare('UPDATE users SET password = ? WHERE id = ?')
            ->execute([password_hash($in['next'], PASSWORD_DEFAULT), $uid]);
        json(['ok' => true]);
    }

    // certificates replace (array)
    if (isset($in['certificates'])) {
        db()->prepare('DELETE FROM certificates WHERE user_id = ?')->execute([$uid]);
        $ins = db()->prepare('INSERT INTO certificates (user_id, name, org, issue_date, cred_id) VALUES (?, ?, ?, ?, ?)');
        foreach ($in['certificates'] as $c) {
            $ins->execute([$uid, $c['name'] ?? '', $c['org'] ?? '', $c['date'] ?? null, $c['credId'] ?? '']);
        }
    }

    // profile fields
    $fields = [];
    $vals = [];
    foreach (['fullname', 'email', 'headline', 'bio'] as $f) {
        if (isset($in[$f])) { $fields[] = "$f = ?"; $vals[] = $in[$f]; }
    }
    if (isset($in['skills'])) {
        $fields[] = 'skills = ?';
        $vals[] = is_array($in['skills']) ? implode(',', $in['skills']) : $in['skills'];
    }
    if ($fields) {
        $vals[] = $uid;
        db()->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
    }
}

// return profile
$stmt = db()->prepare('SELECT id, fullname, email, role, status, headline, bio, skills FROM users WHERE id = ?');
$stmt->execute([$uid]);
$user = $stmt->fetch();
$user['id'] = (int)$user['id'];
$user['skills'] = $user['skills'] ? array_map('trim', explode(',', $user['skills'])) : [];

$cs = db()->prepare('SELECT id, name, org, issue_date AS date, cred_id AS credId FROM certificates WHERE user_id = ?');
$cs->execute([$uid]);
$user['certificates'] = $cs->fetchAll();

json($user);

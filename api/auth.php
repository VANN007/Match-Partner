<?php
/* =========================================================
   AUTH endpoint — ?action=login|register|logout
   ========================================================= */
require __DIR__ . '/db.php';
boot();

$action = $_GET['action'] ?? '';

if ($action === 'logout') {
    session_destroy();
    json(['ok' => true]);
}

$in = body();

if ($action === 'register') {
    $fullname = trim($in['fullname'] ?? '');
    $email    = trim($in['email'] ?? '');
    $password = $in['password'] ?? '';
    $role     = $in['role'] ?? 'participant';
    if (!in_array($role, ['participant', 'organizer'], true)) $role = 'participant';
    $status   = $role === 'organizer' ? 'pending' : 'active';
    if (!$fullname || !$email || !$password) json(['ok' => false, 'error' => 'Missing fields'], 400);

    try {
        $stmt = db()->prepare('INSERT INTO users (fullname, email, password, role, status, skills) VALUES (?, ?, ?, ?, ?, "")');
        $stmt->execute([$fullname, $email, password_hash($password, PASSWORD_DEFAULT), $role, $status]);
        $_SESSION['uid'] = db()->lastInsertId();
        json(['ok' => true, 'user' => ['id' => $_SESSION['uid'], 'fullname' => $fullname, 'email' => $email, 'role' => $role, 'status' => $status]]);
    } catch (PDOException $e) {
        json(['ok' => false, 'error' => 'Email already registered'], 409);
    }
}

if ($action === 'login') {
    $email    = trim($in['email'] ?? '');
    $password = $in['password'] ?? '';
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $stored = $user['password'];
        $ok = false;
        // support "plain:xxx" seed markers -> upgrade to a real hash on first login
        if (strpos($stored, 'plain:') === 0) {
            if ($password === substr($stored, 6)) {
                $ok = true;
                $up = db()->prepare('UPDATE users SET password = ? WHERE id = ?');
                $up->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
            }
        } else {
            $ok = password_verify($password, $stored);
        }
        if ($ok) {
            $_SESSION['uid'] = $user['id'];
            unset($user['password']);
            json(['ok' => true, 'user' => $user]);
        }
    }
    json(['ok' => false, 'error' => 'Email atau password salah.'], 401);
}

json(['ok' => false, 'error' => 'Unknown action'], 400);

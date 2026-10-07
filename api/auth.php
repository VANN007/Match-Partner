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
    if (!$fullname || !$email || !$password) json(['ok' => false, 'error' => 'Missing fields'], 400);

    try {
        $stmt = db()->prepare('INSERT INTO users (fullname, email, password, skills) VALUES (?, ?, ?, "")');
        $stmt->execute([$fullname, $email, password_hash($password, PASSWORD_DEFAULT)]);
        $_SESSION['uid'] = db()->lastInsertId();
        json(['ok' => true, 'user' => ['id' => $_SESSION['uid'], 'fullname' => $fullname, 'email' => $email]]);
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
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['uid'] = $user['id'];
        unset($user['password']);
        json(['ok' => true, 'user' => $user]);
    }
    json(['ok' => false, 'error' => 'Email atau password salah.'], 401);
}

json(['ok' => false, 'error' => 'Unknown action'], 400);

<?php
/* =========================================================
   ADMIN endpoint (admin role only)
   GET  ?resource=stats          -> dashboard counters
   GET  ?resource=users          -> all users
   POST ?resource=users&id=N     -> { role?, status? } update
   POST ?resource=users&action=delete&id=N -> delete user
   ========================================================= */
require __DIR__ . '/db.php';
boot();
require_login();

$uid = current_user_id();
$meStmt = db()->prepare('SELECT role FROM users WHERE id = ?');
$meStmt->execute([$uid]);
$me = $meStmt->fetch();
if (!$me || $me['role'] !== 'admin') json(['ok' => false, 'error' => 'Admin only'], 403);

$resource = $_GET['resource'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($resource === 'stats') {
    $users   = (int) db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $orgs    = (int) db()->query("SELECT COUNT(*) FROM users WHERE role='organizer'")->fetchColumn();
    $pending = (int) db()->query("SELECT COUNT(*) FROM users WHERE role='organizer' AND status='pending'")->fetchColumn();
    $events  = (int) db()->query('SELECT COUNT(*) FROM events')->fetchColumn();
    $matches = (int) db()->query('SELECT COUNT(*) FROM matches')->fetchColumn();
    json(compact('users', 'orgs', 'pending', 'events', 'matches') + [
        'organizers' => $orgs,  // alias used by frontend
    ]);
}

if ($resource === 'users') {
    if ($method === 'POST') {
        // delete
        if (($_GET['action'] ?? '') === 'delete' && isset($_GET['id'])) {
            db()->prepare('DELETE FROM users WHERE id = ? AND id <> ?')->execute([$_GET['id'], $uid]);
            json(['ok' => true]);
        }
        // update role / status
        $in = body();
        $fields = [];
        $vals = [];
        if (isset($in['role']) && in_array($in['role'], ['participant', 'organizer', 'admin'], true)) {
            $fields[] = 'role = ?'; $vals[] = $in['role'];
        }
        if (isset($in['status']) && in_array($in['status'], ['active', 'pending'], true)) {
            $fields[] = 'status = ?'; $vals[] = $in['status'];
        }
        if ($fields && isset($_GET['id'])) {
            $vals[] = $_GET['id'];
            db()->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($vals);
        }
        json(['ok' => true]);
    }

    $rows = db()->query('SELECT id, fullname, email, role, status, headline FROM users ORDER BY id ASC')->fetchAll();
    foreach ($rows as &$r) { $r['id'] = (int)$r['id']; }
    json($rows);
}

json(['ok' => false, 'error' => 'Unknown resource'], 400);

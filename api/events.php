<?php
/* =========================================================
   EVENTS endpoint
   GET                 -> all events (public)
   GET  ?mine=1        -> events owned by current organizer
   POST                -> create (organizer/admin)
   POST ?id=N          -> update (owner or admin)
   POST ?action=delete&id=N -> delete (owner or admin)
   ========================================================= */
require __DIR__ . '/db.php';
boot();

function map_event($r) {
    return [
        'id'        => (int)$r['id'],
        'ownerId'   => $r['owner_id'] !== null ? (int)$r['owner_id'] : null,
        'title'     => $r['title'],
        'category'  => $r['category'],
        'organizer' => $r['organizer'],
        'date'      => $r['event_date'],
        'deadline'  => $r['deadline'],
        'location'  => $r['location'],
        'color'     => $r['color'],
        'desc'      => $r['description'],
    ];
}

function current_role() {
    $uid = current_user_id();
    if (!$uid) return null;
    $s = db()->prepare('SELECT role, status FROM users WHERE id = ?');
    $s->execute([$uid]);
    return $s->fetch();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    require_login();
    $me = current_role();
    $uid = current_user_id();
    $isAdmin = $me && $me['role'] === 'admin';
    $isOrganizer = $me && $me['role'] === 'organizer';

    // delete
    if (($_GET['action'] ?? '') === 'delete' && isset($_GET['id'])) {
        if ($isAdmin) {
            db()->prepare('DELETE FROM events WHERE id = ?')->execute([$_GET['id']]);
        } else {
            db()->prepare('DELETE FROM events WHERE id = ? AND owner_id = ?')->execute([$_GET['id'], $uid]);
        }
        json(['ok' => true]);
    }

    $in = body();

    // update
    if (isset($_GET['id'])) {
        $sql = 'UPDATE events SET title=?, category=?, organizer=?, event_date=?, deadline=?, location=?, color=?, description=? WHERE id=?';
        $params = [$in['title'] ?? '', $in['category'] ?? '', $in['organizer'] ?? '', $in['date'] ?? null,
                   $in['deadline'] ?? null, $in['location'] ?? '', $in['color'] ?? '#f5d300', $in['desc'] ?? '', $_GET['id']];
        if (!$isAdmin) { $sql .= ' AND owner_id = ?'; $params[] = $uid; }
        db()->prepare($sql)->execute($params);
        json(['ok' => true]);
    }

    // create (organizer must be active, or admin)
    if (!$isAdmin && !($isOrganizer && $me['status'] === 'active')) {
        json(['ok' => false, 'error' => 'Not allowed'], 403);
    }
    $stmt = db()->prepare('INSERT INTO events (owner_id, title, category, organizer, event_date, deadline, location, color, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$uid, $in['title'] ?? '', $in['category'] ?? '', $in['organizer'] ?? '',
                    $in['date'] ?? null, $in['deadline'] ?? null, $in['location'] ?? '',
                    $in['color'] ?? '#f5d300', $in['desc'] ?? '']);
    json(['id' => db()->lastInsertId()]);
}

/* GET */
if (isset($_GET['mine'])) {
    require_login();
    $stmt = db()->prepare('SELECT * FROM events WHERE owner_id = ? ORDER BY event_date ASC');
    $stmt->execute([current_user_id()]);
    json(array_map('map_event', $stmt->fetchAll()));
}

$rows = db()->query('SELECT * FROM events ORDER BY event_date ASC')->fetchAll();
json(array_map('map_event', $rows));

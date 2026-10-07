<?php
/* GET all events (lomba) */
require __DIR__ . '/db.php';
boot();

$rows = db()->query('SELECT id, title, category, organizer, event_date AS date, deadline, location, description AS `desc` FROM events ORDER BY event_date ASC')->fetchAll();
json($rows);

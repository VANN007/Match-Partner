<?php
/* =========================================================
   DB CONNECTION + shared helpers (XAMPP / MySQL)
   Edit the credentials below to match your XAMPP setup.
   Default XAMPP: host=localhost, user=root, pass="" (empty)
   ========================================================= */

define('DB_HOST', 'localhost');
define('DB_NAME', 'match_partner');
define('DB_USER', 'root');
define('DB_PASS', '');

function db() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

/* send JSON response */
function json($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

/* read JSON request body */
function body() {
    return json_decode(file_get_contents('php://input'), true) ?: [];
}

/* basic CORS + session for local dev */
function boot() {
    header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
    session_start();
}

function current_user_id() {
    return $_SESSION['uid'] ?? null;
}
function require_login() {
    if (!current_user_id()) json(['ok' => false, 'error' => 'Not authenticated'], 401);
}

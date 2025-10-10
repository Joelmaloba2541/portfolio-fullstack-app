<?php
require __DIR__ . '/../db.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'online_users') {
    // Get all users who have logged in within the last 15 minutes
    $query = "SELECT id, username, is_admin, last_active FROM users WHERE last_active > DATE_SUB(NOW(), INTERVAL 15 MINUTE)";
    $result = $conn->query($query);
    
    $online_users = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $online_users[] = [
                'id' => $row['id'],
                'username' => $row['username'],
                'is_admin' => (bool)$row['is_admin'],
                'last_active' => $row['last_active']
            ];
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'users' => $online_users
    ]);
}
?>
<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require "db.php";

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$route = trim($path, '/');
$id = $_GET['id'] ?? null;

switch ($route) {
    case "api/auth":
        require "routes/auth.php";
        break;
    case "api/projects":
        require "routes/projects.php";
        break;
    case "api/posts":
        require "routes/posts.php";
        break;
    case "api/comments":
        require "routes/comments.php";
        break;
    case "api/contact":
        require "routes/contact.php";
        break;
    case "api/online_users":
        require "routes/online_users.php";
        break;
    case "api/upload":
        require "routes/upload.php";
        break;
    case "api/analytics":
        require "routes/analytics.php";
        break;
    case "api/activity":
        require "routes/activity.php";
        break;
    case "api/test":
        echo json_encode(["status" => "success", "message" => "API is working"]);
        break;
    case "api/testdb":
        require "db.php";
        echo json_encode(["status" => "success", "message" => "Database connection successful"]);
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid route"]);
}
?>

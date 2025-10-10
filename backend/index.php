<?php

// Set CORS headers to allow frontend communication
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow all origins (change to specific domain in production)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require "db.php";

// Get the route from the URL
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = dirname($_SERVER['SCRIPT_NAME']);
$path = str_replace($script_name, '', parse_url($request_uri, PHP_URL_PATH));
$route = trim($path, '/');

// Extract route without query parameters
$route = explode('?', $route)[0];

// Route handling - support both with and without 'api/' prefix
$route = str_replace('index.php/', '', $route);
$route = ltrim($route, '/');

// Map routes to files
switch (true) {
    case (preg_match('/^(api\/)?auth/', $route)):
        require "routes/auth.php";
        break;
    case (preg_match('/^(api\/)?projects/', $route)):
        require "routes/projects.php";
        break;
    case (preg_match('/^(api\/)?posts/', $route)):
        require "routes/posts.php";
        break;
    case (preg_match('/^(api\/)?comments/', $route)):
        require "routes/comments.php";
        break;
    case (preg_match('/^(api\/)?contact/', $route)):
        require "routes/contact.php";
        break;
    case (preg_match('/^(api\/)?online_users/', $route)):
        require "routes/online_users.php";
        break;
    case (preg_match('/^(api\/)?upload/', $route)):
        require "routes/upload.php";
        break;
    case (preg_match('/^(api\/)?analytics/', $route)):
        require "routes/analytics.php";
        break;
    case (preg_match('/^(api\/)?activity/', $route)):
        require "routes/activity.php";
        break;
    case ($route === 'test' || $route === 'api/test'):
        echo json_encode(["status" => "success", "message" => "API is working!", "route" => $route]);
        break;
    case ($route === 'testdb' || $route === 'api/testdb'):
        echo json_encode(["status" => "success", "message" => "Database connection successful", "database" => $conn->server_info]);
        break;
    case ($route === '' || $route === 'index.php'):
        echo json_encode([
            "status" => "success", 
            "message" => "Portfolio API v1.0",
            "endpoints" => [
                "auth" => "/auth",
                "posts" => "/posts",
                "projects" => "/projects",
                "comments" => "/comments",
                "contact" => "/contact"
            ]
        ]);
        break;
    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Invalid route: " . $route, "request_uri" => $request_uri]);
}
?>

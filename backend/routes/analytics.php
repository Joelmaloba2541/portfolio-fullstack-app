<?php
require __DIR__ . '/../db.php';

header("Content-Type: application/json");

// Get user from request
$user_id = $_GET['user_id'] ?? null;

// Verify admin access
if ($user_id) {
    $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = '$user_id'");
    if (!$adminCheck || $adminCheck->num_rows === 0 || !$adminCheck->fetch_assoc()['is_admin']) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        exit;
    }
}

// Get analytics overview
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'overview') {
    try {
        // Total counts
        $totalPosts = $conn->query("SELECT COUNT(*) as count FROM posts")->fetch_assoc()['count'];
        $totalProjects = $conn->query("SELECT COUNT(*) as count FROM projects")->fetch_assoc()['count'];
        $totalUsers = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
        $totalComments = $conn->query("SELECT COUNT(*) as count FROM comments")->fetch_assoc()['count'];
        $totalViews = $conn->query("SELECT COUNT(*) as count FROM post_views")->fetch_assoc()['count'];
        $totalLikes = $conn->query("SELECT COUNT(*) as count FROM likes")->fetch_assoc()['count'];
        
        // Recent activity (last 7 days)
        $recentPosts = $conn->query("SELECT COUNT(*) as count FROM posts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_assoc()['count'];
        $recentComments = $conn->query("SELECT COUNT(*) as count FROM comments WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_assoc()['count'];
        $recentUsers = $conn->query("SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch_assoc()['count'];
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "totals" => [
                    "posts" => $totalPosts,
                    "projects" => $totalProjects,
                    "users" => $totalUsers,
                    "comments" => $totalComments,
                    "views" => $totalViews,
                    "likes" => $totalLikes
                ],
                "recent" => [
                    "posts" => $recentPosts,
                    "comments" => $recentComments,
                    "users" => $recentUsers
                ]
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Get top performing posts
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'top_posts') {
    try {
        $limit = intval($_GET['limit'] ?? 5);
        
        $query = "SELECT p.id, p.title, p.created_at,
                  (SELECT COUNT(*) FROM post_views WHERE post_id = p.id) as views,
                  (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes,
                  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments
                  FROM posts p
                  ORDER BY views DESC, likes DESC
                  LIMIT $limit";
        
        $result = $conn->query($query);
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
        
        echo json_encode(["status" => "success", "data" => $posts]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Get engagement metrics
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'engagement') {
    try {
        // Engagement over last 30 days
        $query = "SELECT 
                  DATE(created_at) as date,
                  COUNT(*) as count
                  FROM comments
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY DATE(created_at)
                  ORDER BY date ASC";
        
        $result = $conn->query($query);
        $comments = [];
        while ($row = $result->fetch_assoc()) {
            $comments[] = $row;
        }
        
        // Likes over last 30 days
        $query = "SELECT 
                  DATE(created_at) as date,
                  COUNT(*) as count
                  FROM likes
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY DATE(created_at)
                  ORDER BY date ASC";
        
        $result = $conn->query($query);
        $likes = [];
        while ($row = $result->fetch_assoc()) {
            $likes[] = $row;
        }
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "comments" => $comments,
                "likes" => $likes
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Get user growth
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'user_growth') {
    try {
        $days = intval($_GET['days'] ?? 30);
        
        $query = "SELECT 
                  DATE(created_at) as date,
                  COUNT(*) as count
                  FROM users
                  WHERE created_at >= DATE_SUB(NOW(), INTERVAL $days DAY)
                  GROUP BY DATE(created_at)
                  ORDER BY date ASC";
        
        $result = $conn->query($query);
        $growth = [];
        while ($row = $result->fetch_assoc()) {
            $growth[] = $row;
        }
        
        echo json_encode(["status" => "success", "data" => $growth]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Track post view
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'track_view') {
    try {
        $data = json_decode(file_get_contents("php://input"), true);
        $post_id = intval($data['post_id'] ?? 0);
        $user_id = isset($data['user_id']) ? intval($data['user_id']) : null;
        $ip_address = $_SERVER['REMOTE_ADDR'];
        
        if ($post_id > 0) {
            $stmt = $conn->prepare("INSERT INTO post_views (post_id, user_id, ip_address) VALUES (?, ?, ?)");
            $stmt->bind_param("iis", $post_id, $user_id, $ip_address);
            $stmt->execute();
            $stmt->close();
            
            echo json_encode(["status" => "success", "message" => "View tracked"]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid post_id"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

?>

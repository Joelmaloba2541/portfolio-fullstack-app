<?php
require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $postId = $_GET['postId'] ?? null;
    $status = $_GET['status'] ?? null;
    $user_id = $_GET['user_id'] ?? null;
    
    // Build query
    $where = [];
    if ($postId) {
        $where[] = "c.post_id = $postId";
    }
    if ($status) {
        $status = $conn->real_escape_string($status);
        $where[] = "c.status = '$status'";
    }
    
    $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
    
    // Get comments with user and post info
    $query = "SELECT c.*, u.username, p.title as post_title 
              FROM comments c 
              LEFT JOIN users u ON c.user_id = u.id 
              LEFT JOIN posts p ON c.post_id = p.id 
              $whereClause
              ORDER BY c.created_at DESC";
    
    $result = $conn->query($query);
    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }
    
    // Get counts by status for admin
    $counts = [
        'all' => 0,
        'approved' => 0,
        'pending' => 0,
        'spam' => 0
    ];
    
    if ($user_id) {
        $counts['all'] = $conn->query("SELECT COUNT(*) as count FROM comments")->fetch_assoc()['count'];
        $counts['approved'] = $conn->query("SELECT COUNT(*) as count FROM comments WHERE status='approved'")->fetch_assoc()['count'];
        $counts['pending'] = $conn->query("SELECT COUNT(*) as count FROM comments WHERE status='pending'")->fetch_assoc()['count'];
        $counts['spam'] = $conn->query("SELECT COUNT(*) as count FROM comments WHERE status='spam'")->fetch_assoc()['count'];
    }
    
    echo json_encode([
        "status" => "success", 
        "data" => $comments,
        "counts" => $counts
    ]);
}


if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $post_id = intval($data['postId'] ?? 0);
    $user_id = intval($data['user_id'] ?? 0);
    $comment = $conn->real_escape_string($data['comment'] ?? '');
    if ($post_id <= 0 || $user_id <= 0 || empty($comment)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing or invalid post_id, user_id, or comment."]);
        exit;
    }
    $result = $conn->query("INSERT INTO comments (post_id, user_id, comment) VALUES ('$post_id', '$user_id', '$comment')");
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Comment added"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to add comment: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id'] ?? 0);
    $comment = $conn->real_escape_string($data['comment'] ?? '');
    if ($id <= 0 || empty($comment)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing or invalid comment id or comment."]);
        exit;
    }
    $result = $conn->query("UPDATE comments SET comment='$comment' WHERE id=$id");
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Comment updated"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update comment: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $id = intval($_GET['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing or invalid comment id."]);
        exit;
    }
    $result = $conn->query("DELETE FROM comments WHERE id=$id");
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Comment deleted"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to delete comment: " . $conn->error]);
    }
}

// Moderate comment (approve, reject, mark as spam)
if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['action'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = intval($data['id'] ?? 0);
    $user_id = intval($data['user_id'] ?? 0);
    
    // Verify admin
    if ($user_id) {
        $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = $user_id");
        if (!$adminCheck || $adminCheck->num_rows === 0 || !$adminCheck->fetch_assoc()['is_admin']) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }
    }
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing or invalid comment id."]);
        exit;
    }
    
    $action = $_GET['action'];
    $status = '';
    
    switch ($action) {
        case 'approve':
            $status = 'approved';
            break;
        case 'reject':
        case 'spam':
            $status = 'spam';
            break;
        case 'pending':
            $status = 'pending';
            break;
        default:
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid action"]);
            exit;
    }
    
    $result = $conn->query("UPDATE comments SET status='$status' WHERE id=$id");
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Comment status updated to $status"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to update comment: " . $conn->error]);
    }
}

// Bulk moderate comments
if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['bulk_action'])) {
    $data = json_decode(file_get_contents("php://input"), true);
    $ids = $data['ids'] ?? [];
    $user_id = intval($data['user_id'] ?? 0);
    $bulk_action = $_GET['bulk_action'];
    
    // Verify admin
    if ($user_id) {
        $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = $user_id");
        if (!$adminCheck || $adminCheck->num_rows === 0 || !$adminCheck->fetch_assoc()['is_admin']) {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Unauthorized"]);
            exit;
        }
    }
    
    if (empty($ids) || !is_array($ids)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No comment IDs provided"]);
        exit;
    }
    
    $ids_string = implode(',', array_map('intval', $ids));
    
    if ($bulk_action === 'delete') {
        $result = $conn->query("DELETE FROM comments WHERE id IN ($ids_string)");
    } else {
        $status = '';
        switch ($bulk_action) {
            case 'approve':
                $status = 'approved';
                break;
            case 'spam':
                $status = 'spam';
                break;
            case 'pending':
                $status = 'pending';
                break;
            default:
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid bulk action"]);
                exit;
        }
        $result = $conn->query("UPDATE comments SET status='$status' WHERE id IN ($ids_string)");
    }
    
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Bulk action completed", "affected" => $conn->affected_rows]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to perform bulk action: " . $conn->error]);
    }
}
?>

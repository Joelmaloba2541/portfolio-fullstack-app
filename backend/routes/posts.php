<?php
require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    // Check if user has liked a post
    if (isset($_GET['action']) && $_GET['action'] === 'check_like') {
        $post_id = intval($_GET['post_id'] ?? 0);
        $user_id = intval($_GET['user_id'] ?? 0);
        
        if ($post_id > 0 && $user_id > 0) {
            $result = $conn->query("SELECT COUNT(*) as count FROM likes WHERE post_id=$post_id AND user_id=$user_id");
            $liked = $result->fetch_assoc()['count'] > 0;
            echo json_encode(["status" => "success", "liked" => $liked]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
        }
        exit;
    }
    
    $id = $_GET['id'] ?? null;
    if ($id) {
        $result = $conn->query("SELECT p.*, u.username as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id WHERE p.id=$id LIMIT 1");
        $post = $result->fetch_assoc();
        if ($post) {
            $post['tags'] = isset($post['tags']) && !empty($post['tags']) ? explode(',', $post['tags']) : [];
            // Get likes count
            $likesResult = $conn->query("SELECT COUNT(*) as likes FROM likes WHERE post_id=$id");
            $post['likes'] = $likesResult->fetch_assoc()['likes'];
            // Get comments
            $commentsResult = $conn->query("SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id=$id ORDER BY c.created_at DESC");
            $comments = [];
            while ($comment = $commentsResult->fetch_assoc()) {
                $comments[] = $comment;
            }
            $post['comments'] = $comments;
        }
        echo json_encode(["status" => "success", "data" => $post]);
    } else {
        $result = $conn->query("SELECT p.*, u.username as author_name FROM posts p LEFT JOIN users u ON p.author_id = u.id ORDER BY p.created_at DESC");
        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $row['tags'] = isset($row['tags']) && !empty($row['tags']) ? explode(',', $row['tags']) : [];
            // Get likes count
            $likesResult = $conn->query("SELECT COUNT(*) as likes FROM likes WHERE post_id=" . $row['id']);
            $row['likes'] = $likesResult->fetch_assoc()['likes'];
            $posts[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $posts]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    // Handle likes first
    if (isset($_GET['action']) && $_GET['action'] === "like") {
        $data = json_decode(file_get_contents("php://input"), true);
        $post_id = intval($data['post_id'] ?? 0);
        $user_id = intval($data['user_id'] ?? 0);
        
        if ($post_id <= 0 || $user_id <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid post_id or user_id"]);
            exit;
        }
        
        $result = $conn->query("INSERT IGNORE INTO likes (post_id, user_id) VALUES ($post_id, $user_id)");
        if ($result) {
            echo json_encode(["status" => "success", "message" => "Liked"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to like: " . $conn->error]);
        }
        exit;
    }
    
    // Handle regular post creation
    $data = json_decode(file_get_contents("php://input"), true);
    $title = $conn->real_escape_string($data['title'] ?? '');
    $content = $conn->real_escape_string($data['content'] ?? '');
    $excerpt = $conn->real_escape_string($data['excerpt'] ?? '');
    $category = $conn->real_escape_string($data['category'] ?? '');
    $tags = $conn->real_escape_string(is_array($data['tags'] ?? null) ? implode(',', $data['tags']) : ($data['tags'] ?? ''));
    $image = $conn->real_escape_string($data['image'] ?? '');
    $author_id = intval($data['author_id'] ?? 0);
    
    if (empty($title) || empty($content) || $author_id <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields: title, content, or author_id"]);
        exit;
    }
    
    if ($conn->query("INSERT INTO posts (title, content, excerpt, category, tags, image, author_id) VALUES ('$title', '$content', '$excerpt', '$category', '$tags', '$image', $author_id)")) {
        $post_id = $conn->insert_id;
        echo json_encode(["status" => "success", "message" => "Post created successfully", "post_id" => $post_id]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to create post: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "PUT") {
    $id = intval($_GET['id'] ?? 0);
    if ($id > 0) {
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $excerpt = $conn->real_escape_string($data['excerpt'] ?? '');
        $category = $conn->real_escape_string($data['category'] ?? '');
        $tags = $conn->real_escape_string(is_array($data['tags'] ?? null) ? implode(',', $data['tags']) : ($data['tags'] ?? ''));
        $image = $conn->real_escape_string($data['image'] ?? '');
        
        if (empty($title) || empty($content)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields: title or content"]);
            exit;
        }
        
        $result = $conn->query("UPDATE posts SET title='$title', content='$content', excerpt='$excerpt', category='$category', tags='$tags', image='$image' WHERE id=$id");
        if ($result) {
            echo json_encode(["status" => "success", "message" => "Post updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to update post: " . $conn->error]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid post ID"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $id = intval($_GET['id'] ?? 0);
    if ($id > 0) {
        $result = $conn->query("DELETE FROM posts WHERE id=$id");
        if ($result) {
            echo json_encode(["status" => "success", "message" => "Post deleted successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to delete post: " . $conn->error]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid post ID"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE" && isset($_GET['action']) && $_GET['action'] === "like") {
    $post_id = intval($_GET['post_id'] ?? 0);
    $user_id = intval($_GET['user_id'] ?? 0);
    
    if ($post_id <= 0 || $user_id <= 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid post_id or user_id"]);
        exit;
    }
    
    $result = $conn->query("DELETE FROM likes WHERE post_id=$post_id AND user_id=$user_id");
    if ($result) {
        echo json_encode(["status" => "success", "message" => "Unliked"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to unlike: " . $conn->error]);
    }
    exit;
}
?>

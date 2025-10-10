<?php
require __DIR__ . '/../db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['action']) && $_GET['action'] === "login") {
    $username = $conn->real_escape_string($data['username'] ?? '');
    $password = $conn->real_escape_string($data['password'] ?? '');

    $res = $conn->query("SELECT id, username, email, password, is_admin FROM users WHERE username='$username'");

    if ($res && $res->num_rows > 0) {
        $user = $res->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Update last_active and remove password from response
            $conn->query("UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = " . $user['id']);
            unset($user['password']);
            echo json_encode(["status" => "success", "user" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['action']) && $_GET['action'] === "register") {
    $username = $conn->real_escape_string($data['username'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $password = password_hash($data['password'] ?? '', PASSWORD_BCRYPT);
    $isAdmin = isset($data['is_admin']) ? (bool)$data['is_admin'] : false;

    // For security, check if any admin exists, if not make this user an admin
    $adminCheck = $conn->query("SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE");
    $adminCount = $adminCheck->fetch_assoc()['admin_count'];
    
    if ($adminCount === 0) {
        $isAdmin = true; // First user becomes admin automatically
    }

    $stmt = $conn->prepare("INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $username, $email, $password, $isAdmin);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User registered", "is_admin" => $isAdmin]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed: " . $stmt->error]);
    }
    $stmt->close();
}

// New endpoint to get all users (requires admin privileges)
if ($_SERVER['REQUEST_METHOD'] === "GET" && isset($_GET['action']) && $_GET['action'] === "users") {
    $requestingUserId = $conn->real_escape_string($_GET['user_id'] ?? '');
    
    $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = '$requestingUserId'");
    if ($adminCheck && $adminCheck->num_rows > 0) {
        $isAdmin = $adminCheck->fetch_assoc()['is_admin'];
        if ($isAdmin) {
            $result = $conn->query("SELECT id, username, email, is_admin FROM users ORDER BY id");
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode(["status" => "success", "users" => $users]);
        } else {
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can view users"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid requesting user"]);
    }
}

// New endpoint to make a user an admin (requires admin privileges)
if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['action']) && $_GET['action'] === "make_admin") {
    // First verify that the requesting user is an admin
    $requestingUserId = $conn->real_escape_string($data['requesting_user_id'] ?? '');
    $targetUserId = $conn->real_escape_string($data['target_user_id'] ?? '');
    
    $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = '$requestingUserId'");
    if ($adminCheck && $adminCheck->num_rows > 0) {
        $isAdmin = $adminCheck->fetch_assoc()['is_admin'];
        if ($isAdmin) {
            // Update the target user's admin status
            $stmt = $conn->prepare("UPDATE users SET is_admin = ? WHERE id = ?");
            $newAdminStatus = true;
            $stmt->bind_param("ii", $newAdminStatus, $targetUserId);
            
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "User has been made admin"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update admin status"]);
            }
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can perform this action"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid requesting user"]);
    }
}

// New endpoint to revoke admin privileges (requires admin privileges)
if ($_SERVER['REQUEST_METHOD'] === "POST" && isset($_GET['action']) && $_GET['action'] === "revoke_admin") {
    // First verify that the requesting user is an admin
    $requestingUserId = $conn->real_escape_string($data['requesting_user_id'] ?? '');
    $targetUserId = $conn->real_escape_string($data['target_user_id'] ?? '');
    
    $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = '$requestingUserId'");
    if ($adminCheck && $adminCheck->num_rows > 0) {
        $isAdmin = $adminCheck->fetch_assoc()['is_admin'];
        if ($isAdmin) {
            // Make sure we're not revoking the last admin's privileges
            $adminCountCheck = $conn->query("SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE AND id != '$targetUserId'");
            $adminCount = $adminCountCheck->fetch_assoc()['admin_count'];
            
            if ($adminCount > 0) {
                // Update the target user's admin status
                $stmt = $conn->prepare("UPDATE users SET is_admin = ? WHERE id = ?");
                $newAdminStatus = false;
                $stmt->bind_param("ii", $newAdminStatus, $targetUserId);
                
                if ($stmt->execute()) {
                    echo json_encode(["status" => "success", "message" => "Admin privileges revoked"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to update admin status"]);
                }
                $stmt->close();
            } else {
                echo json_encode(["status" => "error", "message" => "Cannot revoke last admin's privileges"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can perform this action"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid requesting user"]);
    }
}

// New endpoint to delete a user (requires admin privileges)
if ($_SERVER['REQUEST_METHOD'] === "DELETE" && isset($_GET['action']) && $_GET['action'] === "delete_user") {
    $requestingUserId = $conn->real_escape_string($_GET['requesting_user_id'] ?? '');
    $targetUserId = $conn->real_escape_string($_GET['user_id'] ?? '');
    
    $adminCheck = $conn->query("SELECT is_admin FROM users WHERE id = '$requestingUserId'");
    if ($adminCheck && $adminCheck->num_rows > 0) {
        $isAdmin = $adminCheck->fetch_assoc()['is_admin'];
        if ($isAdmin) {
            // Prevent deleting the last admin
            $adminCountCheck = $conn->query("SELECT COUNT(*) as admin_count FROM users WHERE is_admin = TRUE AND id != '$targetUserId'");
            $adminCount = $adminCountCheck->fetch_assoc()['admin_count'];
            
            if ($adminCount > 0) {
                $result = $conn->query("DELETE FROM users WHERE id = '$targetUserId'");
                if ($result) {
                    echo json_encode(["status" => "success", "message" => "User deleted"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Failed to delete user"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Cannot delete the last admin"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Unauthorized: Only admins can perform this action"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid requesting user"]);
    }
}
?>

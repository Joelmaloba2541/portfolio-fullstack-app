<?php
require __DIR__ . '/../db.php';

header("Content-Type: application/json");

// Helper function to log activity
function logActivity($conn, $user_id, $action, $entity_type, $entity_id, $details) {
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $stmt = $conn->prepare("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ississ", $user_id, $action, $entity_type, $entity_id, $details, $ip_address);
    $stmt->execute();
    $stmt->close();
}

// Get activity logs
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
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
        
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        $search = $conn->real_escape_string($_GET['search'] ?? '');
        $action_filter = $conn->real_escape_string($_GET['action_filter'] ?? '');
        
        $where = [];
        if ($search) {
            $where[] = "(a.action LIKE '%$search%' OR a.entity_type LIKE '%$search%' OR a.details LIKE '%$search%' OR u.username LIKE '%$search%')";
        }
        if ($action_filter) {
            $where[] = "a.action = '$action_filter'";
        }
        
        $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
        
        $query = "SELECT a.*, u.username 
                  FROM activity_logs a 
                  LEFT JOIN users u ON a.user_id = u.id 
                  $whereClause
                  ORDER BY a.created_at DESC 
                  LIMIT $limit OFFSET $offset";
        
        $result = $conn->query($query);
        $logs = [];
        while ($row = $result->fetch_assoc()) {
            $logs[] = $row;
        }
        
        // Get total count
        $countQuery = "SELECT COUNT(*) as total FROM activity_logs a LEFT JOIN users u ON a.user_id = u.id $whereClause";
        $total = $conn->query($countQuery)->fetch_assoc()['total'];
        
        echo json_encode([
            "status" => "success",
            "data" => $logs,
            "total" => $total,
            "limit" => $limit,
            "offset" => $offset
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Export logs to CSV
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'export') {
    try {
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
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="activity_logs_' . date('Y-m-d') . '.csv"');
        
        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'User', 'Action', 'Entity Type', 'Entity ID', 'Details', 'IP Address', 'Date']);
        
        $query = "SELECT a.*, u.username 
                  FROM activity_logs a 
                  LEFT JOIN users u ON a.user_id = u.id 
                  ORDER BY a.created_at DESC";
        
        $result = $conn->query($query);
        while ($row = $result->fetch_assoc()) {
            fputcsv($output, [
                $row['id'],
                $row['username'] ?? 'Unknown',
                $row['action'],
                $row['entity_type'],
                $row['entity_id'],
                $row['details'],
                $row['ip_address'],
                $row['created_at']
            ]);
        }
        
        fclose($output);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

// Get activity statistics
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'stats') {
    try {
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
        
        // Actions by type
        $actionStats = [];
        $result = $conn->query("SELECT action, COUNT(*) as count FROM activity_logs GROUP BY action ORDER BY count DESC");
        while ($row = $result->fetch_assoc()) {
            $actionStats[] = $row;
        }
        
        // Activity by day (last 7 days)
        $dailyActivity = [];
        $result = $conn->query("SELECT DATE(created_at) as date, COUNT(*) as count FROM activity_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date ASC");
        while ($row = $result->fetch_assoc()) {
            $dailyActivity[] = $row;
        }
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "by_action" => $actionStats,
                "daily" => $dailyActivity
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
}

?>

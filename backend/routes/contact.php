<?php
require __DIR__ . '/../db.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = $conn->real_escape_string($data['name'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $subject = $conn->real_escape_string($data['subject'] ?? '');
    $message = $conn->real_escape_string($data['message'] ?? '');
    
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Name, email, and message are required"]);
        exit;
    }
    
    // Check if subject column exists, if not use message only
    $query = "INSERT INTO contacts (name, email, " . ($subject ? "subject, " : "") . "message) VALUES ('$name', '$email', " . ($subject ? "'$subject', " : "") . "'$message')";
    
    if ($conn->query($query)) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to send message: " . $conn->error]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $result = $conn->query("SELECT * FROM contacts ORDER BY created_at DESC");
    $contacts = [];
    while ($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $contacts]);
}
?>

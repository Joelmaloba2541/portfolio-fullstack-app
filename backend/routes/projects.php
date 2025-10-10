<?php
require __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] === "GET") {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $result = $conn->query("SELECT * FROM projects WHERE id=$id LIMIT 1");
        $project = $result->fetch_assoc();
        echo json_encode(["status" => "success", "data" => $project]);
    } else {
        $result = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $projects = [];
        while ($row = $result->fetch_assoc()) {
            $row['tags'] = isset($row['tags']) ? explode(',', $row['tags']) : [];
            $projects[] = $row;
        }
        echo json_encode(["status" => "success", "data" => $projects]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $title = $conn->real_escape_string($data['title'] ?? '');
    $description = $conn->real_escape_string($data['description'] ?? '');
    $tags = $conn->real_escape_string(implode(',', $data['tags'] ?? []));
    $link = $conn->real_escape_string($data['link'] ?? '');
    $image = $conn->real_escape_string($data['image'] ?? '');
    $conn->query("INSERT INTO projects (title, description, tags, link, image) VALUES ('$title', '$description', '$tags', '$link', '$image')");
    echo json_encode(["status" => "success", "message" => "Project created"]);
}

if ($_SERVER['REQUEST_METHOD'] === "PUT") {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $title = $conn->real_escape_string($data['title'] ?? '');
        $description = $conn->real_escape_string($data['description'] ?? '');
        $tags = $conn->real_escape_string(implode(',', $data['tags'] ?? []));
        $link = $conn->real_escape_string($data['link'] ?? '');
        $image = $conn->real_escape_string($data['image'] ?? '');
        $conn->query("UPDATE projects SET title='$title', description='$description', tags='$tags', link='$link', image='$image' WHERE id=$id");
        echo json_encode(["status" => "success", "message" => "Project updated"]);
    }
}

if ($_SERVER['REQUEST_METHOD'] === "DELETE") {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $conn->query("DELETE FROM projects WHERE id=$id");
        echo json_encode(["status" => "success", "message" => "Project deleted"]);
    }
}
?>

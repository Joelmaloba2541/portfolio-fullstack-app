<?php
if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $target_dir = __DIR__ . "/../../uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0755, true);
    }
    $target_file = $target_dir . basename($_FILES["image"]["name"]);
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $check = getimagesize($_FILES["image"]["tmp_name"]);
    if ($check !== false) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            echo json_encode(["status" => "success", "url" => "/uploads/" . basename($_FILES["image"]["name"])]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "File is not an image"]);
    }
}
?>

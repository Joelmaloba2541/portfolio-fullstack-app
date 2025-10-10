<?php
// Database configuration
$host = "localhost";
$user = "your_database_username";
$pass = "your_database_password";
$db = "portfolio";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");
?>

<?php
// data.php

// Set the content type to JSON
header('Content-Type: application/json');

// Retrieve the raw POST data
$postData = file_get_contents("php://input");

// Decode the JSON data
$data = json_decode($postData, true);

// Check if data is present
if (!empty($data)) {
    // Append the data to the log.txt file
    $logFilePath = '../data/log.txt';
    file_put_contents($logFilePath, json_encode($data) . PHP_EOL, FILE_APPEND);

    // Respond with a success message
    $response = ['status' => 'success', 'message' => 'Data received and logged successfully.'];
} else {
    // Respond with an error message
    $response = ['status' => 'error', 'message' => 'No data received.'];
}

// Output the response as JSON
echo json_encode($response);
?>

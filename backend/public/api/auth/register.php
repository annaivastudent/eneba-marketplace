<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'error' => 'Method not allowed'
    ]);

    exit;
}

try {
    $pdo = require dirname(__DIR__, 3) . '/config/database.php';

    $input = json_decode(
        file_get_contents('php://input'),
        true
    );

    if (!is_array($input)) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid JSON'
        ]);

        exit;
    }

    $name = trim($input['name'] ?? '');
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if ($name === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Name is required'
        ]);

        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid email'
        ]);

        exit;
    }

    if (!is_string($password) || strlen($password) < 8) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Password must contain at least 8 characters'
        ]);

        exit;
    }

    $checkUser = $pdo->prepare(
        'SELECT id FROM users WHERE email = :email'
    );

    $checkUser->execute([
        'email' => $email
    ]);

    if ($checkUser->fetch()) {
        http_response_code(409);

        echo json_encode([
            'error' => 'Email is already registered'
        ]);

        exit;
    }

    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    $statement = $pdo->prepare(
        'INSERT INTO users (name, email, password)
         VALUES (:name, :email, :password)'
    );

    $statement->execute([
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword
    ]);

    http_response_code(201);

    echo json_encode([
        'message' => 'Registration successful',
        'user' => [
            'id' => (int) $pdo->lastInsertId(),
            'name' => $name,
            'email' => $email
        ]
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Server error'
    ]);
}

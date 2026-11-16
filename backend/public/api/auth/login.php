<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

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

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

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

    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);

        echo json_encode([
            'error' => 'Invalid email'
        ]);

        exit;
    }

    if (!is_string($password) || $password === '') {
        http_response_code(400);

        echo json_encode([
            'error' => 'Password is required'
        ]);

        exit;
    }

    $statement = $pdo->prepare(
        'SELECT id, name, email, password
         FROM users
         WHERE email = :email'
    );

    $statement->execute([
        'email' => $email
    ]);

    $user = $statement->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);

        echo json_encode([
            'error' => 'Invalid email or password'
        ]);

        exit;
    }

    session_regenerate_id(true);

    $_SESSION['user'] = [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ];

    echo json_encode([
        'message' => 'Login successful',
        'user' => $_SESSION['user']
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Server error'
    ]);
}

<?php

declare(strict_types=1);

$databaseDir = dirname(__DIR__) . '/database';

if (!is_dir($databaseDir)) {
    mkdir($databaseDir, 0777, true);
}

$databasePath = $databaseDir . '/database.sqlite';

try {
    $pdo = new PDO('sqlite:' . $databasePath);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->setAttribute(
        PDO::ATTR_DEFAULT_FETCH_MODE,
        PDO::FETCH_ASSOC
    );

    $pdo->exec('PRAGMA foreign_keys = ON');

} catch (PDOException $error) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Database connection failed'
    ]);

    exit;
}

return $pdo;

<?php

declare(strict_types=1);

$pdo = require dirname(__DIR__) . '/config/database.php';

$sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
";

$pdo->exec($sql);

echo "Users table created successfully!";

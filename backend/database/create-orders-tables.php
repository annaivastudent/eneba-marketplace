<?php

declare(strict_types=1);

$pdo = require dirname(__DIR__) . '/config/database.php';

$pdo->exec("
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'paid',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_title TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        digital_key TEXT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )
");

echo "Orders tables created successfully!";

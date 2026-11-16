<?php

declare(strict_types=1);

$pdo = require __DIR__ . '/../config/database.php';

// Таблица продавцов
$pdo->exec("
    CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rating REAL NOT NULL DEFAULT 5.0
    )
");

// Таблица предложений
$pdo->exec("
    CREATE TABLE IF NOT EXISTS product_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        seller_id INTEGER NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (seller_id) REFERENCES sellers(id)
    )
");

// Добавляем продавцов
$pdo->exec("
    INSERT OR IGNORE INTO sellers (id, name, rating)
    VALUES
        (1, 'GameVault', 4.9),
        (2, 'PixelMarket', 4.8),
        (3, 'KeyZone', 4.7)
");

// Добавляем тестовые предложения
$pdo->exec("
    INSERT OR IGNORE INTO product_offers
        (id, product_id, seller_id, price, stock)
    VALUES
        (1, 1, 1, 34.99, 10),
        (2, 1, 2, 37.49, 15),
        (3, 1, 3, 39.99, 8),

        (4, 2, 1, 24.49, 10),
        (5, 2, 2, 27.99, 15),
        (6, 2, 3, 29.50, 8)
");

echo "Offers tables created successfully!";

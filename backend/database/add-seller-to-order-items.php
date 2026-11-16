<?php

declare(strict_types=1);

$pdo = require __DIR__ . '/../config/database.php';

$columns = $pdo->query("PRAGMA table_info(order_items)")
    ->fetchAll(PDO::FETCH_ASSOC);

$columnExists = false;

foreach ($columns as $column) {
    if ($column['name'] === 'seller_name') {
        $columnExists = true;
        break;
    }
}

if (!$columnExists) {
    $pdo->exec("
        ALTER TABLE order_items
        ADD COLUMN seller_name TEXT
    ");

    echo "Seller column added successfully!";
} else {
    echo "Seller column already exists.";
}

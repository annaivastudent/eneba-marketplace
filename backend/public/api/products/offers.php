<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$productId = filter_input(INPUT_GET, 'product_id', FILTER_VALIDATE_INT);

if (!$productId || $productId < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid product ID']);
    exit;
}

try {
    $pdo = require dirname(__DIR__, 3) . '/config/database.php';

    $statement = $pdo->prepare("
        SELECT
            po.id,
            po.product_id AS productId,
            s.name AS sellerName,
            s.rating AS sellerRating,
            po.price,
            po.stock
        FROM product_offers po
        INNER JOIN sellers s ON s.id = po.seller_id
        WHERE po.product_id = :product_id
          AND po.stock > 0
        ORDER BY po.price ASC
    ");

    $statement->execute([
        'product_id' => $productId
    ]);

    echo json_encode([
        'data' => $statement->fetchAll()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Could not load offers'
    ]);
}

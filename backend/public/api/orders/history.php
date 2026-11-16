<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
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

session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $databasePath = dirname(__DIR__, 3) . '/config/database.php';

    if (!file_exists($databasePath)) {
        throw new RuntimeException('Database file not found');
    }

    $pdo = require $databasePath;

    $statement = $pdo->prepare(
        'SELECT
            o.id AS order_id,
            o.total_price,
            o.status,
            o.created_at,
            oi.product_title,
            oi.price,
            oi.quantity,
            oi.digital_key,
            oi.seller_name
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = :user_id
         ORDER BY o.created_at DESC, o.id DESC'
    );

    $statement->execute([
        'user_id' => $_SESSION['user']['id']
    ]);

    $rows = $statement->fetchAll();

    $orders = [];

    foreach ($rows as $row) {
        $orderId = (int) $row['order_id'];

        if (!isset($orders[$orderId])) {
            $orders[$orderId] = [
                'id' => $orderId,
                'totalPrice' => (float) $row['total_price'],
                'status' => $row['status'],
                'createdAt' => $row['created_at'],
                'items' => []
            ];
        }

        if ($row['product_title'] !== null) {
            $orders[$orderId]['items'][] = [
                'title' => $row['product_title'],
                'price' => (float) $row['price'],
                'quantity' => (int) $row['quantity'],
                'sellerName' => $row['seller_name'],
                'digitalKey' => $row['digital_key']
            ];
        }
    }

    echo json_encode([
        'orders' => array_values($orders)
    ]);

} catch (Throwable $error) {
    http_response_code(500);

    echo json_encode([
        'error' => 'Could not load orders'
    ]);
}

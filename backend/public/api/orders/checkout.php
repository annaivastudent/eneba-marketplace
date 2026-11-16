<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

session_start();

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please sign in first']);
    exit;
}

try {
    $pdo = require dirname(__DIR__, 3) . '/config/database.php';

    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input) || empty($input['items']) || !is_array($input['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid order']);
        exit;
    }

    $items = $input['items'];
    $totalPrice = 0;
    $validatedItems = [];

    foreach ($items as $item) {
        if (!is_array($item)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product data']);
            exit;
        }

        $productId = filter_var($item['productId'] ?? null, FILTER_VALIDATE_INT);
        $title = trim($item['title'] ?? '');
        $price = filter_var($item['price'] ?? null, FILTER_VALIDATE_FLOAT);
        $quantity = filter_var($item['quantity'] ?? null, FILTER_VALIDATE_INT);

        $sellerName = $item['sellerName'] ?? null;

        if ($sellerName !== null && !is_string($sellerName)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid seller']);
            exit;
        }

        $sellerName = $sellerName !== null ? trim($sellerName) : null;

        if (
            !$productId ||
            $title === '' ||
            $price === false ||
            $price <= 0 ||
            !$quantity ||
            $quantity < 1 ||
            $quantity > 10
        ) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product data']);
            exit;
        }

        $validatedItems[] = [
            'productId' => $productId,
            'title' => $title,
            'price' => $price,
            'quantity' => $quantity,
            'sellerName' => $sellerName
        ];

        $totalPrice += $price * $quantity;
    }

    $pdo->beginTransaction();

    $orderStatement = $pdo->prepare(
        'INSERT INTO orders (user_id, total_price, status)
         VALUES (:user_id, :total_price, :status)'
    );

    $orderStatement->execute([
        'user_id' => $_SESSION['user']['id'],
        'total_price' => $totalPrice,
        'status' => 'paid'
    ]);

    $orderId = (int) $pdo->lastInsertId();

    $itemStatement = $pdo->prepare(
        'INSERT INTO order_items
         (order_id, product_id, product_title, price, quantity, digital_key, seller_name)
         VALUES
         (:order_id, :product_id, :product_title, :price, :quantity, :digital_key, :seller_name)'
    );

    $deliveredItems = [];

    foreach ($validatedItems as $item) {
        for ($i = 0; $i < $item['quantity']; $i++) {
            $digitalKey = strtoupper(
                bin2hex(random_bytes(4)) . '-' .
                bin2hex(random_bytes(4)) . '-' .
                bin2hex(random_bytes(4))
            );

            $itemStatement->execute([
                'order_id' => $orderId,
                'product_id' => $item['productId'],
                'product_title' => $item['title'],
                'price' => $item['price'],
                'quantity' => 1,
                'digital_key' => $digitalKey,
                'seller_name' => $item['sellerName']
            ]);

            $deliveredItems[] = [
                'title' => $item['title'],
                'sellerName' => $item['sellerName'],
                'digitalKey' => $digitalKey
            ];
        }
    }

    $pdo->commit();

    echo json_encode([
        'message' => 'Payment successful',
        'orderId' => $orderId,
        'totalPrice' => round($totalPrice, 2),
        'items' => $deliveredItems
    ]);

} catch (Throwable $error) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode(['error' => 'Could not complete the order']);
}

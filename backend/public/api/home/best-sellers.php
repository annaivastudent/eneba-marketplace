<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

header('Access-Control-Allow-Origin: https://eneba-marketplace-lemon.vercel.app');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        'error' => 'Method not allowed'
    ]);

    exit;
}


$products = [
    [
        'id' => 1,
        'title' => 'Elden Ring',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'RPG · Open world',
        'region' => 'Global',
        'price' => 34.99,
        'originalPrice' => 59.99,
        'discountPercent' => 42,
        'image' => '/images/elden-ring.png'
    ],
    [
        'id' => 2,
        'title' => 'Cyberpunk 2077',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'RPG · Sci-fi',
        'region' => 'Global',
        'price' => 24.49,
        'originalPrice' => 59.99,
        'discountPercent' => 59,
        'image' => '/images/cyberpunk-2077.png'
    ],
    [
        'id' => 3,
        'title' => "Baldur's Gate 3",
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'RPG · Fantasy',
        'region' => 'Global',
        'price' => 42.99,
        'originalPrice' => 59.99,
        'discountPercent' => 28,
        'image' => '/images/baldurs-gate-3.png'
    ],
    [
        'id' => 4,
        'title' => 'Red Dead Redemption 2',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Action · Open world',
        'region' => 'Global',
        'price' => 17.99,
        'originalPrice' => 59.99,
        'discountPercent' => 70,
        'image' => '/images/red-dead-redemption-2.png'
    ],
    [
        'id' => 5,
        'title' => 'Hogwarts Legacy',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Adventure · Fantasy',
        'region' => 'Global',
        'price' => 14.79,
        'originalPrice' => 59.99,
        'discountPercent' => 75,
        'image' => '/images/hogwarts-legacy.png'
    ],
    [
        'id' => 6,
        'title' => 'Black Myth: Wukong',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Action · RPG',
        'region' => 'Global',
        'price' => 44.99,
        'originalPrice' => 59.99,
        'discountPercent' => 25,
        'image' => '/images/black-myth-wukong.png'
    ],
    [
        'id' => 7,
        'title' => 'Resident Evil 4',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Horror · Action',
        'region' => 'Global',
        'price' => 19.49,
        'originalPrice' => 39.99,
        'discountPercent' => 51,
        'image' => '/images/resident-evil-4.png'
    ],
    [
        'id' => 8,
        'title' => 'The Forest',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Survival · Open world',
        'region' => 'Global',
        'price' => 3.99,
        'originalPrice' => 18.79,
        'discountPercent' => 76,
        'image' => '/images/the-forest.png'
    ],
    [
        'id' => 9,
        'title' => 'Sekiro: Shadows Die Twice',
        'platform' => 'PC',
        'launcher' => 'Steam',
        'genre' => 'Action · Adventure',
        'region' => 'Global',
        'price' => 26.99,
        'originalPrice' => 59.99,
        'discountPercent' => 55,
        'image' => '/images/sekiro-shadows-die-twice.png'
    ]
];


echo json_encode(
    ['data' => $products],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
);

# Eneba Marketplace

A digital games marketplace inspired by [Eneba](https://www.eneba.com/), where users can explore games, compare seller offers, add products to their cart, and complete test purchases with simulated digital key delivery.

## Live Demo

[Visit Eneba Marketplace](https://eneba-marketplace.freedev.app/)

## GitHub Repository

[View Source Code](https://github.com/annaivastudent/eneba-marketplace)

## About the Project

This project was developed as a full-stack web application using React, TypeScript, PHP, and SQLite.

The application provides a marketplace experience with product browsing, search, filtering, seller offers, user authentication, shopping cart functionality, checkout, and order history.

## Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### Product Details
![Product Details](screenshots/product-details.png)

### Shopping Cart
![Shopping Cart](screenshots/shopping-cart.png)

### Checkout
![Checkout](screenshots/checkout.png)

### Login
![Login](screenshots/login.png)

### Registration
![Registration](screenshots/register.png)

### Order History
![Order History](screenshots/order-history.png)

## Features

### Product Catalog
- Browse available games.
- Search for products by name.
- Filter products by platform, region, and price.
- Sort products.
- View product details, prices, and discounts.

### Seller Offers
- Compare offers from multiple sellers.
- View seller ratings and available stock.
- Add a specific seller's offer to the shopping cart.

### Shopping Cart
- Add and remove products.
- Manage products from different sellers.
- View quantities and total prices.
- Preserve cart data using local storage.

### User Authentication
- User registration and login.
- Session-based authentication.
- Logout functionality.
- Protected checkout and order history pages.

### Checkout and Orders
- Complete a simulated test payment.
- Generate digital keys for purchased products.
- Save orders in the database.
- View previous orders and order details.

## Technologies Used

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS3
- HTML5

### Backend
- PHP
- REST API
- PDO
- SQLite

### Development Tools
- Git
- GitHub
- npm
- Visual Studio Code

## Project Structure

```text
eneba-marketplace/
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── database/
│   │   ├── create-users-table.php
│   │   ├── create-orders-tables.php
│   │   ├── create-offers-tables.php
│   │   └── add-seller-to-order-items.php
│   └── public/
│       └── api/
│           ├── auth/
│           ├── home/
│           ├── orders/
│           └── products/
├── public/
│   └── images/
├── screenshots/
├── src/
│   ├── components/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js and npm
- PHP 8.4 or a compatible version with PDO SQLite enabled
- Git

### 1. Clone the repository

```bash
git clone https://github.com/annaivastudent/eneba-marketplace.git
cd eneba-marketplace
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the PHP backend

Open a terminal in the project root:

```bash
cd backend
php -S localhost:8000 -t public
```

The backend API will be available at:

`http://localhost:8000`

The SQLite database file is created automatically when the database connection is initialized. If the database is empty, run the database table creation scripts.

### 4. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

## Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/home/best-sellers.php` | GET | Retrieves best-selling products |
| `/api/products/offers.php` | GET | Retrieves available seller offers |
| `/api/auth/register.php` | POST | Registers a new user |
| `/api/auth/login.php` | POST | Authenticates a user |
| `/api/auth/me.php` | GET | Retrieves the current user |
| `/api/auth/logout.php` | POST | Logs out the current user |
| `/api/orders/checkout.php` | POST | Processes a test checkout |
| `/api/orders/history.php` | GET | Retrieves order history |

## Important Notes

- Payments are simulated for demonstration purposes. No real transactions are processed.
- Digital keys are generated for testing purposes.
- The application uses SQLite for data persistence.
- This project is an educational marketplace application and is not affiliated with Eneba.

## Author

Developed as a full-stack web development project.

## License

This project is intended for educational and demonstration purposes.
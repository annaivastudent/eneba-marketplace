import "./App.css";
import { useEffect, useState } from "react";
import type { Product } from "./types/Product";
import Header from "./components/layout/header/Header";
import Hero from "./components/layout/hero/Hero";
import BestSellers from "./components/layout/product/BestSellers";
import { getBestSellers } from "./services/productService";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetails from "./components/layout/product-details/ProductDetails";
import type { CartItem } from "./components/layout/cart/CartItem";
import Cart from "./components/layout/cart/Cart";
import Register from "./components/layout/auth/Register";
import Login from "./components/layout/auth/Login";
import { getCurrentUser, logoutUser } from "./services/authService";
import type { AuthUser } from "./services/authService";
import Checkout from "./components/layout/checkout/Checkout";
import OrderHistory from "./components/layout/orders/OrderHistory";
import { Navigate } from "react-router-dom";
import type { Offer } from "../src/types/Offer";
import Footer from "../src/components/layout/footer/Footer";
function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  });
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    getBestSellers()
      .then((data) => {
        setProducts(data);
      })
      .catch((error: unknown) => {
        console.error("Error loading products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("Authentication check failed:", error);
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);
  const addToCart = (product: Product, offer?: Offer) => {
  setCartItems((currentItems) => {
    const existingItem = currentItems.find(
      (item) =>
        item.product.id === product.id &&
        item.offerId === offer?.id,
    );

    if (existingItem) {
      return currentItems.map((item) =>
        item.product.id === product.id &&
        item.offerId === offer?.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    }

    return [
      ...currentItems,
      {
        product,
        quantity: 1,
        offerId: offer?.id,
        sellerName: offer?.sellerName,
      },
    ];
  });
};
const removeFromCart = (productId: number, offerId?: number) => {
  setCartItems((currentItems) =>
    currentItems.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.offerId === offerId
        ),
    ),
  );
};
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      {!authLoading && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          products={products}
          cartCount={cartCount}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                products={products}
              />
              <BestSellers
                searchQuery={searchQuery}
                products={products}
                loading={loading}
                addToCart={addToCart}
              />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              products={products}
              loading={loading}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
              user={user}
              authLoading={authLoading}
              onOrderComplete={() => setCartItems([])}
            />
          }
        />
        <Route
          path="/orders"
          element={
            authLoading ? (
              <p>Loading...</p>
            ) : user ? (
              <OrderHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
            <Footer />
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

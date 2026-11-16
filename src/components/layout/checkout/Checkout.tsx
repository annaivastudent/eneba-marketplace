
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import type { CartItem } from "../cart/CartItem";
import type { AuthUser } from "../../../services/authService";
import { createOrder } from "../../../services/orderService";
import "../../../styles/checkout/Checkout.css";

interface CheckoutProps {
  cartItems: CartItem[];
  user: AuthUser | null;
  authLoading: boolean;
  onOrderComplete: () => void;
}

function Checkout({
  cartItems,
  user,
  authLoading,
  onOrderComplete,
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState<{
    orderId: number;
    totalPrice: number;
    items: { title: string; digitalKey: string }[];
  } | null>(null);

  if (authLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (cartItems.length === 0 && !orderResult) {
    return <Navigate to="/cart" replace />;
  }

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await createOrder(cartItems);

      if (
        result.orderId &&
        result.items &&
        result.totalPrice !== undefined
      ) {
        setOrderResult({
          orderId: result.orderId,
          totalPrice: result.totalPrice,
          items: result.items,
        });

        onOrderComplete();
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">
          <h1>Payment successful!</h1>

          <p>Order number: #{orderResult.orderId}</p>

          <h2>Your digital keys</h2>

          {orderResult.items.map((item, index) => (
            <div className="delivered-key" key={index}>
              <strong>{item.title}</strong>
              <code>{item.digitalKey}</code>
            </div>
          ))}

          <p>
            Total paid: €{orderResult.totalPrice.toFixed(2)}
          </p>

          <Link to="/">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <section className="checkout-details">
          <div className="checkout-section">
            <h2>Customer information</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>

          <div className="checkout-section">
            <h2>Your order</h2>

            {cartItems.map((item) => (
              <article
                className="checkout-item"
                key={item.product.id}
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                />

                <div>
                  <h3>{item.product.title}</h3>
                  <p>{item.product.platform}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <strong>
                  €{(
                    item.product.price * item.quantity
                  ).toFixed(2)}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order summary</h2>

          <div className="checkout-total">
            <span>Total</span>
            <strong>€{totalPrice.toFixed(2)}</strong>
          </div>

          {error && (
            <p className="checkout-error">{error}</p>
          )}

          <button
            type="button"
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay now"}
          </button>

          <Link to="/cart" className="back-to-cart">
            Back to cart
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;

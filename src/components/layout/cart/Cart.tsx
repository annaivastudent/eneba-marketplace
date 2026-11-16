import { Link } from "react-router-dom";
import type { CartItem } from "./CartItem";
import "../../../styles/cart/Cart.css";

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (productId: number, offerId?: number) => void;
}

function Cart({ cartItems, removeFromCart }: CartProps) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <main className="cart-page">
      <h1>Shopping cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Find your next favorite game!</p>
          <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article
                className="cart-item"
                key={`${item.product.id}-${item.offerId ?? "default"}`}
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                />

                <div className="cart-item-info">
                  <h3>{item.product.title}</h3>
                  <p>{item.product.platform}</p>

                  {item.sellerName && (
                    <p className="cart-seller">
                      Seller: {item.sellerName}
                    </p>
                  )}

                  <p>Quantity: {item.quantity}</p>
                </div>

                <div className="cart-item-price">
                  <strong>
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.product.id, item.offerId)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>

            <div className="cart-total">
              <span>Total</span>
              <strong>€{totalPrice.toFixed(2)}</strong>
            </div>

            <Link to="/checkout" className="checkout-button">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;

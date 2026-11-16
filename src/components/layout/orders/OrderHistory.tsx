
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getOrderHistory,
  type Order,
} from "../../../services/orderService";
import "../../../styles/orders/Orders.css";

function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderHistory()
      .then(setOrders)
      .catch((error: unknown) => {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load orders"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="orders-message">Loading orders...</p>;
  }

  if (error) {
    return <p className="orders-error">{error}</p>;
  }

  return (
    <main className="orders-page">
      <h1>My orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <Link to="/">Start shopping</Link>
        </div>
      ) : (
        orders.map((order) => (
          <section className="order-card" key={order.id}>
            <div className="order-header">
              <div>
                <h2>Order #{order.id}</h2>
                <p>{order.createdAt}</p>
              </div>

              <span>{order.status}</span>
            </div>

            {order.items.map((item, index) => (
              <div
                className="order-product"
                key={`${order.id}-${index}`}
              >
                <div>
                  <h3>{item.title}</h3>

                  {item.sellerName && (
                    <p className="order-seller">
                      Seller: {item.sellerName}
                    </p>
                  )}

                  <p>Quantity: {item.quantity}</p>

                  <p>
                    €{item.price.toFixed(2)}
                  </p>

                  <code>{item.digitalKey}</code>
                </div>
              </div>
            ))}

            <div className="order-total">
              Total: €{order.totalPrice.toFixed(2)}
            </div>
          </section>
        ))
      )}
    </main>
  );
}

export default OrderHistory;

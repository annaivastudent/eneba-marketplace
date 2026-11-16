
import type { CartItem } from "../components/layout/cart/CartItem";
import API_BASE_URL from "./apiConfig";

interface OrderResponse {
  message?: string;
  error?: string;
  orderId?: number;
  totalPrice?: number;
  items?: {
    title: string;
    sellerName?: string | null;
    digitalKey: string;
  }[];
}

export async function createOrder(
  cartItems: CartItem[]
): Promise<OrderResponse> {
  const response = await fetch(
    `${API_BASE_URL}/orders/checkout.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          sellerName: item.sellerName ?? null,
        })),
      }),
    }
  );

  const result: OrderResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Payment failed");
  }

  return result;
}

export interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: {
    title: string;
    price: number;
    quantity: number;
    sellerName?: string | null;
    digitalKey: string;
  }[];
}

export async function getOrderHistory(): Promise<Order[]> {
  const response = await fetch(
    `${API_BASE_URL}/orders/history.php`,
    {
      credentials: "include",
    }
  );

  const result: {
    orders?: Order[];
    error?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Could not load order history");
  }

  return result.orders ?? [];
}

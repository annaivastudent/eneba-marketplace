
import type { Offer } from "../types/Offer";

interface ApiResponse<T> {
  data: T;
}

const API_URL = "http://localhost:8000/api/products";

export async function getProductOffers(
  productId: number
): Promise<Offer[]> {
  const response = await fetch(
    `${API_URL}/offers.php?product_id=${productId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load product offers");
  }

  const result: ApiResponse<Offer[]> = await response.json();

  return result.data;
}

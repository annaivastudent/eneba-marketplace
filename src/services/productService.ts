
import type { Product } from '../types/Product';

const API_URL = 'http://localhost:8000/api/home';

interface ApiResponse<T> {
  data: T;
}

export async function getBestSellers(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/best-sellers.php`);

  if (!response.ok) {
    throw new Error('Failed to load best sellers');
  }

  const result: ApiResponse<Product[]> = await response.json();

  return result.data;
}

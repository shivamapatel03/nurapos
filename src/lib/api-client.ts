import { Product, Order, PosStats } from '../types/pos';

// Base URL for future .NET Core Web API (e.g., https://localhost:7001 or http://localhost:5000)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard HTTP client tailored for .NET API integration
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    // Graceful fallback for local development before .NET backend is launched
    console.warn(`[Nuradesk API] Request to ${url} failed, using local mock data fallback.`, error);
    throw error;
  }
}

// Initial sample catalog items for fast POS interaction
export const MOCK_PRODUCTS: Product[] = [
  { id: '1', sku: 'ND-001', name: 'Artisan Espresso', category: 'Beverages', price: 4.50, stock: 84 },
  { id: '2', sku: 'ND-002', name: 'Cold Brew Coffee', category: 'Beverages', price: 5.25, stock: 42 },
  { id: '3', sku: 'ND-003', name: 'Toasted Bagel & Spread', category: 'Bakery', price: 6.00, stock: 28 },
  { id: '4', sku: 'ND-004', name: 'Butter Croissant', category: 'Bakery', price: 4.00, stock: 19 },
  { id: '5', sku: 'ND-005', name: 'Ceramic Nuradesk Mug', category: 'Retail', price: 18.00, stock: 55 },
  { id: '6', sku: 'ND-006', name: 'Thermal Receipt Rolls (5pk)', category: 'Supplies', price: 12.50, stock: 110 },
];

export const MOCK_STATS: PosStats = {
  todaySales: 3840.50,
  ordersCount: 142,
  activeRegisters: 4,
  lowStockAlerts: 2,
};

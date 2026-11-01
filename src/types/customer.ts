/**
 * Customer & Loyalty Points Types (Phase 4 Batch 2)
 */

export interface Customer {
  id: number;
  ownerId: number;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  loyaltyPoints: number;
  totalSpent: number;
  totalVisits: number;
  createdAtUtc: string;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface LoyaltyRedeemRequest {
  points: number;
  saleSubtotal: number;
}

export interface LoyaltyRedeemResponse {
  discountAmount: number;
  remainingPoints: number;
}

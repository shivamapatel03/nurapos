/**
 * Franchise Outlets & Branch Management Types (Phase 3 Batch 2)
 */

export interface FranchiseResponse {
  franchiseId: number;
  franchiseName: string;
  ownerName?: string | null;
  contact?: string | null;
  address?: string | null;
  city?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
}

export type FranchiseDto = FranchiseResponse;

export interface CreateFranchiseRequest {
  franchiseName: string;
  ownerName?: string;
  contact?: string;
  address?: string;
  city?: string;
}

export interface UpdateFranchiseRequest {
  franchiseName: string;
  ownerName?: string;
  contact?: string;
  address?: string;
  city?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

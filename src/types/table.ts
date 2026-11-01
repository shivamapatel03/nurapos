/**
 * Dining Table Management Types (Phase 4 Batch 2)
 */

export interface DiningTable {
  id: number;
  franchiseId: number;
  tableNumber: string;
  section: string;
  capacity: number;
  status: 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'BILLED' | string;
  activeOrderId?: string | null;
}

export interface CreateTableRequest {
  franchiseId: number;
  tableNumber: string;
  section: string;
  capacity: number;
}

export interface UpdateTableStatusRequest {
  status: 'VACANT' | 'OCCUPIED' | 'RESERVED' | 'BILLED' | string;
  activeOrderId?: string;
}

export interface TransferTableRequest {
  targetTableId: number;
}

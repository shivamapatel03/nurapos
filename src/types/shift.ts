/**
 * POS Execution & Shift Management Types (Phase 4 Batch 1)
 */

export interface PosPinLoginRequest {
  terminalId: string;
  employeeId: number;
  pin: string;
}

export interface EmployeeSummary {
  id: number;
  name: string;
  role: string;
}

export interface PosPinLoginResponse {
  posSessionToken: string;
  employee: EmployeeSummary;
  shiftRequired: boolean;
}

export interface RegisterShift {
  shiftId: string;
  franchiseId: number;
  terminalId: string;
  cashierId: number;
  cashierName?: string;
  openedAtUtc: string;
  closedAtUtc?: string | null;
  status: 'OPEN' | 'CLOSED' | string;
  openingFloat: number;
  totalSales: number;
  cashSales: number;
  cardTotal: number;
  upiTotal: number;
  expectedCash?: number | null;
  actualCash?: number | null;
  cashDifference?: number | null;
  notes?: string | null;
}

export interface OpenShiftRequest {
  terminalId: string;
  franchiseId: number;
  openingFloat: number;
  cashierId: number;
  notes?: string;
}

export interface CashMovementRequest {
  shiftId: string;
  type: 'PAY_IN' | 'PAY_OUT';
  amount: number;
  reason: string;
}

export interface CloseShiftRequest {
  shiftId: string;
  closingCashActual: number;
  notes?: string;
}

export interface ShiftCloseResponse {
  shiftId: string;
  expectedCash: number;
  actualCash: number;
  cashDifference: number;
  totalSales: number;
  cashTotal: number;
  cardTotal: number;
  upiTotal: number;
  zReportGenerated: boolean;
}

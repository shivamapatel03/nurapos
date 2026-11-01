/**
 * Employee & Staff Management Types (Phase 3 Batch 1)
 */

export type EmployeeRole =
  | 'Admin'
  | 'Store Manager'
  | 'Shift Supervisor'
  | 'Senior Cashier'
  | 'Cashier'
  | 'Barista'
  | 'Inventory Clerk'
  | 'Kitchen Lead';

export interface EmployeeDto {
  id: number;
  franchiseId: number;
  employeeCode: string;
  name: string;
  role: EmployeeRole;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  pinConfigured: boolean;
  createdAtUtc?: string;
}

export interface CreateEmployeeRequest {
  franchiseId: number;
  employeeCode: string;
  name: string;
  role: EmployeeRole;
  phone?: string | null;
  email?: string | null;
  initialPin?: string | null;
}

export interface UpdateEmployeeRequest {
  name: string;
  role: EmployeeRole;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
}

export interface ResetEmployeePinRequest {
  pin: string;
  confirmPin: string;
}

export type {
  FranchiseResponse,
  FranchiseDto,
  CreateFranchiseRequest,
  UpdateFranchiseRequest,
} from './franchise';

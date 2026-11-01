import { Product, Order, PosStats } from '../types/pos';
import {
  SignupFormData,
  SignupResponseData,
  ApiResponse,
  VerifyEmailRequest,
  EmailVerificationResponseData,
  LoginRequest,
  AuthSession,
  VerifyPasswordCodeRequest,
  VerifyPasswordCodeResponseData,
  PasswordResetFormData,
  PosPinTokenResponse,
} from '../types/auth';
import {
  OnboardingStatusResponse,
  OnboardingDraftRequest,
  OnboardingCompleteResponse,
} from '../types/onboarding';
import {
  OwnerCatalogItem,
  CategoryRequest,
  ProductRequest,
  SupplierRequest,
} from '../types/catalog';
import {
  EmployeeDto,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ResetEmployeePinRequest,
} from '../types/employee';
import {
  FranchiseResponse,
  FranchiseDto,
  CreateFranchiseRequest,
  UpdateFranchiseRequest,
} from '../types/franchise';
import {
  PosPinLoginRequest,
  PosPinLoginResponse,
  RegisterShift,
  OpenShiftRequest,
  CashMovementRequest,
  CloseShiftRequest,
  ShiftCloseResponse,
} from '../types/shift';
import {
  Customer,
  CreateCustomerRequest,
  LoyaltyRedeemRequest,
  LoyaltyRedeemResponse,
} from '../types/customer';
import {
  DiningTable,
  CreateTableRequest,
  UpdateTableStatusRequest,
  TransferTableRequest,
} from '../types/table';
import {
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
  clearAuthSession,
  updatePosPinConfigured,
  updatePosPinVerified,
} from './auth';

// Base URL for ASP.NET Web API (e.g., http://localhost:5076)
const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5076';
export const API_BASE_URL = RAW_URL.replace(/\/+$/, '');

/**
 * Returns full API URL for a given relative endpoint path
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Standard HTTP client tailored for .NET API integration with automatic JWT injection & refresh
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Automatically inject Bearer token if not explicitly skipped
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
    });

    // Handle 401 Unauthorized with automatic token refresh
    if (res.status === 401 && !options.skipAuth && !endpoint.includes('/api/auth/login') && !endpoint.includes('/api/auth/refresh')) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(getApiUrl('/api/auth/refresh'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshRes.ok) {
              const refreshJson: ApiResponse<AuthSession> = await refreshRes.json();
              if (refreshJson.data) {
                saveAuthSession(refreshJson.data);
                const newToken = refreshJson.data.accessToken || refreshJson.data.token;
                onRefreshed(newToken);
              }
            } else {
              clearAuthSession();
            }
          } catch {
            clearAuthSession();
          } finally {
            isRefreshing = false;
          }
        }

        // Retry the original request with new token
        return new Promise<T>((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            options.headers = {
              ...(options.headers as Record<string, string>),
              Authorization: `Bearer ${newToken}`,
            };
            apiRequest<T>(endpoint, options).then(resolve).catch(reject);
          });
        });
      }
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg =
        data?.message ||
        (data?.errors
          ? Object.values(data.errors)
              .flat()
              .join(' ')
          : null) ||
        `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      (err as any).statusCode = res.status;
      (err as any).response = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[Nuradesk API] Error calling ${url}:`, error);
    throw error;
  }
}

/**
 * Authentication Endpoints (Phase 1)
 */

// 1. Signup
export async function signupUser(
  payload: SignupFormData
): Promise<ApiResponse<SignupResponseData>> {
  return apiRequest<ApiResponse<SignupResponseData>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 2. Verify Email
export async function verifyEmail(
  payload: VerifyEmailRequest
): Promise<ApiResponse<EmailVerificationResponseData>> {
  return apiRequest<ApiResponse<EmailVerificationResponseData>>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 3. Resend Verification Code
export async function resendVerification(
  email: string
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>('/api/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

// 4. Login
export async function loginUser(
  payload: LoginRequest
): Promise<ApiResponse<AuthSession>> {
  const res = await apiRequest<ApiResponse<AuthSession>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });

  if (res.data) {
    saveAuthSession(res.data);
  }
  return res;
}

// 5. Logout
export async function logoutUser(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Continue cleanup on failure
    }
  }
  clearAuthSession();
}

// 6. Forgot Password (Request 4-digit reset OTP)
export async function forgotPassword(
  email: string
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>('/api/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

// 7. Verify Password Reset Code (Get resetToken)
export async function verifyPasswordCode(
  payload: VerifyPasswordCodeRequest
): Promise<ApiResponse<VerifyPasswordCodeResponseData>> {
  return apiRequest<ApiResponse<VerifyPasswordCodeResponseData>>('/api/auth/password/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 8. Reset Password
export async function resetPassword(
  payload: PasswordResetFormData
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>('/api/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 9. POS PIN Setup (FRANCHISE_OWNER)
export async function setupPosPin(pin: string): Promise<ApiResponse<object>> {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('POS PIN must contain exactly four numeric digits.');
  }
  const res = await apiRequest<ApiResponse<object>>('/api/auth/pos-pin/setup', {
    method: 'POST',
    body: JSON.stringify({ pin }),
  });
  updatePosPinConfigured(true);
  return res;
}

// 10. POS PIN Verify (FRANCHISE_OWNER - elevated token)
export async function verifyPosPin(
  pin: string
): Promise<ApiResponse<PosPinTokenResponse>> {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('POS PIN must contain exactly four numeric digits.');
  }
  const res = await apiRequest<ApiResponse<PosPinTokenResponse>>(
    '/api/auth/pos-pin/verify',
    {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }
  );
  if (res?.data?.accessToken) {
    updatePosPinVerified(res.data);
  }
  return res;
}

/**
 * Onboarding Endpoints (Phase 1 Batch 2)
 */

// 11. Get Onboarding Status
export async function getOnboardingStatus(): Promise<ApiResponse<OnboardingStatusResponse>> {
  return apiRequest<ApiResponse<OnboardingStatusResponse>>('/api/onboarding/status', {
    method: 'GET',
  });
}

// 12. Save Onboarding Draft
export async function saveOnboardingDraft(
  fields: OnboardingDraftRequest
): Promise<ApiResponse<OnboardingStatusResponse>> {
  return apiRequest<ApiResponse<OnboardingStatusResponse>>('/api/onboarding/draft', {
    method: 'PUT',
    body: JSON.stringify(fields),
  });
}

// 13. Complete Onboarding
export async function completeOnboarding(): Promise<ApiResponse<OnboardingCompleteResponse>> {
  return apiRequest<ApiResponse<OnboardingCompleteResponse>>('/api/onboarding/complete', {
    method: 'POST',
  });
}

/**
 * Owner Catalog Endpoints (Phase 2 Batch 1)
 */

// 14. Get Categories
export async function getCatalogCategories(): Promise<ApiResponse<OwnerCatalogItem[]>> {
  return apiRequest<ApiResponse<OwnerCatalogItem[]>>('/api/owner-catalog/categories', {
    method: 'GET',
  });
}

// 15. Create Category
export async function createCatalogCategory(
  payload: CategoryRequest
): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>('/api/owner-catalog/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 16. Update Category
export async function updateCatalogCategory(
  id: number,
  payload: CategoryRequest
): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// 17. Delete Category
export async function deleteCatalogCategory(
  id: number
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>(`/api/owner-catalog/categories/${id}`, {
    method: 'DELETE',
  });
}

// 18. Get Products Catalog
export async function getCatalogProducts(): Promise<ApiResponse<OwnerCatalogItem[]>> {
  return apiRequest<ApiResponse<OwnerCatalogItem[]>>('/api/owner-catalog/products', {
    method: 'GET',
  });
}

/**
 * Owner Catalog Endpoints (Phase 2 Batch 2)
 */

// 19. Create Product
export async function createCatalogProduct(
  payload: ProductRequest
): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>('/api/owner-catalog/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 20. Update Product
export async function updateCatalogProduct(
  id: number,
  payload: ProductRequest
): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// 21. Delete Product
export async function deleteCatalogProduct(
  id: number
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>(`/api/owner-catalog/products/${id}`, {
    method: 'DELETE',
  });
}

// 22. Get Suppliers
export async function getCatalogSuppliers(): Promise<ApiResponse<OwnerCatalogItem[]>> {
  return apiRequest<ApiResponse<OwnerCatalogItem[]>>('/api/owner-catalog/suppliers', {
    method: 'GET',
  });
}

// 23. Create Supplier
export async function createCatalogSupplier(
  payload: SupplierRequest
): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>('/api/owner-catalog/suppliers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Staff & Employee Endpoints (Phase 3 Batch 1)
 */

// 24. Get All Employees
export async function getEmployees(
  franchiseId?: number
): Promise<ApiResponse<EmployeeDto[]>> {
  const url = franchiseId ? `/api/employees?franchiseId=${franchiseId}` : '/api/employees';
  return apiRequest<ApiResponse<EmployeeDto[]>>(url, {
    method: 'GET',
  });
}

// 25. Get Employee By ID
export async function getEmployeeById(
  id: number
): Promise<ApiResponse<EmployeeDto>> {
  return apiRequest<ApiResponse<EmployeeDto>>(`/api/employees/${id}`, {
    method: 'GET',
  });
}

// 26. Create Employee
export async function createEmployee(
  payload: CreateEmployeeRequest
): Promise<ApiResponse<EmployeeDto>> {
  return apiRequest<ApiResponse<EmployeeDto>>('/api/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 27. Update Employee
export async function updateEmployee(
  id: number,
  payload: UpdateEmployeeRequest
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// 28. Deactivate Employee
export async function deactivateEmployee(
  id: number
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/employees/${id}`, {
    method: 'DELETE',
  });
}

// 29. Reset Employee PIN
export async function resetEmployeePin(
  id: number,
  payload: ResetEmployeePinRequest
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/employees/${id}/reset-pin`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// PHASE 3 BATCH 2: FRANCHISE OUTLETS & STORE MANAGEMENT (5 APIs)
// ============================================================================

// 30. Get All Franchises
export async function getFranchises(): Promise<ApiResponse<FranchiseResponse[]>> {
  return apiRequest<ApiResponse<FranchiseResponse[]>>('/api/franchises', {
    method: 'GET',
  });
}

// 31. Get Franchise By ID
export async function getFranchiseById(
  id: number
): Promise<ApiResponse<FranchiseResponse>> {
  return apiRequest<ApiResponse<FranchiseResponse>>(`/api/franchises/${id}`, {
    method: 'GET',
  });
}

// 32. Create Franchise (Accepts Form Data per [FromForm])
export async function createFranchise(
  payload: CreateFranchiseRequest
): Promise<ApiResponse<FranchiseResponse>> {
  const formData = new FormData();
  formData.append('franchiseName', payload.franchiseName);
  if (payload.ownerName) formData.append('ownerName', payload.ownerName);
  if (payload.contact) formData.append('contact', payload.contact);
  if (payload.address) formData.append('address', payload.address);
  if (payload.city) formData.append('city', payload.city);

  return apiRequest<ApiResponse<FranchiseResponse>>('/api/franchises', {
    method: 'POST',
    body: formData,
  });
}

// 33. Update Franchise
export async function updateFranchise(
  id: number,
  payload: UpdateFranchiseRequest
): Promise<ApiResponse<FranchiseResponse>> {
  return apiRequest<ApiResponse<FranchiseResponse>>(`/api/franchises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// 34. Delete Franchise (Handles 409 Conflict if records are linked)
export async function deleteFranchise(
  id: number
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/franchises/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// PHASE 4 BATCH 1: POS AUTH & REGISTER SHIFT OPERATIONS (5 APIs)
// ============================================================================

export interface EmployeeLookupDto {
  id: number;
  franchiseId: number;
  franchiseName: string;
  employeeCode: string;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  pinConfigured: boolean;
}

// 34b. POS Employee Lookup (Anonymous, Public Rate-Limited)
export async function posLookupEmployee(
  identifier: string
): Promise<ApiResponse<EmployeeLookupDto>> {
  return apiRequest<ApiResponse<EmployeeLookupDto>>('/api/pos/auth/lookup', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
    skipAuth: true,
  });
}

export interface SaleLineRequest {
  productId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  franchiseId: number;
  shiftId?: string;
  paymentMethod: string;
  items: SaleLineRequest[];
}

export interface BillRecordItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BillRecord {
  id: number;
  billNumber: string;
  billType: string;
  franchiseId: number;
  totalAmount: number;
  paymentMethod: string;
  items: BillRecordItem[];
  createdAtUtc: string;
}

// 34c. Execute POS Sale / Transaction (PosPin Session)
export async function createPosSale(
  payload: CreateSaleRequest,
  idempotencyKey?: string
): Promise<ApiResponse<BillRecord>> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  } else {
    headers['Idempotency-Key'] = `pos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
  return apiRequest<ApiResponse<BillRecord>>('/api/pos/sales', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}

// 35. POS Employee PIN Login (Anonymous, Terminal Rate-Limited)
export async function posPinLogin(
  payload: PosPinLoginRequest
): Promise<ApiResponse<PosPinLoginResponse>> {
  return apiRequest<ApiResponse<PosPinLoginResponse>>('/api/pos/auth/pin', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

// 35b. Register Terminal
export async function registerTerminal(
  payload: {
    franchiseId: number;
    terminalCode: string;
    deviceName: string;
    platform?: string;
    hardwareIdentifier?: string;
  }
): Promise<ApiResponse<any>> {
  return apiRequest<ApiResponse<any>>('/api/terminals/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 36. Open Register Shift
export async function openShift(
  payload: OpenShiftRequest
): Promise<ApiResponse<RegisterShift>> {
  return apiRequest<ApiResponse<RegisterShift>>('/api/shifts/open', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 37. Get Active Shift
export async function getActiveShift(
  terminalId?: string,
  cashierId?: number
): Promise<ApiResponse<RegisterShift | null>> {
  const params = new URLSearchParams();
  if (terminalId) params.append('terminalId', terminalId);
  if (cashierId !== undefined && cashierId !== null) params.append('cashierId', String(cashierId));
  const qs = params.toString();
  const endpoint = qs ? `/api/shifts/active?${qs}` : '/api/shifts/active';

  return apiRequest<ApiResponse<RegisterShift | null>>(endpoint, {
    method: 'GET',
  });
}

// 38. Record Cash Movement (Pay In / Pay Out)
export async function recordCashMovement(
  payload: CashMovementRequest
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>('/api/shifts/cash-movement', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 39. Close Register Shift & Reconcile Cash
export async function closeShift(
  payload: CloseShiftRequest
): Promise<ApiResponse<ShiftCloseResponse>> {
  return apiRequest<ApiResponse<ShiftCloseResponse>>('/api/shifts/close', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// PHASE 4 BATCH 2: CUSTOMERS, LOYALTY & DINE-IN TABLES (5 APIs)
// ============================================================================

// 40. Get Customers (Search by phone or name)
export async function getCustomers(
  search?: string,
  name?: string
): Promise<ApiResponse<Customer[]>> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (name) params.append('name', name);
  const qs = params.toString();
  const endpoint = qs ? `/api/customers?${qs}` : '/api/customers';

  return apiRequest<ApiResponse<Customer[]>>(endpoint, {
    method: 'GET',
  });
}

// 41. Quick-register Customer at POS Counter
export async function createCustomer(
  payload: CreateCustomerRequest
): Promise<ApiResponse<Customer>> {
  return apiRequest<ApiResponse<Customer>>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 42. Redeem Customer Loyalty Points
export async function redeemLoyaltyPoints(
  id: number,
  payload: LoyaltyRedeemRequest
): Promise<ApiResponse<LoyaltyRedeemResponse>> {
  return apiRequest<ApiResponse<LoyaltyRedeemResponse>>(`/api/customers/${id}/loyalty/redeem`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 43. Get Dining Tables for Franchise Outlet
export async function getDiningTables(
  franchiseId?: number
): Promise<ApiResponse<DiningTable[]>> {
  const params = new URLSearchParams();
  if (franchiseId !== undefined && franchiseId !== null) {
    params.append('franchiseId', String(franchiseId));
  }
  const qs = params.toString();
  const endpoint = qs ? `/api/tables?${qs}` : '/api/tables';

  return apiRequest<ApiResponse<DiningTable[]>>(endpoint, {
    method: 'GET',
  });
}

// 44. Update Dining Table Status (VACANT | OCCUPIED | RESERVED | BILLED)
export async function updateTableStatus(
  id: number,
  payload: UpdateTableStatusRequest
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/tables/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Helper: Transfer Active Table Order
export async function transferTable(
  id: number,
  payload: TransferTableRequest
): Promise<ApiResponse<object | null>> {
  return apiRequest<ApiResponse<object | null>>(`/api/tables/${id}/transfer`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// GROUP B: OWNER OPERATIONS (SALES, PURCHASES, EXPENSES, INVENTORY) (14 APIs)
// ============================================================================

export interface PaymentMode {
  id: number;
  name: string;
}

export interface ExpenseRecord {
  id: number;
  franchiseId: number;
  expenseCategoryId: number;
  expenseCategoryName?: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  receiptImage?: string;
  expenseDate: string;
}

export interface ExpenseRequest {
  franchiseId: number;
  expenseCategoryId: number;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'OTHER';
  description?: string;
  receiptImage?: string;
  expenseDate?: string;
}

export interface PurchaseLineRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseRequest {
  franchiseId: number;
  supplierId?: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT' | 'OTHER';
  items: PurchaseLineRequest[];
}

export interface FranchiseProduct {
  id: number;
  franchiseId: number;
  productId: number;
  productName: string;
  categoryName?: string;
  stockQuantity: number;
  reorderLevel: number;
  sellingPrice: number;
  costPrice: number;
  isLowStock?: boolean;
}

export interface DailySummary {
  date: string;
  franchiseId: number;
  grossSales: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
}

export interface PaymentAuditRecord {
  id: number;
  billId: number;
  billNumber: string;
  franchiseId: number;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  createdAtUtc: string;
}

// B1. Get Payment Modes
export async function getPaymentModes(): Promise<ApiResponse<PaymentMode[]>> {
  return apiRequest<ApiResponse<PaymentMode[]>>('/api/owner/payment-modes', {
    method: 'GET',
  });
}

// B2. Create Payment Mode
export async function createPaymentMode(payload: { name: string }): Promise<ApiResponse<PaymentMode>> {
  return apiRequest<ApiResponse<PaymentMode>>('/api/owner/payment-modes', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// B3. Get Operating Expenses
export async function getExpenses(franchiseId?: number): Promise<ApiResponse<ExpenseRecord[]>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<ExpenseRecord[]>>(`/api/owner/expenses${qs}`, {
    method: 'GET',
  });
}

// B4. Create Operating Expense
export async function createExpense(payload: ExpenseRequest): Promise<ApiResponse<ExpenseRecord>> {
  return apiRequest<ApiResponse<ExpenseRecord>>('/api/owner/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// B5. Get Sales Ledger
export async function getOwnerSales(franchiseId?: number): Promise<ApiResponse<BillRecord[]>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<BillRecord[]>>(`/api/owner/sales${qs}`, {
    method: 'GET',
  });
}

// B6. Get Sale by ID
export async function getOwnerSaleById(id: number): Promise<ApiResponse<BillRecord>> {
  return apiRequest<ApiResponse<BillRecord>>(`/api/owner/sales/${id}`, {
    method: 'GET',
  });
}

// B7. Create Manual Back-Office Sale Bill
export async function createOwnerSale(payload: CreateSaleRequest): Promise<ApiResponse<BillRecord>> {
  return apiRequest<ApiResponse<BillRecord>>('/api/owner/sales', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// B8. Get Purchases (Stock-In) Log
export async function getOwnerPurchases(franchiseId?: number): Promise<ApiResponse<BillRecord[]>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<BillRecord[]>>(`/api/owner/purchases${qs}`, {
    method: 'GET',
  });
}

// B9. Get Purchase by ID
export async function getOwnerPurchaseById(id: number): Promise<ApiResponse<BillRecord>> {
  return apiRequest<ApiResponse<BillRecord>>(`/api/owner/purchases/${id}`, {
    method: 'GET',
  });
}

// B10. Record Purchase / Stock-In
export async function createOwnerPurchase(payload: PurchaseRequest): Promise<ApiResponse<BillRecord>> {
  return apiRequest<ApiResponse<BillRecord>>('/api/owner/purchases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// B11. Get Franchise Inventory / Stock Levels
export async function getFranchiseInventory(franchiseId: number): Promise<ApiResponse<FranchiseProduct[]>> {
  return apiRequest<ApiResponse<FranchiseProduct[]>>(`/api/owner/franchises/${franchiseId}/products`, {
    method: 'GET',
  });
}

// B12. Update Franchise Product Stock & Reorder Level
export async function updateFranchiseInventory(
  franchiseId: number,
  productId: number,
  payload: { stockQuantity: number; reorderLevel?: number }
): Promise<ApiResponse<FranchiseProduct>> {
  return apiRequest<ApiResponse<FranchiseProduct>>(`/api/owner/franchises/${franchiseId}/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// B13. Get Payments Reconciliation Audit
export async function getOwnerPayments(franchiseId?: number): Promise<ApiResponse<PaymentAuditRecord[]>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<PaymentAuditRecord[]>>(`/api/owner/payments${qs}`, {
    method: 'GET',
  });
}

// B14. Get Daily Financial Summaries
export async function getDailySummaries(franchiseId?: number): Promise<ApiResponse<DailySummary[]>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<DailySummary[]>>(`/api/owner/daily-summaries${qs}`, {
    method: 'GET',
  });
}

// ============================================================================
// GROUP C: REPORTS, Z-REPORTS & BUSINESS ANALYTICS (4 APIs)
// ============================================================================

export interface ReportRangeQuery {
  from?: string;
  to?: string;
  franchiseId?: number;
}

export interface TaxSlabBreakdown {
  taxRate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface SalesTaxReport {
  from?: string;
  to?: string;
  taxableSales: number;
  totalTax: number;
  orderCount: number;
  salesByRate?: TaxSlabBreakdown[];
  purchasesByRate?: TaxSlabBreakdown[];
  cgst?: number;
  sgst?: number;
  igst?: number;
}

export interface ProfitLossReport {
  grossSales: number;
  discountsAndRefunds?: number;
  netSales?: number;
  cogs?: number;
  costOfGoodsSold?: number;
  grossMargin?: number;
  expenses?: number;
  operatingExpenses?: number;
  netProfit?: number;
  netOperatingProfit?: number;
  marginPercent?: number;
  costOfGoodsSoldUsesCurrentProductCost?: boolean;
}

export interface ZReportRecord {
  shiftId: string;
  terminalId?: string;
  franchiseId?: number;
  cashierId?: number;
  cashierName?: string;
  openedAtUtc: string;
  closedAtUtc?: string | null;
  openingFloat: number;
  expectedCash?: number | null;
  actualCash?: number | null;
  cashDifference?: number | null;
  totalSales: number;
  cashTotal?: number;
  cardTotal?: number;
  upiTotal?: number;
  totalTransactions?: number;
}

export interface InventoryValuationLine {
  productId: number;
  productName: string;
  quantity: number;
  costPrice: number;
  value: number;
  reorderLevel: number;
  isLowStock: boolean;
}

export interface InventoryValuationReport {
  totalValue: number;
  lowStockItems: number;
  items: InventoryValuationLine[];
  totalItems?: number;
  totalCostValue?: number;
  totalRetailValue?: number;
  potentialProfit?: number;
}

// C1. Get Sales Tax (GST) Summary Report
export async function getSalesTaxReport(params?: ReportRangeQuery): Promise<ApiResponse<SalesTaxReport>> {
  const q = new URLSearchParams();
  if (params?.from) q.append('from', params.from);
  if (params?.to) q.append('to', params.to);
  if (params?.franchiseId) q.append('franchiseId', String(params.franchiseId));
  const qs = q.toString();
  return apiRequest<ApiResponse<SalesTaxReport>>(`/api/reports/sales-tax${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

// C2. Get Profit & Loss Statement Report
export async function getProfitLossReport(params?: ReportRangeQuery): Promise<ApiResponse<ProfitLossReport>> {
  const q = new URLSearchParams();
  if (params?.from) q.append('from', params.from);
  if (params?.to) q.append('to', params.to);
  if (params?.franchiseId) q.append('franchiseId', String(params.franchiseId));
  const qs = q.toString();
  return apiRequest<ApiResponse<ProfitLossReport>>(`/api/reports/profit-loss${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

// C3. Get Shift Z-Reports Audit
export async function getZReports(params?: ReportRangeQuery): Promise<ApiResponse<ZReportRecord[]>> {
  const q = new URLSearchParams();
  if (params?.from) q.append('from', params.from);
  if (params?.to) q.append('to', params.to);
  if (params?.franchiseId) q.append('franchiseId', String(params.franchiseId));
  const qs = q.toString();
  return apiRequest<ApiResponse<ZReportRecord[]>>(`/api/reports/z-report${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

// C4. Get Inventory Asset Valuation
export async function getInventoryValuationReport(franchiseId?: number): Promise<ApiResponse<InventoryValuationReport>> {
  const qs = franchiseId ? `?franchiseId=${franchiseId}` : '';
  return apiRequest<ApiResponse<InventoryValuationReport>>(`/api/reports/inventory-valuation${qs}`, {
    method: 'GET',
  });
}

// ============================================================================
// GROUP D: PROMOTIONS, OFFERS & BILL DISCOUNTS (3 APIs)
// ============================================================================

export interface Offer {
  id: number;
  franchiseId: number;
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  minBill: number;
  isActive: boolean;
  expiresAtUtc?: string;
}

export interface CreateOfferRequest {
  franchiseId: number;
  code: string;
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
  minBill: number;
  expiresAtUtc?: string;
}

export interface ValidateDiscountRequest {
  code: string;
  cartTotal: number;
  franchiseId: number;
}

export interface DiscountValidationResponse {
  isValid: boolean;
  discountAmount: number;
  finalTotal: number;
  reason?: string;
}

// D1. Get Active Offers
export async function getOffers(franchiseId: number): Promise<ApiResponse<Offer[]>> {
  return apiRequest<ApiResponse<Offer[]>>(`/api/offers?franchiseId=${franchiseId}`, {
    method: 'GET',
  });
}

// D2. Create New Offer
export async function createOffer(payload: CreateOfferRequest): Promise<ApiResponse<Offer>> {
  return apiRequest<ApiResponse<Offer>>('/api/offers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// D3. Validate Discount Code in Cart
export async function validateDiscountCode(payload: ValidateDiscountRequest): Promise<ApiResponse<DiscountValidationResponse>> {
  return apiRequest<ApiResponse<DiscountValidationResponse>>('/api/discounts/validate-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// GROUP E: CATALOG ITEMS, SUPPLIERS & EXPENSE CATEGORIES (7 APIs)
// ============================================================================

export interface ExpenseCategoryRequest {
  name: string;
  description?: string;
  status?: string;
}

// E1. Get Category by ID
export async function getCatalogCategoryById(id: number): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/categories/${id}`, {
    method: 'GET',
  });
}

// E2. Get Product by ID
export async function getCatalogProductById(id: number): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/products/${id}`, {
    method: 'GET',
  });
}

// E3. Get Supplier by ID
export async function getCatalogSupplierById(id: number): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/suppliers/${id}`, {
    method: 'GET',
  });
}

// E4. Update Supplier
export async function updateCatalogSupplier(id: number, payload: SupplierRequest): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>(`/api/owner-catalog/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// E5. Delete Supplier
export async function deleteCatalogSupplier(id: number): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>(`/api/owner-catalog/suppliers/${id}`, {
    method: 'DELETE',
  });
}

// E6. Get Expense Categories
export async function getExpenseCategories(): Promise<ApiResponse<OwnerCatalogItem[]>> {
  return apiRequest<ApiResponse<OwnerCatalogItem[]>>('/api/owner-catalog/expense-categories', {
    method: 'GET',
  });
}

// E7. Create Expense Category
export async function createExpenseCategory(payload: ExpenseCategoryRequest): Promise<ApiResponse<OwnerCatalogItem>> {
  return apiRequest<ApiResponse<OwnerCatalogItem>>('/api/owner-catalog/expense-categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// GROUP F: STORE & HARDWARE SETTINGS (4 APIs)
// ============================================================================

export interface StoreSettings {
  storeName?: string;
  storeCode?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  legalEntityName?: string;
  taxId?: string;
  currency?: string;
  currencyCode?: string;
  currencySymbol?: string;
  defaultTaxRate?: number;
  taxInclusive?: boolean;
  timezone?: string;
  invoiceHeaderTitle?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  roundingRule?: string;
}

export interface HardwareSettings {
  printerIp?: string;
  printerHost?: string;
  printerPort?: number;
  characterWidth?: number;
  paperWidth?: number;
  cashDrawerKickCode?: string;
  autoKickDrawer?: boolean;
  scannerMode?: string;
  scannerContinuousRead?: boolean;
  customerDisplayEnabled?: boolean;
}

// F1. Get Store Settings
export async function getStoreSettings(): Promise<ApiResponse<StoreSettings>> {
  return apiRequest<ApiResponse<StoreSettings>>('/api/settings/store', {
    method: 'GET',
  });
}

// F2. Save Store Settings
export async function saveStoreSettings(payload: StoreSettings): Promise<ApiResponse<StoreSettings>> {
  return apiRequest<ApiResponse<StoreSettings>>('/api/settings/store', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// F3. Get Hardware Settings
export async function getHardwareSettings(): Promise<ApiResponse<HardwareSettings>> {
  return apiRequest<ApiResponse<HardwareSettings>>('/api/settings/hardware', {
    method: 'GET',
  });
}

// F4. Save Hardware Settings
export async function saveHardwareSettings(payload: HardwareSettings): Promise<ApiResponse<HardwareSettings>> {
  return apiRequest<ApiResponse<HardwareSettings>>('/api/settings/hardware', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// GROUP G: HARDWARE TERMINALS & DEVICE PAIRING (2 APIs)
// ============================================================================

export interface TerminalHeartbeatRequest {
  appVersion?: string;
  batteryPercent?: number;
  peripheralStatus?: string;
}

// G1. Send Terminal Heartbeat
export async function sendTerminalHeartbeat(
  terminalId: string,
  payload: TerminalHeartbeatRequest
): Promise<ApiResponse<object>> {
  return apiRequest<ApiResponse<object>>(`/api/terminals/${terminalId}/heartbeat`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// G2. Get Eligible Employees for Terminal
export async function getTerminalEligibleEmployees(terminalId: string): Promise<ApiResponse<EmployeeDto[]>> {
  return apiRequest<ApiResponse<EmployeeDto[]>>(`/api/terminals/${terminalId}/eligible-employees`, {
    method: 'GET',
  });
}

// ============================================================================
// GROUP H: DINING TABLES (1 API)
// ============================================================================

// H1. Create Dining Table
export async function createDiningTable(payload: CreateTableRequest): Promise<ApiResponse<DiningTable>> {
  return apiRequest<ApiResponse<DiningTable>>('/api/tables', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// GROUP I: MEDIA ASSET & RECEIPT UPLOADS (3 APIs)
// ============================================================================

export interface UploadResponse {
  url: string;
}

// I1. Upload Product Image (multipart/form-data)
export async function uploadProductImage(file: File): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest<ApiResponse<UploadResponse>>('/api/upload/product-image', {
    method: 'POST',
    body: formData,
  });
}

// I2. Upload Expense Receipt (multipart/form-data)
export async function uploadReceipt(file: File): Promise<ApiResponse<UploadResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest<ApiResponse<UploadResponse>>('/api/upload/receipt', {
    method: 'POST',
    body: formData,
  });
}

// I3. Get File URL
export function getUploadedFileUrl(id: number | string): string {
  return `/api/upload/files/${id}`;
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

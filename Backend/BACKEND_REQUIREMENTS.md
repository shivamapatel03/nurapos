# Nuradesk Backend Requirements

This document is the backend handoff for the current Nuradesk frontend. It separates behavior that exists only in the browser from API contracts the .NET backend must implement.

## 1. Current Backend Status

Implemented today:

- `POST /api/franchises`
- `GET /api/franchises`
- `GET /api/franchises/{id}`
- `PUT /api/franchises/{id}`
- `DELETE /api/franchises/{id}`
- PostgreSQL via `Npgsql`
- JWT authentication middleware is registered, but no auth controller, token issuing endpoint, or `[Authorize]` protected business endpoint exists.

The frontend API helper is `src/lib/api-client.ts` and uses:

```text
NEXT_PUBLIC_API_URL || http://localhost:5000/api
```

All other frontend features currently use component state, mock data, or `localStorage`. They must be replaced with authenticated API calls and server-side persistence.

## 2. User Roles

Required roles:

- `Owner`: full organization and branch access, billing, settings, users, audit logs.
- `Admin`: full operational access within an organization/branch.
- `Store Manager`: operations, reports, returns, stock adjustments, purchase orders, audit logs; no user/permission administration unless explicitly granted.
- `Shift Supervisor`: sales, discounts, voids, returns, stock adjustments, purchase orders, reports, Z-report, audit logs.
- `Senior Cashier`: POS sales, limited discounts, voids, receipt reprint, drawer kick, returns, receiving purchase orders.
- `Cashier`: POS sales and receipt reprint.
- `Barista`: POS sales and receipt reprint, normally without administrative access.
- `Inventory Clerk`: stock adjustments and purchase-order receiving.
- `Kitchen Lead`: operational role; exact permissions must be configured by the owner/admin.

Every request must be scoped by `organizationId` and, where applicable, `branchId` and `terminalId`. Never trust these scopes from the client without checking the authenticated user's membership.

## 3. Authentication and Account Lifecycle

### 3.1 Signup

Frontend route: `/signup`

Current fields:

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "agreeTerms": true
}
```

Required behavior:

1. Validate full name, email, password strength, and terms acceptance.
2. Normalize email to lowercase.
3. Reject duplicate email with a conflict response.
4. Hash the password with Argon2id or bcrypt. Never store plaintext passwords.
5. Create the user in an unverified state.
6. Create or prepare the organization/owner record.
7. Send a 4-digit email verification code with expiry and attempt limits.
8. Return a short-lived verification transaction identifier, not a password or code.

Recommended endpoint:

```text
POST /api/auth/register
Content-Type: application/json
```

Response:

```json
{
  "message": "Verification code sent.",
  "verificationId": "uuid",
  "expiresAt": "2026-09-29T12:00:00Z"
}
```

### 3.2 Email Verification

Frontend routes: `/verify-email`, `/verification`

Current UI behavior:

- Four separate OTP inputs.
- One digit per input.
- Backspace moves to the previous input.
- Resend code action.
- Success proceeds to onboarding.

Recommended endpoints:

```text
POST /api/auth/verify-email
POST /api/auth/resend-verification
```

Request:

```json
{
  "verificationId": "uuid",
  "code": "1234"
}
```

Rules:

- Code expires, preferably after 10 minutes.
- Limit failed attempts.
- Invalidate a code after successful use.
- Resend must invalidate the previous code or version it.
- Do not reveal whether an email exists in public recovery flows.

### 3.3 Sign In

Frontend route: `/signin`

Fields:

```json
{
  "email": "user@example.com",
  "password": "string",
  "rememberDevice": false
}
```

Recommended endpoint:

```text
POST /api/auth/login
```

Response:

```json
{
  "accessToken": "jwt",
  "refreshToken": "opaque-token",
  "expiresAt": "2026-09-29T13:00:00Z",
  "user": {
    "id": "uuid",
    "fullName": "string",
    "email": "string",
    "role": "Owner"
  },
  "organizations": []
}
```

Use refresh-token rotation, revocation, rate limiting, failed-login audit events, and secure httpOnly cookie storage where possible.

### 3.4 Forgot Password

Frontend route: `/forgot-password`; `/forget-password` is an alias.

UI sequence:

1. Enter email.
2. Receive 4-digit OTP.
3. Verify OTP.
4. Enter new password and confirmation.
5. Complete reset.

Recommended endpoints:

```text
POST /api/auth/password/forgot
POST /api/auth/password/verify-code
POST /api/auth/password/reset
```

Reset request:

```json
{
  "resetId": "uuid",
  "code": "1234",
  "newPassword": "string"
}
```

Rules: short expiry, one-time reset token, attempt limits, password history policy if required, revoke active refresh tokens after reset.

## 4. Onboarding Workflow

Routes:

```text
/onboarding
/onboarding-2
/onboarding-3
/onboarding-4
/onboarding-5
/onboarding-6
```

The current frontend only routes between screens. It does not persist the form values.

### Step 1: Welcome

`/onboarding`

No business data. Starts setup and routes to step 2.

### Step 2: Business Profile

`/onboarding-2`

Fields:

```json
{
  "businessName": "string",
  "businessType": "Cafe",
  "countryCode": "IN",
  "dialCode": "+91",
  "phoneNumber": "string"
}
```

Business types currently offered include:

- Cafe
- Restaurant
- Retail Store
- Supermarket & Grocery
- Boutique & Clothing
- Bar & Lounge
- Salon & Spa
- Other

Backend requirements:

- Validate country and phone format.
- Create/update organization profile.
- Keep onboarding draft server-side so refresh or device change does not lose data.

### Step 3: Store Profile

`/onboarding-3`

Fields:

```json
{
  "storeName": "string",
  "storeCode": "string",
  "storeAddress": "string",
  "city": "string"
}
```

Create a branch/store under the organization. `storeCode` must be unique within the organization.

### Step 4: Add Staff

`/onboarding-4`

The UI supports a repeatable employee list. Each employee has:

```json
{
  "name": "string",
  "employeeId": "string",
  "role": "Cashier | Shift Lead | Store Manager | Barista | Supervisor | Admin",
  "phone": "string"
}
```

The user can add/remove employees, continue, or skip. Empty optional staff setup must be accepted. Employee IDs must be unique per organization or branch.

### Step 5: Payments and Hardware

`/onboarding-5`

Payment flags:

```json
{
  "cash": true,
  "card": true,
  "upi": true
}
```

Hardware fields:

```json
{
  "hasCashDrawer": "yes | no",
  "printerStatus": "connected | later"
}
```

Backend should store payment methods and hardware configuration separately so POS terminals can query capabilities.

### Step 6: Completion

`/onboarding-6`

The UI displays a summary and routes to `/dashboard`. The backend must mark onboarding complete only after required organization/store data is valid.

Recommended onboarding endpoints:

```text
GET  /api/onboarding/status
PUT  /api/onboarding/draft
POST /api/onboarding/complete
```

## 5. POS Terminal Authentication and PIN Flow

Routes:

```text
/pos-connect
/pos-store-found
/pos-not-connect
/pos-login
/pos-login-3
/pos-login-2
/start-shift
/pos-start-shift
/pos
```

### 5.1 Terminal Connection

The UI supports connected, store-found, and not-connected states. Backend/device requirements:

```text
POST /api/terminals/register
POST /api/terminals/{terminalId}/heartbeat
GET  /api/terminals/{terminalId}/store
POST /api/terminals/{terminalId}/pair
```

A terminal should have a stable ID, branch assignment, display name, status, last heartbeat, and software version.

### 5.2 POS Account Login

`/pos-login` collects employee ID or email and password, then routes to employee selection.

Recommended endpoint:

```text
POST /api/pos/auth/login
```

Request:

```json
{
  "terminalId": "POS-Ahmedabad-01",
  "identifier": "employee-id-or-email",
  "password": "string",
  "rememberDevice": false
}
```

### 5.3 Employee Selection

`/pos-login-3` currently displays a hardcoded list (`Amit`, `Priya`). Replace it with:

```text
GET /api/terminals/{terminalId}/eligible-employees
```

Return only active employees assigned to the branch/terminal and allowed to use POS.

### 5.4 Staff PIN Login

`/pos-login-2` supports a six-digit keypad input in the current UI, although staff management defaults to a four-digit PIN and the permission description says temporary 4-digit PINs. This must be standardized by product decision. Recommended default: 4 or 6 digits configured globally, never both implicitly.

Recommended endpoint:

```text
POST /api/pos/auth/pin
```

Request:

```json
{
  "terminalId": "POS-Ahmedabad-01",
  "employeeId": "EMP-101",
  "pin": "1234",
  "deviceId": "optional-device-id"
}
```

Response:

```json
{
  "accessToken": "short-lived-pos-jwt",
  "employee": {
    "id": "EMP-101",
    "name": "Amit",
    "role": "Cashier"
  },
  "permissions": ["pos_ring_sales", "pos_reprint_receipts"],
  "shiftRequired": true
}
```

Security requirements:

- Store only a slow hash of the PIN.
- Rate-limit attempts per employee and terminal.
- Lock account after configurable failures.
- Audit success, failure, lock, reset, and override events.
- Never return the raw PIN or store it in localStorage.

### 5.5 Start Shift

`/start-shift` collects:

```json
{
  "terminalId": "POS-Ahmedabad-01",
  "storeId": "uuid",
  "openingCash": 5000,
  "cashierId": "EMP-101"
}
```

Recommended endpoint:

```text
POST /api/shifts/open
GET  /api/shifts/active?employeeId=...&terminalId=...
```

Rules:

- Prevent two active shifts on the same terminal if policy disallows it.
- Record opening float and opening timestamp.
- Return a shift ID and register session token.
- Allow store selection only from the authenticated user's assigned stores.

## 6. Staff, PIN, Roles, Shifts, and Attendance

Primary UI: `src/components/admin/EmployeesManagement.tsx`.

### 6.1 Employee Record

Frontend model:

```json
{
  "id": "EMP-101",
  "name": "string",
  "role": "Store Manager | Shift Supervisor | Senior Cashier | Cashier | Barista | Kitchen Lead | Inventory Clerk",
  "department": "Operations | Front of House | Kitchen | Inventory & Store",
  "email": "string",
  "phone": "string",
  "assignedTerminal": "POS-Ahmedabad-01",
  "basePay": "₹22,000/mo",
  "status": "Active | On Leave | Suspended",
  "joinedDate": "YYYY-MM-DD",
  "emergencyContact": "string",
  "pinSet": true,
  "avatarColor": "#hex"
}
```

Recommended endpoints:

```text
GET    /api/staff?branchId=...
POST   /api/staff
GET    /api/staff/{employeeId}
PUT    /api/staff/{employeeId}
PATCH  /api/staff/{employeeId}/status
DELETE /api/staff/{employeeId}
```

Add staff request should validate name, role, department, phone, email, terminal assignment, and optionally set the initial PIN. Do not accept a client-generated employee ID as authoritative; generate it server-side.

### 6.2 Cashier Account

Frontend model:

```json
{
  "id": "CSH-01",
  "employeeId": "EMP-101",
  "terminalId": "POS-Ahmedabad-01",
  "pinMasked": "****",
  "maxDiscountPercent": 10,
  "canOpenDrawerNoSale": false,
  "canReprintReceipts": true,
  "shiftStatus": "On Register | On Break | Off Duty",
  "status": "Active | Locked | Suspended"
}
```

Recommended endpoints:

```text
GET  /api/staff/cashiers
PUT  /api/staff/{employeeId}/cashier-settings
POST /api/staff/{employeeId}/pin
POST /api/staff/{employeeId}/pin/reset
POST /api/staff/{employeeId}/unlock
```

PIN reset should require an authorized manager/admin permission such as `sys_reset_pins`, require a new PIN plus confirmation, invalidate current POS sessions, and write an audit record.

### 6.3 Manager Accounts

Frontend model includes title, branch, approval limit, return approval, Z-report, catalog modification, audit-log access, two-factor status, and override-PIN status.

Recommended endpoint:

```text
GET  /api/staff/managers
PUT  /api/staff/{employeeId}/manager-settings
POST /api/staff/{employeeId}/override-pin
```

### 6.4 Roles and Permissions

The UI defines these permission keys:

```text
pos_ring_sales
pos_custom_discount
pos_void_items
pos_reprint_receipts
pos_open_drawer_no_sale
ret_authorize_return
ret_issue_cash_refund
ret_override_no_receipt
inv_edit_selling_price
inv_add_products
inv_adjust_stock
inv_receive_po
rep_view_revenue
rep_view_employee_perf
rep_export_ledgers
rep_run_z_report
sys_reset_pins
sys_edit_settings
sys_view_audit_logs
```

Recommended endpoints:

```text
GET /api/roles
GET /api/roles/{role}/permissions
PUT /api/roles/{role}/permissions
GET /api/permissions
```

Authorize permissions server-side on every protected endpoint. The UI permission matrix is not a security boundary.

### 6.5 Shifts

Frontend model:

```json
{
  "id": "SH-2026-0920-1",
  "employeeId": "EMP-101",
  "employeeName": "string",
  "role": "Cashier",
  "terminalId": "POS-Ahmedabad-01",
  "date": "YYYY-MM-DD",
  "clockIn": "HH:mm",
  "clockOut": "HH:mm",
  "openingFloat": 5000,
  "expectedCash": 5200,
  "actualCash": 5190,
  "variance": -10,
  "totalTransactions": 42,
  "status": "Closed | Active / Open | Discrepancy",
  "notes": "optional"
}
```

Recommended endpoints:

```text
GET  /api/shifts
GET  /api/shifts/{shiftId}
POST /api/shifts/open
POST /api/shifts/{shiftId}/close
POST /api/shifts/{shiftId}/breaks
GET  /api/shifts/{shiftId}/reconciliation
POST /api/shifts/{shiftId}/z-report
```

Closing a shift must calculate expected cash from tenders, refunds, cash-in/out, opening float, and sales. The server must determine discrepancy; never trust a client-calculated variance.

### 6.6 Attendance

Frontend model:

```json
{
  "id": "ATT-1",
  "employeeId": "EMP-101",
  "employeeName": "string",
  "role": "Cashier",
  "date": "YYYY-MM-DD",
  "scheduledShift": "08:00 - 16:30",
  "clockInTime": "08:04",
  "clockOutTime": "16:35",
  "totalHours": 8.5,
  "overtimeHours": 0.5,
  "status": "Present | Late | Half Day | Absent | On Leave",
  "approvalStatus": "Approved | Pending Review | Flagged"
}
```

Recommended endpoints:

```text
GET  /api/attendance?from=...&to=...&employeeId=...
POST /api/attendance/clock-in
POST /api/attendance/clock-out
PUT  /api/attendance/{id}
POST /api/attendance/{id}/approve
```

Manual punch adjustment requires audit logging and an authorized permission.

## 7. Catalog and Products

Primary UI: `ProductManagement.tsx`.

Product fields used by the frontend:

```json
{
  "id": "uuid",
  "name": "Artisan Truffle Burger",
  "description": "string",
  "category": "General",
  "brand": "None / Unbranded",
  "sku": "SKU-PRD-558",
  "barcode": "890...",
  "sellingPrice": 220,
  "costPrice": 100,
  "taxRate": 5,
  "taxType": "inclusive | exclusive",
  "image": "url-or-data-reference",
  "hasVariants": false,
  "variants": [],
  "isActive": true,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

Recommended endpoints:

```text
GET    /api/products?branchId=...&search=...&categoryId=...&active=...
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
PATCH  /api/products/{id}/status
DELETE /api/products/{id}
POST   /api/products/{id}/image
GET    /api/products/{id}/variants
POST   /api/products/{id}/variants
PUT    /api/products/{id}/variants/{variantId}
DELETE /api/products/{id}/variants/{variantId}
```

Rules:

- SKU unique within organization or branch.
- Barcode unique where supplied.
- Price and cost cannot be negative.
- Tax rate must come from allowed configured rates or a validated custom policy.
- Product deletion should normally archive/deactivate when historical orders reference it.
- Store image files in object storage and return a URL; do not persist large base64 strings in product rows.

Categories and brands:

```text
GET/POST/PUT/DELETE /api/categories
GET/POST/PUT/DELETE /api/brands
```

## 8. Inventory

Primary UI: `InventoryManagement.tsx` and `ManagerInventoryScreen.tsx`.

Stock item fields:

```json
{
  "id": "uuid",
  "sku": "SKU-001",
  "name": "Coffee beans",
  "category": "Beverages",
  "location": "Main Storage",
  "inStock": 42,
  "minThreshold": 5,
  "unitCost": 100,
  "retailPrice": 220,
  "image": "url",
  "supplier": "Supplier name"
}
```

Recommended endpoints:

```text
GET  /api/inventory?branchId=...&search=...&status=...
GET  /api/inventory/{productId}
POST /api/inventory/adjustments
GET  /api/inventory/adjustments?from=...&to=...
GET  /api/inventory/low-stock
GET  /api/inventory/valuation
```

Every stock mutation must be ledger-based, not a blind overwrite:

```json
{
  "productId": "uuid",
  "variantId": "uuid-or-null",
  "quantityDelta": -2,
  "reason": "Damage | Expired | Audit Count | Internal Use | Theft/Lost | Supplier Restock",
  "notes": "string",
  "source": "manual | sale | return | purchase_order",
  "referenceId": "optional"
}
```

The server must update stock atomically and retain an immutable audit record.

## 9. Purchase Orders

Frontend purchase order model:

```json
{
  "poNumber": "PO-2026-0001",
  "supplier": "string",
  "orderDate": "YYYY-MM-DD",
  "expectedDate": "YYYY-MM-DD",
  "items": [{ "productId": "uuid", "quantity": 10, "unitCost": 100 }],
  "totalAmount": 1000,
  "status": "Received | In Transit | Pending Approval | Draft",
  "notes": "string"
}
```

Recommended endpoints:

```text
GET    /api/purchase-orders
POST   /api/purchase-orders
GET    /api/purchase-orders/{id}
PUT    /api/purchase-orders/{id}
POST   /api/purchase-orders/{id}/submit
POST   /api/purchase-orders/{id}/approve
POST   /api/purchase-orders/{id}/receive
POST   /api/purchase-orders/{id}/cancel
```

Receiving must create stock ledger entries and be idempotent.

## 10. POS Sales, Orders, Payments, Returns

Primary UI: `src/app/pos/page.tsx`.

### 10.1 Product Catalog

The current POS loads products, offers, customers, held sales, and orders from localStorage keys. Replace these reads with branch/terminal-scoped API calls.

### 10.2 Order Creation

The POS supports:

- Dine in, takeaway, delivery.
- Table section and table number.
- Guest customer or selected customer.
- Customer phone.
- Line item quantity changes.
- Line-item notes.
- Order notes and payment notes.
- Percentage discounts.
- Promo/coupon code.
- Tax calculation.
- Cash, card, UPI, and store-credit style payment methods.
- Hold sale and restore held sale.
- Save order.
- Charge payment.
- Receipt printing.

Recommended endpoints:

```text
POST /api/orders/quote
POST /api/orders
GET  /api/orders?from=...&to=...&status=...
GET  /api/orders/{id}
POST /api/orders/{id}/hold
POST /api/orders/{id}/restore
POST /api/orders/{id}/cancel
POST /api/orders/{id}/payments
POST /api/orders/{id}/refunds
GET  /api/orders/{id}/receipt
```

Order request:

```json
{
  "branchId": "uuid",
  "terminalId": "POS-Ahmedabad-01",
  "shiftId": "SH-...",
  "orderType": "dine_in | takeaway | delivery",
  "tableSection": "Main Hall",
  "tableNumber": "T-01",
  "customerId": "uuid-or-null",
  "customerName": "Guest Customer",
  "customerPhone": "string",
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid-or-null",
      "quantity": 2,
      "unitPrice": 220,
      "discountAmount": 0,
      "note": "no onions"
    }
  ],
  "discountPercent": 0,
  "promoCode": "optional",
  "orderNote": "optional",
  "paymentNote": "optional"
}
```

The server must recalculate product prices, discounts, tax, promotion eligibility, totals, and stock availability. Client totals are display-only.

Payment request:

```json
{
  "amount": 440,
  "method": "cash | card | qr_code | store_credit",
  "reference": "gateway-reference",
  "tenderedAmount": 500
}
```

Use an order/payment state machine:

```text
Draft -> Held -> Open -> PaymentPending -> Paid
Paid -> PartiallyRefunded -> Refunded
Open -> Cancelled
```

Payment operations must be idempotent using an idempotency key from the terminal.

### 10.3 Returns and Refunds

Recommended endpoints:

```text
GET  /api/returns/eligibility?orderId=...
POST /api/returns
POST /api/returns/{id}/approve
POST /api/returns/{id}/refund
```

Enforce role permission, original order validation, return quantity limits, refund method rules, and stock restocking policy.

## 11. Customers

Primary UI: `CustomersManagement.tsx` and POS customer picker.

Fields used:

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "loyaltyPoints": 0
}
```

The admin UI also supports customer search, history, feedback, and purchase-related views.

Recommended endpoints:

```text
GET    /api/customers?search=...
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}
GET    /api/customers/{id}/orders
GET    /api/customers/{id}/feedback
POST   /api/customers/{id}/feedback
```

## 12. Offers and Promotions

Primary UI: `OffersManagement.tsx`.

Offer fields used:

```json
{
  "id": "uuid",
  "title": "string",
  "code": "optional",
  "badgeText": "string",
  "discountType": "percentage | fixed_amount | promo_price",
  "discountValue": 10,
  "appliesTo": "all | category | products",
  "targetCategories": [],
  "targetProductIds": [],
  "minSubtotal": 0,
  "maxDiscount": 0,
  "startDate": "ISO timestamp",
  "endDate": "ISO timestamp",
  "isActive": true
}
```

Recommended endpoints:

```text
GET    /api/offers
POST   /api/offers
GET    /api/offers/{id}
PUT    /api/offers/{id}
PATCH  /api/offers/{id}/status
DELETE /api/offers/{id}
POST   /api/offers/validate-code
```

Promotion validation must be server-side and deterministic. Define precedence when multiple offers apply.

## 13. Dashboard and Reports

The dashboard currently reads `nuradesk_user_name`, `storeName`, `nuradesk_products`, and `nuradesk_orders` from localStorage. Replace with authenticated, branch-scoped queries.

Recommended dashboard endpoint:

```text
GET /api/dashboard/summary?branchId=...&from=...&to=...
```

Response should include:

```json
{
  "revenue": 0,
  "ordersCount": 0,
  "activeProductsCount": 0,
  "averageOrderValue": 0,
  "ordersTrend": [],
  "topProducts": [],
  "lowStockAlerts": [],
  "activeShifts": 0,
  "paymentBreakdown": []
}
```

Reports:

```text
GET /api/reports/sales
GET /api/reports/inventory
GET /api/reports/customers
GET /api/reports/performance
GET /api/reports/export?format=csv|pdf
```

All report endpoints need date range, branch, terminal, employee, and pagination/filter parameters where applicable.

## 14. Store Settings

Primary UI: `SettingsManagement.tsx`.

Settings groups exposed by the frontend:

- Store profile: name, address, city, state, pincode, phone, email, logo.
- Business settings: business type, legal/tax identity, currency, timezone.
- Tables and dining: table sections, table numbers, seating configuration.
- Tax and invoicing: tax rates, inclusive/exclusive behavior, invoice numbering.
- Payments: enabled methods, gateway configuration, merchant details.
- Hardware: terminal, printer, scanner, cash drawer, card terminal model.
- POS settings: receipt behavior, order numbering, customer requirements.
- Notifications: low stock email, end-of-day email, shift discrepancy alerts.
- Users and permissions: roles and user access.
- Security: cashier PIN enforcement, discount threshold, audit logs, 2FA.
- Appearance: theme and light/dark mode.

Recommended endpoints:

```text
GET /api/settings/store
PUT /api/settings/store
GET /api/settings/business
PUT /api/settings/business
GET /api/settings/pos
PUT /api/settings/pos
GET /api/settings/payments
PUT /api/settings/payments
GET /api/settings/hardware
PUT /api/settings/hardware
GET /api/settings/notifications
PUT /api/settings/notifications
GET /api/settings/security
PUT /api/settings/security
GET /api/audit-logs
```

Secrets such as gateway keys must never be returned to the browser after save. Return masked values and store encrypted server-side.

## 15. LocalStorage Keys to Remove During API Integration

The current browser-only persistence uses:

```text
nuradesk_products
nuradesk_orders
nuradesk_customers
nuradesk_held_sales
nuradesk_offers
nuradesk_categories
nuradesk_user_name
storeName
```

These should become a temporary offline cache only, preferably replaced by IndexedDB plus a sync queue. Never use localStorage for passwords, PINs, JWT refresh tokens, payment secrets, or authoritative inventory/order state.

## 16. Cross-Cutting Requirements

### Tenant and branch isolation

Every organization, branch, terminal, staff member, product, order, shift, and report query must enforce tenant scope from the authenticated token.

### Audit log

Record actor, role, action, entity, entity ID, branch, terminal, timestamp, IP/device, old value, and new value for:

- Login and failed login.
- PIN reset and PIN lock.
- Price/tax/catalog changes.
- Discounts, voids, returns, and refunds.
- Stock adjustments and purchase-order receiving.
- Shift open/close and cash discrepancy.
- Permission and settings changes.

### Pagination and concurrency

Use pagination for staff, orders, products, customers, shifts, and audit logs. Use optimistic concurrency/version fields for products, stock, settings, and orders.

### Error format

Use one consistent response shape:

```json
{
  "message": "Human-readable summary",
  "code": "MACHINE_READABLE_CODE",
  "errors": {
    "field": ["Validation message"]
  },
  "traceId": "request-id"
}
```

### Dates and money

- Store timestamps in UTC.
- Return ISO-8601 timestamps.
- Store money as decimal/numeric, never floating point.
- Return currency and minor-unit rules from store settings.
- Apply timezone only at presentation/report boundaries.

### Idempotency

Require an idempotency key for order creation, payments, refunds, stock mutations, purchase-order receiving, and shift closing.

### Security blockers before production

- Replace the placeholder JWT key in `Backend/appsettings.json` with environment/secret-manager configuration.
- Remove the database password from committed configuration and rotate it.
- Add authentication and authorization policies to controllers.
- Add CORS environments beyond localhost only through explicit configuration.
- Add rate limits to auth, PIN, OTP, and payment endpoints.
- Add database migrations, unique constraints, foreign keys, and transaction boundaries.

## 17. Suggested Implementation Order

1. Organization, branch, user, role, and JWT authentication.
2. Signup, email verification, login, refresh, and password reset.
3. Onboarding draft/complete APIs.
4. Staff, roles, permissions, PINs, terminals, and audit logs.
5. Products, categories, brands, and image storage.
6. Inventory ledger and purchase orders.
7. Shifts and attendance.
8. POS catalog, order quote, order creation, hold/restore, payments, and receipts.
9. Customers and offers.
10. Dashboard summaries and reports.
11. Settings and notification jobs.
12. Offline sync, reconciliation, monitoring, and production hardening.

## 18. Frontend Integration Notes

- Replace direct `localStorage` reads with a typed API client built on `apiRequest`.
- Add `Authorization: Bearer <accessToken>` to authenticated requests.
- Add a 401 refresh/logout interceptor.
- Store selected organization, branch, terminal, and shift in authenticated session state.
- Convert mock UI data to loading, empty, error, and retry states.
- Keep all totals, permissions, stock, PIN validation, and status transitions authoritative on the server.

# Nuradesk Pending Backend Requirements

> **Scope Note:** This document lists **ONLY the APIs that are currently missing from the backend**.
> The 26 core franchise owner endpoints (`/api/auth/signup`, `login`, `pos-pin/setup`, `pos-pin/verify`, `/api/franchises/*`, `/api/owner-catalog/*`, `/api/owner/sales`, `purchases`, `expenses`, `payments`, `inventory`, `daily-summaries`) are already implemented.

---

## Implementation status

Implemented today (snapshot; verify against the code before relying on this list):

- PostgreSQL via `Npgsql`, JWT authentication, and owner-scoped franchise, catalog, sales/purchase/expense, inventory, payment-mode, and summary APIs.
- Auth signup/register, login, refresh/logout, email OTP verify/resend, password recovery/reset, and owner POS PIN setup/verify. OTPs/reset tokens are held in Redis; OTPs are HMAC-hashed.
- Onboarding status, JSON draft persistence, and transactional completion that creates a franchise/store profile, payment modes, and staff.
- Employee CRUD/deactivation and PIN setup/reset; terminal registration/heartbeat/eligible employees and POS PIN login.
- Shift open/active/cash-movement/close with server cash reconciliation; customers and loyalty redemption; offers and code validation; table status/transfer.
- Product-image/receipt upload, sales-tax/profit-loss/Z/inventory-valuation reports, and store/hardware settings.
- Exception middleware, an action logging filter, IP rate limits, and Redis-backed distributed limits on sensitive auth/PIN routes.

Some report values depend on the available transactional data. Discount/refund totals are zero until those workflows are implemented, and legacy sale lines without cost snapshots use the current product cost for COGS.

The remaining endpoints below are target contracts, not a claim of implementation. The canonical architecture/layering and Redis/email configuration plan is in `BACKEND_ARCHITECTURE.md`.

The frontend API helper is `src/lib/api-client.ts` and uses:

```text
NEXT_PUBLIC_API_URL || http://localhost:5000/api
```

All other frontend features currently use component state, mock data, or `localStorage`. They must be replaced with authenticated API calls and server-side persistence.

## User Roles Reference

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

Every request must be scoped by `organizationId` and, where applicable, `branchId` and `terminalId`. Never trust these scopes from the client without checking these scopes against the authenticated user's ownership or membership.

## 1. Authentication Lifecycle & Recovery

### 1.1 Email Verification (OTP)
* **Frontend Screens:** `/verify-email`, `/verification`
* **Purpose:** Validate new owner account via 4-digit numeric code sent after signup.

#### `POST /api/auth/verify-email`
* **Auth:** Public
* **Request:**
```json
{
  "email": "owner@example.com",
  "code": "1234"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Email verified successfully.",
  "data": {
    "isVerified": true
  }
}
```
* **Validation & Errors:**
  * `400 Bad Request`: Code must be exactly 4 digits.
  * `404 Not Found`: Email not registered.
  * `409 Conflict`: Code expired (10 min TTL) or maximum attempts exceeded (limit 5).

#### `POST /api/auth/resend-verification`
* **Auth:** Public (Rate limit: 3 requests / 10 minutes)
* **Request:**
```json
{
  "email": "owner@example.com"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Verification code resent."
}
```

---

### 1.2 Password Recovery
* **Frontend Screens:** `/forgot-password`, `/forget-password`

#### `POST /api/auth/password/forgot`
* **Auth:** Public (Rate limit: 5 / 15 minutes)
* **Request:**
```json
{
  "email": "owner@example.com"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "If this email is registered, a 4-digit reset code has been sent."
}
```

#### `POST /api/auth/password/verify-code`
* **Request:**
```json
{
  "email": "owner@example.com",
  "code": "1234"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Reset code verified.",
  "data": {
    "resetToken": "opaque-single-use-token"
  }
}
```

#### `POST /api/auth/password/reset`
* **Request:**
```json
{
  "email": "owner@example.com",
  "resetToken": "opaque-single-use-token",
  "newPassword": "StrongPassword1!",
  "confirmPassword": "StrongPassword1!"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Password updated successfully. Please sign in with your new credentials."
}
```
* **Rules:** Invalidate all active refresh tokens for the user upon reset.

---

## 2. Onboarding Workflow APIs

* **Frontend Screens:** `/onboarding`, `/onboarding-2` (Business Profile), `/onboarding-3` (Store Profile), `/onboarding-4` (Staff), `/onboarding-5` (Payments & Hardware), `/onboarding-6` (Completion)
* **Purpose:** Persist setup progress so refresh or device switch does not lose onboarding state.

### `GET /api/onboarding/status`
* **Auth:** `Bearer <accessToken>`
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "isCompleted": false,
    "currentStep": 3,
    "draft": {
      "businessName": "Artisan Brews",
      "businessType": "Cafe",
      "countryCode": "IN",
      "dialCode": "+91",
      "phoneNumber": "9876543210",
      "storeName": "Main Branch",
      "storeCode": "AB-01",
      "storeAddress": "12 Market Street",
      "city": "Ahmedabad",
      "hasCashDrawer": true,
      "printerStatus": "connected"
    }
  }
}
```

### `PUT /api/onboarding/draft`
* **Auth:** `Bearer <accessToken>`
* **Request:**
```json
{
  "businessName": "Artisan Brews",
  "businessType": "Cafe",
  "countryCode": "IN",
  "dialCode": "+91",
  "phoneNumber": "9876543210",
  "storeName": "Main Branch",
  "storeCode": "AB-01",
  "storeAddress": "12 Market Street",
  "city": "Ahmedabad",
  "staff": [
    {
      "name": "Amit Sharma",
      "employeeId": "EMP-01",
      "role": "Cashier",
      "phone": "9876500001"
    }
  ],
  "paymentMethods": {
    "cash": true,
    "card": true,
    "upi": true
  },
  "hasCashDrawer": true,
  "printerStatus": "connected"
}
```

### `POST /api/onboarding/complete`
* **Auth:** `Bearer <accessToken>`
* **Response (200 OK):** Creates the primary franchise, provisions payment modes, registers staff, and marks onboarding completed.

---

## 3. Staff & Employee Management

* **Frontend Screens:** `/onboarding-4`, `/dashboard` (Staff tab)
* **Roles:** `Admin`, `Store Manager`, `Shift Supervisor`, `Cashier`, `Barista`, `Inventory Clerk`

### `GET /api/employees`
* **Auth:** `Bearer <verifiedToken>` (Owner or Admin)
* **Query:** `?franchiseId=1`
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 101,
      "franchiseId": 1,
      "employeeCode": "EMP-101",
      "name": "Priya Patel",
      "role": "Cashier",
      "phone": "9876501234",
      "email": "priya@example.com",
      "isActive": true,
      "pinConfigured": true,
      "createdAt": "2026-10-10T09:00:00Z"
    }
  ]
}
```

### `POST /api/employees`
* **Request:**
```json
{
  "franchiseId": 1,
  "employeeCode": "EMP-102",
  "name": "Rahul Verma",
  "role": "Barista",
  "phone": "9876501235",
  "email": "rahul@example.com",
  "initialPin": "4321"
}
```
* **Validation:** `employeeCode` must be unique per franchise. PIN hashed before storage.

### `PUT /api/employees/{id}`
* Update name, role, phone, active status.

### `DELETE /api/employees/{id}`
* Soft-deactivates staff member.

### `PUT /api/employees/{id}/reset-pin`
* Owner/manager sets new temporary 4-digit PIN for staff.

---

## 4. POS Terminal Hardware & Device Pairing

* **Frontend Screens:** `/pos-connect`, `/pos-store-found`, `/pos-login-3`, `/pos-login-2`
* **Purpose:** Link POS registers/tablets to specific branches with fast staff PIN login.

### `POST /api/terminals/register`
* **Request:**
```json
{
  "franchiseId": 1,
  "terminalCode": "REG-01",
  "deviceName": "iPad Counter 1",
  "platform": "iPadOS / Chrome",
  "hardwareIdentifier": "MAC-or-UUID"
}
```

### `POST /api/terminals/{terminalId}/heartbeat`
* Registers device as online, reporting app version, battery %, and peripheral status.

### `GET /api/terminals/{terminalId}/eligible-employees`
* **Purpose:** Powers `/pos-login-3` avatar employee selection grid.
* Returns list of active staff assigned to this terminal's store.

### `POST /api/pos/auth/pin`
* **Frontend Screen:** `/pos-login-2` (Keypad PIN screen)
* **Request:**
```json
{
  "terminalId": "REG-01",
  "employeeId": 101,
  "pin": "1234"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "posSessionToken": "jwt-token-with-employee-role",
    "employee": {
      "id": 101,
      "name": "Priya Patel",
      "role": "Cashier"
    },
    "shiftRequired": true
  }
}
```

---

## 5. Register Shift & Cash Drawer Management

* **Frontend Screens:** `/start-shift`, `/pos-start-shift`, `/pos` (Action Menu $\rightarrow$ End Shift)

### `POST /api/shifts/open`
* **Request:**
```json
{
  "terminalId": "REG-01",
  "franchiseId": 1,
  "openingFloat": 5000.00,
  "cashierId": 101,
  "notes": "Morning float verified"
}
```
* **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "shiftId": "SH-2026-0042",
    "openedAt": "2026-10-17T08:00:00Z",
    "status": "OPEN",
    "openingFloat": 5000.00
  }
}
```

### `GET /api/shifts/active`
* Returns current open shift for terminal or cashier.

### `POST /api/shifts/cash-movement`
* **Purpose:** Record drawer Pay-In / Pay-Out (e.g. buying milk or vendor payout).
* **Request:**
```json
{
  "shiftId": "SH-2026-0042",
  "type": "PAY_OUT",
  "amount": 250.00,
  "reason": "Milk supply emergency purchase"
}
```

### `POST /api/shifts/close`
* **Request:**
```json
{
  "shiftId": "SH-2026-0042",
  "closingCashActual": 18450.00,
  "notes": "Drawer balanced cleanly"
}
```
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "shiftId": "SH-2026-0042",
    "expectedCash": 18450.00,
    "actualCash": 18450.00,
    "cashDifference": 0.00,
    "totalSales": 24800.00,
    "cardTotal": 8200.00,
    "upiTotal": 3150.00,
    "cashTotal": 13450.00,
    "zReportGenerated": true
  }
}
```

---

## 6. Customer CRM & Loyalty Ledger

* **Frontend Screens:** `/pos` (Customer picker modal), `/dashboard` (Customer list)

### `GET /api/customers`
* **Query:** `?search=9876` or `?name=Sharma`
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 501,
      "name": "Arjun Mehta",
      "phone": "9876540001",
      "email": "arjun@example.com",
      "loyaltyPoints": 420,
      "totalSpent": 8450.00,
      "totalVisits": 18
    }
  ]
}
```

### `POST /api/customers`
* Create customer profile with name, phone, optional email, address.

### `POST /api/customers/{id}/loyalty/redeem`
* **Request:** `{ "points": 100, "saleSubtotal": 500 }`
* **Response:** `{ "discountAmount": 100, "remainingPoints": 320 }`

---

## 7. Promotions, Offers & Discount Rules

* **Frontend Screens:** `/pos` (Store Offers sidebar & Promo Code popup)

### `GET /api/offers`
* Returns active store discounts (`percentage`, `fixed_amount`, `promo_price`) with validity dates and applicable category/product IDs.

### `POST /api/offers`
* Create promotional offer:
```json
{
  "title": "Happy Hours 20% Off",
  "badgeText": "HAPPY20",
  "discountType": "percentage",
  "discountValue": 20,
  "appliesTo": "category",
  "targetCategories": ["Coffee", "Beverages"],
  "minSubtotal": 200,
  "startDate": "2026-10-01",
  "endDate": "2026-10-31",
  "isActive": true
}
```

### `POST /api/discounts/validate-code`
* Validates voucher/coupon entered by cashier on checkout.

---

## 8. Dine-In Table Management

* **Frontend Screen:** `/pos` (Dine-in selector: Main Hall, AC Hall, Garden, Rooftop)

### `GET /api/tables`
* **Query:** `?franchiseId=1`
* **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "tableNumber": "T-01",
      "section": "Main Hall",
      "capacity": 4,
      "status": "VACANT",
      "activeOrderId": null
    },
    {
      "id": 2,
      "tableNumber": "T-02",
      "section": "Main Hall",
      "capacity": 2,
      "status": "OCCUPIED",
      "activeOrderId": "ORD-108"
    }
  ]
}
```

### `POST /api/tables`
* Add new table with table number, section, and seat capacity.

### `PUT /api/tables/{id}/status`
* Status values: `VACANT`, `OCCUPIED`, `RESERVED`, `BILLED`.

### `POST /api/tables/{id}/transfer`
* Transfer open order items from Table A to Table B.

---

## 9. Media & File Uploads

* **Frontend Screens:** Product creation image picker, expense receipt attachment.

### `POST /api/upload/product-image`
* **Content-Type:** `multipart/form-data`
* **Payload:** File image (JPEG/PNG/WebP, max 5MB).
* **Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "url": "https://cdn.example.com/products/prod_101.webp"
  }
}
```

### `POST /api/upload/receipt`
* **Content-Type:** `multipart/form-data`
* **Payload:** File image/PDF for expense receipt proof.

---

## 10. Financial Reports & Detailed Analytics

* **Frontend Screens:** `/dashboard` (Reports tab)

### `GET /api/reports/sales-tax`
* Tax breakdown by GST/VAT slabs: 0%, 5%, 12%, 18%, 28% for sales and purchases over date range.

### `GET /api/reports/profit-loss`
* Calculates:
  * Gross Sales
  * Discounts & Refunds
  * Net Sales
  * Cost of Goods Sold (COGS)
  * Operating Expenses
  * Net Operating Profit

### `GET /api/reports/z-report`
* Historical printable Z-Reports per register shift.

### `GET /api/reports/inventory-valuation`
* Stock on hand valuation (`quantity * costPrice`), low-stock warnings, and reorder levels.

---

## 11. Store & Peripheral Hardware Configuration

* **Frontend Screens:** Settings $\rightarrow$ Store Profile & Peripheral Hardware

### `GET /api/settings/store` & `PUT /api/settings/store`
* Configures:
  * Currency code (`INR`, `USD`) and symbol (`₹`, `$`)
  * Default tax rate & tax inclusive/exclusive toggle
  * Invoice header title, GSTIN/Tax ID, receipt footer message
  * Rounding rule (none, round to nearest 1, 0.50)

### `GET /api/settings/hardware` & `PUT /api/settings/hardware`
* Configures:
  * Network/Bluetooth receipt printer IP port and character width (80mm vs 58mm)
  * Cash drawer kick impulse command code
  * Barcode scanner continuous read mode

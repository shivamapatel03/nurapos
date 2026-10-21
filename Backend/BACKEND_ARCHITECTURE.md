# Nurapos backend architecture

This document describes the target architecture and configuration for the Nurapos ASP.NET Core API. The domain status is tracked in `BACKEND_REQUIREMENTS.md`; each module is implemented and extended in separate vertical slices.

## Existing application

The project is a single ASP.NET Core Web API using PostgreSQL through Npgsql. It currently has controllers/services/repositories for authentication, franchises, owner catalog, and owner operations. Keep it as a modular monolith while building the remaining capabilities; split into separately deployed services only when scale or team ownership requires it.

```text
HTTP Controllers -> Application Services -> Repositories / Providers
                                             |-> PostgreSQL (durable business data)
                                             |-> Redis (short-lived OTPs, counters, cache)
                                             |-> SMTP provider (verification/reset email)
                                             |-> Object storage (images/receipts)
```

Controllers handle HTTP binding and response codes. Services enforce business rules and authorization. Repositories own SQL and transactions. Provider interfaces keep Redis, SMTP, and object storage replaceable. DTOs define the public API; do not expose database models directly.

The current implementation uses these layers for auth and recovery, onboarding, employees, terminals/POS PIN, shifts, customers/loyalty, offers, tables, uploads, reports, and store/hardware settings. The existing owner catalog and operations modules continue to handle products, inventory, sales, purchases, and expenses.

## Configuration and secrets

Use typed options (`JwtOptions`, `RedisOptions`, and `MailOptions`) bound from configuration. `appsettings.json` should contain non-secret defaults or empty placeholders only. Supply real values through environment variables or the host's secret manager, with ASP.NET Core's `__` nesting convention:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Redis__ConnectionString
Mail__Host
Mail__Port
Mail__Username
Mail__Password
Mail__FromAddress
Mail__UseStartTls
```

Do not commit production database, JWT, SMTP, or Redis credentials in `appsettings*.json`. The current `appsettings.json` contains a populated PostgreSQL connection string; treat it as exposed, rotate that database credential, and move it to deployment secrets. SMTP credentials shared in configuration should also be rotated and moved to deployment secrets. The JWT placeholder must be replaced by a strong secret outside source control.

Example shape for local non-secret configuration:

```json
{
  "Redis": { "InstanceName": "nurapos:", "OtpTtlMinutes": 10, "MaxOtpAttempts": 5 },
  "Mail": { "Port": 587, "FromAddress": "", "UseStartTls": true }
}
```

## Redis OTP and email flow

Use Redis for ephemeral verification and password-reset state, not as the source of truth for users or business records. A key can be namespaced by purpose and normalized email, for example `nurapos:otp:verify:{email}` and `nurapos:otp:reset:{email}`. Store an HMAC/hash of the four-digit code rather than the raw code, plus attempt count and any transaction identifier. Set a 10-minute expiry atomically; invalidate/replace the prior code on resend and delete it after successful verification. Limit guesses to five and rate-limit resend and forgot-password requests by IP and account. Avoid revealing account existence in password recovery responses.

Send email through an `IEmailSender` SMTP/provider adapter using credentials from secret configuration. Generate the OTP with a cryptographic random generator. Do not log codes, reset tokens, SMTP passwords, or Redis connection strings. The reset verification step should mint a cryptographically random opaque single-use token; store only its hash in Redis with a short expiry. On password reset, update the password and revoke all refresh tokens in one PostgreSQL transaction, then consume the token. Email delivery failure should return a generic public response and record a safe operational error.

For a free hosted Redis, verify its TLS URL, authentication format, connection limits, memory/eviction policy, and data retention. OTPs may disappear on eviction/restart, so the application must handle a missing key as expired and allow a rate-limited resend. Use Redis for distributed rate-limit counters too; the existing ASP.NET rate limiter is process-local and does not coordinate across multiple API instances. Keep database-backed refresh-token revocation authoritative.

## Domain modules and endpoint ownership

Keep each domain in its own controller, DTO, service/interface, repository/interface, and PostgreSQL schema/tables. Every query and mutation must be scoped by the authenticated organization/franchise and branch; never authorize using an untrusted ID in the request body alone.

| Module | Core responsibility and route groups |
|---|---|
| Auth | Signup, email verification/resend, login/refresh/logout, forgot/verify/reset password, POS PIN. `/api/auth/*` |
| Onboarding | Persist owner business/store/staff/payment/hardware draft and finalize atomically. `/api/onboarding/*` |
| Organization and stores | Business profile, franchise/store ownership, membership, tenant scoping. `/api/franchises/*`, `/api/settings/store` |
| Staff and access | Employee lifecycle, hashed PINs, role/permission management, audit events. `/api/employees/*`, `/api/roles/*` |
| Terminals and POS access | Pair/register terminals, heartbeat, eligible employees, PIN sessions. `/api/terminals/*`, `/api/pos/auth/*` |
| Shifts and cash drawer | Open/close shift, pay-in/out ledger, reconciliation and Z report. `/api/shifts/*` |
| Customers and loyalty | Customer search/profile and transactional points ledger. `/api/customers/*` |
| Offers and discounts | Offers, applicability, validity, and server-side coupon validation. `/api/offers/*`, `/api/discounts/*` |
| Tables and orders | Table state/transfer plus order quote, hold, payment, refund and receipt. `/api/tables/*`, `/api/orders/*` |
| Catalog and inventory | Products, variants, categories, stock ledger, adjustments and valuation. `/api/products/*`, `/api/inventory/*` |
| Purchases and expenses | Purchase orders, receiving, expenses, receipts, supplier records. `/api/purchase-orders/*`, `/api/expenses/*` |
| Uploads | Validate file type/size, store in object storage, persist metadata/URL. `/api/upload/*` |
| Reports and settings | Tax/P&L/shift/inventory reports; store and peripheral configuration. `/api/reports/*`, `/api/settings/*` |

Use PostgreSQL transactions for coupled durable changes: onboarding completion, shift close/reconciliation, order payment/refund, loyalty redemption, purchase receiving with stock ledger, and password change with refresh-token revocation. Use idempotency keys for payment, receiving, and other retryable operations. Never accept client-calculated totals, cash variance, role permissions, or stock balances as authoritative.

## Suggested implementation sequence

1. Harden configuration and migrations; define tenant, user verification, organization/store, and refresh-token data model.
2. Complete auth lifecycle with Redis OTP storage, email adapter, verification gates, password reset, and distributed throttling.
3. Implement onboarding persistence and organization/branch membership; apply tenant authorization consistently.
4. Add employees/roles, terminal pairing/PIN login, and audit trail.
5. Add shifts, cash movements, orders/payments, tables, customers/loyalty, offers, and settings.
6. Add catalog/inventory/purchases/expenses, uploads, and reports after the transactional source data exists.
7. Connect frontend features to the APIs and then add integration coverage and deployment configuration.

The pasted frontend spec and `BACKEND_REQUIREMENTS.md` are product/API inputs. Implement and review one domain slice at a time; the architecture above is not a claim that all listed endpoints already exist.

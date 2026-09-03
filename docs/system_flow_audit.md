# HUGPONG — Canonical System Architecture & Traffic Routing Matrix

## 1. Authoritative Architecture Definition

The HUGPONG platform operates on a **Single Canonical Persistence Layer** backed by **Google Cloud Firestore**, with an **Express Backend API Gateway** serving as the authoritative application logic, RBAC, and validation layer.

```
                    ┌───────────────────────────────┐
                    │        CLOUD FIRESTORE        │
                    │   CANONICAL MASTER DATABASE   │
                    │   (Project: hugpong-ff)       │
                    │  Collections: block_farms,    │
                    │  fields, operation_logs,      │
                    │  sra_prices, support_tickets, │
                    │  users                        │
                    └───────────────┬───────────────┘
                                    │ (Privileged Admin SDK)
                    ┌───────────────▼───────────────┐
                    │      EXPRESS BACKEND API      │
                    │   BUSINESS / RBAC / AUDIT     │
                    │   • Session Guard & RBAC      │
                    │   • Log Certification         │
                    │   • Outbox Validation & Write │
                    └───────┬───────────────┬───────┘
                            │               │
         REST / Session API │               │ REST / Session API
                            ▼               ▼
                      ┌───────────┐   ┌───────────┐
                      │    WEB    │   │  MOBILE   │
                      │ DASHBOARDS│   │REACT NAT. │
                      └─────┬─────┘   └─────┬─────┘
                            │               │
                   localStorage             AsyncStorage
                   Persistent Cache         Local Database Driver
                                            │
                                            ▼
                                       OUTBOX QUEUE
                                       (FIFO Offline Storage)
```

---

## 2. Operation Routing Matrix: Direct Firestore vs. Express API

| Operation Category | Specific Endpoint / Channel | Transport Path | Justification & Responsibility |
| :--- | :--- | :--- | :--- |
| **Authentication & Registration** | `POST /auth/login`<br>`POST /auth/register`<br>`GET /auth/me` | **Express Backend API** | Enforces password verification, role scoping, 8-digit ID generation, and session cookie issuance. |
| **Price Publication (SRA Admin)** | `POST /api/prices` | **Express Backend API** | Verifies `SRA (Admin)` role, validates numeric pricing bounds, generates official circular metadata. |
| **Field & Block Farm Creation** | `POST /api/fields`<br>`POST /api/block-farms` | **Express Backend API** | Verifies `Farm Manager` / `Admin` role, checks boundary and hectarage constraints. |
| **Operation Log Certification** | `POST /api/logs/certify` | **Express Backend API** | Verifies `Farm Manager` or `SRA Admin` role, immutably stamps certification officer and timestamp. |
| **Live Price Stream** | `collection('sra_prices')` | **Direct Firestore (`onSnapshot`)** | Reactive broadcast to all active mobile farmer and web consumers after Firestore synchronization. |
| **Live Field & Block Farm Stream** | `collection('fields')`<br>`collection('block_farms')` | **Direct Firestore (`onSnapshot`)** | Real-time reactive updates when plot stages or block farm allocations change. |
| **Live Operations Audit Stream** | `collection('operation_logs')` | **Direct Firestore (`onSnapshot`)** | Real-time operational visibility across supervisory dashboards. |
| **Offline Outbox Flush** | `flushOutboxToFirestore()` / `POST /api/logs` | **Sync Engine $\rightarrow$ Firestore / Express** | FIFO idempotent write with monotonic stage conflict resolution (`resolveStageConflict`). |

---

## 3. Data Flow Guarantees

1. **No Competing Master Stores**: Cloud Firestore is the sole master database. The Express backend uses `firebase-admin` to read and write directly to Cloud Firestore.
2. **Deterministic In-Memory State**: Web and Mobile in-memory stores (`db` and `dataStore.js`) reflect real-time Firestore snapshots.
3. **Cold-Boot Persistence**: `AsyncStorage` and `localStorage` act as read caches for instantaneous startup before cloud listeners attach.

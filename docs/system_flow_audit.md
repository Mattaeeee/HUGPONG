# HUGPONG System Flow Audit

## Architecture Overview

```
Mobile App (React Native)  ◄──── Firestore (hugpong-ff) ────►  Admin Web (dashboard.html)
         │                        Real-time listeners                       │
         │ AsyncStorage (offline)                          localStorage (hugpong_db)
         │ Outbox Queue                                    + Firestore sync on write
```

**Shared Firestore Collections:** `fields`, `sra_prices`, `operation_logs`, `support_tickets`

---

## What IS Connected (Mobile ↔ Admin)

Both sides share **the same Firebase project: `hugpong-ff`** and communicate via Firestore.

| Collection | Mobile Reads | Mobile Writes | Admin Reads | Admin Writes |
|---|---|---|---|---|
| `sra_prices` | ✅ `listenToCloudSync()` | ❌ Not implemented | ✅ `initFirestoreRealtimeSync()` | ✅ `syncLocalChangesToFirestore()` |
| `fields` | ✅ `listenToCloudSync()` | ✅ `flushOutboxToFirestore()` | ✅ `initFirestoreRealtimeSync()` | ✅ `syncLocalChangesToFirestore()` |
| `operation_logs` | ❌ Not reading | ✅ `flushOutboxToFirestore()` | ✅ `initFirestoreRealtimeSync()` | ❌ Not writing |
| `support_tickets` | ❌ Local only | ❌ Outbox path broken | ❌ localStorage only | ❌ |

**Price flow works:** Admin posts price → `syncLocalChangesToFirestore()` → Firestore → Mobile `onSnapshot` updates live ✅

**Field/log flow works:** Mobile logs operation → `flushOutboxToFirestore()` → Firestore → Admin `onSnapshot` merges in ✅

---

## Loopholes & Issues Found

### 1. CRITICAL — Mobile login is 100% offline mock (no real auth)
**File:** [`LoginScreen.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/screens/auth/LoginScreen.js) → [`mockData.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/data/mockData.js) L79

- `authenticateUser()` checks against a **hardcoded in-memory** `REGISTERED_USERS` dictionary.
- Firebase `auth` IS initialized in [`firebase/config.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/firebase/config.js) but is **never used**.
- Registered users exist only in memory — they disappear on app restart.
- Anyone can register and instantly get access — no server-side validation.

### 2. CRITICAL — Admin login has NO password check
**File:** [`login.html`](file:///c:/Users/Matt/Documents/HUGPONG/admin/login.html) L163–201

- The form handler only looks up a contact in `localStorage` — if not found, still redirects to dashboard.
- **Password field is never verified.** Any contact number grants access.
- `dashboard.html` has no session guard — can be accessed directly by URL.
- Quick-fill buttons hardcode `'hugpong2026'` but the value is never compared.

### 3. HIGH — Admin does NOT sync logs back to Firestore
**File:** [`admin.js`](file:///c:/Users/Matt/Documents/HUGPONG/admin/admin.js) L527–548

`syncLocalChangesToFirestore()` only pushes **fields** and **priceHistory** to Firestore.

- Log certifications, assignment approvals, user changes — stay in `localStorage` only.
- Mobile can never receive admin decisions via Firestore.

### 4. HIGH — Support tickets are completely disconnected
- Mobile `submitSupportTicket()` in [`mockData.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/data/mockData.js) L829 pushes to local `MOCK_TICKETS` only.
- [`syncEngine.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/services/syncEngine.js) L212 has a `type === 'ticket'` path to Firestore, but `submitSupportTicket()` **never enqueues to the outbox**.
- Admin stores tickets in `localStorage` only — no Firestore `support_tickets` listener.
- **Result: Tickets filed on mobile never reach the admin panel.**

### 5. MEDIUM — The "Sync Now" button is fake
**File:** [`mockData.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/data/mockData.js) L204–228

```js
await processOutbox(async (item) => {
  return true; // Simulated — no real upload
});
```

- `performMobileSync()` uses a fake handler that always returns `true` without uploading.
- `flushOutboxToFirestore()` is the real Firestore uploader but is **not called** by any sync button.

### 6. MEDIUM — Mobile user registration is not persisted
**File:** [`mockData.js`](file:///c:/Users/Matt/Documents/HUGPONG/mobile/src/data/mockData.js) L93–111

`registerUser()` updates an in-memory object and session — never writes to Firestore or AsyncStorage. New accounts vanish on restart.

### 7. LOW — `server.js` is a completely orphaned REST server
**File:** [`server.js`](file:///c:/Users/Matt/Documents/HUGPONG/server.js)

Provides `/api/data`, `/api/sync`, `/api/price`, `/api/task` but **neither mobile nor admin calls any of these endpoints**. Both talk directly to Firestore.

### 8. LOW — Firebase config duplicated in login.html
[`login.html`](file:///c:/Users/Matt/Documents/HUGPONG/admin/login.html) L204–223 inlines its own `initializeApp()` separately from [`firebaseConfig.js`](file:///c:/Users/Matt/Documents/HUGPONG/admin/firebaseConfig.js) — results in two Firebase app instances per browser session (harmless but redundant).

---

## Summary

| # | Issue | Severity | Impact |
|---|---|---|---|
| 1 | Mobile auth is hardcoded mock | 🔴 Critical | Any user can log in; no real identity |
| 2 | Admin login has no password check | 🔴 Critical | Anyone can access admin dashboard |
| 3 | Admin log/assignment changes never reach Firestore | 🟠 High | Mobile never receives admin decisions |
| 4 | Support tickets disconnected mobile→admin | 🟠 High | Tickets are invisible to admin |
| 5 | Sync button uses fake handler | 🟡 Medium | Outbox never really flushes on demand |
| 6 | Mobile registrations lost on restart | 🟡 Medium | New accounts not persisted |
| 7 | server.js completely unused | 🟢 Low | Dead code |
| 8 | Duplicate Firebase init in login.html | 🟢 Low | Minor redundancy |

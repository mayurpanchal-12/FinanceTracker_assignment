# Advanced Finance Tracker — Finance Dashboard UI

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-green?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![GitHub](https://img.shields.io/badge/GitHub-Repo-black?logo=github)
![Vercel](https://img.shields.io/badge/Vercel-Live-black?logo=vercel)

---

> A production-grade personal finance dashboard built with React 18, Context API, and TailwindCSS v4. Fully client-side — no backend, no API keys, no external dependencies. All data lives in `localStorage`.

---

## 🔗 Links

| | |
|---|---|
| **Live Demo** | [finance-tracker-reactjs-sandy.vercel.app](https://finance-tracker-assignment-wiu5.vercel.app/) |
| **Repository** | [github.com/mayurpanchal-12/FinanceTracker_Reactjs](https://github.com/mayurpanchal-12/FinanceTracker_assignment) |

---

## 📋 Assignment Requirements — Coverage Map

| Requirement | Implementation |
|---|---|
| Dashboard overview with summary cards | ✅ Total Balance, Income, Expenses — live-computed via `useMemo` |
| Time-based visualization | ✅ Line chart — balance trend over time (Chart.js) |
| Categorical visualization | ✅ Pie charts — income vs expense breakdown by category |
| Transactions list with date, amount, category, type | ✅ Full table with running balance column |
| Filtering and search | ✅ Month, type, category, and keyword filters — combined logic |
| Role-based UI (Admin / Viewer) | ✅ Simulated via `AuthContext` — toggle in header, persisted to `localStorage` |
| Insights section | ✅ Highest spending category, monthly comparison, savings rate, smart observation banner |
| State management | ✅ Context API + `useReducer` — transactions, filters, role, budget |
| Responsive design | ✅ Mobile-first TailwindCSS layout, works from 320px to desktop |
| Empty / no-data handling | ✅ Empty states across all pages — notes, charts, insights, transactions |
| Data persistence | ✅ `localStorage` sync — survives page refresh, no backend needed |
| Export functionality | ✅ CSV and PDF export via `DownloadDropdown` |
| Dark mode | ✅ Theme toggle — persisted to `localStorage` |
| Animations / transitions | ✅ Skeleton loaders, fade-in page transitions, button states |
| Scheduled / future transactions | ✅ Auto-promote to main tracker on their due date |
| Error handling | ✅ ErrorBoundary + 404 wildcard route |

---

## 🚀 Getting Started

```bash
git clone https://github.com/mayurpanchal-12/FinanceTracker_Reactjs.git
cd FinanceTracker_Reactjs
npm install
npm run dev
```

> Open [http://localhost:5173](http://localhost:5173) in your browser.

No environment variables or API keys required. The app is fully self-contained.

---

## 🧭 Navigation

| Route | Page | Access |
|---|---|---|
| `/` | Tracker (Home) | All roles |
| `/set-transaction` | Add Transaction | Admin only |
| `/charts` | Charts & Analytics | All roles |
| `/notes` | Transaction Notes | All roles |
| `/budget` | Budget Tracker | All roles |
| `/insights` | Insights | All roles |
| `/*` | 404 Wildcard | — |

---

## 🧩 Feature Breakdown

### 1. Dashboard Overview

The home page (`HomePage.jsx`) is the main dashboard:

- **Summary cards** — Total Balance, Total Income, Total Expenses, computed live with `useMemo` on every filter or transaction change.
- **Running balance column** — Each row shows a rolling balance recalculated on filter change via `useMemo`.
- **Budget summary strip** — Compact strip showing per-category budget usage at a glance (`Budgetsummarystrip.jsx`).

---

### 2. Transactions Section

- Full transaction table (`TransactionTable.jsx`) with Date, Description, Category, Type, Amount, Balance, and Notes columns.
- **Combined filter logic** — Month picker, type toggle (income/expense), category dropdown, and keyword search all apply simultaneously (`filterUtils.js`).
- **Edit and delete** — Available to Admin role only. Edit opens a modal (`EditTransactionModal.jsx`).
- **Scheduled transactions** — Future-dated entries sit in a separate table and auto-promote to the main tracker on their scheduled date — no manual action required.

---

### 3. Role-Based UI

Implemented via `AuthContext.jsx` with a `RoleSwitcher` toggle in the header:

- **Admin** — Full access: can add, edit, and delete transactions. The "Set Transaction" page and all edit/delete controls are visible.
- **Viewer** — Read-only: form, edit, and delete controls are hidden. `ProtectedRoute.jsx` enforces route-level protection.
- Role is persisted to `localStorage` so it survives refresh.
- Switch roles at any time using the Admin / Viewer toggle in the top navigation bar.

---

### 4. Insights Section

`InsightsPage.jsx` surfaces five data-driven cards:

- **Highest spending category** — top expense category by total amount.
- **Savings rate** — this month's income vs expenses as a percentage, with a colour-coded progress bar.
- **Most active day** — day of the week with the highest transaction count.
- **Biggest single expense / income** — largest individual transactions with category and date.
- **All-time summary** — total earned, total spent, net worth.
- **Monthly comparison** — bar comparison of income vs expenses across recent months (`Monthlycomparison.jsx`).
- **Smart observation banner** — context-aware message surfacing patterns like overspending in a category (`SmartObservationBanner.jsx`).

---

### 5. State Management

| Concern | Approach |
|---|---|
| Transactions + filters | `Context API + useReducer` (`TransactionContext.jsx`) |
| Budget data | `Context API + useReducer` (`BudgetContext.jsx`) |
| Auth / role | `Context API + useState` (`AuthContext.jsx`) |
| Persistence | All key state synced to `localStorage` via `storage.js` utils |

No Redux or external state library — Context API with two reducers cleanly handles this scale while keeping the bundle lightweight.

---

### 6. Charts & Analytics

`ChartPage.jsx` renders three Chart.js visualizations:

- **Line chart** — balance trend over time (time-based).
- **Income pie chart** — breakdown of income by category.
- **Expense pie chart** — breakdown of expenses by category.

All chart data is derived from live transaction state via `chartData.js` utilities.

---

### 7. Budget Tracker

`BudgetPage.jsx` with `BudgetContext`:

- Set per-category monthly spending limits.
- Visual progress bars show actual vs budgeted spend (`Budgetindicators.jsx`).
- Category list with inline usage percentages (`Budgetcategorylist.jsx`).

---

### 8. Export

`DownloadDropdown.jsx` provides two export formats:

- **CSV** — all visible (filtered) transactions as a `.csv` file.
- **PDF** — formatted PDF report generated client-side via `pdf.js`.

---

## 🗄️ localStorage — What Gets Persisted

| Key | Data |
|---|---|
| `finance_tracker_transactions` | All transactions (main + scheduled) |
| `finance_tracker_filters` | Active filter state (month, type, category, search) |
| `finance_tracker_budgets` | Per-category budget limits |
| `demo_role` | Current role (admin / viewer) |
| `theme` | Dark / light mode preference |

No API keys. No backend. Everything is local.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Hooks, `lazy`, `Suspense`) |
| Routing | React Router DOM v6 (`createBrowserRouter`, `errorElement`) |
| State | Context API + `useReducer` (no Redux) |
| Styling | TailwindCSS v4 + custom CSS variables + `@layer` |
| Charts | Chart.js |
| Build tool | Vite |
| Persistence | `localStorage` |
| Voice input | Browser Speech API (`useSpeechInput` hook) |
| Export | Custom CSV + PDF utilities |

---

## ⚙️ Key Engineering Decisions

**React.lazy + Suspense** — every page is code-split with a `PageLoader` skeleton fallback. Only the active route's bundle loads, keeping initial load fast.

**withEB wrapper** — a single `withEB()` helper in `App.jsx` wraps every route element in both `ErrorBoundary` and `Suspense`, keeping the router config clean and DRY.

**Error Boundary** — `ErrorBoundry.jsx` wraps all pages. If an unexpected JS error is thrown during render, the user sees a fallback UI instead of a blank screen.

**useMemo for derived data** — running balance, filtered transactions, and chart datasets are all memoized so they only recalculate when their actual dependencies change.

**localStorage sync** — state is persisted on every dispatch using utility helpers in `storage.js`, ensuring no data loss on refresh with zero backend.

**`en-IN` locale formatting** — amounts are formatted using Indian number notation (`toLocaleString('en-IN')`), a deliberate localisation choice.

---

## 🛡️ Error Handling Strategy

```
Any page render → unexpected JS error → ErrorBoundary → fallback UI   ✅
/unknown-path   → no matching route   → wildcard (*)  → 404 page      ✅
/notes          → no transactions with notes           → empty state   ✅
/insights       → no transactions                      → empty state   ✅
Charts          → no data                              → empty state   ✅
```

---


---

## ✨ Optional Enhancements Implemented

-  **Dark mode** — theme toggle, persisted to `localStorage`
-  **Data persistence** — full `localStorage` sync across all state slices
-  **Export functionality** — CSV and PDF
- **Animations / transitions** — skeleton loaders, fade-in page transitions
- **Voice input** — `useSpeechInput` hook using Browser Speech API
-  **Advanced filtering** — combined month + type + category + keyword

---

## 🙋 Notes for Evaluators

- No setup beyond `npm install && npm run dev` — no API keys, no `.env` file needed.
- To test **role switching**, use the Admin / Viewer toggle in the top navigation bar.
- To test **scheduled transactions**, add a transaction with tomorrow's date — it auto-promotes when that date arrives.
- To test **export**, apply any filter on the home page then use the Download dropdown for CSV or PDF.
- To test **empty states**, clear all transactions — the app handles zero-data gracefully on every page.
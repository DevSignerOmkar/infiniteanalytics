# FluxInvoice — Premium Invoicing Platform

A production-ready, single-page invoicing SaaS app built with React. Create, manage, and track invoices from a beautiful dashboard — no backend required.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
git clone <repo-url>
cd invoicing-platform
npm install
npm start          # Opens http://localhost:3000 with hot reload
```

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Tests in watch mode |

### Deploy to Vercel

1. Push to GitHub, import in Vercel
2. Build: `npm run build`, Output: `dist`
3. Add `vercel.json` for SPA fallback:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Tech Stack

| Technology | What it's used for | Why it was chosen |
|------------|-------------------|-------------------|
| **React 18** | UI components, hooks, declarative rendering | Component model, rich ecosystem, hooks API |
| **Redux Toolkit** | State management (invoices, filters, loading) | Centralized store, `createAsyncThunk` for async flows, minimal boilerplate |
| **React Router v6** | Client-side routing (7 routes) | `<NavLink>` active styling, `useNavigate`, SPA routing |
| **Tailwind CSS 3** | Styling and design system | Utility-first, custom theme with 55 colors, zero runtime, dark mode support |
| **Webpack 5** | Module bundling, dev server, HMR | `HtmlWebpackPlugin`, content hashing, hot module replacement |
| **Babel** | JSX/ES6+ transpilation | New JSX transform (no `import React`), browser compatibility |
| **Jest + Testing Library** | Unit testing | 13 tests, 95% statement coverage |

---

## Features

### Dashboard (`/`)
- 4 KPI cards (Total Revenue, Paid Invoices, Outstanding, Late Invoices) live-computed from invoice data
- Invoice Status donut chart (conic gradient) — Paid/Pending/Overdue/Sent
- Upcoming Due — next 3 pending invoices with countdown
- Recent Invoices — last 5 invoices in a table
- Time range filter — toggle All Time / This Month across all metrics

### Invoices (`/invoices`)
- Full CRUD — create, read, update, delete
- Status tabs + search + sort (Date/Amount/Client)
- Invoice detail drawer with items table, subtotal/tax/total, payment instructions
- Send via email modal with auto-generated body
- Delete confirmation modal

### Create / Edit Invoice (`/create`, `/edit/:id`)
- Two-column layout: form + live summary
- Dynamic line items with auto-calculated totals
- Tax rate, notes, payment instructions
- Save Draft / Send Invoice

### Settings (`/settings`)
10 sections: Profile, Notifications, Invoice Defaults, Payment Methods, Invoice Customization (logo, color picker, notes), Security (password, 2FA), Appearance (dark mode, compact view), Team Members, Data Management (export CSV/JSON, delete account), Save Changes

### Support (`/support`)
- FAQ accordion (5 questions)
- Contact form with success state
- Contact info cards (email, phone, live chat)
- Support hours

---

## Architecture

```
User Action → Component → dispatch(action) → Redux Reducer → new state → re-render
```

- **Two layouts**: `SidebarLayout` (Dashboard, Invoices, Settings, Support) with sidebar + top header + mobile bottom nav; `TopNavLayout` (Create/Edit) with simplified header + footer
- **Data**: All data persisted in `localStorage` under key `invoicehub_invoices`. Services simulate async with 200-300ms delays.
- **Seed data**: 12 sample invoices loaded on every app mount so it never starts empty.

### Routes

| Path | Layout | Page |
|------|--------|------|
| `/` | SidebarLayout | Dashboard |
| `/invoices` | SidebarLayout | InvoiceManagement |
| `/create` | TopNavLayout | CreateInvoice |
| `/edit/:id` | TopNavLayout | CreateInvoice (edit) |
| `/settings` | SidebarLayout | Settings |
| `/support` | SidebarLayout | Support |
| `/clients` | SidebarLayout | InvoiceManagement |

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/    # AnalyticsSection, RecentInvoices
│   ├── invoice/      # InvoiceCard, InvoiceDetailsDrawer, InvoiceForm,
│   │                 # InvoiceItemRow, InvoiceSummary, InvoiceTable
│   └── ui/           # Button, Card, Drawer, Icon, Input, Modal,
│                     # Select, SkeletonLoader, StatusBadge, Table, EmptyState
├── constants/        # Statuses, filter options, storage keys
├── hooks/            # useInvoices (Redux wrapper)
├── layouts/          # SidebarLayout, TopNavLayout
├── pages/            # Dashboard, InvoiceManagement, CreateInvoice, Settings, Support
├── routes/           # AppRoutes
├── services/         # invoiceService, analyticsService, seedData
├── store/            # Redux store + invoiceSlice (async thunks, reducers, selectors)
├── styles/           # Tailwind directives + custom component classes
├── utils/            # helpers (formatCurrency, calculateSubtotal, isOverdue, etc.)
├── __tests__/        # helpers.test.js (13 tests)
├── App.jsx           # Provider + BrowserRouter
└── index.jsx         # Entry point
```

---

## State Management

### Store Shape
```js
{
  invoices: {
    items: [],
    selectedInvoice: null,
    filters: { status: 'all', search: '' },
    loading: false,
    error: null,
    drawerOpen: false
  }
}
```

### Async Thunks
`fetchInvoices`, `createInvoice`, `updateInvoice`, `deleteInvoice`, `markInvoicePaid`, `sendInvoice` — all operate against localStorage with simulated delays.

### Selector
`selectFilteredInvoices` — applies status filter + search + auto-overdue detection in one pass.

---

## Design System

- **55 custom colors** following Material Design 3 naming (primary, secondary, error, surface, outline, etc.)
- **9 font sizes** — `display-lg` (48px) down to `label-sm` (12px)
- **8 spacing steps** — `xs` (4px) to `xxl` (48px)
- **Custom component classes**: `sidebar-link`, `custom-shadow`, `drawer-transition`, `animate-slide-up`
- **Dark mode** supported via `darkMode: 'class'` (toggle in Settings)
- **Print styles** — hides chrome, shows invoice detail for printing

---

## Testing

13 tests across 5 groups with ~95% statement coverage:

```
npm test              # Run with coverage
npm run test:watch    # Watch mode
```

---

## Environment

- Browsers: last 2 versions (via `babel.config.js`)
- Node: 18+ (for `Intl.NumberFormat` INR locale)
- No backend required — fully client-side

---

**Omkar Wayal**

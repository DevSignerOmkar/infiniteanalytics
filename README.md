# FluxInvoice — Premium Invoicing Platform

A production-ready, single-page invoicing SaaS application built with React. Manage invoices, track payments, oversee analytics, and handle client billing — all from a beautifully designed dashboard with no backend required.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack & Rationale](#tech-stack--rationale)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Component Tree](#component-tree)
- [Routing](#routing)
- [State Management](#state-management)
- [Data Layer & Persistence](#data-layer--persistence)
- [Design System](#design-system)
- [Pages](#pages)
- [Components](#components)
- [Services](#services)
- [Utilities](#utilities)
- [Testing](#testing)
- [Getting Started](#getting-started)
- [Build & Deploy](#build--deploy)
- [Environment](#environment)

---

## Overview

FluxInvoice is a fully client-side invoicing platform that lets users create, manage, and track invoices without any server infrastructure. All data is persisted in the browser's `localStorage`, making it instantly available offline and zero-config to deploy. The application simulates real-world async backend operations (loading states, optimistic updates, error handling) to provide a production-grade experience.

The name "FluxInvoice" reflects the application's reactive data flow (via Redux/Flux architecture) and its core domain — invoicing.

---

## Tech Stack & Rationale

### React 18

**What it is:** A declarative, component-based JavaScript library for building user interfaces.

**Why it was chosen:**
- **Component model** enables clean separation of UI into reusable, isolated pieces (cards, tables, drawers, buttons, etc.)
- **Declarative rendering** makes the UI predictable — the view is a function of state, which simplifies debugging and testing
- **Rich ecosystem** — React Router for navigation, Redux for state, Testing Library for tests — all battle-tested and well-documented
- **Hooks API** (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`) allows stateful logic without class components, keeping the codebase concise and functional
- **`createRoot` API** (React 18) enables concurrent features and automatic batching for better performance

### Redux Toolkit (@reduxjs/toolkit)

**What it is:** The official, opinionated toolset for efficient Redux development.

**Why it was chosen:**
- **Centralized state** — a single store holds all invoice data, filters, loading/error states, and drawer visibility. Any component can read or write state without prop drilling.
- **`createAsyncThunk`** simplifies async flows — dispatching a thunk automatically produces `pending`/`fulfilled`/`rejected` actions that the slice reducer handles to manage loading and error states uniformly
- **`createSlice`** eliminates boilerplate by generating action creators and reducers from a simple configuration object
- **Immer integration** (via `createSlice`) allows writing "mutating" reducer logic that is actually immutable under the hood
- **Selectors** (like `selectFilteredInvoices`) encapsulate derived data logic — the filter/search/overdue-detection pipeline is computed once and reused across components
- **Middleware-free** for this use case — no sagas or epics needed since all async logic is simple CRUD against localStorage

### react-redux

**What it is:** Official React bindings for Redux.

**Why it was chosen:**
- `useSelector` hook provides fine-grained subscriptions — components re-render only when the slice of state they select changes
- `useDispatch` hook gives access to the store's dispatch without wrapper components or `connect()` HOC
- Together they integrate React's component model with Redux's predictable state container

### React Router DOM v6

**What it is:** Declarative routing for React applications.

**Why it was chosen:**
- **Nested routes** aren't needed here (each page is top-level), but v6's `<Routes>` + `<Route>` pattern is simpler and more intuitive than v5's `<Switch>`
- **`<NavLink>`** with `className` callback enables active-link styling in the sidebar without manual URL matching
- **`useNavigate`** provides imperative navigation for buttons ("Quick Create", "View All", etc.)
- **`historyApiFallback: true`** in webpack dev server ensures client-side routing works on refresh during development

### Webpack 5

**What it is:** A static module bundler.

**Why it was chosen:**
- **Zero-config JSX/CSS processing** via `babel-loader`, `css-loader`, `style-loader`, `postcss-loader` — everything is configured declaratively in `webpack.config.js`
- **`HtmlWebpackPlugin`** auto-injects the built JS bundle into `index.html` with content-hashed filenames for cache busting
- **`devServer`** with HMR (hot module replacement) provides instant feedback during development
- **`clean: true`** ensures the `dist/` folder is cleaned before each production build

### Babel (preset-env + preset-react)

**What it is:** A JavaScript transpiler.

**Why it was chosen:**
- **`@babel/preset-env`** transpiles modern JS (optional chaining, nullish coalescing, arrow functions, etc.) to ES5 for browser compatibility
- **`@babel/preset-react`** with `runtime: 'automatic'` enables the new JSX transform — no need to `import React` in every file; the compiler auto-imports `jsx()` from `react/jsx-runtime`

### Tailwind CSS 3

**What it is:** A utility-first CSS framework.

**Why it was chosen:**
- **Rapid prototyping** — composing UI from utility classes (`flex`, `items-center`, `p-lg`, `rounded-xl`, `text-headline-sm`) is faster than writing custom CSS
- **Design consistency** — the custom theme in `tailwind.config.js` defines a comprehensive color palette (~55 colors), type scale (9 sizes), spacing scale (8 steps), and border radii, ensuring every pixel follows the design system
- **`darkMode: 'class'`** — dark mode can be toggled by adding/removing a single class on `<html>`, which is already wired in the Settings page
- **Zero runtime** — unlike CSS-in-JS, Tailwind generates static CSS at build time, meaning no performance overhead
- **`@apply` in `@layer components`** is used sparingly for complex, repeated patterns like `.sidebar-link` and `.custom-shadow`, keeping the markup clean

### Jest + @testing-library/react

**What it is:** A testing framework and React testing utilities.

**Why it was chosen:**
- **Jest** provides the test runner, assertion library (`expect`), mocking, and code coverage — all in one package
- **`jest-environment-jsdom`** simulates a browser environment in Node, so React components can be rendered and queried without a real browser
- **`@testing-library/react`** encourages testing from the user's perspective — queries by label text, role, placeholder text — rather than testing implementation details

### PostCSS + Autoprefixer

**What it is:** A CSS post-processor and vendor-prefix auto-injector.

**Why it was chosen:**
- PostCSS runs Tailwind as a plugin, transforming `@tailwind` directives into the actual utility classes
- Autoprefixer automatically adds vendor prefixes (`-webkit-`, `-moz-`, etc.) to CSS rules, ensuring cross-browser compatibility without manual effort

---

## Features

### Dashboard (`/`)
- **4 KPI cards** — Total Revenue, Paid Invoices, Outstanding Amount, Late Invoices — all computed live from the invoice dataset
- **Invoice Status donut chart** — conic gradient visualization showing Paid/Pending/Overdue/Sent proportions
- **Upcoming Due** — next 3 pending invoices with client name and due-in-X-days countdown
- **Recent Invoices** — last 5 invoices in a table format
- **Time range filter** — toggle between "All Time" and "This Month" to scope every metric on the page

### Invoice Management (`/invoices`)
- **Full CRUD** — create, read, update, delete invoices
- **Status tabs** — filter by All / Paid / Pending / Overdue / Sent
- **Search** — live-filter by invoice number, client name, or email
- **Sort** — by Date, Amount, or Client
- **Invoice detail drawer** — slide-in panel showing full invoice breakdown with items table, subtotal/tax/total, payment instructions, and action buttons (PDF, Edit, Delete, Mark as Paid)
- **Send via email** — modal with auto-generated email body containing invoice details
- **Delete confirmation** — modal to confirm destructive actions
- **Toast notification** — success feedback after sending an invoice

### Create / Edit Invoice (`/create`, `/edit/:id`)
- **Two-column layout** — form on the left, live summary on the right
- **Dynamic line items** — add/remove items with auto-calculated totals
- **Tax rate** — percentage applied to subtotal
- **Notes & Payment Instructions** — text areas for additional information
- **Save Draft** — saves to localStorage when creating; updates when editing
- **Send Invoice** — saves and triggers the send flow
- **Duplicate detection** — creating invoices with existing IDs triggers update

### Settings (`/settings`)
- **Profile** — Business Name, Email, Phone
- **Notifications** — Email, SMS, Invoice Reminders, Marketing toggles
- **Invoice Defaults** — Due Period, Tax Rate, Invoice Prefix
- **Payment Methods** — Bank Transfer, Credit Card, PayPal (connected status display)
- **Invoice Customization** — Logo upload (UI), Primary Color picker, Default Notes
- **Security** — Password change fields, Two-Factor Authentication toggle
- **Appearance** — Dark Mode, Compact View toggles
- **Team Members** — mock team list with Admin/Editor/Viewer roles
- **Data Management** — Export CSV, Export JSON, Delete Account buttons
- **Save Changes** — global save with 2-second success feedback

### Support (`/support`)
- **Gradient hero** — branded header with help icon and title
- **FAQ accordion** — 5 expandable questions covering common topics (creating invoices, payment processing, client management, customization, security)
- **Contact form** — Name, Email, Subject, Message with success state after submission
- **Contact info** — Email, Phone, Live Chat cards
- **Support Hours** — Mon-Fri, Saturday, Sunday availability

---

## Architecture

### Component Unidirectional Flow

```
User Action → Component → dispatch(action) → Redux Reducer → new state → useSelector → re-render
```

All data flows in one direction:
1. User interacts with a component (clicks a button, types in a field)
2. Component dispatches a Redux action (or uses local state for ephemeral UI state)
3. Redux reducer processes the action and returns new state
4. React re-renders components that subscribe to the changed state via `useSelector`

### Layout System

Two layout wrappers encapsulate the chrome around page content:

- **`SidebarLayout`** — used for primary pages (Dashboard, Invoices, Settings, Support, Clients). Includes a persistent sidebar nav (desktop) and bottom tab bar (mobile), plus a top header bar with search, notifications, and quick-create button.
- **`TopNavLayout`** — used for the invoice creation/edit flow. Simplified top navigation bar with brand name and minimal links, plus a footer.

### Async Simulation

Since there is no backend, all service calls simulate network latency with `setTimeout` delays (`300ms` for invoices, `200ms` for analytics). This ensures:
- Loading spinners are visible and tested
- Components handle `loading` states gracefully
- The experience mirrors a real API-driven application

---

## Project Structure

```
invoicing-platform/
├── __mocks__/                    # Jest module mocks
│   └── styleMock.js              #   Mock for CSS imports in tests
├── public/
│   └── index.html                # HTML shell with root div
├── dist/                         # Production build output
├── src/
│   ├── __tests__/
│   │   └── helpers.test.js       # Unit tests for utility functions
│   ├── components/
│   │   ├── dashboard/            # Dashboard-specific components
│   │   │   ├── AnalyticsSection.jsx
│   │   │   └── RecentInvoices.jsx
│   │   ├── invoice/              # Invoice domain components
│   │   │   ├── InvoiceCard.jsx
│   │   │   ├── InvoiceDetailsDrawer.jsx
│   │   │   ├── InvoiceForm.jsx
│   │   │   ├── InvoiceItemRow.jsx
│   │   │   ├── InvoiceSummary.jsx
│   │   │   └── InvoiceTable.jsx
│   │   └── ui/                   # Reusable design-system primitives
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Drawer.jsx
│   │       ├── EmptyState.jsx
│   │       ├── Icon.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Select.jsx
│   │       ├── SkeletonLoader.jsx
│   │       ├── StatusBadge.jsx
│   │       └── Table.jsx
│   ├── constants/
│   │   └── index.js              # App-wide constants (statuses, filter options, storage keys)
│   ├── hooks/
│   │   └── useInvoices.js        # Custom hook wrapping Redux dispatch + selectors
│   ├── layouts/
│   │   ├── SidebarLayout.jsx     # Primary layout with sidebar + top header
│   │   └── TopNavLayout.jsx      # Secondary layout for create/edit flow
│   ├── pages/
│   │   ├── Dashboard/index.jsx
│   │   ├── InvoiceManagement/index.jsx
│   │   ├── CreateInvoice/index.jsx
│   │   ├── Settings/index.jsx
│   │   └── Support/index.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx         # Route definitions
│   ├── services/
│   │   ├── invoiceService.js     # CRUD operations against localStorage
│   │   ├── analyticsService.js   # Analytics computation
│   │   └── seedData.js           # 12 sample invoices for demo
│   ├── store/
│   │   ├── store.js              # Redux store configuration
│   │   └── slices/
│   │       └── invoiceSlice.js   # Invoice state + async thunks + selectors
│   ├── styles/
│   │   └── index.css             # Tailwind directives + custom component classes
│   ├── utils/
│   │   └── helpers.js            # Pure utility functions (formatting, math, ID gen)
│   ├── App.jsx                   # Root component (Provider + BrowserRouter)
│   └── index.jsx                 # Entry point (createRoot)
├── babel.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── webpack.config.js
```

---

## Component Tree

```
<App>
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes>
        ── SidebarLayout ───
        │   ├── <header>         # Top bar: search, quick-create, notifications, avatar
        │   ├── <aside>          # Sidebar nav (desktop)
        │   ├── <main>
        │   │   ├── <Dashboard>
        │   │   │   ├── <AnalyticsSection invoices={displayInvoices} />
        │   │   │   ├── <div> Invoice Status (donut chart) </div>
        │   │   │   ├── <div> Upcoming Due (invoice cards) </div>
        │   │   │   └── <RecentInvoices invoices={displayInvoices} />
        │   │   ├── <InvoiceManagement>
        │   │   │   ├── <div> Filters (tabs) + Sort + Search </div>
        │   │   │   ├── <InvoiceTable />
        │   │   │   ├── <InvoiceDetailsDrawer />
        │   │   │   ├── <Modal /> (delete confirmation)
        │   │   │   ├── <Modal /> (email send)
        │   │   │   └── <div> Toast notification </div>
        │   │   ├── <Settings>
        │   │   │   └── 10 section cards with <Toggle />, <InputField />, <SelectField />
        │   │   └── <Support>
        │   │       ├── <div> Hero gradient + FAQ accordion </div>
        │   │       └── <div> Contact form + Contact info cards </div>
        │   └── <nav>            # Bottom tab bar (mobile)
        │
        ── TopNavLayout ───
            ├── <header>         # Simplified top nav
            ├── <main>
            │   └── <CreateInvoice>
            │       ├── <InvoiceForm />
            │       └── <InvoiceSummary />
            └── <footer>
      </AppRoutes>
    </BrowserRouter>
  </Provider>
</App>
```

---

## Routing

| Path | Layout | Page | Purpose |
|------|--------|------|---------|
| `/` | SidebarLayout | Dashboard | Executive overview with KPIs and charts |
| `/invoices` | SidebarLayout | InvoiceManagement | Full invoice list with CRUD |
| `/create` | TopNavLayout | CreateInvoice | New invoice creation |
| `/edit/:id` | TopNavLayout | CreateInvoice | Edit existing invoice |
| `/settings` | SidebarLayout | Settings | App configuration |
| `/support` | SidebarLayout | Support | FAQ and contact form |
| `/clients` | SidebarLayout | InvoiceManagement | Reused invoice list |

All routes use `SidebarLayout` except `CreateInvoice` which uses `TopNavLayout` for a focused, distraction-free experience.

The webpack dev server is configured with `historyApiFallback: true` to serve `index.html` for all routes, enabling client-side routing without a backend.

For Vercel/Netlify deployment, a `vercel.json` with `rewrites` rule is needed to achieve the same behavior in production:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## State Management

### Store Structure

```js
{
  invoices: {
    items: [],                  // Array of invoice objects
    selectedInvoice: null,      // Currently viewed invoice (for drawer)
    filters: {
      status: 'all',           // 'all' | 'paid' | 'pending' | 'overdue' | 'sent'
      search: ''               // Search query string
    },
    loading: false,             // True during async operations
    error: null,                // Error message string
    drawerOpen: false           // Invoice detail drawer visibility
  }
}
```

### Async Thunks

| Thunk | Action | Returns | Triggers Loading |
|-------|--------|---------|------------------|
| `fetchInvoices` | Load all invoices from localStorage | Array of invoices | Yes |
| `createInvoice` | Create a new invoice | Created invoice object | No (optimistic) |
| `updateInvoice` | Update an existing invoice | Updated invoice object | No |
| `deleteInvoice` | Delete an invoice by ID | Deleted invoice ID (for filtering) | Yes |
| `markInvoicePaid` | Set invoice status to 'paid' | Updated invoice object | No |
| `sendInvoice` | Set invoice status to 'sent' | Updated invoice object | No |

### Selectors

- **`selectFilteredInvoices`** — applies status filter, search filter, and auto-overdue detection in a single pass. Used by the InvoiceManagement page and Dashboard.

### Custom Hook: `useInvoices`

Wraps all Redux dispatch calls and selectors into a single hook, memoizing dispatch callbacks with `useCallback` to prevent unnecessary re-renders. Returns:

- `invoices` (raw items)
- `filteredInvoices` (via selector)
- `selectedInvoice`, `filters`, `loading`, `error`, `drawerOpen`
- `analytics` (computed counts: total, paid, pending, overdue, sent)
- All action dispatchers (`fetchInvoices`, `createInvoice`, etc.)

---

## Data Layer & Persistence

### localStorage Schema

All invoice data is stored under the single key `invoicehub_invoices` as a JSON array.

### Invoice Object Shape

```js
{
  id: "inv_1700000000_abc1234",       // Unique ID generated by generateId()
  invoiceNumber: "INV-0001",          // Auto-incremented on creation
  clientName: "Acme Solutions",
  clientEmail: "billing@acme.com",
  items: [
    {
      id: "item_1700000000_def5678",
      description: "UI/UX Design",
      quantity: 45,
      rate: 100,
      type: "service"                  // "service" | "product"
    }
  ],
  notes: "Net-14 terms apply.",
  paymentInstructions: "Bank Transfer · Account: 123456789",
  dueDate: "2024-08-15",
  taxRate: 8,                          // Percentage (0-100)
  status: "pending",                   // "paid" | "pending" | "overdue" | "sent" | "draft"
  createdAt: "2024-07-15T10:00:00.000Z" // ISO string of creation time
}
```

### Seed Data

12 sample invoices are loaded on every app mount via `seedInvoices()` in `App.jsx`. These cover all statuses (paid, pending, overdue, sent) with realistic client names, line items, and date ranges. The seed data ensures the application never starts empty.

### Simulated Async

- `invoiceService` — 300ms delay
- `analyticsService` — 200ms delay
- Errors are thrown for not-found IDs, caught by Redux `rejected` handlers

---

## Design System

### Color Palette

The custom theme defines ~55 colors following the Material Design 3 dynamic color naming convention:

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#4648d4` | Primary actions, links, active states |
| `secondary` | `#6b38d4` | Secondary accents |
| `error` | `#ba1a1a` | Errors, overdue, destructive actions |
| `success` (inline) | green-600 | Paid status, positive trends |
| `surface` | `#fcf8ff` | Page background |
| `surface-container-low` | `#f5f2fe` | Card backgrounds, input fields |
| `surface-container-high` | `#e9e6f3` | Hover states, skeleton loaders |
| `outline` | `#767586` | Secondary text, borders |
| `outline-variant` | `#c7c4d7` | Subtle borders, dividers |
| `on-surface` | `#1b1b23` | Primary text |
| `on-surface-variant` | `#464554` | Secondary text |

### Typography

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `display-lg` | 48px | 600 | 1.1 | Large hero text |
| `headline-lg` | 32px | 600 | 1.2 | Page titles |
| `headline-md` | 24px | 600 | 1.3 | Section headings |
| `headline-sm` | 20px | 600 | 1.4 | Card titles, KPI values |
| `body-md` | 16px | 400 | 1.6 | Body text |
| `body-sm` | 14px | 400 | 1.5 | Secondary body text |
| `label-md` | 14px | 500 | 1.0 | Button labels, form labels |
| `label-sm` | 12px | 600 | 1.0 | Badge text, metadata |

### Spacing

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |
| `gutter` | 24px |

### Component Classes

Defined in `src/styles/index.css` using Tailwind's `@apply` directive:

- **`.sidebar-link`** — sidebar nav items with hover and active states
- **`.sidebar-link-active`** — active nav item with primary color and emphasis
- **`.custom-shadow`** — subtle purple-tinted shadow for cards
- **`.drawer-transition`** — smooth cubic-bezier slide animation for drawers
- **`.line-item-row:hover .delete-btn`** — show delete button on row hover
- **`.chart-gradient`** — gradient fill for chart backgrounds
- **`.animate-slide-up`** — fade + slide-up animation for FAQ answers

### Print Styles

A `@media print` block hides all UI chrome (sidebar, header, buttons) and shows only the invoice detail content, making it suitable for generating printer-friendly PDFs.

---

## Pages

### Dashboard (`/`)

The main landing page after login. It provides a real-time snapshot of the business:

- **AnalyticsSection** — 4 compact KPI cards computed from the filtered invoice set (Total Revenue in INR, Paid Invoice count, Outstanding amount, Late Invoice amount). Each card has a label, icon, formatted value, and trend indicator.
- **Invoice Status** — a donut chart built with a CSS `conic-gradient` showing the proportion of Paid, Pending, Overdue, and Sent invoices.
- **Upcoming Due** — the next 3 pending invoices sorted by proximity to due date, with client name and days-until-due.
- **Recent Invoices** — the 5 most recently created invoices rendered via `InvoiceTable`.
- **Time Range Toggle** — filters all data on the page to only show invoices created in the current month.

### Invoice Management (`/invoices`)

The core working page for day-to-day operations:

- **Filter Tabs** — All / Paid / Pending / Overdue / Sent
- **Sort Dropdown** — Date (newest), Amount (highest), Client (A-Z)
- **Search Input** — filters by invoice number, client name, or email
- **Invoice Table** — columns for Invoice ID, Client, Amount, Due Date, Status, Created, Share (email), and Actions (view drawer)
- **Invoice Detail Drawer** — a slide-in panel showing the full invoice: status badge, bill-to/payment details, line-item table with subtotal/tax/total, payment instructions, and action buttons (PDF/print, Edit, Delete, Mark as Paid)
- **Send Email Modal** — opens a modal with an auto-generated email body containing the invoice summary and a mailto link
- **Delete Confirmation Modal** — warns before deleting an invoice

### Create / Edit Invoice (`/create`, `/edit/:id`)

A clean two-column layout for invoice composition:

- **InvoiceForm** (left column with `forwardRef`):
  - Client Name & Email
  - Created Date & Due Date
  - Tax Rate (%)
  - Dynamic line items with add/remove — each row has description, quantity, rate, and auto-calculated total
  - Notes & Payment Instructions textareas
  - Live subtotal/tax/total computation via callback
- **InvoiceSummary** (right column, `memo`ized):
  - Subtotal, Tax (with rate badge), and Total (in large headline text)

### Settings (`/settings`)

10 configuration sections in a scrollable layout:

1. **Profile** — Business Name, Email, Phone
2. **Notifications** — 4 toggle switches (Email, SMS, Reminders, Marketing)
3. **Invoice Defaults** — Due Period (7/14/30 days), Tax Rate, Invoice Prefix
4. **Payment Methods** — Bank Transfer, Credit Card, PayPal with "Connected" status badges
5. **Invoice Customization** — Logo upload (UI only), Primary Color picker, Default Notes textarea
6. **Security** — Password change fields (current/new/confirm), 2FA toggle
7. **Appearance** — Dark Mode toggle, Compact View toggle
8. **Team Members** — 3 mock members with role badges (Admin/Editor/Viewer)
9. **Data Management** — Export CSV, Export JSON, Delete Account action buttons
10. **Save Changes** — Global save button with 2-second success feedback

### Support (`/support`)

Customer support page with help resources:

- **Hero Banner** — gradient background with help icon and "How can we help you?" heading
- **FAQ Accordion** — 5 questions with expand/collapse functionality (click to toggle, chevron rotation animation)
- **Contact Form** — Name, Email, Subject, Message fields with validation and success/thank-you state
- **Contact Info Cards** — Email (mailto link), Phone, Live Chat button
- **Support Hours** — Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed

---

## Components

### UI Primitives (`src/components/ui/`)

These are generic, reusable building blocks that follow the project's design system:

| Component | Props | Features |
|-----------|-------|----------|
| **Button** | `variant` (primary/secondary/danger/ghost/success), `size` (sm/md/lg), `loading`, `disabled`, `className` | Loading spinner, press animation, disabled state, `forwardRef` |
| **Card** | `padding` (boolean), `children`, `...props` | White card with shadow and border |
| **Drawer** | `isOpen`, `onClose`, `title`, `children` | Portal-based, Esc to close, body scroll lock, backdrop blur |
| **Modal** | `isOpen`, `onClose`, `title`, `size` (sm/md/lg/xl), `children` | Portal-based, Esc to close, backdrop, close button |
| **Icon** | `name`, `size`, `filled`, `className` | 40 custom SVG paths, dev-mode warning for unknown names |
| **Input** | `label`, `error`, `...props` | Label, error message, focus ring, `forwardRef` |
| **Select** | `label`, `error`, `options[]`, `placeholder` | Native select styled to match theme, `forwardRef` |
| **Table** | `columns[]`, `data[]`, `onRowClick`, `emptyMessage` | Configurable columns with custom render, row click, empty state |
| **StatusBadge** | `status` | 5 statuses with matching colors and dots |
| **EmptyState** | `icon`, `title`, `description`, `actionLabel`, `onAction` | Centered empty state with CTA button |
| **SkeletonLoader** | `rows` (default 5) | Animated pulse loading placeholder |

### Dashboard Components

| Component | Purpose |
|-----------|---------|
| **AnalyticsSection** | 4 KPI cards computed from invoices prop via `useMemo`. Handles empty/loading state gracefully. |
| **RecentInvoices** | Renders first 5 invoices via `InvoiceTable`, with empty state redirect to create page. |

### Invoice Components

| Component | Purpose |
|-----------|---------|
| **InvoiceCard** | `memo`ized card for grid display with client, status badge, total, and hover effect |
| **InvoiceDetailsDrawer** | Full invoice detail view in a slide-in drawer with action buttons and print support |
| **InvoiceForm** | Complex form with `useImperativeHandle` exposing `submit()` and `getFormData()`. Dynamic line items with live calculation. |
| **InvoiceItemRow** | `memo`ized single line item with description, quantity, rate, and auto-total. Delete on hover. |
| **InvoiceSummary** | `memo`ized subtotal/tax/total display |
| **InvoiceTable** | 8-column table with client avatars, status badges, late detection, email/share button |

---

## Services

### `invoiceService.js`

The data access layer abstracting localStorage operations:

- **`fetchInvoices()`** — reads from localStorage, applies overdue detection, returns sorted array
- **`getInvoiceById(id)`** — returns a single invoice or null
- **`createInvoice(invoice)`** — generates `id`, `invoiceNumber` (auto-incremented), `createdAt`, and prepends to the array
- **`updateInvoice(id, updates)`** — merges updates, re-applies overdue detection, saves
- **`deleteInvoice(id)`** — filters out the invoice by id
- **`markAsPaid(id)`** — delegates to `updateInvoice` with `{ status: 'paid' }`
- **`sendInvoice(id)`** — sets status to `'sent'`

All methods are async with a 300ms simulated delay.

### `analyticsService.js`

Computes aggregate metrics:

- **`getAnalytics()`** — reads all invoices, computes total invoices, revenue (sum of paid invoice totals), outstanding (sum of pending + overdue totals), counts by status, and paid percentage

### `seedData.js`

Provides 12 realistic sample invoices with diverse clients (Acme Solutions, Nova Labs, Quantum Design, etc.), varied statuses, and date ranges spanning from 2024 to 2026. Called on every app mount to ensure the app never starts empty for demo purposes.

---

## Utilities (`src/utils/helpers.js`)

All utility functions are pure — they take input and return output without side effects:

### ID Generation
- **`generateId()`** — produces unique IDs like `inv_1700000000_abc1234` using timestamp + random string

### Formatting
- **`formatCurrency(amount)`** — formats numbers as INR currency using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`. Returns values like `₹1,000.00`.
- **`formatDate(dateStr)`** — formats ISO date strings to human-readable format (e.g., `"Jan 15, 2024"`) using `Intl.DateTimeFormat`

### Date Logic
- **`getDaysOverdue(dueDate)`** — computes number of days past due (0 if not yet due)
- **`isOverdue(dueDate, status)`** — returns `true` if the date is in the past and status is not `'paid'`

### Invoice Math
- **`calculateItemTotal(quantity, rate)`** — `quantity * rate`, rounded to 2 decimal places
- **`calculateSubtotal(items)`** — sum of all item totals
- **`calculateTax(subtotal, taxRate)`** — percentage calculation
- **`calculateTotal(subtotal, tax)`** — subtotal + tax

### Templates
- **`getDefaultInvoice()`** — returns a blank invoice object with one empty line item, ready for form binding

---

## Testing

### Test Suite

The test suite covers all utility functions with 13 tests across 5 describe blocks:

| Group | Tests | Coverage |
|-------|-------|----------|
| Invoice Calculations | 4 | calculateItemTotal, calculateSubtotal, calculateTax, calculateTotal |
| Invoice Filtering | 3 | isOverdue (past due, paid, future) |
| Late Invoice Detection | 2 | getDaysOverdue (past, future) |
| Form Validation | 2 | Zero values, empty items array |
| Utility Functions | 2 | formatCurrency (INR), formatDate |

### Running Tests

```bash
npm test            # Run all tests with coverage
npm run test:watch  # Run in watch mode for development
```

### Coverage

The tests achieve approximately:
- **95.6%** statement coverage
- **80%** branch coverage
- **81.8%** function coverage

---

## Getting Started

### Prerequisites

- Node.js 18+ (uses `Intl.NumberFormat` for currency formatting)
- npm 9+

### Installation

```bash
git clone <repo-url>
cd invoicing-platform
npm install
```

### Development Server

```bash
npm start
```

Opens http://localhost:3000 with hot module replacement. The `historyApiFallback` option ensures client-side routing works on refresh.

### Production Build

```bash
npm run build
```

Outputs to `dist/` with content-hashed bundles and minified assets.

### Running Tests

```bash
npm test
```

Runs Jest with coverage reporting.

---

## Build & Deploy

### Production Artifacts

The `dist/` directory contains:
- `index.html` — minified HTML with script tag
- `bundle.[contenthash].js` — minified, tree-shaken JS bundle
- `bundle.[contenthash].js.LICENSE.txt` — third-party license notices

### Deployment Targets

#### Vercel (recommended)

1. Push the repository to GitHub/GitLab
2. Import the project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add a `vercel.json` in the root for SPA fallback:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

#### Netlify

1. Push to GitHub/GitLab
2. Import in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add a `_redirects` file in the `public/` directory:

```
/*    /index.html   200
```

#### Any Static Host

Since the app is fully client-side with no backend requirements, it can be deployed to any static file host (GitHub Pages, Cloudflare Pages, AWS S3, Firebase Hosting, etc.). Ensure the host supports SPA fallback routing (serving `index.html` for all paths).

---

## Environment

### Browser Support

The application targets "last 2 versions" of all major browsers, as configured in `babel.config.js`. The `Intl.NumberFormat` API is used for currency formatting and is supported in all modern browsers (Chrome, Firefox, Safari, Edge) — no polyfill needed.

### Node Compatibility

Node.js 18+ is required due to the use of `Intl.NumberFormat` for Indian Rupee formatting (`en-IN` locale). Earlier versions may not have full `Intl` locale support.

---

## License

This project is licensed under the ISC License. See the `package.json` for details.

---

*Built with React 18, Redux Toolkit, Tailwind CSS, and Webpack.*

---

**Omkar Wayal**

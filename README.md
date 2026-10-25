# Ecaspian

**Curated for the extraordinary.**

Ecaspian is a complete, responsive e-commerce storefront built as a capstone project. It pairs a
considered visual identity — Caspian teal, champagne gold, Cormorant Garamond and Manrope — with a
real catalogue from the Fake Store API, a persistent cart and wishlist, a simulated checkout and a
printable order receipt.

The shop is a demonstration: payments and authentication are simulated, and no real money moves.

## Highlights

- **Full shopping journey** — browse the collection, search, filter and sort, open a product,
  choose a quantity, add to bag, save for later, sign in, check out and receive an order receipt.
- **Real remote catalogue** — products and ratings come from the Fake Store API, normalised into
  Indian rupees with derived discounts, stock levels and category metadata. A bundled snapshot keeps
  the storefront usable if the API is unavailable.
- **Persistent by default** — cart, wishlist, session, orders, saved address, recently viewed
  products and recent searches survive refreshes through `localStorage`, with cross-tab sync.
- **A checkout that behaves like a checkout** — field-level validation, saved details, coupon codes,
  standard or express delivery, card / UPI / net banking / cash on delivery, and an order
  confirmation with a delivery estimate.
- **Responsive and accessible** — mobile navigation, keyboard-friendly dialogs, focus trapping,
  reduced-motion support, skip links, semantic landmarks and labelled controls.
- **Tested** — 37 unit and integration tests across 9 files using Vitest and React Testing Library.

## Tech stack

| Area       | Choice                                     |
| ---------- | ------------------------------------------ |
| UI         | React 19, React Router 7                   |
| State      | Redux Toolkit, React Redux                 |
| Styling    | Tailwind CSS 4, custom design tokens       |
| Build      | Vite 8                                     |
| Data       | Fake Store API + bundled fallback snapshot |
| Tests      | Vitest 5, React Testing Library, jsdom     |
| Quality    | ESLint 10, Prettier                        |
| Deployment | Vercel (SPA rewrites and security headers) |

## Getting started

You need **Node.js 22.12+** (Node 24 recommended) and npm.

```bash
git clone <repository-url>
cd ecaspian
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Environment variables

Copy `.env.example` to `.env` only if you want to override the defaults.

| Variable            | Default                    | Purpose                                             |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `VITE_USD_TO_INR`   | `84`                       | Fixed conversion rate applied to Fake Store API USD |
| `VITE_API_BASE_URL` | `https://fakestoreapi.com` | Override the catalogue API base URL                 |

Both are optional; the app works without a `.env` file.

## Demo access

Authentication is simulated locally. Use the demo account:

```text
Email:    demo@ecaspian.com
Password: Ecaspian@123
```

The login page has a **Use demo credentials** button that fills the form for you.

### Test payment details

| Payment method   | Test values                                                    |
| ---------------- | -------------------------------------------------------------- |
| Card             | `4111 1111 1111 1111`, any future expiry, any 3-digit CVV      |
| UPI              | Any value matching `name@bank`, for example `aarav@okhdfcbank` |
| Net banking      | Choose any bank from the list                                  |
| Cash on delivery | A ₹49 COD fee is added at checkout                             |

### Coupon codes

| Code         | Benefit                         | Minimum spend |
| ------------ | ------------------------------- | ------------- |
| `ECASP10`    | 10% off, capped at ₹500         | None          |
| `WELCOME200` | ₹200 off                        | ₹1,999        |
| `FREESHIP`   | Complimentary standard delivery | None          |

Delivery is free on standard orders of ₹999 or more. Express delivery is ₹99. The checkout is a
simulation and never sends payment data anywhere.

## Scripts

| Command                 | What it does                                       |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Start the Vite development server                  |
| `npm run build`         | Create the production build in `dist/`             |
| `npm run preview`       | Serve the production build locally                 |
| `npm run lint`          | Run ESLint across the project                      |
| `npm run format`        | Format the project with Prettier                   |
| `npm run format:check`  | Verify formatting without writing changes          |
| `npm run test`          | Start Vitest in watch mode                         |
| `npm run test:run`      | Run the full test suite once                       |
| `npm run test:coverage` | Run tests with a V8 coverage report in `coverage/` |

## Project structure

```text
src/
├─ api/            Fake Store API client and mock authentication
├─ app/            Redux store, typed hooks and persistence orchestration
├─ components/
│  ├─ cart/        Cart rows, coupon form and order summary
│  ├─ common/      Buttons, inputs, modal, drawer, rating, price, skeletons
│  ├─ home/        Hero carousel, category grid, featured edit, FAQ, trust strip
│  ├─ layout/      Header, mobile menu, search, account/notifications and footer
│  └─ product/     Product cards, grids, listings, pincode check and reviews
├─ data/           Categories, coupons, constants, legal copy, FAQs, API snapshot
├─ hooks/          Focus trap, media queries, recent history, scroll position
├─ pages/          Home, shop, category, product, cart, wishlist, search, login,
│                  checkout, order success and 404
├─ redux/          Slices, actions and memoised selectors
├─ routes/         Route map and protected checkout route
├─ tests/          Setup, fixtures and the Vitest suites
├─ utils/          Currency, dates, validators, totals, sorting, storage, normalisation
├─ App.jsx         Error boundary + routes
├─ index.css       Tailwind theme tokens, typography and shared utilities
└─ main.jsx        Application entry point
```

Path alias `@/` points to `src/`.

## Data and API behaviour

The Fake Store API is a public demo catalogue, so Ecaspian adapts it rather than presenting it as
production inventory:

- **Prices** are converted from USD to INR using the fixed `VITE_USD_TO_INR` rate (default `84`).
- **Discounts, original prices and stock levels** are derived deterministically from each product's
  id and category. They are presentation data, not live inventory.
- **Key features, warranty, shipping and care copy** come from per-category metadata.
- **Reviews** shown on product pages are representative sample content. The rating score and review
  count come from the API; customers can add their own local review, which is stored in the browser.
- **Catalogue caching** keeps normalised products in `localStorage` for six hours. If the API fails,
  the app falls back to a bundled snapshot from `src/data/fakeStoreSnapshot.json` and shows a
  dismissible notice. A failed live refresh does not break an already-cached catalogue.

Because these values are simulated, the storefront should not be used to represent real pricing,
availability or customer reviews.

## Local persistence

All user state stays in the browser. Nothing is sent to a backend.

| Storage key              | Contents                                      |
| ------------------------ | --------------------------------------------- |
| `ecaspian.state.v1`      | Cart, wishlist, session, local reviews and UI |
| `ecaspian.orders.v1`     | Up to 25 order receipts, newest first         |
| `ecaspian.address.v1`    | Saved checkout address                        |
| `ecaspian.pincode.v1`    | Last used delivery pincode                    |
| `ecaspian.catalog.v1`    | Cached normalised catalogue (six-hour TTL)    |
| `ecaspian.recent.v1`     | Recently viewed product ids                   |
| `ecaspian.searches.v1`   | Recent search terms                           |
| `ecaspian.newsletter.v1` | Newsletter signup state                       |

- State is versioned (`version: 1`) and sanitised when rehydrated, so corrupted or outdated values
  cannot crash the storefront.
- Writes are debounced and ignore transient state such as toasts and catalogue data.
- Changes made in another tab hydrate through the `storage` event without echoing back.
- Clearing site data removes the cart, session and order history. Order receipts are only available
  in the browser where they were created.

## Accessibility and responsive behaviour

- Skip-to-content link, one `<main>` landmark, labelled navigation and forms.
- Focus traps and Escape-to-close behaviour for the modal, drawer and menus; body scroll locks.
- Wishlist and quantity controls expose `aria-pressed`, `aria-label` and disabled states.
- Visible focus rings, text alternatives for rating stars, and live regions for toasts.
- `prefers-reduced-motion` disables reveal animations and smooth scrolling.
- Layouts are built mobile-first; product grids, navigation and the checkout summary reflow rather
  than overflow on small screens and expand across wide desktops.

## Testing

```bash
npm run test:run
```

The suite covers:

- form validators, including Indian phone/pincode formats and Luhn card checks
- cart and wishlist reducers, stock clamping, coupon handling and hydration
- order totals, coupons, delivery fees, COD and sorting
- debounced persistence and cross-tab hydration without write loops
- product cards, add-to-cart state and wishlist toggles
- product listing sort, filters and empty states
- login validation, demo sign-in and error handling
- the complete checkout-to-order flow, including receipt creation and cart clearing
- search results from the query string

## Deployment

The repository includes `vercel.json` with a single-page-application rewrite and baseline security
headers. Vercel auto-detects Vite.

### Publish to GitHub

Create an empty repository on GitHub (without a README or `.gitignore`), then connect this local
history and push:

```bash
git remote add origin https://github.com/<your-username>/ecaspian.git
git push -u origin main
```

### Deploy with the Vercel dashboard

1. Push the repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected settings: build command `npm run build`, output directory `dist`.
4. Add `VITE_USD_TO_INR` (optional) under **Environment Variables** if you want a different rate.
5. Deploy. Every push to the production branch redeploys automatically.

### Deploy with the Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

Any static host works as long as unknown routes are rewritten to `index.html`. The app uses
`BrowserRouter`, so server-side rewrites are required for deep links such as `/product/14`.

### Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`:

1. install dependencies with `npm ci`
2. check formatting with Prettier
3. lint with ESLint
4. run the test suite
5. produce a production build

## Known limitations

- Authentication and payments are simulated; there is no server, database or real transaction.
- Fake Store API data is a public demo catalogue. Pricing, discounts, stock, features and sample
  reviews are illustrative.
- Cart, wishlist and orders are device-local and are not shared between browsers.
- The newsletter form stores interest locally; it does not subscribe anyone to a mailing list.
- Product imagery is loaded from the Fake Store API CDN. If an image is unavailable, a branded
  placeholder is shown.

## Acknowledgements

Catalogue data and imagery are provided by [Fake Store API](https://fakestoreapi.com). Fonts are
bundled locally through Fontsource: Cormorant Garamond and Manrope. Icons are from React Icons
(Feather set).

This project was built for educational and portfolio purposes.

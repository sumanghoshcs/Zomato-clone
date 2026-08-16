# Zomato Clone

A fully responsive Zomato-style food delivery app: restaurant discovery, menus, cart, coupon codes, checkout with payment options, live order tracking, order history, auth, search and favourites. React 18 + Redux Toolkit + Tailwind CSS.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in watch mode. Tests cover restaurant data normalization, menu generation, search/sort, coupon math and the TheMealDB dish mapper.

### `npm run build`

Builds the app for production to the `build` folder. Pages and the map component are code-split into lazy-loaded chunks.

## Optional API Integrations

All integrations are optional and degrade gracefully. Without any keys, the app runs fully on local mock data.

| Feature | Provider | Config (`.env`) | Fallback |
| --- | --- | --- | --- |
| Real dish names + food images | TheMealDB (free, no key) | none — auto-enabled | Static dish catalog |
| Restaurant / delivery map | Leaflet + OpenStreetMap (free, no key) | none — auto-enabled | Hidden map placeholder |
| Real payment popup (test mode) | Razorpay | `REACT_APP_RAZORPAY_KEY_ID` (`rzp_test_...`) | Simulated payment flow |
| Real email/password auth | Firebase Auth (free tier) | `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID` | Local mock auth |

### Setup

1. Copy the empty `.env` file and fill in the values you have.
2. **Razorpay:** dashboard.razorpay.com → Settings → API Keys → use a test key. Test UPI/cards are listed in the Razorpay docs.
3. **Firebase:** console.firebase.google.com → create project → Authentication → enable Email/Password → Project settings → Your apps → Web → copy the config.
4. Restart `npm start` after editing `.env`.

> Security: the Razorpay key in `.env` is a **test** key and is compiled into the client bundle. Production payments require a server-side order-creation endpoint (do not ship a live key client-side).

## Key Commands

- Lint/type check happens automatically during `npm run build` (CRA).
- Tests: `npm test`.

## Project Structure

- `src/data/` — restaurant normalization (`restaurants.js`), dish catalog + menu builder (`dishCatalog.js`), TheMealDB pool (`mealDB.js`), coupons (`coupons.js`).
- `src/redux/` — cart (`cartSlice.js`), user/auth (`userSlice.js`), orders (`ordersSlice.js`), store config.
- `src/components/` — shared UI (MenuCard, RestaurantCard, AuthModal, CartDrawer, RestaurantMap, Toast, …).
- `src/pages/` — restaurant detail, cart, checkout, order success, orders, search, favourites.
- `src/Json-file/` — mock restaurant JSON data.

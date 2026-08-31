# Ufon Weddings

Handcrafted wedding accessories, made in Akwa Ibom, Nigeria.

Monorepo:

- `server/` — NestJS API (catalog, shipping rates, delivery estimates, orders, Paystack)
- `client/` — React + Vite storefront

## Running locally

```bash
# API (port 4000)
cd server && npm install && npm run start:dev

# Storefront (port 5173, proxies /api to the server)
cd client && npm install && npm run dev
```

## Production build

```bash
cd client && npm install && npm run build
cd ../server && npm install && npm run build && npm run start:prod
```

The server serves the built storefront from `client/dist` when it exists, so one
process hosts both the API and the site.

## Environment (server/.env)

| Variable              | Purpose                                             |
| --------------------- | --------------------------------------------------- |
| `PORT`                | API port (default 4000)                             |
| `PAYSTACK_SECRET_KEY` | Paystack secret. **Unset = mock payment mode**, the checkout completes without charging so the flow can be tested. |
| `CLIENT_URL`          | Public site URL used for the Paystack callback (default http://localhost:5173) |

## Where things live

- Products, categories, personalization settings: `server/src/data/products.ts`, `server/src/data/categories.ts`
- Shipping fees & delivery days per state/city (origin: Uyo, Akwa Ibom): `server/src/data/shipping.ts`
- WhatsApp number: `client/src/config.ts`
- Brand colors: `client/src/index.css` (primary `#C14B23`)

Orders are kept in memory for now — swap `OrdersService`'s Map for a database
when moving beyond sample products.

# Ufon Weddings

Handcrafted wedding accessories, made in Akwa Ibom, Nigeria.

The site is a **conversation starter**: every product is a style the studio
makes, shown with an indicative price range. Customers add pieces to a cart
and send the whole thing as a formatted order request on WhatsApp, where the
specifics, final price, delivery and payment are agreed. No payment is taken
on the site.

Monorepo:

- `server/` : NestJS API (categories, products, delivery-day estimates)
- `client/` : React + Vite storefront
- `tools/` : image tooling (raw photo to web-ready product image set)
- `photos/` : raw product photos, organized by category / product

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
process hosts both the API and the site. `PORT` (default 4000) is the only
environment variable.

## Going live

The repo is set up for Render (render.yaml at the root). In Render: New + >
Blueprint > select this repository > Apply. Render builds with `npm run build`
and starts `npm start`; the health check hits `/api/categories`. Any Node host
works the same way (Railway, Fly.io): build with `npm run build`, start with
`npm start`, port from `PORT`.

To use a custom domain, add it under the service's Settings > Custom Domains
and point the domain's DNS at the target Render shows; HTTPS is automatic.

## Adding products

1. Put photos in `photos/<category-slug>/`:
   - one photo per product: `photos/<category>/<product-slug>.jpeg`
   - several photos of one product: `photos/<category>/<product-slug>/01.jpeg`, `02.jpeg`, …
2. Generate web images (`slide-N.jpg` / `main.jpg`, plus `square.jpg`, `thumb.jpg`)
   into `client/public/images/products/<product-slug>/` : `tools/product-images.mjs`
   does one photo at a time; see its header for usage.
3. Add the product to `server/src/data/products.ts` (price range, make time,
   sizes/colours) and, for a new category, `server/src/data/categories.ts`
   plus a 5:4 tile at `client/public/images/cat-<category-slug>.jpg`.
4. Rebuild the client.

## Where things live

- WhatsApp number & brand details: `client/src/config.ts`
- Order request message format: `client/src/pages/CartPage.tsx`
- Delivery days per state/city (origin Eket): `server/src/data/shipping.ts`
- Brand colors: `client/src/index.css` (primary `#C14B23`)

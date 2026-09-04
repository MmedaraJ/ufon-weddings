# Ufon Weddings — project notes for Claude

Handmade wedding accessories store (NestJS API in `server/`, React/Vite in
`client/`). Owner: the user's mother. Brand goal: be known for high-quality,
handcrafted wedding pieces made in Akwa Ibom, Nigeria. Boutique positioning —
fewer, better products with real photos; never bloat the catalog.

## Catalog size plan (agreed 2026-09-04)

Verify against these targets whenever products are added, removed, or renamed.
When a change moves a category outside its range (or the total past ~70),
say so and ask before proceeding. Real photos > product count: 3 excellent
listings with real photos beat 8 with placeholders.

| Tier | Categories | Target per category |
| --- | --- | --- |
| Hero | wedding-dresses, traditional-attire, bridesmaid-dresses | 6–10 (dresses ~8, covering silhouettes: ball gown, fish/mermaid, A-line, sheath) |
| Core | veils-trains, jewelry, headwear, bouquets-flowers, bridal-shoes | 4–6 |
| Supporting | robes, accessories, reception-dresses, little-bride | 3–4 |

Total at maturity: ~55–70 products. Current sample data is ~3 per category —
that is an acceptable launch shape; grow by replacing samples with real pieces,
hero categories first.

## Conventions

- Wedding gown types in names: "Ball Gown" and "Fish" (fish = mermaid). All
  wedding gowns: silver/off-white/white colors, production time scales with
  quantity (`productionScalesWithQuantity`), and the "similar but not exact
  material" note — enforced in `server/src/data/products.ts` post-processing.
- Prices in NGN, primary color #C14B23, ships from Uyo (rates in
  `server/src/data/shipping.ts`).
- Raw photos land in `photos/` on main; process with `tools/product-images.mjs`
  (or sharp directly) into `client/public/images/products/<slug>/`; category
  tiles are 5:4.
- Work on and push to `main`. Rebuild `client/` after adding images so
  `client/dist` (served by the API in production) picks them up.

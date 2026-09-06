# Ufon Weddings — project notes for Claude

Handmade wedding accessories store (NestJS API in `server/`, React/Vite in
`client/`). Owner: the user's mother. Brand goal: be known for high-quality,
handcrafted wedding pieces made in Akwa Ibom, Nigeria. Boutique positioning —
fewer, better products with real photos; never bloat the catalog.

Business model (since 2026-09-06): the site is a **conversation starter**. No
payments on the site. Products have indicative price ranges (`priceMin`/
`priceMax`), generic style names, and the cart sends a formatted order request
to WhatsApp (number in `client/src/config.ts`), where details, price, delivery
and payment are agreed. Copy everywhere should reinforce "starting point —
customizable — we finalize on WhatsApp".

## Catalog size plan (agreed 2026-09-04)

Verify against these targets whenever products are added, removed, or renamed.
When a change moves a category outside its range (or the total past ~70),
say so and ask before proceeding. Real photos > product count: 3 excellent
listings with real photos beat 8 with placeholders.

| Tier | Categories | Target per category |
| --- | --- | --- |
| Hero | wedding-gowns, bridesmaid-dresses (traditional attire when added) | 6–10 (gowns ~8, covering ball gown, fish/mermaid, A-line, sheath) |
| Core | wedding-bouquets, wedding-veils, wedding-fascinators, wedding-hair-pins, wedding-fans, wedding-purses | 4–6 |
| Supporting | bridal-shower-robes, flower-girl-dresses, bridal-petticoats | 3–4 |

Total at maturity: ~55–70 products. Catalog as of 2026-09-06: 52 real-photo
products across 11 categories (gowns 8, bridesmaid 5, robes 3, flower girl 3,
bouquets 6, veils 2, fascinators 4, hair pins 4, fans 6, purses 3, petticoats 8).
Known gaps vs plan: bridesmaid (5 < 6), veils (2 < 4), purses (3 < 4);
petticoats (8) exceeds its tier; no traditional attire category yet.

## Conventions

- Wedding gown types in names: "Ball Gown" and "Fish" (fish = mermaid). All
  wedding gowns: silver/off-white/white colors, production time scales with
  quantity (`productionScalesWithQuantity`), and the "similar but not exact
  material" note — enforced in `server/src/data/products.ts` post-processing.
- Prices in NGN, primary color #C14B23, ships from Uyo (rates in
  `server/src/data/shipping.ts`).
- Raw photos land in `photos/<category-slug>/` on main — either
  `<product-slug>.jpeg` (one photo) or `<product-slug>/01.jpeg…` (several).
  Process with sharp (`tools/product-images.mjs`) into
  `client/public/images/products/<slug>/` as `main.jpg` or `slide-N.jpg`, plus
  `square.jpg`/`thumb.jpg`; category tiles are 5:4 at
  `client/public/images/cat-<category-slug>.jpg`. Product slug = folder/file name.
- Product names are generic style names (e.g. "Lace A-Line Gown", "Pearl Hoop
  Bridal Bouquet"), not brand/model names.
- Work on and push to `main`. Rebuild `client/` after adding images so
  `client/dist` (served by the API in production) picks them up.

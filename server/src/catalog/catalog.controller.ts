import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { Product } from '../common/types';

// Personalization stays server-side truth: the storefront only ever sees
// `enabled` configs, so hidden (no-machine-yet) options never leak to the UI.
export function publicProduct(product: Product): Product {
  if (product.personalization && !product.personalization.enabled) {
    const { personalization, ...rest } = product;
    return rest;
  }
  return product;
}

@Controller()
export class CatalogController {
  @Get('categories')
  categories() {
    return CATEGORIES.map((c) => ({
      ...c,
      productCount: PRODUCTS.filter((p) => p.categorySlug === c.slug).length,
    }));
  }

  @Get('categories/:slug')
  category(@Param('slug') slug: string) {
    const category = CATEGORIES.find((c) => c.slug === slug);
    if (!category) throw new NotFoundException('Category not found');
    return {
      ...category,
      products: PRODUCTS.filter((p) => p.categorySlug === slug).map(publicProduct),
    };
  }

  @Get('products')
  products(@Query('featured') featured?: string) {
    let list = PRODUCTS;
    if (featured === 'true') list = list.filter((p) => p.featured);
    return list.map(publicProduct);
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (!product) throw new NotFoundException('Product not found');
    const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
    return { ...publicProduct(product), category };
  }
}

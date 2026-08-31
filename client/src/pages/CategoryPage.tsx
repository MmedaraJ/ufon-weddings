import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { Category, Product } from '../types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<(Category & { products: Product[] }) | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setCategory(null);
    api.category(slug).then(setCategory).catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container empty-state">
        <h2>Category not found</h2>
        <Link to="/categories" className="btn btn-primary">Browse all categories</Link>
      </div>
    );
  }
  if (!category) return <div className="container page-head">Loading…</div>;

  return (
    <div className="container">
      <div className="page-head">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/categories">Shop</Link> / {category.name}
        </div>
        <h1>{category.name}</h1>
        <p>{category.tagline}. Handmade to order — chat with us for custom requests.</p>
      </div>
      <div className="section" style={{ paddingTop: 28 }}>
        <div className="grid grid-products">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

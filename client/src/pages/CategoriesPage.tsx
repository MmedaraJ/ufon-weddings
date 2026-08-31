import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Category } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">The collection</div>
        <h1>Shop by category</h1>
        <p>Every piece is handmade in our Akwa Ibom studio and customized for your wedding.</p>
      </div>
      <div className="section" style={{ paddingTop: 28 }}>
        <div className="grid grid-cats">
          {categories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="card">
              <img className="card-img" src={c.image} alt={c.name} loading="lazy" />
              <div className="card-body">
                <h3>{c.name}</h3>
                <p className="card-tagline">{c.tagline}</p>
                <div className="card-meta">{c.productCount} pieces</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Product } from '../types';

// Real product photos, shown large. Grows automatically as products are added.
export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    api.products().then(setProducts).catch(() => {});
  }, []);

  const shots = products.flatMap((p) => p.images.slice(0, 2).map((src) => ({ src, product: p })));

  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">The work</div>
        <h1>Gallery</h1>
        <p>Pieces from the studio — every one a starting point for something made just for you.</p>
      </div>
      <div className="section" style={{ paddingTop: 28 }}>
        <div className="grid grid-gallery">
          {shots.map((s, i) => (
            <Link key={s.src + i} to={`/product/${s.product.slug}`} className="card" style={{ margin: 0 }}>
              <img className="card-img-tall" src={s.src} alt={s.product.name} loading="lazy" />
              <div className="card-body card-tagline">{s.product.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

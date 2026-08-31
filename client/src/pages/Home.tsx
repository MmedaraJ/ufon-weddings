import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { whatsappLink } from '../config';
import { Category, Product } from '../types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.products({ featured: true }).then(setFeatured).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <div className="eyebrow">Handcrafted in Akwa Ibom, Nigeria</div>
            <h1>
              All your wedding needs, <em>made by hand</em> — for you.
            </h1>
            <p className="hero-sub">
              From your dress to your veil, your bouquet to your bridal train's robes — every piece
              is handmade, handcrafted and customized for you and your wedding. Shop it all in one
              place, delivered anywhere in Nigeria.
            </p>
            <div className="hero-ctas">
              <Link to="/categories" className="btn btn-primary">
                Shop the collection
              </Link>
              <a
                className="btn btn-outline"
                href={whatsappLink('Hello Ufon Weddings! I would love to talk about my wedding.')}
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="hero-badges">
              <span className="hero-badge"><span className="dot" /> <strong>100% handmade</strong>&nbsp;to order</span>
              <span className="hero-badge"><span className="dot" /> <strong>Customized</strong>&nbsp;for your day</span>
              <span className="hero-badge"><span className="dot" /> <strong>Nationwide</strong>&nbsp;delivery</span>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero.svg" alt="Handcrafted wedding pieces by Ufon Weddings" />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Shop by category</div>
            <h2>Everything for the bride & her train</h2>
            <p>Dresses, veils, jewelry, bouquets and more — all made in our studio.</p>
          </div>
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
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Bridal favourites</div>
            <h2>Pieces brides love</h2>
          </div>
          <div className="grid grid-products">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="trust-strip">
            <div className="trust-item">
              <div className="trust-icon">🪡</div>
              <h3>Handmade to order</h3>
              <p>Nothing off a shelf. Your piece is cut, sewn and beaded after you order.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🎀</div>
              <h3>Customized for you</h3>
              <p>Your measurements, your colors — and personalization on select pieces.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📦</div>
              <h3>Delivered on time</h3>
              <p>Tell us your event date and we confirm your pieces arrive before the big day.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon">💬</div>
              <h3>A real person on WhatsApp</h3>
              <p>Questions, swatches, adjustments — chat with us any time.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

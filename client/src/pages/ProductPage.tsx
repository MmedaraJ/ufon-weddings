import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../cart';
import Carousel from '../components/Carousel';
import { WhatsAppIcon } from '../components/WhatsAppButton';
import { whatsappLink } from '../config';
import { nairaRange } from '../money';
import { Product } from '../types';

const NOTES_MAX = 300;

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setProduct(null);
    setError('');
    setSize(undefined);
    setColor(undefined);
    setQuantity(1);
    setPersonalization('');
    setNotes('');
    setAdded(false);
    api.product(slug).then(setProduct).catch((e) => setError(e.message));
    window.scrollTo(0, 0);
  }, [slug]);

  if (error) {
    return (
      <div className="container empty-state">
        <h2>Product not found</h2>
        <Link to="/categories" className="btn btn-primary">Browse the collection</Link>
      </div>
    );
  }
  if (!product) return <div className="container page-head">Loading…</div>;

  const pers = product.personalization; // server only sends enabled configs
  const overLimit = pers ? personalization.length > pers.maxLength : false;
  const makeDays = product.productionDays * (product.productionScalesWithQuantity ? quantity : 1);

  const selectionSummary = [
    size && `Size: ${size}`,
    color && `Colour: ${color}`,
    personalization.trim() && `${pers?.label}: ${personalization.trim()}`,
    notes.trim() && `Notes: ${notes.trim()}`,
  ]
    .filter(Boolean)
    .join('\n');

  const chatMessage =
    `Hello Ufon Weddings! I'm interested in the *${product.name}* ` +
    `(${nairaRange(product.priceMin, product.priceMax)}).\n` +
    `Quantity: ${quantity}` +
    (selectionSummary ? `\n${selectionSummary}` : '') +
    `\n\nI'd like to discuss the details and get a quote.`;

  const handleAdd = () => {
    addItem(product, { quantity, size, color, personalizationText: personalization, notes });
    setAdded(true);
  };

  return (
    <div className="container">
      <div className="product-layout">
        <div>
          <div className="breadcrumbs" style={{ marginBottom: 16 }}>
            <Link to="/">Home</Link> / <Link to="/categories">Shop</Link>
            {product.category && (
              <> / <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link></>
            )}
          </div>
          <Carousel images={product.images} alt={product.name} />
        </div>

        <div className="product-info">
          <span className="pill pill-primary">Made to order · customizable</span>
          <h1 style={{ marginTop: 10 }}>{product.name}</h1>
          <div className="product-price">{nairaRange(product.priceMin, product.priceMax)}</div>
          <div className="price-note">Indicative range — final quote agreed with you on WhatsApp</div>
          <p className="product-desc">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="option-block">
              <div className="option-label">
                <span>Size</span>
                <span className="hint">optional — we can take measurements later</span>
              </div>
              <div className="chip-row">
                {product.sizes.map((s) => (
                  <button key={s} className={`chip ${size === s ? 'selected' : ''}`} onClick={() => setSize(size === s ? undefined : s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="option-block">
              <div className="option-label">
                <span>Colour{color ? `: ${color}` : ''}</span>
                <span className="hint">optional — other colours on request</span>
              </div>
              <div className="swatch-row">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className={`swatch ${color === c.name ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    title={c.name}
                    aria-label={`Colour ${c.name}`}
                    onClick={() => setColor(color === c.name ? undefined : c.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {pers && (
            <div className="personalization-box">
              <div className="option-label">
                <span>✨ {pers.label}</span>
                <span className="hint">optional</span>
              </div>
              <input
                type="text"
                value={personalization}
                onChange={(e) => setPersonalization(e.target.value)}
                placeholder={pers.placeholder}
                maxLength={pers.maxLength + 20}
              />
              <div className={`char-count ${overLimit ? 'over' : ''}`}>
                {personalization.length}/{pers.maxLength} characters
                {overLimit && ' — too long'}
              </div>
            </div>
          )}

          <div className="option-block">
            <div className="option-label">
              <span>Your notes</span>
              <span className="hint">optional · {notes.length}/{NOTES_MAX}</span>
            </div>
            <textarea
              className="notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX))}
              placeholder="Anything you'd like changed — neckline, fabric, colour, length, your event date…"
            />
          </div>

          <div className="option-block">
            <div className="option-label"><span>Quantity</span></div>
            <div className="qty-stepper">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(50, q + 1))} aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div className="buy-row">
            {added ? (
              <>
                <button className="btn btn-primary" onClick={() => navigate('/cart')}>View cart & send request →</button>
                <button className="btn btn-outline" onClick={() => setAdded(false)}>Add another</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleAdd} disabled={overLimit}>
                Add to cart
              </button>
            )}
            <a className="btn btn-whatsapp" href={whatsappLink(chatMessage)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> Chat about this on WhatsApp
            </a>
          </div>

          <div className="made-note">
            <span>🪡</span>
            <span>
              <strong>Made for you in ~{makeDays} days</strong>
              {product.productionScalesWithQuantity && quantity > 1 && <> ({product.productionDays} days per piece)</>}
              , then delivered from our studio in Uyo, Akwa Ibom. Share your event date and we'll
              confirm it arrives in good time.
            </span>
          </div>

          <ul className="details-list">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

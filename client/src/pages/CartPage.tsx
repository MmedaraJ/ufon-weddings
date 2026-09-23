import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, asset } from '../api';
import { cartKey, itemProductionDays, useCart } from '../cart';
import { WhatsAppIcon } from '../components/WhatsAppButton';
import { whatsappLink } from '../config';
import { formatDate, naira, nairaRange } from '../money';
import { ShippingLocations } from '../types';

function isoPlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  const pad = (x: number) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function CartPage() {
  const { items, totalMin, totalMax, longestProductionDays, updateQuantity, removeItem, clear } = useCart();
  const [locations, setLocations] = useState<ShippingLocations | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.shippingLocations().then(setLocations).catch(() => {});
  }, []);

  const stateInfo = locations?.states.find((s) => s.state === state);
  const cityInfo = stateInfo?.cities.find((c) => c.city === city);
  const deliveryDays = cityInfo?.days ?? stateInfo?.days;

  const estimate = useMemo(() => {
    if (!deliveryDays || items.length === 0) return null;
    const eta = isoPlusDays(longestProductionDays + deliveryDays);
    if (!eventDate) return { eta, status: null as null | 'comfortable' | 'tight' | 'late' };
    const safe = isoPlusDays(longestProductionDays + deliveryDays + (locations?.safetyBufferDays ?? 3));
    const status = eventDate >= safe ? 'comfortable' : eventDate >= eta ? 'tight' : 'late';
    return { eta, status };
  }, [deliveryDays, items.length, longestProductionDays, eventDate, locations]);

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p>Add the pieces you like, then send them to us on WhatsApp and we'll take it from there.</p>
        <Link to="/categories" className="btn btn-primary">Browse the collection</Link>
      </div>
    );
  }

  const ready = Boolean(name.trim() && phone.trim() && state && city);

  // The WhatsApp message IS the order request: everything the studio needs to
  // pick up the conversation, in one readable block.
  const message = [
    'Hello Ufon Weddings! 👋',
    "I'd like to request an order.",
    '',
    '*ORDER REQUEST*',
    ...items.flatMap((i, idx) => {
      const lines = [`${idx + 1}. *${i.name}* × ${i.quantity}`];
      const opts = [i.size && `Size: ${i.size}`, i.color && `Colour: ${i.color}`].filter(Boolean).join(' · ');
      if (opts) lines.push(`   ${opts}`);
      if (i.personalizationText) lines.push(`   Personalization: ${i.personalizationText}`);
      if (i.notes) lines.push(`   Notes: ${i.notes}`);
      lines.push(`   Est. ${nairaRange(i.priceMin * i.quantity, i.priceMax * i.quantity)}`);
      return lines;
    }),
    '',
    `*Estimated total:* ${nairaRange(totalMin, totalMax)} (before delivery)`,
    '',
    '*MY DETAILS*',
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    `Event date: ${eventDate ? formatDate(eventDate) : 'not set yet'}`,
    `Delivery to: ${city}, ${state}`,
    `Additional notes: ${notes.trim() || 'none'}`,
    '',
    'Please confirm availability, final pricing and delivery. Thank you!',
    '(sent from the Ufon Weddings website)',
  ].join('\n');

  return (
    <div className="container">
      <div className="page-head">
        <h1>Your cart</h1>
        <p>
          Review your picks, add your details, and send everything to us on WhatsApp. We'll confirm
          the specifics, final price and delivery in the chat. No payment is taken on this site.
        </p>
      </div>
      <div className="cart-layout">
        <div>
          <div className="cart-lines">
            {items.map((item) => {
              const key = cartKey(item);
              return (
                <div key={key} className="cart-line">
                  <Link to={`/product/${item.slug}`}>
                    <img src={asset(item.image)} alt={item.name} />
                  </Link>
                  <div>
                    <h3><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                    <div className="cart-line-meta">
                      {item.size && <>Size: {item.size} · </>}
                      {item.color && <>Colour: {item.color} · </>}
                      Made in ~{itemProductionDays(item)} days
                    </div>
                    {item.personalizationText && (
                      <div className="cart-line-meta">✨ Personalization: “{item.personalizationText}”</div>
                    )}
                    {item.notes && <div className="cart-line-meta">📝 {item.notes}</div>}
                    <div className="qty-row" style={{ marginTop: 10 }}>
                      <div className="qty-stepper">
                        <button onClick={() => updateQuantity(key, item.quantity - 1)} aria-label="Decrease">−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(key, item.quantity + 1)} aria-label="Increase">+</button>
                      </div>
                      <button className="link-btn" onClick={() => removeItem(key)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-line-price">
                    {nairaRange(item.priceMin * item.quantity, item.priceMax * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-section" style={{ marginTop: 24 }}>
            <h2>Your details <span className="optional-tag">so we know who we are talking to</span></h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Your name *</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Adaeze Okon" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone / WhatsApp number *</label>
                <input id="phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" />
              </div>
              <div className="form-field">
                <label htmlFor="eventDate">Wedding / event date <span className="optional">(optional)</span></label>
                <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} min={isoPlusDays(0)} />
              </div>
              <div className="form-field">
                <label htmlFor="state">Delivery state *</label>
                <select id="state" required value={state} onChange={(e) => { setState(e.target.value); setCity(''); }}>
                  <option value="">Select state…</option>
                  {locations?.states.map((s) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="city">Delivery city *</label>
                <select id="city" required value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
                  <option value="">{state ? 'Select city…' : 'Select a state first'}</option>
                  {stateInfo?.cities.map((c) => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="notes">Anything else? <span className="optional">(optional)</span></label>
                <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 500))} placeholder="Budget, colour theme, measurements, questions…" />
              </div>
            </div>

            {estimate?.status === 'comfortable' && (
              <div className="banner banner-success"><span>✓</span><span>Estimated ready & delivered by <strong>{formatDate(estimate.eta)}</strong> , comfortably before your event.</span></div>
            )}
            {estimate?.status === 'tight' && (
              <div className="banner banner-warning"><span>⚠</span><span>Estimated ready & delivered by <strong>{formatDate(estimate.eta)}</strong> , close to your event date. Mention this in the chat so we can plan around it.</span></div>
            )}
            {estimate?.status === 'late' && (
              <div className="banner banner-danger"><span>✕</span><span>Estimated ready & delivered by <strong>{formatDate(estimate.eta)}</strong> , after your event date. Send the request anyway; we'll talk through rush options.</span></div>
            )}
            {estimate && !estimate.status && (
              <div className="banner banner-info"><span>🪡</span><span>Estimated ready & delivered by <strong>{formatDate(estimate.eta)}</strong> for {city}, {state}.</span></div>
            )}
          </div>
        </div>

        <div className="summary-card">
          <h2>Order request</h2>
          {items.map((i) => (
            <div key={cartKey(i)} className="summary-row">
              <span>{i.quantity} × {i.name}</span>
              <span>{nairaRange(i.priceMin * i.quantity, i.priceMax * i.quantity)}</span>
            </div>
          ))}
          <div className="summary-row summary-total">
            <span>Estimated total</span>
            <strong>{nairaRange(totalMin, totalMax)}</strong>
          </div>
          <p className="field-hint">
            Ranges are indicative. Delivery is quoted separately. Your final price is agreed on WhatsApp.
          </p>
          {ready ? (
            <a className="btn btn-whatsapp btn-block" href={whatsappLink(message)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={20} /> Send order request on WhatsApp
            </a>
          ) : (
            <button className="btn btn-whatsapp btn-block" disabled title="Fill in your name, phone and delivery location first">
              <WhatsAppIcon size={20} /> Send order request on WhatsApp
            </button>
          )}
          {!ready && (
            <p className="field-hint" style={{ marginTop: 8, color: 'var(--danger)' }}>
              Please add your name, phone number and delivery state/city so we know who to reply to.
            </p>
          )}
          <p className="field-hint" style={{ marginTop: 12 }}>
            This opens WhatsApp with your order written out. Just press send. We usually reply within
            the day. Longest piece in this cart: ~{longestProductionDays} days to make.
          </p>
          <button className="link-btn" style={{ marginTop: 10 }} onClick={() => { if (confirm('Clear your cart?')) clear(); }}>
            Clear cart
          </button>
          <div className="summary-row" style={{ marginTop: 14, fontSize: 13 }}>
            <span>Prefer to talk first?</span>
            <a href={whatsappLink(`Hello! I have a question about a few items (est. ${naira(totalMin)}+).`)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Ask a question
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

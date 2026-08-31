import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../cart';
import { WhatsAppIcon } from '../components/WhatsAppButton';
import { whatsappLink } from '../config';
import { formatDate, naira } from '../money';
import { Quote, ShippingLocations } from '../types';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [locations, setLocations] = useState<ShippingLocations | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const cartItemsPayload = useMemo(
    () =>
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        personalizationText: i.personalizationText,
      })),
    [items],
  );

  useEffect(() => {
    api.shippingLocations().then(setLocations).catch(() => {});
  }, []);

  // Re-quote whenever destination or event date changes.
  useEffect(() => {
    if (!state || !city || items.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    api
      .quote({ items: cartItemsPayload, state, city, eventDate: eventDate || undefined })
      .then((q) => !cancelled && setQuote(q))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [state, city, eventDate, cartItemsPayload, items.length]);

  const cities = locations?.states.find((s) => s.state === state)?.cities ?? [];

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Nothing to check out yet</h2>
        <Link to="/categories" className="btn btn-primary">Shop the collection</Link>
      </div>
    );
  }

  const handlePay = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setPaying(true);
    try {
      const { authorizationUrl } = await api.createOrder({
        items: cartItemsPayload,
        customer: {
          fullName,
          phone,
          email,
          address,
          state,
          city,
          eventDate: eventDate || undefined,
          orderNotes: orderNotes || undefined,
        },
      });
      window.location.href = authorizationUrl; // Paystack (or mock) payment page
    } catch (err) {
      setError((err as Error).message);
      setPaying(false);
    }
  };

  const banner = quote?.eventDateStatus && quote.estimatedDeliveryDate && (
    <>
      {quote.eventDateStatus === 'comfortable' && (
        <div className="banner banner-success">
          <span>✓</span>
          <span>
            Estimated delivery <strong>{formatDate(quote.estimatedDeliveryDate)}</strong> — arrives
            comfortably before your big day.
          </span>
        </div>
      )}
      {quote.eventDateStatus === 'tight' && (
        <div className="banner banner-warning">
          <span>⚠</span>
          <span>
            Estimated delivery <strong>{formatDate(quote.estimatedDeliveryDate)}</strong> — that's
            cutting it close to your event. We recommend{' '}
            <a href={whatsappLink('Hello! My event date is close — can you confirm my order will arrive in time?')} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
              confirming on WhatsApp
            </a>{' '}
            before you pay.
          </span>
        </div>
      )}
      {quote.eventDateStatus === 'late' && (
        <div className="banner banner-danger">
          <span>✕</span>
          <span>
            Estimated delivery <strong>{formatDate(quote.estimatedDeliveryDate)}</strong> — this may
            arrive <strong>after</strong> your event date. Please{' '}
            <a href={whatsappLink('Hello! I need pieces before my event date but the estimate is late. Can you help with a rush order?')} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
              chat with us about a rush order
            </a>{' '}
            before paying.
          </span>
        </div>
      )}
    </>
  );

  return (
    <div className="container">
      <div className="page-head">
        <h1>Checkout</h1>
        <p>Handmade in Akwa Ibom, shipped from Uyo to your door.</p>
      </div>
      <form className="cart-layout" onSubmit={handlePay}>
        <div>
          <div className="checkout-section">
            <h2>Your details</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adaeze Okon" />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone (WhatsApp preferred)</label>
                <input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" />
              </div>
              <div className="form-field full">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                <span className="field-hint">Your payment receipt goes here.</span>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2>Delivery</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  required
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity('');
                  }}
                >
                  <option value="">Select state…</option>
                  {locations?.states.map((s) => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="city">City</label>
                <select id="city" required value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
                  <option value="">{state ? 'Select city…' : 'Select a state first'}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-field full">
                <label htmlFor="address">Street address</label>
                <input id="address" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House number, street, landmark" />
              </div>
              <div className="form-field">
                <label htmlFor="eventDate">
                  Wedding / event date <span className="optional">(optional)</span>
                </label>
                <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
                <span className="field-hint">We'll check your order arrives before it.</span>
              </div>
              <div className="form-field">
                <label htmlFor="notes">
                  Order notes <span className="optional">(optional)</span>
                </label>
                <input id="notes" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Measurements, color notes…" maxLength={1000} />
              </div>
            </div>
            {banner}
          </div>
        </div>

        <div className="summary-card">
          <h2>Order summary</h2>
          {items.map((i) => (
            <div key={`${i.productId}${i.size}${i.color}${i.personalizationText}`} className="summary-row">
              <span>
                {i.quantity} × {i.name}
                {i.personalizationText ? ' ✨' : ''}
              </span>
              <span>{naira((i.price + i.personalizationFee) * i.quantity)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><strong>{naira(quote?.subtotal ?? subtotal)}</strong></div>
          <div className="summary-row">
            <span>Shipping{quote?.shipping ? ` to ${quote.shipping.city}` : ''}</span>
            {quote?.shipping ? <strong>{naira(quote.shipping.fee)}</strong> : <span>select location</span>}
          </div>
          {quote?.estimatedDeliveryDate && !eventDate && (
            <div className="summary-row">
              <span>Estimated delivery</span>
              <strong>{formatDate(quote.estimatedDeliveryDate)}</strong>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total</span>
            <strong>{naira(quote?.total ?? subtotal)}</strong>
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary btn-block" type="submit" disabled={!quote || paying}>
            {paying ? 'Starting payment…' : `Pay ${naira(quote?.total ?? subtotal)} with Paystack`}
          </button>
          <a
            className="btn btn-ghost btn-block"
            style={{ marginTop: 10 }}
            href={whatsappLink('Hello! I have a question about my order before I pay.')}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={18} color="#25D366" /> Questions? Chat with us
          </a>
          <p className="field-hint" style={{ marginTop: 12 }}>
            Payments are processed securely by Paystack. Made-to-order pieces begin production once
            payment is confirmed.
          </p>
        </div>
      </form>
    </div>
  );
}

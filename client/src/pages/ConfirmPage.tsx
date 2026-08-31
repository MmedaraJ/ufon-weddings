import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../cart';
import { whatsappLink } from '../config';
import { formatDate, naira } from '../money';
import { Order } from '../types';

export default function ConfirmPage() {
  const [params] = useSearchParams();
  // Paystack redirects back with ?reference= (or ?trxref=); mock mode uses the same shape.
  const reference = params.get('reference') || params.get('trxref') || '';
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const cleared = useRef(false);

  useEffect(() => {
    if (!reference) {
      setError('Missing payment reference.');
      return;
    }
    api
      .verifyOrder(reference)
      .then((o) => {
        setOrder(o);
        if (o.status === 'paid' && !cleared.current) {
          cleared.current = true;
          clear();
        }
      })
      .catch((e) => setError(e.message));
  }, [reference, clear]);

  if (error) {
    return (
      <div className="container empty-state">
        <h2>We couldn't confirm that payment</h2>
        <p>{error}</p>
        <a className="btn btn-primary" href={whatsappLink(`Hello! I paid for an order but could not confirm it. Reference: ${reference || 'unknown'}`)} target="_blank" rel="noreferrer">
          Chat with us on WhatsApp
        </a>
      </div>
    );
  }
  if (!order) return <div className="container page-head">Confirming your payment…</div>;

  const paid = order.status === 'paid';
  return (
    <div className="container">
      <div className="confirm-card">
        <div className="big-check">{paid ? '🎉' : '⏳'}</div>
        <h1>{paid ? 'Thank you! Your order is in.' : 'Payment pending'}</h1>
        <p style={{ color: 'var(--muted)' }}>
          {paid
            ? 'Our hands are already itching to get started. We will reach out on WhatsApp to confirm your measurements and details.'
            : 'We have not confirmed this payment yet. If you completed payment, give it a moment or chat with us.'}
        </p>
        <div className="confirm-ref">{order.reference}</div>
        {order.mock && (
          <div className="banner banner-info">
            <span>🧪</span>
            <span>Test mode: no real payment was taken. Connect a Paystack key to go live.</span>
          </div>
        )}
        <div className="confirm-lines">
          {order.quote.items.map((i, idx) => (
            <div key={idx} className="summary-row">
              <span>
                {i.quantity} × {i.name}
                {i.personalizationText && <> — ✨ “{i.personalizationText}”</>}
              </span>
              <span>{naira(i.lineTotal)}</span>
            </div>
          ))}
          {order.quote.shipping && (
            <div className="summary-row">
              <span>Shipping to {order.quote.shipping.city}, {order.quote.shipping.state}</span>
              <span>{naira(order.quote.shipping.fee)}</span>
            </div>
          )}
          <div className="summary-row summary-total">
            <span>Total {paid ? 'paid' : 'due'}</span>
            <strong>{naira(order.quote.total)}</strong>
          </div>
          {order.quote.estimatedDeliveryDate && (
            <div className="summary-row">
              <span>Estimated delivery</span>
              <strong>{formatDate(order.quote.estimatedDeliveryDate)}</strong>
            </div>
          )}
        </div>
        <div className="hero-ctas" style={{ justifyContent: 'center' }}>
          <a className="btn btn-primary" href={whatsappLink(`Hello! I just placed order ${order.reference}. Excited!`)} target="_blank" rel="noreferrer">
            Chat with us about your order
          </a>
          <Link to="/categories" className="btn btn-outline">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { cartKey, useCart } from '../cart';
import { naira } from '../money';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container empty-state">
        <h2>Your cart is empty</h2>
        <p>Every piece is handmade to order — find something made for you.</p>
        <Link to="/categories" className="btn btn-primary">Shop the collection</Link>
      </div>
    );
  }

  const maxProduction = Math.max(...items.map((i) => i.productionDays));

  return (
    <div className="container">
      <div className="page-head">
        <h1>Your cart</h1>
      </div>
      <div className="cart-layout">
        <div className="cart-lines">
          {items.map((item) => {
            const key = cartKey(item);
            return (
              <div key={key} className="cart-line">
                <Link to={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
                <div>
                  <h3><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                  <div className="cart-line-meta">
                    {item.size && <>Size: {item.size} · </>}
                    {item.color && <>Color: {item.color} · </>}
                    Made in ~{item.productionDays} days
                  </div>
                  {item.personalizationText && (
                    <div className="cart-line-meta">
                      ✨ Personalized: “{item.personalizationText}” (+{naira(item.personalizationFee)})
                    </div>
                  )}
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
                  {naira((item.price + item.personalizationFee) * item.quantity)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="summary-card">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal</span><strong>{naira(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><span>calculated at checkout</span></div>
          <div className="summary-row summary-total"><span>Total</span><strong>{naira(subtotal)}</strong></div>
          <div className="banner banner-info">
            <span>🪡</span>
            <span>Your longest piece takes ~{maxProduction} days to make. We'll show your delivery
            estimate once you choose your location at checkout.</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
}

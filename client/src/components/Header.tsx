import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../cart';

const links = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Shop' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">Ufon</span>
          <span className="logo-sub">Weddings</span>
        </Link>
        <nav className={`main-nav ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7z" />
              <path d="M9 7V6a3 3 0 0 1 6 0v1" />
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

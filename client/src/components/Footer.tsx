import { Link } from 'react-router-dom';
import { BRAND, whatsappLink } from '../config';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3>Ufon Weddings</h3>
            <p>
              Handmade wedding accessories, handcrafted in {BRAND.origin} and customized for you
              and your wedding. Every stitch, bead and hem is finished by hand in our Eket studio,
              then shipped anywhere in Nigeria.
            </p>
          </div>
          <div>
            <h3>Shop</h3>
            <Link to="/categories">All categories</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">Our story</Link>
            <Link to="/cart">Your cart</Link>
          </div>
          <div>
            <h3>Talk to us</h3>
            <a href={whatsappLink('Hello Ufon Weddings!')} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            <p>Orders are agreed on WhatsApp · Nationwide delivery from Eket</p>
          </div>
        </div>
        <div className="footer-note">
          <span>© {new Date().getFullYear()} Ufon Weddings. All rights reserved.</span>
          <span>Handcrafted with love in Akwa Ibom, Nigeria 🇳🇬</span>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { whatsappLink } from '../config';

export default function AboutPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">Our story</div>
        <h1>Handcrafted in Akwa Ibom, with love</h1>
      </div>
      <div className="about-layout">
        <img src="/images/about-portrait.svg" alt="The founder of Ufon Weddings" />
        <div className="about-copy">
          {/* TODO: replace with the founder's real story and photo */}
          <p>
            Ufon Weddings began in a small studio in Uyo, Akwa Ibom, with one belief: the things you
            wear and carry on your wedding day should be made for <em>you</em> — not pulled off a
            shelf.
          </p>
          <p>
            Every dress, veil, crown and bouquet that leaves our studio is handmade to order. We
            cut, sew, bead and embroider by hand, working with each bride on her measurements, her
            colors and the small personal touches that make a piece hers.
          </p>
          <h2>Why we talk before we sew</h2>
          <p>
            Because your wedding is one day, and everything has to be right. The styles on this site
            are starting points — you tell us what you love, and we agree the fabric, colours,
            measurements, price and delivery together on WhatsApp before a single stitch. Share your
            event date and we make sure everything is in your hands before it, with time to spare.
          </p>
          <h2>From Uyo to anywhere in Nigeria</h2>
          <p>
            We ship nationwide from Akwa Ibom, with delivery estimates for every state and city. And
            you can always reach a real person on WhatsApp — for swatches, adjustments, or just to
            talk through your ideas.
          </p>
          <div className="hero-ctas" style={{ marginTop: 24 }}>
            <Link to="/categories" className="btn btn-primary">Browse the collection</Link>
            <a className="btn btn-outline" href={whatsappLink('Hello! I read your story and I would love to chat about my wedding.')} target="_blank" rel="noreferrer">
              Say hello on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

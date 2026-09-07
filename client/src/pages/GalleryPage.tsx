import { whatsappLink } from '../config';

// Reserved for photos of real customers wearing and using our pieces. Add
// entries to SHOTS as customers share their photos (with permission).
const SHOTS: { src: string; caption: string }[] = [];

export default function GalleryPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">Real weddings</div>
        <h1>Gallery</h1>
        <p>Our brides, their trains and their big days, wearing pieces made in our Eket studio.</p>
      </div>
      {SHOTS.length === 0 ? (
        <div className="empty-state">
          <h2>Customer photos coming soon</h2>
          <p>
            We are collecting photos from recent weddings. If we made something for your day, we would
            love to feature you here.
          </p>
          <a className="btn btn-outline" href={whatsappLink('Hello! I would love to share photos from my wedding for your gallery.')} target="_blank" rel="noreferrer">
            Share your wedding photos
          </a>
        </div>
      ) : (
        <div className="section" style={{ paddingTop: 28 }}>
          <div className="grid grid-gallery">
            {SHOTS.map((s) => (
              <figure key={s.src} className="card" style={{ margin: 0 }}>
                <img className="card-img-tall" src={s.src} alt={s.caption} loading="lazy" />
                <figcaption className="card-body card-tagline">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

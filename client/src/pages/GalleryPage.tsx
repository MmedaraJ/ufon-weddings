const SHOTS = [1, 2, 3, 4, 5, 6, 7, 8, 1, 3, 5, 7].map((n, i) => ({
  src: `/images/ph-${n}.svg`,
  caption: [
    'Adaeze in her Adiaha ballgown, Uyo',
    'Hand-beading a cathedral veil',
    'Bridal train in Ekaette wrap dresses',
    'Coral crown, traditional ceremony',
    'The everlasting silk bouquet',
    'Morning-of robes for the girls',
    'Aso-oke set, engagement day',
    'Pearl-strap heels, first dance',
    'Embroidered hankie detail',
    'Little bride matching the big one',
    'Studio work in progress',
    'Boutonnieres ready for pickup',
  ][i],
}));

// Placeholder gallery — replace images with real photos of products in use.
export default function GalleryPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="eyebrow">Real weddings</div>
        <h1>Gallery</h1>
        <p>
          Our pieces out in the world — on brides, trains and aisles across Nigeria. Real photos
          coming soon; these are placeholders while we shoot them.
        </p>
      </div>
      <div className="section" style={{ paddingTop: 28 }}>
        <div className="grid grid-gallery">
          {SHOTS.map((s, i) => (
            <figure key={i} className="card" style={{ margin: 0 }}>
              <img className="card-img" src={s.src} alt={s.caption} loading="lazy" />
              <figcaption className="card-body card-tagline">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

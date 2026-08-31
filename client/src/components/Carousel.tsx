import { useState } from 'react';

// Simple image carousel with arrows and thumbnails. Works the same for real
// photos and videos later — swap the <img> for a media component per slide.
export default function Carousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const go = (delta: number) => setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div>
      <div className="carousel-main">
        <img src={images[index]} alt={`${alt} — photo ${index + 1}`} />
        {images.length > 1 && (
          <>
            <button className="carousel-nav carousel-prev" onClick={() => go(-1)} aria-label="Previous image">
              ‹
            </button>
            <button className="carousel-nav carousel-next" onClick={() => go(1)} aria-label="Next image">
              ›
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((src, i) => (
            <button key={src + i} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

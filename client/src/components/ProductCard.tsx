import { Link } from 'react-router-dom';
import { naira } from '../money';
import { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.slug}`} className="card">
      <img className="card-img-tall" src={product.images[0]} alt={product.name} loading="lazy" />
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="card-price">{naira(product.price)}</div>
        <div className="card-meta">Made to order · ~{product.productionDays} days</div>
      </div>
    </Link>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../api/client';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProduct(Number(id))
      .then(res => setProduct(res.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-8 w-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline text-sm">
          ← Back to products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
        ← Back to products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-50 flex items-center justify-center h-72 md:h-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>

          <div className="p-8 flex flex-col gap-4">
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
              {product.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-gray-400 font-mono">SKU: {product.sku}</p>

            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              {product.description}
            </p>

            {product.weightKg && (
              <p className="text-xs text-gray-400">Weight: {product.weightKg} kg</p>
            )}

            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-red-100 text-red-600'
                  : product.stock < 10
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
              </span>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Qty:</label>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={e => setQuantity(Math.min(Number(e.target.value), product.stock))}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
            >
              {added ? '✓ Added to Cart' : isOutOfStock ? 'Unavailable' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

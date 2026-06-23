import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gray-50 h-48 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
          {product.category}
        </span>

        <Link to={`/products/${product.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-gray-900">
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

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-xl transition-colors"
        >
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

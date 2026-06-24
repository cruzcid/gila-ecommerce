import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">
          ← Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="bg-gray-50 rounded-xl h-16 w-16 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
              <p className="text-sm text-indigo-600 font-medium mt-0.5">
                ${product.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-7 w-7 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center text-lg transition-colors"
              >−</button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                disabled={quantity >= product.stock}
                className="h-7 w-7 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-600 flex items-center justify-center text-lg transition-colors"
              >+</button>
            </div>

            <div className="text-right shrink-0 w-20">
              <p className="font-bold text-gray-900">
                ${(product.price * quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Proceed to Checkout
        </button>
        <Link to="/" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

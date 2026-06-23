import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, checkout } from '../api/client';
import { useCart } from '../context/CartContext';
import type { PaymentResponse } from '../types';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<PaymentResponse | null>(null);

  const set = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  if (items.length === 0 && !receipt) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/" className="text-indigo-600 hover:underline text-sm">← Browse products</Link>
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm mb-6">{receipt.message}</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm mb-8">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium">#{receipt.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-mono text-xs text-gray-700 break-all">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount charged</span>
              <span className="font-bold text-gray-900">${receipt.amount.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const orderRes = await createOrder({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });

      const paymentRes = await checkout({
        orderId: orderRes.data.id,
        cardholderName: form.cardholderName,
        cardNumber: form.cardNumber,
        expiryDate: form.expiryDate,
        cvv: form.cvv,
        email: form.customerEmail,
      });

      clearCart();
      setReceipt(paymentRes.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Payment failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/cart" className="text-sm text-indigo-600 hover:underline mb-6 inline-block">
        ← Back to cart
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">Customer Information</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
              <input className={inputClass} required value={form.customerName}
                onChange={e => set('customerName', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input className={inputClass} type="email" required value={form.customerEmail}
                onChange={e => set('customerEmail', e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Payment Details</h2>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Simulated</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder Name *</label>
              <input className={inputClass} required value={form.cardholderName}
                onChange={e => set('cardholderName', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Card Number *</label>
              <input className={inputClass} required placeholder="1234 5678 9012 3456"
                maxLength={19} value={form.cardNumber}
                onChange={e => set('cardNumber', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry *</label>
                <input className={inputClass} required placeholder="MM/YY" maxLength={5}
                  value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">CVV *</label>
                <input className={inputClass} required placeholder="123" maxLength={4}
                  value={form.cvv} onChange={e => set('cvv', e.target.value)} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors">
            {loading ? 'Processing…' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {product.name} × {quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-bold text-lg text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

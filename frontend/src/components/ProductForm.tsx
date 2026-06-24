import { useState } from 'react';
import type { Product, ProductRequest } from '../types';

interface Props {
  initial?: Product;
  onSubmit: (data: ProductRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const empty: ProductRequest = {
  name: '',
  sku: '',
  description: '',
  category: '',
  price: 0,
  stock: 0,
  weightKg: null,
};

export default function ProductForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState<ProductRequest>(
    initial
      ? {
          name: initial.name,
          sku: initial.sku,
          description: initial.description,
          category: initial.category,
          price: initial.price,
          stock: initial.stock,
          weightKg: initial.weightKg,
        }
      : empty
  );
  const [error, setError] = useState('');

  const set = (field: keyof ProductRequest, value: string | number | null) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Something went wrong';
      setError(msg);
    }
  };

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
          <input className={inputClass} value={form.name} required
            onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
          <input className={inputClass} value={form.sku} required
            onChange={e => set('sku', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea className={inputClass} rows={3} value={form.description}
          onChange={e => set('description', e.target.value)} />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
        <input className={inputClass} value={form.category} required
          onChange={e => set('category', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Price ($) *</label>
          <input className={inputClass} type="number" min="0.01" step="0.01"
            value={form.price} required
            onChange={e => set('price', parseFloat(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
          <input className={inputClass} type="number" min="0" step="1"
            value={form.stock} required
            onChange={e => set('stock', parseInt(e.target.value))} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
          <input className={inputClass} type="number" min="0" step="0.001"
            value={form.weightKg ?? ''}
            onChange={e =>
              set('weightKg', e.target.value ? parseFloat(e.target.value) : null)
            } />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl transition-colors">
          {loading ? 'Saving…' : initial ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

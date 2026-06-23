import axios from 'axios';
import type {
  ImportLog,
  Order,
  OrderRequest,
  PaymentRequest,
  PaymentResponse,
  Product,
  ProductRequest,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getProducts = (search?: string, category?: string) => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (category) params.category = category;
  return api.get<Product[]>('/products', { params });
};

export const getProduct = (id: number) =>
  api.get<Product>(`/products/${id}`);

export const createProduct = (data: ProductRequest) =>
  api.post<Product>('/products', data);

export const updateProduct = (id: number, data: ProductRequest) =>
  api.put<Product>(`/products/${id}`, data);

export const deleteProduct = (id: number) =>
  api.delete(`/products/${id}`);

export const importProductsCsv = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return api.post<Product[]>('/products/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getOrders = () => api.get<Order[]>('/orders');

export const getOrder = (id: number) => api.get<Order>(`/orders/${id}`);

export const createOrder = (data: OrderRequest) =>
  api.post<Order>('/orders', data);

export const checkout = (data: PaymentRequest) =>
  api.post<PaymentResponse>('/payments/checkout', data);

export const getImportLogs = () => api.get<ImportLog[]>('/import-logs');

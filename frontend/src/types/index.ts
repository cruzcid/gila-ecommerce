export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  weightKg: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  weightKg: number | null;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
}

export interface PaymentRequest {
  orderId: number;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

export interface PaymentResponse {
  transactionId: string;
  orderId: number;
  amount: number;
  status: string;
  message: string;
  processedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ImportLog {
  id: string;
  fileName: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  skipped: string[];
  errors: string[];
  importedAt: string;
}

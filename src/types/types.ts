export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  origin: string | null;
  price: number;
  weight: string | null;
  shelf_life: string | null;
  storage: string | null;
  farming_method: string | null;
  certification: string | null;
  category_id: string | null;
  image_url: string | null;
  thumbnail_urls: string[] | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_deal: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: ShippingAddress | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  product_id?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  payment_method: 'card' | 'upi' | 'cod';
}

import { supabase } from './supabase';
import type { Product, Category, Review, Order } from '@/types';

// Categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Products
export async function getProducts(params?: {
  category_id?: string;
  is_featured?: boolean;
  is_deal?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories(*)');

  if (params?.category_id) {
    query = query.eq('category_id', params.category_id);
  }

  if (params?.is_featured !== undefined) {
    query = query.eq('is_featured', params.is_featured);
  }

  if (params?.is_deal !== undefined) {
    query = query.eq('is_deal', params.is_deal);
  }

  // Sorting
  if (params?.sort_by === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (params?.sort_by === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else if (params?.sort_by === 'rating') {
    query = query.order('rating', { ascending: false });
  } else if (params?.sort_by === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 12) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', productId)
    .limit(limit)
    .order('rating', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,origin.ilike.%${query}%`)
    .limit(20)
    .order('rating', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

// Reviews
export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createReview(review: {
  product_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: review.product_id,
      customer_name: review.customer_name,
      rating: review.rating,
      comment: review.comment || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Newsletter
export async function subscribeNewsletter(email: string): Promise<void> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email });

  if (error) throw error;
}

// Orders
export async function getOrderBySessionId(sessionId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

import type { Category, Product, Review } from "@/types";
import { mockCategories, mockProducts, mockReviewsByProductId } from "./mock-data";

const REVIEW_STORAGE_KEY = "terra_local_reviews";
const NEWSLETTER_STORAGE_KEY = "terra_local_newsletter";

type ProductQuery = {
  category_id?: string;
  is_featured?: boolean;
  is_deal?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: "price_asc" | "price_desc" | "rating" | "newest";
};

function sortProducts(products: Product[], sortBy: ProductQuery["sort_by"]) {
  const sorted = [...products];

  switch (sortBy) {
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
    default:
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return sorted;
}

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (error) {
    console.warn(`Unable to read local demo data for "${key}".`, error);
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return mockCategories.find((category) => category.slug === slug) ?? null;
}

export async function getProducts(params?: ProductQuery): Promise<Product[]> {
  let products = [...mockProducts];

  if (params?.category_id) {
    products = products.filter((product) => product.category_id === params.category_id);
  }
  if (params?.is_featured !== undefined) {
    products = products.filter((product) => product.is_featured === params.is_featured);
  }
  if (params?.is_deal !== undefined) {
    products = products.filter((product) => product.is_deal === params.is_deal);
  }

  const sorted = sortProducts(products, params?.sort_by);
  const start = params?.offset ?? 0;
  const end = params?.limit === undefined ? undefined : start + params.limit;
  return sorted.slice(start, end);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
): Promise<Product[]> {
  return mockProducts
    .filter((product) => product.category_id === categoryId && product.id !== productId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return mockProducts
    .filter((product) =>
      [product.name, product.description, product.origin]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const storedReviews = readStoredValue<Review[]>(REVIEW_STORAGE_KEY, []);
  return [...(mockReviewsByProductId[productId] ?? []), ...storedReviews.filter((review) => review.product_id === productId)]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createReview(review: {
  product_id: string;
  customer_name: string;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const newReview: Review = {
    id: `local-review-${Date.now()}`,
    product_id: review.product_id,
    customer_name: review.customer_name,
    rating: review.rating,
    comment: review.comment || null,
    created_at: new Date().toISOString(),
  };
  const storedReviews = readStoredValue<Review[]>(REVIEW_STORAGE_KEY, []);
  window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([newReview, ...storedReviews]));
  return newReview;
}

export async function subscribeNewsletter(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("Email is required to save a demo subscription.");
  }

  const subscribers = readStoredValue<string[]>(NEWSLETTER_STORAGE_KEY, []);
  if (!subscribers.includes(normalizedEmail)) {
    window.localStorage.setItem(
      NEWSLETTER_STORAGE_KEY,
      JSON.stringify([...subscribers, normalizedEmail]),
    );
  }
}

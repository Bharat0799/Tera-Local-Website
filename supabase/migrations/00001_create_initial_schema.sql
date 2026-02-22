-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  origin TEXT,
  price NUMERIC(10,2) NOT NULL,
  weight TEXT,
  shelf_life TEXT,
  storage TEXT,
  farming_method TEXT,
  certification TEXT,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  thumbnail_urls TEXT[],
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_deal BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  items JSONB NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'inr',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_is_deal ON public.products(is_deal);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- RLS Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and products
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);

-- Anyone can insert reviews
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Anyone can insert newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Service role can manage orders
CREATE POLICY "Service role can manage orders" ON public.orders FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET 
    rating = (SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update product rating after review insert
CREATE TRIGGER update_rating_after_review
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();
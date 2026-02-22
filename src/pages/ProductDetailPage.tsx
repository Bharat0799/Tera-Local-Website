import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Star, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TrustStrip from '@/components/shared/TrustStrip';
import ProductCard from '@/components/shared/ProductCard';
import RatingDisplay from '@/components/shared/RatingDisplay';
import { getProductBySlug, getRelatedProducts, getProductReviews, createReview } from '@/db/api';
import type { Product, Review } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review form
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getProductBySlug(slug).then(data => {
        setProduct(data);
        setLoading(false);
        if (data) {
          getRelatedProducts(data.id, data.category_id || '', 4).then(setRelatedProducts);
          getProductReviews(data.id).then(setReviews);
        }
      });
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${quantity} × ${product.name} added to cart`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity);
      window.location.href = '/cart';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      const newReview = await createReview({
        product_id: product.id,
        customer_name: reviewForm.customer_name,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewForm({ customer_name: '', rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-custom section-spacing">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg bg-muted" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4 bg-muted" />
              <Skeleton className="h-6 w-1/2 bg-muted" />
              <Skeleton className="h-24 w-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image_url, ...(product.thumbnail_urls || [])].filter(Boolean);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <Link to="/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <section className="container-custom pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={images[selectedImage] as string}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img as string}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              {product.origin && (
                <p className="text-lg text-muted-foreground">{product.origin}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <RatingDisplay rating={product.rating} size="lg" />
              <span className="text-muted-foreground">
                ({product.review_count} reviews)
              </span>
            </div>

            <div className="text-4xl font-bold text-primary">₹{product.price}</div>

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary" onClick={handleBuyNow} className="flex-1">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Product Story */}
      {product.farming_method && (
        <section className="section-spacing bg-card">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">From the Soil</h2>
              <p className="text-lg text-muted-foreground">
                {product.farming_method}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Product Details Grid */}
      <section className="section-spacing">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Product Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Origin', value: product.origin },
              { label: 'Weight', value: product.weight },
              { label: 'Shelf Life', value: product.shelf_life },
              { label: 'Storage', value: product.storage },
              { label: 'Farming Method', value: product.farming_method },
              { label: 'Certification', value: product.certification },
            ].map((item, index) => (
              item.value && (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-spacing bg-accent">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
          
          {/* Review Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={reviewForm.customer_name}
                    onChange={e => setReviewForm(prev => ({ ...prev, customer_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= reviewForm.rating ? 'fill-secondary text-secondary' : 'text-muted'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                  />
                </div>
                <Button type="submit">Submit Review</Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <RatingDisplay rating={review.rating} showNumber={false} />
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-spacing">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

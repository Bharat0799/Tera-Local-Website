import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="card-hover overflow-hidden h-full">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {product.is_deal && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              Deal
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          {product.origin && (
            <p className="text-sm text-muted-foreground">{product.origin}</p>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({product.review_count})
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xl font-bold text-primary">₹{product.price}</span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import { getProducts } from '@/db/api';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ is_deal: true, limit: 50 }).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-secondary text-secondary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Season's Selection</h1>
          <p className="text-xl opacity-90">
            Handpicked deals on the freshest organic produce
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-spacing">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square rounded-lg bg-muted" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No deals available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

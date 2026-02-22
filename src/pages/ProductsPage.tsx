import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/shared/ProductCard';
import { getProducts, getCategories } from '@/db/api';
import type { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);

  const selectedCategory = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const categoryId = categories.find(c => c.slug === selectedCategory)?.id;
    
    getProducts({
      category_id: categoryId,
      sort_by: sortBy as any,
      limit: 100,
    }).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [selectedCategory, sortBy, categories]);

  const handleCategoryChange = (category: string) => {
    setSearchParams(prev => {
      if (category === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', category);
      }
      return prev;
    });
    setDisplayCount(12);
  };

  const handleSortChange = (sort: string) => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      return prev;
    });
  };

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">The Harvest</h1>
          <p className="text-xl opacity-90">
            Fresh, organic produce from our partner farms
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card sticky top-20 z-40">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => handleCategoryChange('all')}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-spacing">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
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
              <p className="text-xl text-muted-foreground">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setDisplayCount(prev => prev + 12)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

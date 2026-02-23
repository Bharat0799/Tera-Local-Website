import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shared/ProductCard';
import { searchProducts } from '@/db/api';
import type { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered with query:', query);
    if (query) {
      setSearchInput(query);
      performSearch(query);
    } else {
      console.log('No query parameter found');
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    console.log('performSearch called with:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('Search query is empty, returning');
      return;
    }
    
    setLoading(true);
    console.log('Setting loading to true');
    try {
      console.log('Calling searchProducts with:', searchQuery);
      const results = await searchProducts(searchQuery);
      console.log('Search results received:', results);
      setProducts(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSearch called with searchInput:', searchInput);
    if (searchInput.trim()) {
      console.log('Setting search params with:', searchInput);
      setSearchParams({ q: searchInput });
    } else {
      console.log('Search input is empty, not setting params');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">Search Products</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for organic products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-12 h-14 text-lg bg-primary-foreground text-foreground"
                autoFocus
              />
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="section-spacing">
        <div className="container-custom">
          {/* Debug Info */}
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
            <h4 className="font-bold">Debug Info:</h4>
            <p>Query: "{query}"</p>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>Products found: {products.length}</p>
            <p>Search input: "{searchInput}"</p>
          </div>

          {query && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                {loading ? 'Searching...' : `Results for "${query}"`}
              </h2>
              {!loading && (
                <p className="text-muted-foreground mt-2">
                  {products.length} {products.length === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>
          )}

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
          ) : products.length === 0 && query ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try searching with different keywords. Query: "{query}"
              </p>
              <Link to="/products">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Start Searching</h3>
              <p className="text-muted-foreground">
                Enter a search term to find organic products
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

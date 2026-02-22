import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/db/api';
import type { Product } from '@/types';

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);

  React.useEffect(() => {
    if (debouncedSearch.length >= 2) {
      searchProducts(debouncedSearch).then(results => {
        setSearchResults(results.slice(0, 5));
        setShowSearchResults(true);
      });
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: "Today's Deals", path: '/deals' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Terra Local</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="link-hover text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    className="pl-10 w-64"
                  />
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <img
                        src={product.image_url || ''}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/search')}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

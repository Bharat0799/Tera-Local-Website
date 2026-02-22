import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TrustStrip from '@/components/shared/TrustStrip';
import ProductCard from '@/components/shared/ProductCard';
import NewsletterSection from '@/components/shared/NewsletterSection';
import { getProducts, getCategories } from '@/db/api';
import type { Product, Category } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ is_featured: true, limit: 4 }),
      getCategories(),
    ]).then(([products, cats]) => {
      setFeaturedProducts(products);
      setCategories(cats.slice(0, 6));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden grain-texture">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Indian farmland at golden hour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>
        <div className="relative h-full container-custom flex items-center">
          <div className="max-w-2xl text-primary-foreground space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              From Our Soil<br />To Your Table
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Authentic organic food, directly from Indian farmers who care.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="gap-2">
                  Explore Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* Categories Grid */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Discover fresh, organic produce from trusted farmers
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={category.image_url || ''}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <h3 className="text-2xl font-bold text-primary-foreground">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Statement */}
      <section className="section-spacing bg-accent">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              This isn't just shopping. It's a choice.
            </h2>
            <p className="text-lg text-muted-foreground">
              Every purchase supports farmers who refuse shortcuts, honor the land, and grow food the way it should be grown.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Today's Selection</h2>
              <p className="text-lg text-muted-foreground">
                Handpicked fresh produce from our partner farms
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="gap-2 hidden md:flex">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-square bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      <section className="section-spacing bg-card">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&q=80"
                alt="Farmer portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Meet the Farmers Behind Your Food
              </h2>
              <p className="text-lg text-muted-foreground">
                We partner with organic farmers across India who practice sustainable agriculture and traditional farming methods. Every product tells a story of dedication, heritage, and respect for the earth.
              </p>
              <Link to="/about">
                <Button variant="default" className="gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            What Our Community Says
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                rating: 5,
                comment: 'The quality is unmatched. You can taste the difference in every bite. Finally, organic food that lives up to its promise.',
              },
              {
                name: 'Rajesh Kumar',
                location: 'Bangalore',
                rating: 5,
                comment: 'Supporting local farmers while getting the freshest produce delivered to my door. Terra Local has changed how my family eats.',
              },
              {
                name: 'Anita Desai',
                location: 'Delhi',
                rating: 5,
                comment: 'Authentic, transparent, and delicious. This is what food shopping should be. Highly recommend to anyone who cares about what they eat.',
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Commitment */}
      <section className="section-spacing bg-accent">
        <div className="container-custom">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Our Commitment
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                title: '100% Organic',
                description: 'Certified organic produce grown without synthetic pesticides or fertilizers',
              },
              {
                title: 'Ethical Sourcing',
                description: 'Fair prices for farmers, transparent supply chain from farm to table',
              },
              {
                title: 'Eco Packaging',
                description: 'Minimal, recyclable packaging that respects the environment',
              },
              {
                title: 'Fresh Delivery',
                description: 'Harvested to order and delivered within 48 hours',
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}

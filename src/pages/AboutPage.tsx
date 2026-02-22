import React from 'react';
import { Leaf, Heart, Users, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NewsletterSection from '@/components/shared/NewsletterSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        <div className="relative h-full container-custom flex items-center">
          <div className="max-w-2xl text-primary-foreground space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              Food as it Should Be
            </h1>
            <p className="text-xl opacity-90">
              We're not just selling groceries. We're building a movement that reconnects people with the land and the farmers who nurture it.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Our Philosophy</h2>
              <p className="text-lg text-muted-foreground">
                Food is more than fuel. It's culture, heritage, and connection. Every meal should honor the hands that grew it and the earth that gave it life.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-2xl font-bold mb-2">Authenticity Over Convenience</h3>
                <p className="text-muted-foreground">
                  We refuse to compromise on quality for the sake of speed. Our produce is harvested when it's ready, not when it's convenient.
                </p>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h3 className="text-2xl font-bold mb-2">Farmers First</h3>
                <p className="text-muted-foreground">
                  Fair prices, transparent relationships, and long-term partnerships. We believe farmers deserve respect and prosperity.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-2xl font-bold mb-2">Sustainability as Standard</h3>
                <p className="text-muted-foreground">
                  Organic isn't a trend for us—it's the only way. We work with farmers who practice regenerative agriculture and honor traditional methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="section-spacing bg-accent">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-3xl font-bold">A Note from Our Founder</h2>
                <p className="text-muted-foreground italic">
                  "Growing up in rural Maharashtra, I watched my grandmother tend to her kitchen garden with reverence. Every seed, every harvest was sacred. When I moved to the city, I was shocked by how disconnected we'd become from our food sources.
                </p>
                <p className="text-muted-foreground italic">
                  Terra Local was born from a simple belief: people deserve to know where their food comes from and who grew it. We're not trying to disrupt anything—we're trying to restore what was lost.
                </p>
                <p className="text-muted-foreground italic">
                  This is more than a business. It's a return to roots, a celebration of Indian agriculture, and a commitment to the farmers who feed us all."
                </p>
                <p className="font-semibold">— Arjun Mehta, Founder</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Farm Partnership */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                alt="Farmers working"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Farm Partners</h2>
              <p className="text-lg text-muted-foreground">
                We work with over 150 certified organic farms across India. Each farmer is carefully vetted for their commitment to sustainable practices and product quality.
              </p>
              <p className="text-lg text-muted-foreground">
                From the rice paddies of Kerala to the vegetable farms of Punjab, our network represents the diversity and richness of Indian agriculture.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-3xl font-bold text-primary">150+</p>
                  <p className="text-muted-foreground">Partner Farms</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-muted-foreground">States Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="section-spacing bg-card">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Sustainability Commitment
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="h-8 w-8" />,
                title: 'Zero Pesticides',
                description: 'All our produce is grown without synthetic chemicals or GMOs',
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: 'Soil Health',
                description: 'We support regenerative farming practices that enrich the earth',
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Fair Trade',
                description: 'Farmers receive fair prices and long-term contracts',
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: 'Carbon Neutral',
                description: 'Eco-friendly packaging and optimized delivery routes',
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Join Us in Honoring the Land
            </h2>
            <p className="text-xl text-muted-foreground">
              Every purchase is a vote for sustainable agriculture, fair farmer wages, and food that nourishes both body and soul.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}

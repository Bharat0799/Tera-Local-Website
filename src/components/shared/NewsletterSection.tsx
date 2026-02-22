import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscribeNewsletter } from '@/db/api';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-spacing bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Join the Movement</h2>
          <p className="text-lg opacity-90">
            Get weekly updates on new harvests, farmer stories, and exclusive offers.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 bg-primary-foreground text-foreground"
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={loading}
              className="whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

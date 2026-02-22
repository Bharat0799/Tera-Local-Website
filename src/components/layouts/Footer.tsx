import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-foreground">Terra Local</h3>
            <p className="text-sm">
              Connecting you directly with organic farmers. A movement for authentic, sustainable food.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-secondary transition-colors">
                  Today's Deals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-secondary transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-primary-foreground">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm">
              Email: hello@terralocal.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        <div className="border-t border-footer-foreground/20 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2026 Terra Local. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { CheckCircle, Truck, Shield, Leaf } from 'lucide-react';

interface TrustItem {
  icon: React.ReactNode;
  text: string;
}

const trustItems: TrustItem[] = [
  { icon: <CheckCircle className="h-5 w-5" />, text: 'Certified Organic' },
  { icon: <Leaf className="h-5 w-5" />, text: 'Direct from Farmers' },
  { icon: <Truck className="h-5 w-5" />, text: 'Delivered Fresh' },
  { icon: <Shield className="h-5 w-5" />, text: 'Trusted by 2,000+ Families' },
];

export default function TrustStrip() {
  return (
    <div className="bg-accent py-6">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 justify-center">
              <div className="text-primary">{item.icon}</div>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function RatingDisplay({ rating, size = 'md', showNumber = true }: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-secondary text-secondary' : 'text-muted'
          }`}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

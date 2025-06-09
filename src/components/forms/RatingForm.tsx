'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RatingFormProps {
  currentRating?: number | null;
  onSave: (rating: number) => void;
  onCancel: () => void;
}

// [R6.1] Implements the Vendor Ratings Interface form.
export function RatingForm({ currentRating, onSave, onCancel }: RatingFormProps) {
  const [rating, setRating] = React.useState(currentRating || 0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const { toast } = useToast();

  const handleSave = () => {
    if (rating === 0) {
      toast({
        title: "Invalid Rating",
        description: "Please select at least one star.",
        variant: "destructive",
      });
      return;
    }
    onSave(rating);
    toast({
      title: "Rating Saved",
      description: `You've rated this project ${rating} out of 5 stars.`,
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm">
      <h4 className="font-headline text-lg mb-4 text-center">Rate this Vendor's Performance</h4>
      <div className="flex justify-center items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-8 w-8 cursor-pointer transition-colors',
              (hoverRating || rating) >= star
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            )}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">Save Rating</Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

import { useLanguage } from '@/contexts/language-context';

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export function RatingModal({ open, onClose, userId }: RatingModalProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(t('rating.selectRating'));
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ app_rating: rating })
        .eq('id', userId);

      if (error) throw error;

      toast.success(t('rating.success'));
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(t('rating.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{t('rating.title')}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {t('rating.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating === 1 && t('rating.feedback.1')}
              {rating === 2 && t('rating.feedback.2')}
              {rating === 3 && t('rating.feedback.3')}
              {rating === 4 && t('rating.feedback.4')}
              {rating === 5 && t('rating.feedback.5')}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={submitting}
            >
              {t('rating.skip')}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={rating === 0 || submitting}
            >
              {submitting ? t('rating.submitting') : t('rating.submit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

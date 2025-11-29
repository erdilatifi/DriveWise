'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: DeleteAccountFeedback) => Promise<void>;
  isDeleting?: boolean;
}

export interface DeleteAccountFeedback {
  reason: string;
  customReason?: string;
  comment?: string;
  allowPublic?: boolean;
}

const DELETION_REASONS = [
  { id: 'passed', label: 'I passed the exam' },
  { id: 'not-needed', label: 'I don’t need the mock tests anymore' },
  { id: 'duplicate', label: 'I made another account' },
  { id: 'unsatisfied', label: 'I’m not satisfied with the app' },
  { id: 'other', label: 'Other' },
];

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteAccountModalProps) {
  const [reason, setReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [comment, setComment] = useState('');
  const [allowPublic, setAllowPublic] = useState(false);

  const handleConfirm = async () => {
    if (!reason) return;
    
    await onConfirm({
      reason,
      customReason: reason === 'other' ? customReason : undefined,
      comment: (reason === 'passed' || reason === 'unsatisfied') ? comment : undefined,
      allowPublic: reason === 'passed' ? allowPublic : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Are you sure you want to delete your account?
          </DialogTitle>
          <DialogDescription>
            All progress, mock test history, and account data will be permanently deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Reason Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Why are you leaving?</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
              {DELETION_REASONS.map((option) => (
                <div key={option.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-normal text-foreground/90 cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    
                    {/* Custom Reason Input */}
                    {option.id === 'other' && reason === 'other' && (
                      <Input
                        placeholder="Please tell us more..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="mt-2 h-8 text-sm"
                        autoFocus
                      />
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Positive Feedback Section (Conditional) */}
          {reason === 'passed' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10">
              <div className="space-y-2">
                <Label htmlFor="testimonial" className="font-medium text-emerald-600 dark:text-emerald-400">
                  Congratulations! Want to share your experience? <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="testimonial"
                  placeholder="Your feedback helps future learners. Tell us how our mock tests helped you!"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] bg-background/50 resize-none border-emerald-500/20 focus-visible:ring-emerald-500/30"
                />
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    id="allow-public"
                    checked={allowPublic}
                    onChange={(e) => setAllowPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-primary text-primary ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Label
                  htmlFor="allow-public"
                  className="text-sm font-normal text-muted-foreground cursor-pointer select-none leading-normal"
                >
                  Allow my comment to be used publicly as a testimonial.
                </Label>
              </div>
            </div>
          )}

          {/* Negative Feedback Section (Conditional) */}
          {reason === 'unsatisfied' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 bg-muted/50 p-4 rounded-lg border border-border">
              <div className="space-y-2">
                <Label htmlFor="feedback" className="font-medium">
                  We’re sorry your experience wasn’t good. Want to tell us what went wrong? <span className="text-muted-foreground font-normal text-xs">(Optional)</span>
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Your feedback helps us improve the app."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px] bg-background/50 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason || isDeleting}
            className="w-full sm:w-auto gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

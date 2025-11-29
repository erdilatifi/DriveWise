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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bug, Loader2 } from 'lucide-react';

interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BugReportData) => Promise<void>;
}

export interface BugReportData {
  title: string;
  description: string;
  stepsToReproduce: string;
  location: string;
  deviceBrowser: string;
  contactEmail: string;
}

const LOCATIONS = [
  'Dashboard',
  'Mock test list',
  'Mock test session',
  'Payments/checkout',
  'Account/profile',
  'Other',
];

export function BugReportModal({ isOpen, onClose, onSubmit }: BugReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [location, setLocation] = useState('');
  const [deviceBrowser, setDeviceBrowser] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        stepsToReproduce,
        location,
        deviceBrowser,
        contactEmail,
      });
      // Reset form handled by parent or on successful submit if kept open
      // But typically we close it.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Bug className="w-5 h-5" />
            Report a bug
          </DialogTitle>
          <DialogDescription>
            Found something not working correctly? Tell us and we’ll look into it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="bug-title">Bug title <span className="text-destructive">*</span></Label>
            <Input
              id="bug-title"
              placeholder="e.g. Timer doesn't stop when test ends"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="bug-description">What went wrong? <span className="text-destructive">*</span></Label>
            <Textarea
              id="bug-description"
              placeholder="Describe what happened and what you expected instead."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              required
            />
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <Label htmlFor="bug-steps">Steps to reproduce <span className="text-muted-foreground text-xs">(Optional)</span></Label>
            <Textarea
              id="bug-steps"
              placeholder={'Step 1: Go to ...\nStep 2: Click on ...\nStep 3: ...'}
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="bug-location">Where did this happen?</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="bug-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Device/Browser */}
            <div className="space-y-2">
              <Label htmlFor="bug-device">Device / browser <span className="text-muted-foreground text-xs">(Optional)</span></Label>
              <Input
                id="bug-device"
                placeholder="e.g. iPhone + Safari"
                value={deviceBrowser}
                onChange={(e) => setDeviceBrowser(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="bug-email">Email <span className="text-muted-foreground text-xs">(Optional, if you want a reply)</span></Label>
            <Input
              id="bug-email"
              type="email"
              placeholder="your@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !description || isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit bug report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
  'Paneli',
  'Lista e mock testeve',
  'Sesioni i mock testit',
  'Pagesat/checkout',
  'Llogaria/profili',
  'Tjetër',
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
            Raporto një problem
          </DialogTitle>
          <DialogDescription>
            Gjetët diçka që nuk punon mirë? Na tregoni dhe ne do ta shqyrtojmë.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="bug-title">Titulli i problemit <span className="text-destructive">*</span></Label>
            <Input
              id="bug-title"
              placeholder="p.sh. Kronometri nuk ndalon kur mbaron testi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="bug-description">Çfarë shkoi keq? <span className="text-destructive">*</span></Label>
            <Textarea
              id="bug-description"
              placeholder="Përshkruani çfarë ndodhi dhe çfarë prisnit të ndodhte."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
              required
              maxLength={5000}
            />
          </div>

          {/* Steps to Reproduce */}
          <div className="space-y-2">
            <Label htmlFor="bug-steps">Hapat për ta riprodhuar <span className="text-muted-foreground text-xs">(Opsionale)</span></Label>
            <Textarea
              id="bug-steps"
              placeholder={'Hapi 1: Shko te ...\nHapi 2: Kliko mbi ...\nHapi 3: ...'}
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              className="min-h-[80px]"
              maxLength={5000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="bug-location">Ku ndodhi kjo?</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="bug-location">
                  <SelectValue placeholder="Zgjidh vendndodhjen" />
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
              <Label htmlFor="bug-device">Pajisja / shfletuesi <span className="text-muted-foreground text-xs">(Opsionale)</span></Label>
              <Input
                id="bug-device"
                placeholder="p.sh. iPhone + Safari"
                value={deviceBrowser}
                onChange={(e) => setDeviceBrowser(e.target.value)}
                maxLength={300}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="bug-email">Email <span className="text-muted-foreground text-xs">(Opsionale, nëse doni përgjigje)</span></Label>
            <Input
              id="bug-email"
              type="email"
              placeholder="emaili-juaj@email.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              maxLength={320}
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Anulo
            </Button>
            <Button
              type="submit"
              disabled={!title || !description || isSubmitting}
              className="gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Dërgo raportin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

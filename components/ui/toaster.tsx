'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      expand={false}
      duration={3000}
      toastOptions={{
        classNames: {
          toast: 'bg-card/95 backdrop-blur-xl text-card-foreground border-2 border-border shadow-xl shadow-primary/5 rounded-xl',
          title: 'text-foreground font-semibold text-base',
          description: 'text-muted-foreground text-sm',
          actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium',
          cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/80 rounded-lg',
          closeButton: 'bg-card/50 border-border hover:bg-muted/50 rounded-lg transition-colors',
          success: 'border-green-500/30 bg-green-500/10 backdrop-blur-xl',
          error: 'border-red-500/30 bg-red-500/10 backdrop-blur-xl',
          warning: 'border-yellow-500/30 bg-yellow-500/10 backdrop-blur-xl',
          info: 'border-blue-500/30 bg-blue-500/10 backdrop-blur-xl',
        },
        style: {
          backdropFilter: 'blur(12px)',
        },
      }}
    />
  );
}

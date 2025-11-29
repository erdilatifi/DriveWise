"use client";

import type React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      // Your app is dark by design, so force dark theme
      theme="dark"
      position="top-right"
      closeButton
      expand={false}
      duration={3000}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Base toast surface – uses your card + border + radius tokens
          toast:
            "bg-card text-card-foreground border border-border rounded-[var(--radius)] shadow-lg shadow-primary/15 px-4 py-3",

          // Typography aligned with your theme
          title: "text-foreground font-semibold text-sm",
          description: "text-muted-foreground text-xs",

          // Actions keep the orange accent feel
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors",
          cancelButton:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors",

          // Close button is subtle, not screaming
          closeButton:
            "text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md p-1 transition-colors",
        },
      }}
      // Use Sonner's CSS variables so its internals follow your theme tokens
      style={
        {
          // Normal/default toast colors
          "--normal-bg": "hsl(var(--popover))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--popover-foreground))",

          // Corner radius consistent with the rest of the UI
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

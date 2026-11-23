"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group font-sans border border-border bg-card text-foreground shadow-lg rounded-xl text-sm p-4",
          description: "text-muted-foreground text-xs",
          actionButton: "bg-primary text-primary-foreground text-xs font-medium rounded-lg px-2.5 py-1.5",
          cancelButton: "bg-muted text-muted-foreground text-xs font-medium rounded-lg px-2.5 py-1.5",
          error: "border-destructive/30 text-destructive bg-destructive/5",
          success: "border-emerald-500/30 text-emerald-800 bg-emerald-50",
          info: "border-sky-500/30 text-sky-800 bg-sky-50",
          warning: "border-amber-500/30 text-amber-800 bg-amber-50",
        },
      }}
    />
  );
}

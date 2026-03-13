"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      closeButton
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border border-slate-200 bg-white text-slate-900",
          description: "text-slate-500",
        },
      }}
    />
  );
}

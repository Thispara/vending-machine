"use client";

import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast() as any; // 👈 อธิบายด้านล่าง

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts?.map((toast: any) => (
        <div
          key={toast.id}
          className={`
            rounded-lg px-4 py-3 shadow-lg text-white
            ${toast.variant === "destructive" ? "bg-red-600" : "bg-slate-900"}
          `}
        >
          {toast.title && <p className="font-bold">{toast.title}</p>}
          {toast.description && (
            <p className="text-sm opacity-90">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

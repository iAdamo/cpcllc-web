"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, subtitle, children, footer }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-100 dark:border-slate-800 transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <footer className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {footer}
            </footer>
          )}
        </div>
      </aside>
    </>
  );
}

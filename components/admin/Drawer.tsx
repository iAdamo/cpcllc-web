"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import {
  Drawer as GluestackDrawer,
  DrawerBackdrop,
  DrawerContent,
} from "@/components/ui/drawer";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Admin side drawer, now built on the gluestack Drawer primitive (backdrop,
 * slide-in animation, focus trap, ESC + overlay-click close all handled by
 * gluestack). The header/body/footer keep the admin's Tailwind look — the
 * gluestack shell only provides the container + behaviour. Props are
 * unchanged so every consumer (TicketDrawer, Users/Providers/etc.) works as
 * before.
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: DrawerProps) {
  return (
    <GluestackDrawer isOpen={open} onClose={onClose} size="md" anchor="right">
      <DrawerBackdrop />
      <DrawerContent className="h-full border-l border-slate-100 bg-white p-0 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-full w-full flex-col">
          <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
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
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>
          {footer && (
            <footer className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/50">
              {footer}
            </footer>
          )}
        </div>
      </DrawerContent>
    </GluestackDrawer>
  );
}

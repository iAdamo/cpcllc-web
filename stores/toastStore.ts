import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  /** Optional reference id (correlation/error id) shown small for support. */
  reference?: string;
  action?: ToastAction;
  durationMs: number;
}

interface ToastStore {
  toasts: Toast[];
  show: (toast: Omit<Toast, "id" | "durationMs"> & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 3500,
  info: 4000,
  warning: 5000,
  error: 6000,
};

/**
 * One place every transient message flows through. Screens never build their
 * own modal-or-inline decision anymore — they call notify.* and this renders
 * a single consistent stack. Blocking recovery (full-screen) stays separate.
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    const durationMs = toast.durationMs ?? DEFAULT_DURATION[toast.variant];

    // Collapse duplicates already on screen (same variant + title + message)
    // so a retry loop can't stack ten identical error toasts.
    const dup = get().toasts.find(
      (t) =>
        t.variant === toast.variant &&
        t.title === toast.title &&
        t.message === toast.message,
    );
    if (dup) return dup.id;

    set((state) => ({ toasts: [...state.toasts, { ...toast, id, durationMs }] }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

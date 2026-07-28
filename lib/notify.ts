import { useToastStore, type ToastAction } from "@/stores/toastStore";
import { AppErrorService, type NormalizedAppError } from "@/lib/errorService";

interface NotifyOptions {
  title?: string;
  action?: ToastAction;
  durationMs?: number;
}

interface ErrorNotifyOptions extends NotifyOptions {
  /** Attach module/feature for the backend Error Center. */
  module?: string;
  feature?: string;
  /** Skip reporting to the backend (e.g. an expected validation hint). */
  report?: boolean;
}

const store = () => useToastStore.getState();

/**
 * The one way to surface a transient message on web. Screens stop deciding
 * "modal vs inline" — everything routes here into a single consistent stack.
 */
export const notify = {
  success(message: string, options: NotifyOptions = {}) {
    return store().show({
      variant: "success",
      title: options.title ?? "Done",
      message,
      action: options.action,
      durationMs: options.durationMs,
    });
  },

  info(message: string, options: NotifyOptions = {}) {
    return store().show({
      variant: "info",
      title: options.title ?? "Heads up",
      message,
      action: options.action,
      durationMs: options.durationMs,
    });
  },

  warning(message: string, options: NotifyOptions = {}) {
    return store().show({
      variant: "warning",
      title: options.title ?? "Please note",
      message,
      action: options.action,
      durationMs: options.durationMs,
    });
  },

  /**
   * Surface any thrown/axios error with the SPECIFIC backend message. Reports
   * to the Error Center unless told not to. Returns the normalized error so
   * callers can branch (e.g. redirect on AUTH_EXPIRED).
   */
  error(input: unknown, options: ErrorNotifyOptions = {}): NormalizedAppError {
    const normalized = AppErrorService.fromApiError(input, {
      module: options.module,
      feature: options.feature,
    });

    if (options.report !== false) AppErrorService.report(normalized);

    store().show({
      variant: normalized.severity === "warning" ? "warning" : "error",
      title: options.title ?? titleForCategory(normalized.category),
      message: normalized.userMessage,
      reference:
        normalized.severity === "critical" || normalized.severity === "error"
          ? normalized.correlationId ?? normalized.errorId
          : undefined,
      action: options.action,
      durationMs: options.durationMs,
    });

    return normalized;
  },
};

function titleForCategory(category: string): string {
  switch (category) {
    case "authentication":
      return "Sign-in needed";
    case "permission":
      return "Not allowed";
    case "validation":
      return "Check your details";
    case "network":
      return "Connection issue";
    case "server":
      return "Server issue";
    case "timeout":
      return "Took too long";
    default:
      return "Something went wrong";
  }
}

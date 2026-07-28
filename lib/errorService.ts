export type AppErrorSeverity =
  | "info"
  | "warning"
  | "error"
  | "critical"
  | "fatal";
export type AppErrorCategory =
  | "authentication"
  | "authorization"
  | "validation"
  | "business_logic"
  | "network"
  | "server"
  | "database"
  | "cache"
  | "redis"
  | "queue"
  | "socket"
  | "notification"
  | "payment"
  | "storage"
  | "upload"
  | "external_service"
  | "kyc"
  | "email"
  | "sms"
  | "push_notification"
  | "geo_location"
  | "permission"
  | "timeout"
  | "configuration"
  | "unexpected_system_error"
  | "unknown";

export interface AppErrorPayload {
  code: string;
  category: AppErrorCategory;
  severity: AppErrorSeverity;
  message: string;
  technicalMessage?: string;
  userMessage?: string;
  source?:
    | "mobile"
    | "web"
    | "backend"
    | "queue"
    | "socket"
    | "cron"
    | "worker";
  module?: string;
  service?: string;
  route?: string;
  feature?: string;
  correlationId?: string;
  retryable?: boolean;
  context?: Record<string, unknown>;
}

export interface NormalizedAppError {
  errorId: string;
  code: string;
  category: AppErrorCategory;
  severity: AppErrorSeverity;
  message: string;
  technicalMessage: string;
  userMessage: string;
  source: string;
  module: string;
  service: string;
  route?: string;
  feature?: string;
  correlationId?: string;
  retryable: boolean;
  status?: number;
  timestamp: string;
  context: Record<string, unknown>;
}

/**
 * The structured error our NestJS AllExceptionsFilter returns:
 *   { success:false, error:{ errorId, code, category, message, retryable, correlationId } }
 * `message` here is already the user-safe message (real 4xx business message,
 * or a safe generic for 5xx). We trust it — that is the whole point of the
 * backend fix.
 */
interface BackendErrorBody {
  success?: boolean;
  error?: {
    errorId?: string;
    code?: string;
    category?: AppErrorCategory;
    message?: string;
    retryable?: boolean;
    correlationId?: string;
  };
}

const REPORT_ENDPOINT = "errors/report";

/** Friendly fallback copy keyed by code, used only when nothing better exists. */
export const USER_MESSAGE_BY_CODE: Record<string, string> = {
  AUTH_EXPIRED: "Your session has expired. Please sign in again.",
  AUTH_INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
  AUTH_ACCOUNT_DISABLED: "This account has been disabled. Please contact support.",
  AUTH_TERMS_REQUIRED:
    "Please review and accept the required terms before continuing.",
  VALIDATION_FAILED: "Please review the information you entered and try again.",
  PERMISSION_DENIED: "You do not have permission to perform this action.",
  NOT_FOUND: "We couldn't find what you were looking for.",
  CONFLICT: "This action conflicts with existing information.",
  NETWORK_UNAVAILABLE: "Your internet connection appears to be unavailable.",
  SERVER_UNAVAILABLE:
    "Our servers are temporarily unavailable. Please try again shortly.",
  TIMEOUT: "The request took too long to complete. Please try again.",
  RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
  UNEXPECTED_ERROR:
    "Something unexpected happened. We recorded the issue and can help if it continues.",
};

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function categoryFromStatus(status?: number): AppErrorCategory {
  if (status === undefined) return "network";
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "authentication";
  if (status === 403) return "permission";
  if (status === 404) return "business_logic";
  if (status === 409) return "business_logic";
  if (status === 429) return "network";
  if (status >= 500) return "server";
  return "unknown";
}

function codeFromStatus(status?: number): string {
  if (status === undefined) return "NETWORK_UNAVAILABLE";
  const map: Record<number, string> = {
    400: "VALIDATION_FAILED",
    401: "AUTH_EXPIRED",
    403: "PERMISSION_DENIED",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_FAILED",
    429: "RATE_LIMITED",
    500: "SERVER_UNAVAILABLE",
    502: "SERVER_UNAVAILABLE",
    503: "SERVER_UNAVAILABLE",
    504: "TIMEOUT",
  };
  return map[status] ?? (status >= 500 ? "SERVER_UNAVAILABLE" : "UNEXPECTED_ERROR");
}

/** True for anything shaped like an axios error (has response/request). */
function isAxiosLike(input: unknown): input is {
  response?: { status?: number; data?: BackendErrorBody };
  request?: unknown;
  message?: string;
  config?: { url?: string };
} {
  return (
    typeof input === "object" &&
    input !== null &&
    ("response" in input || "request" in input || "isAxiosError" in input)
  );
}

let reported = new Set<string>();

export class AppErrorService {
  /** Normalize any thrown value into a stable shape. */
  static normalize(input: unknown, context: AppErrorPayload): NormalizedAppError {
    const error = input instanceof Error ? input : new Error(String(input));
    return {
      errorId: newId(),
      code: context.code,
      category: context.category,
      severity: context.severity,
      message: context.message,
      technicalMessage: context.technicalMessage ?? error.message,
      userMessage:
        context.userMessage ??
        USER_MESSAGE_BY_CODE[context.code] ??
        USER_MESSAGE_BY_CODE.UNEXPECTED_ERROR,
      source: context.source ?? "web",
      module: context.module ?? "unknown",
      service: context.service ?? "unknown",
      route: context.route,
      feature: context.feature,
      correlationId: context.correlationId,
      retryable: context.retryable ?? true,
      timestamp: new Date().toISOString(),
      context: context.context ?? {},
    };
  }

  /**
   * Turn an axios/fetch failure into a normalized error. Prefers the backend's
   * structured message so the user sees "A user with this email already exists"
   * instead of a generic wall.
   */
  static fromApiError(
    input: unknown,
    context: Partial<AppErrorPayload> = {},
  ): NormalizedAppError {
    const axiosErr = isAxiosLike(input) ? input : undefined;
    const status = axiosErr?.response?.status;
    const body = axiosErr?.response?.data as BackendErrorBody | undefined;
    const backend = body?.error;
    // No response object at all → the request never completed: network down,
    // timeout, DNS, or CORS. This is the "your internet appears unavailable" case.
    const isNetwork = !!axiosErr && !axiosErr.response;

    const code =
      backend?.code ?? context.code ?? (isNetwork ? "NETWORK_UNAVAILABLE" : codeFromStatus(status));
    const category =
      backend?.category ?? context.category ?? categoryFromStatus(status);
    const severity: AppErrorSeverity =
      context.severity ?? (status && status >= 500 ? "error" : "warning");

    const userMessage =
      backend?.message ??
      context.userMessage ??
      USER_MESSAGE_BY_CODE[code] ??
      USER_MESSAGE_BY_CODE.UNEXPECTED_ERROR;

    const normalized: NormalizedAppError = {
      errorId: backend?.errorId ?? newId(),
      code,
      category,
      severity,
      message: userMessage,
      technicalMessage:
        (input instanceof Error ? input.message : undefined) ??
        axiosErr?.message ??
        userMessage,
      userMessage,
      source: "web",
      module: context.module ?? "api",
      service: context.service ?? axiosErr?.config?.url ?? "api",
      route: context.route,
      feature: context.feature,
      correlationId: backend?.correlationId ?? context.correlationId,
      retryable:
        backend?.retryable ?? context.retryable ?? (isNetwork || (status ?? 0) >= 500),
      status,
      timestamp: new Date().toISOString(),
      context: context.context ?? {},
    };
    return normalized;
  }

  /**
   * Best-effort report to the backend Error Center. Fire-and-forget, never
   * throws, deduped per errorId. Uses a bare fetch (not the axios instance) so
   * a reporting failure cannot recurse through the response interceptor.
   */
  static report(normalized: NormalizedAppError): void {
    if (reported.has(normalized.errorId)) return;
    reported.add(normalized.errorId);
    if (reported.size > 500) reported = new Set();

    if (typeof window === "undefined") return;

    const base = (process.env.NEXT_PUBLIC_API_URL ||
      "https://9qc99pwv-3333.uks1.devtunnels.ms/").replace(/\/$/, "");

    try {
      void fetch(`${base}/${REPORT_ENDPOINT}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          code: normalized.code,
          message: normalized.message,
          category: normalized.category,
          severity: normalized.severity,
          source: "web",
          technicalMessage: normalized.technicalMessage,
          userMessage: normalized.userMessage,
          module: normalized.module,
          service: normalized.service,
          route:
            normalized.route ??
            (typeof window !== "undefined" ? window.location.pathname : undefined),
          feature: normalized.feature,
          correlationId: normalized.correlationId,
          browser:
            typeof navigator !== "undefined" ? navigator.userAgent : undefined,
          context: normalized.context,
        }),
      }).catch(() => undefined);
    } catch {
      /* swallow — reporting must never break the app */
    }
  }

  /** Log locally + report to the backend when severe enough. */
  static log(input: unknown, context: AppErrorPayload): NormalizedAppError {
    const normalized = this.normalize(input, context);
    if (process.env.NODE_ENV !== "production") {
      console.error("[app-error]", normalized.code, normalized.technicalMessage);
    }
    if (normalized.severity !== "info" && normalized.severity !== "warning") {
      this.report(normalized);
    }
    return normalized;
  }

  static getUserMessage(code: string): string {
    return USER_MESSAGE_BY_CODE[code] ?? USER_MESSAGE_BY_CODE.UNEXPECTED_ERROR;
  }
}

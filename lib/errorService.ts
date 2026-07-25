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
  retryable?: boolean;
  context?: Record<string, unknown>;
}

export class AppErrorService {
  static normalize(input: unknown, context: AppErrorPayload) {
    const error = input instanceof Error ? input : new Error(String(input));
    return {
      errorId: crypto.randomUUID(),
      code: context.code,
      category: context.category,
      severity: context.severity,
      message: context.message,
      technicalMessage: context.technicalMessage ?? error.message,
      userMessage: context.userMessage ?? "Something unexpected happened.",
      source: context.source ?? "web",
      module: context.module ?? "unknown",
      service: context.service ?? "unknown",
      route: context.route,
      feature: context.feature,
      retryable: context.retryable ?? true,
      timestamp: new Date().toISOString(),
      context: context.context ?? {},
    };
  }

  static log(input: unknown, context: AppErrorPayload) {
    const normalized = this.normalize(input, context);
    console.error("[app-error]", JSON.stringify(normalized));
    return normalized;
  }
}

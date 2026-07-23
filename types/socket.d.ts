import {
  SocketEvents,
  ChatEvents,
  PresenceEvents,
  NotificationEvents,
  AdminEvents,
  SupportEvents,
} from "@/lib/socket";

export interface EventEnvelope<T = any> {
  version: string;
  event:
    | SocketEvents
    | ChatEvents
    | PresenceEvents
    | NotificationEvents
    | AdminEvents
    | SupportEvents;
  timestamp: number;
  payload: T;
  metadata?: {
    requestId?: string;
    deviceId?: string;
    sessionId?: string;
  };
}

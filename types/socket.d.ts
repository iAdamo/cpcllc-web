import {
  SocketEvents,
  ChatEvents,
  PresenceEvents,
  NotificationEvents,
  AdminEvents,
} from "@/lib/socket";

export interface EventEnvelope<T = any> {
  version: string;
  event:
    | SocketEvents
    | ChatEvents
    | PresenceEvents
    | NotificationEvents
    | AdminEvents;
  timestamp: number;
  payload: T;
  metadata?: {
    requestId?: string;
    deviceId?: string;
    sessionId?: string;
  };
}

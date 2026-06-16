"use client";

import { io, Socket } from "socket.io-client";
import { EventEnvelope } from "@/types/socket";
import { getDeviceId, getSessionId } from "@/utils/Device";
import { v4 as uuidv4 } from "uuid";

export enum SocketEvents {
  // Connection events
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  RECONNECT = "reconnect",

  // Chat events
  CHAT_SEND_MESSAGE = "chat:send_message",
  CHAT_MESSAGE_SENT = "chat:message_sent",
  CHAT_MESSAGE_DELIVERED = "chat:message_delivered",
  CHAT_TYPING_START = "chat:typing_start",
  CHAT_TYPING_STOP = "chat:typing_stop",
  CHAT_JOIN_ROOM = "chat:join_room",
  CHAT_LEAVE_ROOM = "chat:leave_room",

  // Notification events
  NOTIFICATION_SEND = "notification:send",
  NOTIFICATION_RECEIVED = "notification:received",
  NOTIFICATION_READ = "notification:read",

  // Presence events
  PRESENCE_UPDATE = "presence:update",
  PRESENCE_ONLINE = "presence:online",
  PRESENCE_OFFLINE = "presence:offline",
  PRESENCE_SUBSCRIBE = "presence:subscribe",

  // Subscription primitive (Phase 1 of the WS upgrade). Clients open and
  // close channel subscriptions via these events; the backend pushes
  // matching emissions wrapped in a `domain:event` envelope.
  SUBSCRIPTION_SUBSCRIBE = "subscription:subscribe",
  SUBSCRIPTION_UNSUBSCRIBE = "subscription:unsubscribe",
  SUBSCRIPTION_SUBSCRIBED = "subscription:subscribed",
  SUBSCRIPTION_UNSUBSCRIBED = "subscription:unsubscribed",
  DOMAIN_EVENT = "domain:event",

  // System events
  ERROR = "error",
  RATE_LIMIT_EXCEEDED = "rate_limit:exceeded",
}

export enum ChatEvents {
  // Outgoing events
  MESSAGE_SENT = SocketEvents.CHAT_MESSAGE_SENT,
  MESSAGE_DELIVERED = SocketEvents.CHAT_MESSAGE_DELIVERED,
  UNREAD_COUNT_UPDATED = "chat:unread_count_updated",
  TYPING_START = SocketEvents.CHAT_TYPING_START,
  TYPING_STOP = SocketEvents.CHAT_TYPING_STOP,
  USER_JOINED = "chat:user_joined",
  USER_LEFT = "chat:user_left",
  CONVERSATION_UPDATED = "chat:conversation_updated",

  // Incoming events
  SEND_MESSAGE = SocketEvents.CHAT_SEND_MESSAGE,
  JOIN_ROOM = SocketEvents.CHAT_JOIN_ROOM,
  LEAVE_ROOM = SocketEvents.CHAT_LEAVE_ROOM,
  CHAT_MESSAGE_READ = "chat:message_read",
  TYPING_INDICATOR = "chat:typing_indicator",
}

/**
 * Unified Presence Event System
 */

export enum PresenceEvents {
  UPDATE_STATUS = "presence:update_status",
  SUBSCRIBE = "presence:subscribe",
  UNSUBSCRIBE = "presence:unsubscribe",
  GET_SUBSCRIPTIONS = "presence:get_subscriptions",
  HEARTBEAT = "presence:heartbeat",
  USER_ACTIVITY = "presence:user_activity",
  GET_STATUS = "presence:get_status",
  GET_BATCH_STATUS = "presence:get_batch_status",
  STATUS_UPDATED = "presence:status_updated",
  STATUS_CHANGE = "presence:status_change", // For subscribed users
  USER_ONLINE = "presence:user_online",
  USER_OFFLINE = "presence:user_offline",
  USER_AWAY = "presence:user_away",
  USER_BUSY = "presence:user_busy",
  SUBSCRIBED = "presence:subscribed",
  UNSUBSCRIBED = "presence:unsubscribed",
  SUBSCRIPTIONS_LIST = "presence:subscriptions_list",
  STATUS_RESPONSE = "presence:status_response",
  BATCH_STATUS_RESPONSE = "presence:batch_status_response",
  PRESENCE_ERROR = "presence:error",
  HEARTBEAT_ACK = "presence:heartbeat_ack",
}

export enum PRESENCE_STATUS {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
  BUSY = "busy",
  DO_NOT_DISTURB = "dnd",
}

export enum NotificationEvents {
  // Incoming events
  SEND_NOTIFICATION = SocketEvents.NOTIFICATION_SEND,
  SEND_BULK_NOTIFICATION = "notification:send_bulk",
  MARK_AS_READ = "notification:mark_read",
  GET_NOTIFICATIONS = "notification:get",
  GET_UNREAD_COUNT = "notification:get_unread_count",
  UPDATE_PREFERENCE = "notification:update_preference",
  UPDATE_PUSH_TOKEN = "notification:update_push_token",
  GET_PREFERENCE = "notification:get_preference",
  DELETE_NOTIFICATIONS = "notification:delete",

  // Outgoing events
  NOTIFICATION_RECEIVED = SocketEvents.NOTIFICATION_RECEIVED,
  NOTIFICATION_READ = SocketEvents.NOTIFICATION_READ,
  NOTIFICATIONS_FETCHED = "notification:fetched",
  NOTIFICATIONS_DELETED = "notification:deleted",
  UNREAD_COUNT = "notification:unread_count",
  PREFERENCE_UPDATED = "notification:preference_updated",
  PREFERENCE_FETCHED = "notification:preference_fetched",
  PUSH_TOKEN_UPDATED = "notification:push_token_updated",
  BULK_NOTIFICATION_RESULT = "notification:bulk_result",
  DELIVERY_STATUS = "notification:delivery_status",

  NOTIFICATION_DELIVERY = "notification.delivery",
  NOTIFICATION_SCHEDULED = "notification.scheduled",
  NOTIFICATION_CLEANUP = "notification.cleanup",

  GET_UNREAD = "notification:get_unread",
}
export enum AdminEvents {
  STATS_INVALIDATED = "admin:stats_invalidated",
  USER_REGISTERED = "admin:user_registered",
  USER_HEARTBEAT = "admin:user_heartbeat",
  PROVIDER_REGISTERED = "admin:provider_registered",
  TASK_CREATED = "admin:task_created",
}

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://9qc99pwv-3333.uks1.devtunnels.ms/";

let socket: Socket | null = null;

class SocketService {
  private socket: ReturnType<typeof io> | null = null;
  public isConnected: boolean = false;
  private emitQueue: Array<{ event: string; envelope: EventEnvelope }> = [];
  private static instance: SocketService;
  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // ----------------------------------
  // Connection
  // ----------------------------------
  async connect(): Promise<void> {
    if (this.socket?.connected || this.isConnected) {
      return;
    }

    if (this.socket) {
      // update auth on existing instance
      // @ts-ignore
      this.socket.connect();
      return;
    }

    this.socket = io(SOCKET_URL.replace(/\/$/, ""), {
      path: "/sanuxsocket/socket.io",
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      autoConnect: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.setupEventListeners();
  }

  // ----------------------------------
  // Listener setup
  // ----------------------------------
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connection", (data: any) => {
      console.log("🟢 socket connected", data);
      this.isConnected = true;

      while (this.emitQueue.length && this.socket) {
        const { event, envelope } = this.emitQueue.shift()!;
        this.socket.emit(event, envelope);
      }
    });

    this.socket.on("disconnect", (reason: any) => {
      console.log("🔴 socket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (err: any) => {
      console.error("Socket error:", err.message);
      this.isConnected = false;
    });
  }

  // async isSocketConnected(): boolean {

  // }

  // ----------------------------------
  // EMIT with envelope
  // ----------------------------------
  async emitEvent<T>(
    event:
      | SocketEvents
      | ChatEvents
      | PresenceEvents
      | NotificationEvents
      | AdminEvents,
    payload: T
  ): Promise<void> {
    const deviceId = getDeviceId();
    const sessionId = getSessionId();

    const envelope: EventEnvelope<T> = {
      version: "1.0.0",
      event,
      timestamp: Date.now(),
      payload,
      metadata: {
        requestId: uuidv4(), // auto-generate requestId
        deviceId: deviceId || undefined,
        sessionId: sessionId || undefined,
      },
    };

    if (this.isConnected && this.socket?.connected) {
      this.socket.emit(event, envelope);
    } else {
      this.emitQueue.push({ event, envelope });
      this.connect().catch(() => {});
    }
  }

  // ----------------------------------
  // LISTEN with envelope
  // ----------------------------------
  onEvent<T>(
    event:
      | SocketEvents
      | ChatEvents
      | PresenceEvents
      | NotificationEvents
      | AdminEvents,
    callback: (envelope: EventEnvelope<T>) => void
  ): void {
    this.socket?.on(event, callback);
  }

  offEvent(
    event:
      | SocketEvents
      | ChatEvents
      | PresenceEvents
      | NotificationEvents
      | AdminEvents,
    callback?: (data: any) => void
  ): void {
    this.socket?.off(event, callback);
  }

  onceEvent<T>(
    event: SocketEvents | ChatEvents | PresenceEvents
  ): Promise<EventEnvelope<T>> {
    return new Promise((resolve) => {
      this.socket?.once(event, (envelope: EventEnvelope<T>) => {
        resolve(envelope);
      });
    });
  }

  disconnect(): void {
    if (!this.socket) return;

    socket.removeAllListeners();
    this.socket.disconnect();
    this.isConnected = false;
    this.socket = null;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export const socketService = SocketService.getInstance();

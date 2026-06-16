"use client";

import { useEffect, useRef, useState } from "react";
import { SocketEvents, socketService } from "@/lib/socket";
import type { EventEnvelope } from "@/types/socket";
import type { DomainEventPayload } from "@/types/domain-events";

interface UseSubscriptionResult<T> {
  /** Last event received on this channel (null until one arrives). */
  lastEvent: DomainEventPayload<T> | null;
  /** True once the server has acknowledged the subscription. */
  isSubscribed: boolean;
}

interface UseSubscriptionOptions<T> {
  /** Called for every event delivered to this channel, in addition to the
   *  hook updating `lastEvent`. Use this when the consumer needs to react
   *  to every event (e.g. patch a Zustand slice) rather than just read the
   *  latest one. */
  onEvent?: (event: DomainEventPayload<T>) => void;
}

/**
 * Subscribe to a server-side channel and receive `domain:event` payloads
 * destined for it. Sends `subscription:subscribe` on mount,
 * `subscription:unsubscribe` on unmount.
 *
 * Phase 1 of the WebSocket upgrade (CLAUDE.md → "WebSocket architecture
 * upgrade — planning session 2026-06-10"). No production callers yet —
 * Phase 2 wires the admin marketplace views through this hook.
 *
 *   const { lastEvent } = useSubscription<AdminUserRow>(
 *     "scope:marketplace:users",
 *     { onEvent: (e) => { if (e.type === "user.registered") prepend(e.data); } },
 *   );
 *
 * Pass `null` as the channel to opt out (e.g. when not authenticated yet).
 */
export function useSubscription<T = unknown>(
  channel: string | null,
  options: UseSubscriptionOptions<T> = {},
): UseSubscriptionResult<T> {
  const [lastEvent, setLastEvent] = useState<DomainEventPayload<T> | null>(
    null,
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Keep the latest onEvent in a ref so we don't have to re-subscribe each
  // time the caller redefines the callback inline.
  const onEventRef = useRef(options.onEvent);
  onEventRef.current = options.onEvent;

  useEffect(() => {
    if (!channel) {
      setIsSubscribed(false);
      return;
    }

    let cancelled = false;
    void socketService.connect();

    const onIncoming = (
      envelope: EventEnvelope<DomainEventPayload<T>>,
    ) => {
      const payload = envelope?.payload;
      if (!payload || !Array.isArray(payload.channels)) return;
      // The backend already resolved recipients via SubscriptionRegistry,
      // but a single socket may be subscribed to multiple channels and
      // multiple useSubscription instances may share the socket — filter
      // so each hook only fires for its own channel.
      if (!payload.channels.includes(channel)) return;
      if (cancelled) return;
      setLastEvent(payload);
      onEventRef.current?.(payload);
    };

    const onAck = (envelope: any) => {
      const data = envelope?.payload ?? envelope;
      if (data?.channel === channel && !cancelled) setIsSubscribed(true);
    };

    socketService.onEvent(SocketEvents.DOMAIN_EVENT, onIncoming as any);
    socketService.onEvent(SocketEvents.SUBSCRIPTION_SUBSCRIBED, onAck as any);
    void socketService.emitEvent(SocketEvents.SUBSCRIPTION_SUBSCRIBE, {
      channel,
    });

    return () => {
      cancelled = true;
      socketService.offEvent(
        SocketEvents.DOMAIN_EVENT,
        onIncoming as any,
      );
      socketService.offEvent(
        SocketEvents.SUBSCRIPTION_SUBSCRIBED,
        onAck as any,
      );
      void socketService.emitEvent(SocketEvents.SUBSCRIPTION_UNSUBSCRIBE, {
        channel,
      });
      setIsSubscribed(false);
    };
  }, [channel]);

  return { lastEvent, isSubscribed };
}

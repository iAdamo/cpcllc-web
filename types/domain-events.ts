/**
 * Wire types for the DomainEventPublisher pipeline. Mirrors
 * `cpcllc-backend/src/modules/domain-events/domain-event.types.ts`.
 *
 * The frontend never publishes domain events — it only receives them by
 * subscribing to a channel via `useSubscription`. The backend resolves
 * recipients and projects per-permission before delivery.
 */

export interface DomainEventPayload<T = unknown> {
  /** Stable event type, e.g. `user.registered`, `task.created`. */
  type: string;
  /** Identifier of the resource the event refers to. */
  resourceId: string;
  /** Channels the event was published to. The hook filters by membership. */
  channels: string[];
  /** Projected resource — already permission-filtered server-side. */
  data: T;
  metadata?: Record<string, unknown>;
}

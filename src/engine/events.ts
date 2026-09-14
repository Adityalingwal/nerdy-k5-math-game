/**
 * Anonymous, in-memory event log.
 *
 * Nothing here is persisted, sent anywhere, or tied to a person. It exists so
 * the summary screen can describe what happened and so a demo operator can see
 * the loop's decisions. It is discarded when the tab closes.
 */

export interface GameEvent {
  /** Milliseconds since the session started. */
  readonly at: number;
  readonly type: string;
  readonly data?: Record<string, string | number | boolean>;
}

export class EventLog {
  private readonly startedAt = Date.now();
  private readonly entries: GameEvent[] = [];

  add(type: string, data?: Record<string, string | number | boolean>): void {
    this.entries.push({ at: Date.now() - this.startedAt, type, ...(data ? { data } : {}) });
  }

  all(): readonly GameEvent[] {
    return this.entries;
  }

  count(type: string): number {
    return this.entries.filter((e) => e.type === type).length;
  }

  clear(): void {
    this.entries.length = 0;
  }
}

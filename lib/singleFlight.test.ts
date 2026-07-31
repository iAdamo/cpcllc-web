import { describe, it, expect, vi } from "vitest";
import { createSingleFlight } from "./singleFlight";

describe("createSingleFlight", () => {
  it("collapses concurrent calls into one underlying invocation", async () => {
    let resolve!: (v: number) => void;
    const fn = vi.fn(() => new Promise<number>((r) => (resolve = r)));
    const flight = createSingleFlight(fn);

    const a = flight();
    const b = flight();
    const c = flight();
    // All three share the same in-flight call — fn ran once.
    expect(fn).toHaveBeenCalledTimes(1);

    resolve(42);
    expect(await a).toBe(42);
    expect(await b).toBe(42);
    expect(await c).toBe(42);
  });

  it("starts a fresh call once the previous one settles", async () => {
    const fn = vi.fn(async () => "ok");
    const flight = createSingleFlight(fn);

    await flight();
    await flight();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("resets after a rejection so the next call can retry", async () => {
    const fn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce("recovered");
    const flight = createSingleFlight(fn);

    await expect(flight()).rejects.toThrow("boom");
    await expect(flight()).resolves.toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

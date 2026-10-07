import { afterEach, describe, expect, it, vi } from "vitest";
import { aiChatStream } from "./ai";

/**
 * What the website sends to Sanux, and what it shows when the server refuses.
 * The server refuses a chat without the notice version the window showed
 * (cpcllc-backend ai-consent.ts), so it must ride along.
 */
const sse = (chunks: string[]) =>
  new Response(
    new ReadableStream({
      start(c) {
        for (const ch of chunks) c.enqueue(new TextEncoder().encode(ch));
        c.close();
      },
    }),
    { status: 200 },
  );

afterEach(() => vi.unstubAllGlobals());

describe("aiChatStream", () => {
  it("sends the notice version with the messages and streams the reply", async () => {
    const fetchMock = vi.fn(async () =>
      sse(['data: {"delta":"Tap "}\n\n', 'data: {"delta":"Post a task."}\n\ndata: [DONE]\n\n']),
    );
    vi.stubGlobal("fetch", fetchMock);
    let text = "";
    await aiChatStream([{ role: "user", content: "Hi" }], "2026-10-08", (d) => (text += d));
    expect(text).toBe("Tap Post a task.");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/ai\/chat\/stream$/);
    expect(JSON.parse(init.body as string)).toEqual({
      messages: [{ role: "user", content: "Hi" }],
      noticeVersion: "2026-10-08",
    });
    expect(init.credentials).toBe("include");
  });

  it("a refusal carries the server's reason, to show in the chat", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            success: false,
            error: { message: "You turned Sanux off. Turn it back on in Settings to chat." },
          }),
          { status: 403 },
        ),
      ),
    );
    await expect(
      aiChatStream([{ role: "user", content: "Hi" }], "2026-10-08", () => {}),
    ).rejects.toMatchObject({
      status: 403,
      serverMessage: "You turned Sanux off. Turn it back on in Settings to chat.",
    });
  });

  it("a server failure shows the friendly fallback, not internals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: { message: "boom" } }), { status: 503 })),
    );
    await expect(
      aiChatStream([{ role: "user", content: "Hi" }], "2026-10-08", () => {}),
    ).rejects.toMatchObject({ status: 503, serverMessage: undefined });
  });
});

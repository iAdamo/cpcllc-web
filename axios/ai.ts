import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const getAiStatus = async (): Promise<{ available: boolean }> =>
  (await axiosInstance.get("ai/status")).data;

/** Non-streaming reply (fallback / simple use). */
export const aiChat = async (messages: AiChatMessage[]): Promise<string> =>
  (await axiosInstance.post("ai/chat", { messages })).data.reply;

/**
 * Stream an assistant reply over SSE, calling `onDelta` for each text chunk.
 * Uses fetch (axios can't stream in the browser) against the same API base;
 * `credentials: include` so a signed-in user's cookie rides along.
 */
export async function aiChatStream(
  messages: AiChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const base = (axiosInstance.defaults.baseURL ?? "").replace(/\/$/, "");
  const res = await fetch(`${base}/ai/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    credentials: "include",
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`AI stream failed (${res.status})`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("event: error")) throw new Error("assistant error");
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload);
        if (json.delta) onDelta(json.delta as string);
      } catch {
        /* partial frame — next chunk completes it */
      }
    }
  }
}

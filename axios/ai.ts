import { ApiClientSingleton } from "./conf";

const { axiosInstance } = ApiClientSingleton.getInstance();

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Sanux status. `consented` and `off` come only for a signed-in account. */
export interface SanuxStatus {
  available: boolean;
  noticeVersion: string;
  consented?: boolean;
  off?: boolean;
}

export const getAiStatus = async (): Promise<SanuxStatus> =>
  (await axiosInstance.get("ai/status")).data;

/** Record acceptance of the Sanux notice (stored on the account when signed
 *  in; a guest's lives in this browser). */
export const acceptAiNotice = async (version: string): Promise<void> => {
  await axiosInstance.post("ai/consent", { version });
};

/** Non-streaming reply (fallback / simple use). */
export const aiChat = async (
  messages: AiChatMessage[],
  noticeVersion: string,
): Promise<string> =>
  (await axiosInstance.post("ai/chat", { messages, noticeVersion })).data.reply;

/**
 * Stream an assistant reply over SSE, calling `onDelta` for each text chunk.
 * Uses fetch (axios can't stream in the browser) against the same API base;
 * `credentials: include` so a signed-in user's cookie rides along.
 */
export async function aiChatStream(
  messages: AiChatMessage[],
  noticeVersion: string,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const base = (axiosInstance.defaults.baseURL ?? "").replace(/\/$/, "");
  const res = await fetch(`${base}/ai/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, noticeVersion }),
    credentials: "include",
    signal,
  });
  if (!res.ok || !res.body) {
    // The server's reason when it refused ("You turned Sanux off...").
    const body = await res.json().catch(() => null);
    const message: string | undefined = body?.error?.message;
    throw Object.assign(new Error(message ?? `AI stream failed (${res.status})`), {
      status: res.status,
      serverMessage: res.status < 500 ? message : undefined,
    });
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

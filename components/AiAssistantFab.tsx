"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { getAiStatus, aiChatStream, type AiChatMessage } from "@/axios/ai";

const GREETING: AiChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Herman, CompaniesCenter assistant. Ask me how to find a provider, post a task, or how the platform works.",
};

const SUGGESTIONS = [
  "How do I post a task?",
  "How do payments work?",
  "How do I find a plumber near me?",
];

/**
 * Floating AI assistant available to everyone (guests + signed-in users).
 * Streams replies token-by-token from the backend, which holds the Gemini key.
 * Hidden on the admin console (it has its own surface).
 */
export default function AiAssistantFab() {
  const pathname = usePathname();
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    getAiStatus()
      .then((s) => setAvailable(!!s.available))
      .catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!available || pathname?.startsWith("/admin")) return null;

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming) return;
    const next: AiChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      // Send prior turns minus the local greeting (backend has its own system prompt).
      const history = next.filter((m) => m !== GREETING);
      await aiChatStream(
        history,
        (delta) => {
          setMessages((prev) => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = { ...last, content: last.content + delta };
            return copy;
          });
        },
        abortRef.current.signal,
      );
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant" && !last.content) {
          copy[copy.length - 1] = {
            ...last,
            content: "Sorry, I couldn't reach the assistant. Please try again.",
          };
        }
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label="Open AI assistant"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm h-[32rem] max-h-[70vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">Herman</p>
                <p className="text-[11px] text-white/80 leading-tight">CompaniesCenter assistant</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {m.content ||
                      (streaming && i === messages.length - 1 ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        ""
                      ))}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask anything…"
                  className="flex-1 resize-none max-h-24 text-sm bg-gray-100 dark:bg-gray-800 rounded-2xl px-3.5 py-2.5 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                />
                <button
                  type="button"
                  aria-label="Send"
                  onClick={() => send(input)}
                  disabled={streaming || !input.trim()}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition-colors flex-shrink-0"
                >
                  {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Herman can make mistakes. Verify important details.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

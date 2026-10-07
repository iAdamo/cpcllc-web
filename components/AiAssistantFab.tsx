"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Loader2, ShieldAlert, Info } from "lucide-react";
import {
  getAiStatus,
  aiChatStream,
  acceptAiNotice,
  type AiChatMessage,
  type SanuxStatus,
} from "@/axios/ai";

const GREETING: AiChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Sanux, the CompaniesCenter assistant. Ask me how to find a provider, post a task, or how the platform works.",
};

const SUGGESTIONS = [
  "How do I post a task?",
  "How do payments work?",
  "How do I find a plumber near me?",
];

/** Where a guest's acceptance of the notice is kept in this browser. */
const NOTICE_KEY = "sanux-notice-version";

// The notice. A text change needs a new notice version on the backend
// (cpcllc-backend docs/ai-assistant.md), and the same change in the app.
const NOTICE_POINTS: Array<[typeof Sparkles, string]> = [
  [Sparkles, "Sanux is an AI assistant that runs on Google Gemini."],
  [Send, "What you type here is sent to Google to write the answer. We don't store your chat."],
  [ShieldAlert, "Don't share personal details: your address, phone number, payment or health information."],
  [Info, "Answers can be wrong. For anything important, contact support."],
];

const readNotice = (): string | null => {
  try {
    return window.localStorage.getItem(NOTICE_KEY);
  } catch {
    return null;
  }
};

/**
 * Sanux, the floating AI assistant for everyone (guests + signed-in users).
 * Shows the notice before the first message; streams replies from the
 * backend, which holds the Gemini key and refuses a chat without the notice.
 * Hidden on the admin console, and when a signed-in person turned Sanux off.
 */
export default function AiAssistantFab() {
  const pathname = usePathname();
  const [status, setStatus] = useState<SanuxStatus | null>(null);
  const [deviceNotice, setDeviceNotice] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setDeviceNotice(readNotice());
    getAiStatus()
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!status?.available || status.off || pathname?.startsWith("/admin")) return null;

  // Only a signed-in request gets `consented` back: then the account decides.
  const signedIn = typeof status.consented === "boolean";
  const needsNotice = signedIn
    ? !status.consented
    : deviceNotice !== status.noticeVersion;

  const accept = async () => {
    setAccepting(true);
    try {
      await acceptAiNotice(status.noticeVersion);
      try {
        window.localStorage.setItem(NOTICE_KEY, status.noticeVersion);
      } catch {
        /* signed in: the account record is what counts */
      }
      setDeviceNotice(status.noticeVersion);
      if (signedIn) setStatus({ ...status, consented: true });
    } catch {
      setOpen(false);
    } finally {
      setAccepting(false);
    }
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming || needsNotice) return;
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
        status.noticeVersion,
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
    } catch (error) {
      const reason =
        (error as { serverMessage?: string })?.serverMessage ??
        "Sorry, I couldn't reach the assistant. Please try again.";
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant" && !last.content) {
          copy[copy.length - 1] = { ...last, content: reason };
        }
        return copy;
      });
      // A changed notice or setting: re-read it (shows the notice again).
      if ((error as { status?: number })?.status === 403) {
        getAiStatus().then(setStatus).catch(() => {});
      }
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        aria-label={open ? "Close Sanux" : "Chat with Sanux"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-600 text-white shadow-xl shadow-brand-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
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
            <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-600 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold leading-tight">Sanux</p>
                <p className="text-[11px] text-white/80 leading-tight">CompaniesCenter assistant</p>
              </div>
              <button type="button" aria-label="Close Sanux" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {needsNotice ? (
              /* The notice: nothing is sent to Google before "Continue". */
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Before you chat with Sanux
                </p>
                <ul className="flex flex-col gap-3">
                  {NOTICE_POINTS.map(([Icon, text]) => (
                    <li key={text} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <Icon size={18} className="mt-0.5 shrink-0 text-brand-600" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/privacy-policy"
                  className="text-sm font-semibold text-brand-600 underline"
                >
                  Read our privacy policy
                </Link>
                <div className="mt-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={accepting}
                    className="flex-1 h-11 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50"
                  >
                    Not now
                  </button>
                  <button
                    type="button"
                    onClick={accept}
                    disabled={accepting}
                    className="flex-1 h-11 rounded-xl bg-brand-600 text-white text-sm font-bold flex items-center justify-center disabled:opacity-60 hover:bg-brand-700"
                  >
                    {accepting ? <Loader2 size={16} className="animate-spin" /> : "Continue"}
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                            ? "bg-brand-600 text-white rounded-br-sm"
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
                          className="text-[12px] px-2.5 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 transition-colors"
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
                      aria-label="Message Sanux"
                      className="flex-1 resize-none max-h-24 text-sm bg-gray-100 dark:bg-gray-800 rounded-2xl px-3.5 py-2.5 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      aria-label="Send"
                      onClick={() => send(input)}
                      disabled={streaming || !input.trim()}
                      className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-700 transition-colors flex-shrink-0"
                    >
                      {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-1.5">
                    Sanux can make mistakes, and runs on Google Gemini. Don&apos;t share personal details.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

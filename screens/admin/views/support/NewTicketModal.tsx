"use client";

import { useEffect, useRef, useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { createTicket, getAdminUsersView } from "@/axios/admin";

const CATEGORIES = [
  "account",
  "payment",
  "subscription",
  "task",
  "booking",
  "review",
  "dispute",
  "trust_safety",
  "technical",
  "other",
];
const PRIORITIES = ["low", "normal", "high", "urgent"];

function name(u: any): string {
  return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.email || "User";
}

/**
 * Create a ticket on behalf of a customer (e.g. someone who emailed or
 * called in). Agent searches for the requester, then fills the request.
 */
export function NewTicketModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (ticketId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [requester, setRequester] = useState<any>(null);
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setRequester(null);
      setCategory("other");
      setPriority("normal");
      setSubject("");
      setDescription("");
    }
  }, [open]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const q = query.trim();
    if (q.length < 2 || requester) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      try {
        const r = await getAdminUsersView({ search: q, limit: 8 });
        setResults((r as any).page?.items ?? (r as any).items ?? []);
      } catch {
        setResults([]);
      }
    }, 300);
  }, [query, requester]);

  if (!open) return null;

  const canSave = requester && subject.trim().length > 2;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const t = await createTicket({
        subject: subject.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        requester: requester._id,
      });
      onClose();
      onCreated(t._id ?? t.ticket?._id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            New ticket for a customer
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Requester */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Customer
            </label>
            {requester ? (
              <div className="mt-1 flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-800 dark:text-slate-100">
                  {name(requester)}{" "}
                  <span className="text-slate-400">· {requester.email}</span>
                </span>
                <button
                  onClick={() => setRequester(null)}
                  className="text-xs text-blue-600 font-semibold"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative mt-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search customer by name or email…"
                  className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-400"
                />
                {results.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
                    {results.map((u) => (
                      <button
                        key={u._id}
                        onClick={() => {
                          setRequester(u);
                          setResults([]);
                          setQuery("");
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        {name(u)}{" "}
                        <span className="text-slate-400">· {u.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full mt-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-2"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 resize-none"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={save}
            disabled={!canSave || saving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Create ticket
          </button>
        </div>
      </div>
    </div>
  );
}

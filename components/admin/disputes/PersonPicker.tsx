"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { getAdminUsersView } from "@/axios/admin";
import { personName } from "@/lib/disputeCase";

type Person = { _id: string; firstName?: string; lastName?: string; email?: string };

/** Search marketplace users by name or email and pick one. */
export function PersonPicker({
  id,
  value,
  onChange,
  placeholder = "Search by name or email…",
}: {
  id: string;
  value: Person | null;
  onChange: (p: Person | null) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    const q = query.trim();
    if (q.length < 2 || value) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      try {
        const r: any = await getAdminUsersView({ search: q, limit: 8 });
        setResults(r?.page?.items ?? r?.items ?? []);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [query, value]);

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-md bg-brand-50 dark:bg-brand-950/30 px-3 py-2 text-sm">
        <span className="text-slate-800 dark:text-slate-100">
          {personName(value)} <span className="text-slate-400">· {value.email}</span>
        </span>
        <button type="button" onClick={() => onChange(null)} className="text-xs font-semibold text-brand-600">
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 outline-none focus:border-brand-400"
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg overflow-hidden">
          {results.map((u) => (
            <button
              key={u._id}
              type="button"
              onClick={() => {
                onChange(u);
                setQuery("");
                setResults([]);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {personName(u)} <span className="text-slate-400">· {u.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Paperclip, X, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  fetchSubscribers,
  deleteSubscriber,
  sendNewsletterBroadcast,
  fetchQueries,
  UnauthorizedError,
  type Subscriber,
  type ContactQuery,
} from "@/lib/admin-api";
import { fadeUpStagger } from "@/lib/motion";
import { formatDate } from "@/lib/format";
import { useIsDesktop } from "@/lib/use-media-query";
import ContactButtons from "@/components/admin/contact-buttons";
import AdminModal from "@/components/admin/admin-modal";
import AdminDrawer from "@/components/admin/admin-drawer";

const inputClasses =
  "w-full rounded-xl border border-navy/15 px-4 py-3 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none";

type RecencyFilter = "all" | "7" | "30" | "90";
const RECENCY_DAYS: Record<Exclude<RecencyFilter, "all">, number> = { "7": 7, "30": 30, "90": 90 };

type Tab = "send" | "queries";

export default function AdminNewsletterPage() {
  const router = useRouter();
  const { token, logout } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("send");
  const [subscribers, setSubscribers] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [recency, setRecency] = useState<RecencyFilter>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Captured once rather than read inside useMemo — a memoized computation
  // must stay pure, and Date.now() is a fresh value on every call.
  const [now] = useState(() => Date.now());

  // Lets the admin nav's "Queries" dropdown link deep-link straight into
  // this tab (?tab=queries) without a separate route.
  useEffect(() => {
    // The URL's search params don't exist during server rendering, so this
    // can only be read once mounted on the client — an effect is
    // unavoidable here, same as admin-auth.tsx's localStorage read.
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.get("tab") === "queries") setTab("queries");
  }, []);

  function handleUnauthorized() {
    logout();
    router.replace("/admin/login");
  }

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchSubscribers(token)
      .then((data) => {
        if (!cancelled) setSubscribers(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load subscribers");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDelete(subscriber: Subscriber) {
    if (!token) return;
    if (!window.confirm(`Remove ${subscriber.email} from the newsletter list? This can't be undone.`)) return;

    setDeletingId(subscriber.id);
    try {
      await deleteSubscriber(token, subscriber.id);
      setSubscribers((prev) => prev?.filter((s) => s.id !== subscriber.id) ?? prev);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        handleUnauthorized();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to delete subscriber");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter((s) => {
      const matchesSearch = s.email.toLowerCase().includes(search.trim().toLowerCase());
      const matchesRecency =
        recency === "all" || now - new Date(s.created_at).getTime() <= RECENCY_DAYS[recency] * 24 * 60 * 60 * 1000;
      return matchesSearch && matchesRecency;
    });
  }, [subscribers, search, recency, now]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-navy">Newsletter</h1>
      <p className="mt-1 text-navy/50">
        {subscribers ? `${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"}` : "Loading..."}
      </p>

      <div className="mt-4 inline-flex rounded-xl border border-navy/15 bg-white p-1">
        <button
          type="button"
          onClick={() => setTab("send")}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
            tab === "send" ? "bg-navy text-white" : "text-navy/50 hover:text-navy"
          }`}
        >
          Send Newsletter
        </button>
        <button
          type="button"
          onClick={() => setTab("queries")}
          className={`rounded-lg px-4 py-1.5 text-sm font-bold transition-colors ${
            tab === "queries" ? "bg-navy text-white" : "text-navy/50 hover:text-navy"
          }`}
        >
          Queries
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {tab === "send" ? (
        <>
          <SendEmailCard token={token} subscriberCount={subscribers?.length ?? 0} onUnauthorized={handleUnauthorized} />

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUpStagger}
            className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy/30" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-navy/15 py-2 pr-4 pl-9 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none"
                />
              </div>

              <select
                value={recency}
                onChange={(e) => setRecency(e.target.value as RecencyFilter)}
                className="rounded-xl border border-navy/15 px-4 py-2 text-navy focus:border-amber focus:outline-none"
              >
                <option value="all">All time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-navy/10 text-sm text-navy/50">
                    <th className="py-3 pr-3 font-bold">Email</th>
                    <th className="px-3 py-3 font-bold">Subscribed</th>
                    <th className="py-3 pl-3 font-bold">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-navy/5 last:border-0">
                      <td className="py-3 pr-3 text-navy">{s.email}</td>
                      <td className="px-3 py-3 text-navy/60">{formatDate(s.created_at)}</td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          onClick={() => handleDelete(s)}
                          disabled={deletingId === s.id}
                          aria-label={`Remove ${s.email}`}
                          className="text-navy/40 transition-colors hover:text-red-600 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers && filtered.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-navy/40">
                        No subscribers match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      ) : (
        <QueriesSection token={token} onUnauthorized={handleUnauthorized} />
      )}
    </div>
  );
}

type Status = "idle" | "sending" | "success" | "error";

function SendEmailCard({
  token,
  subscriberCount,
  onUnauthorized,
}: {
  token: string | null;
  subscriberCount: number;
  onUnauthorized: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  // Remounting the file input via a changing key (rather than clearing its
  // .value by hand) is what lets the same file be re-selected a second time.
  // Setting .value = "" directly on a React-managed file input desyncs
  // React's own internal change-tracking for that element, which silently
  // breaks the *next* selection — confirmed by reproducing it directly.
  const [fileInputKey, setFileInputKey] = useState(0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
    setFileInputKey((k) => k + 1);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || subscriberCount === 0) return;
    if (!window.confirm(`Send this email to all ${subscriberCount} subscribers? This can't be undone.`)) return;

    setStatus("sending");
    setFeedback("");
    try {
      const result = await sendNewsletterBroadcast(token, subject, message, files);
      setStatus("success");
      setFeedback(`Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.`);
      setSubject("");
      setMessage("");
      setFiles([]);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        onUnauthorized();
        return;
      }
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Failed to send the email.");
    }
  }

  const canSend = subject.trim().length > 0 && message.trim().length > 0 && subscriberCount > 0;

  return (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={fadeUpStagger}
      className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-lg font-extrabold text-navy">Send an Email</h2>
      <p className="text-sm text-navy/50">
        This goes out to all {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClasses}
        />
        <textarea
          placeholder="Write your message..."
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClasses}
        />

        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-navy hover:text-amber">
            <Paperclip className="h-4 w-4" />
            Attach files
            <input key={fileInputKey} type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-cream px-3 py-2 text-sm text-navy"
                >
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${file.name}`}>
                    <X className="h-4 w-4 text-navy/50 hover:text-navy" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {feedback && (
          <p className={`text-sm ${status === "error" ? "text-red-600" : "text-navy"}`}>{feedback}</p>
        )}

        <button
          type="submit"
          disabled={!canSend || status === "sending"}
          className="w-full rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-[1.02] hover:bg-amber/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : `Send to ${subscriberCount} Subscriber${subscriberCount === 1 ? "" : "s"}`}
        </button>
      </form>
    </motion.div>
  );
}

function QueriesSection({ token, onUnauthorized }: { token: string | null; onUnauthorized: () => void }) {
  const [queries, setQueries] = useState<ContactQuery[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContactQuery | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetchQueries(token)
      .then((data) => {
        if (!cancelled) setQueries(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          onUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load queries");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filtered = useMemo(() => {
    if (!queries) return [];
    const q = search.trim().toLowerCase();
    if (!q) return queries;
    return queries.filter(
      (query) =>
        `${query.first_name} ${query.last_name}`.toLowerCase().includes(q) ||
        query.email.toLowerCase().includes(q) ||
        query.subject.toLowerCase().includes(q)
    );
  }, [queries, search]);

  const selectedTitle = selected ? `${selected.first_name} ${selected.last_name}` : "";

  return (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={fadeUpStagger}
      className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-navy">Contact Queries</h2>
          <p className="text-sm text-navy/50">{queries ? `${queries.length} total` : "Loading..."}</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy/30" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-navy/15 py-2 pr-4 pl-9 text-navy placeholder:text-navy/40 focus:border-amber focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {queries && filtered.length === 0 && (
        <p className="mt-6 text-center text-navy/40">No queries {search ? "match your search" : "yet"}.</p>
      )}

      <div className="mt-6 divide-y divide-navy/5">
        {filtered.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setSelected(q)}
            className="flex w-full items-center justify-between gap-4 rounded-lg py-3 text-left transition-colors hover:bg-cream/60"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-navy">
                {q.first_name} {q.last_name}
              </p>
              <p className="truncate text-sm text-navy/50">{q.subject}</p>
            </div>
            <span className="shrink-0 text-sm text-navy/40">{formatDate(q.created_at)}</span>
          </button>
        ))}
      </div>

      {/* Modal on desktop, a side drawer below it — a centered dialog feels
          too heavy on a narrow screen for what's really just reading a
          message and tapping a call/email button. */}
      {isDesktop ? (
        <AdminModal isOpen={selected !== null} onClose={() => setSelected(null)} title={selectedTitle}>
          {selected && <QueryDetails query={selected} />}
        </AdminModal>
      ) : (
        <AdminDrawer isOpen={selected !== null} onClose={() => setSelected(null)} title={selectedTitle}>
          {selected && <QueryDetails query={selected} />}
        </AdminDrawer>
      )}
    </motion.div>
  );
}

function QueryDetails({ query }: { query: ContactQuery }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-bold text-navy/50">Subject</p>
        <p className="mt-1 text-navy">{query.subject}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-navy/50">Message</p>
        <p className="mt-1 whitespace-pre-wrap text-navy">{query.message}</p>
      </div>
      <div>
        <p className="text-sm font-bold text-navy/50">Email</p>
        <p className="mt-1 text-navy">{query.email}</p>
      </div>
      {query.phone && (
        <div>
          <p className="text-sm font-bold text-navy/50">Phone</p>
          <p className="mt-1 text-navy">{query.phone}</p>
        </div>
      )}
      <div>
        <p className="text-sm font-bold text-navy/50">Submitted</p>
        <p className="mt-1 text-navy">{formatDate(query.created_at)}</p>
      </div>

      <div className="border-t border-navy/5 pt-4">
        <ContactButtons name={`${query.first_name} ${query.last_name}`} phone={query.phone} email={query.email} />
      </div>
    </div>
  );
}

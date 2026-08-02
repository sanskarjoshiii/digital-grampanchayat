"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGlobalContext } from "../../context/context";
import { Clamped, MediaStrip, MediaViewer, StatusBadge } from "../../component/ComplaintBits";
import Dropdown from "../../component/Dropdown";
import { avatarSrc } from "../../utils/avatar";
import {
  COMPLAINT_STATUSES,
  requiresNote,
  statusMeta,
} from "../../utils/complaints";
import { fmtDateTime } from "../../utils/format";

export default function ComplaintsDashboard() {
  const { userData, setOpenSidebar } = useGlobalContext();
  const [data, setData] = useState({ complaints: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [preview, setPreview] = useState(null);
  const [changing, setChanging] = useState(null);
  const isAdmin = userData?.userType === "admin";

  // Debounce typing so each keystroke does not hit the database.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, sort });
      if (search) params.set("q", search);
      const response = await fetch(`/api/admin/complaints?${params}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      setData(payload);
    } catch (error) {
      toast.error(error.message || "Could not load complaints");
    }
    setLoading(false);
  }, [status, search, sort]);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin, load]);

  if (!isAdmin)
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-cream px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">Office access only</h1>
          <p className="mt-2 text-sm text-muted">
            This dashboard is for Panchayat staff. You can see the complaints you raised on your
            own tracking page.
          </p>
          <Link href="/complaints" className="btn-primary mt-6 text-sm">
            My complaints
          </Link>
        </div>
      </main>
    );

  const { complaints, stats } = data;

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-cream px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-7xl">
        {/* No page title or blurb: the section name is in the top nav and the
            explanation is in the help panel. */}

        {/* Workload at a glance */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <button
            onClick={() => setStatus("all")}
            className={`rounded-card border px-4 py-3 text-left transition-colors ${
              status === "all" ? "border-ink bg-paper" : "border-line bg-paper hover:bg-mist"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-muted">Total</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
              {stats.total || 0}
            </p>
          </button>
          {COMPLAINT_STATUSES.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatus(option.value)}
              className={`rounded-card border px-4 py-3 text-left transition-colors ${
                status === option.value ? "border-ink bg-paper" : "border-line bg-paper hover:bg-mist"
              }`}
              title={option.description}
            >
              <p className="text-xs uppercase tracking-wide text-muted">{option.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                {stats[option.value] || 0}
              </p>
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-end gap-3 rounded-card border border-line bg-paper p-4">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="ds-input py-2"
              placeholder="Complaint ID, title or email…"
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Sort</span>
            <Dropdown
              value={sort}
              options={[
                { value: "newest", label: "Newest first" },
                { value: "oldest", label: "Oldest first" },
              ]}
              onChange={setSort}
              ariaLabel="Sort"
            />
          </div>
          {(status !== "all" || query || sort !== "newest") && (
            <button
              onClick={() => {
                setStatus("all");
                setQuery("");
                setSort("newest");
              }}
              className="ml-auto text-sm font-medium text-ink hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="h-24 animate-pulse rounded-card bg-mist" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center">
            <h2 className="font-semibold text-ink">Nothing to show</h2>
            <p className="mt-2 text-sm text-muted">
              {search || status !== "all"
                ? "No complaint matches these filters."
                : "No villager has raised a complaint yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-card border border-line bg-paper xl:block">
              <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Complaint ID</th>
                    <th className="px-4 py-3 font-medium">Raised by</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Complaint</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Evidence</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Raised on</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => {
                    const latest = complaint.history?.[complaint.history.length - 1];
                    return (
                      <tr key={complaint._id} className="border-b border-line align-top last:border-0">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-ink">
                          {complaint.complaintId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={avatarSrc(complaint.raiser.profile)}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-full border border-line object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink">
                                {complaint.raiser.name}
                              </p>
                              <p className="truncate text-xs text-muted">
                                @{complaint.raiser.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {complaint.raiser.phoneNo ? (
                            <a
                              href={`tel:${complaint.raiser.phoneNo}`}
                              className="block whitespace-nowrap font-medium text-ink hover:underline"
                            >
                              {complaint.raiser.phoneNo}
                            </a>
                          ) : (
                            <span className="block text-muted">No mobile on file</span>
                          )}
                          <a
                            href={`mailto:${complaint.raiser.email}`}
                            className="mt-0.5 block max-w-[160px] truncate text-muted hover:underline"
                          >
                            {complaint.raiser.email}
                          </a>
                        </td>
                        <td className="max-w-[180px] px-4 py-3 font-medium text-ink">
                          {complaint.title}
                        </td>
                        <td className="max-w-[260px] px-4 py-3">
                          <Clamped text={complaint.description} />
                        </td>
                        <td className="px-4 py-3">
                          <MediaStrip media={complaint.media} onOpen={setPreview} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={complaint.status} />
                          {latest?.note && (
                            <p className="mt-1.5 max-w-[160px] text-xs text-muted">{latest.note}</p>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                          {fmtDateTime(complaint.createdAt)}
                          {latest && (
                            <span className="mt-0.5 block">
                              Last change {fmtDateTime(latest.at)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setChanging(complaint)}
                            className="whitespace-nowrap text-sm font-medium text-ink hover:underline"
                          >
                            Change status
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 xl:hidden">
              {complaints.map((complaint) => {
                const latest = complaint.history?.[complaint.history.length - 1];
                return (
                  <article key={complaint._id} className="rounded-card border border-line bg-paper p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-xs text-muted">{complaint.complaintId}</p>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <h2 className="mt-1 font-medium text-ink">{complaint.title}</h2>
                    <div className="mt-2">
                      <Clamped text={complaint.description} />
                    </div>
                    {complaint.media?.length > 0 && (
                      <div className="mt-3">
                        <MediaStrip media={complaint.media} onOpen={setPreview} />
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                      <img
                        src={avatarSrc(complaint.raiser.profile)}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-full border border-line object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {complaint.raiser.name}{" "}
                          <span className="text-muted">@{complaint.raiser.username}</span>
                        </p>
                        <p className="truncate text-xs text-muted">
                          {complaint.raiser.phoneNo ? (
                            <a href={`tel:${complaint.raiser.phoneNo}`} className="hover:underline">
                              {complaint.raiser.phoneNo}
                            </a>
                          ) : (
                            "No mobile on file"
                          )}{" "}
                          · {complaint.raiser.email}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      Raised {fmtDateTime(complaint.createdAt)}
                    </p>
                    {latest?.note && (
                      <p className="mt-2 rounded-md bg-mist px-2 py-1.5 text-xs text-muted">
                        {latest.note}
                      </p>
                    )}
                    <button
                      onClick={() => setChanging(complaint)}
                      className="btn-ghost mt-3 w-full px-4 py-2 text-sm"
                    >
                      Change status
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {changing && (
        <StatusDialog
          complaint={changing}
          onClose={() => setChanging(null)}
          onSaved={() => {
            setChanging(null);
            load();
          }}
        />
      )}
      <MediaViewer item={preview} onClose={() => setPreview(null)} />
    </main>
  );
}

function StatusDialog({ complaint, onClose, onSaved }) {
  const [status, setStatus] = useState(complaint.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (status === complaint.status) return onClose();
    if (requiresNote(status) && !note.trim())
      return toast.error("Add a reason so the villager knows why it was rejected");

    setSaving(true);
    const response = await fetch(`/api/admin/complaints/${complaint._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) return toast.error(data.message || "Could not update the status");
    toast.success(`${complaint.complaintId} → ${statusMeta(status).label}`);
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-card border border-line bg-paper shadow-pop"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-semibold text-ink">Update {complaint.complaintId}</h2>
          <p className="mt-1 truncate text-sm text-muted">{complaint.title}</p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <span className="ds-label">New status</span>
            <div className="space-y-2">
              {COMPLAINT_STATUSES.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    status === option.value ? "border-ink bg-mist" : "border-line hover:bg-mist"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={status === option.value}
                    onChange={() => setStatus(option.value)}
                    className="mt-0.5 h-4 w-4 accent-ink"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{option.label}</span>
                    <span className="block text-xs text-muted">{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="ds-label" htmlFor="status-note">
              Note for the villager{" "}
              {requiresNote(status) ? (
                <span className="text-red-700">(required)</span>
              ) : (
                <span className="font-normal text-muted">(optional)</span>
              )}
            </label>
            <textarea
              id="status-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="ds-input min-h-20 resize-y"
              placeholder="What is being done, or why it is being closed"
              maxLength={500}
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button onClick={save} disabled={saving} className="btn-primary text-sm">
            {saving ? "Saving…" : "Update status"}
          </button>
          <button onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

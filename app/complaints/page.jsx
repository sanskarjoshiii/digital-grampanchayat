"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import ComplaintForm from "../component/ComplaintForm";
import { Clamped, MediaStrip, MediaViewer, StatusBadge } from "../component/ComplaintBits";
import { COMPLAINT_STATUSES, isEditableByOwner, statusMeta } from "../utils/complaints";
import { fmtDateTime } from "../utils/format";

export default function ComplaintsPage() {
  const { userData, setOpenSidebar } = useGlobalContext();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState(null);
  const isAdmin = userData?.userType === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/complaints");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setComplaints(data);
    } catch (error) {
      toast.error(error.message || "Could not load your complaints");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData?.email && !isAdmin) load();
    else setLoading(false);
  }, [userData?.email, isAdmin, load]);

  const withdraw = async (complaint) => {
    if (
      !window.confirm(
        `Withdraw complaint ${complaint.complaintId}? This cannot be undone.`
      )
    )
      return;
    const response = await fetch(`/api/complaints/${complaint._id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return toast.error(data.message || "Could not withdraw the complaint");
    toast.success("Complaint withdrawn");
    setComplaints((current) => current.filter((item) => item._id !== complaint._id));
  };

  // The office tracks complaints on its own dashboard; this page is the
  // villager's view of their own submissions.
  if (isAdmin)
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">This page is for villagers</h1>
          <p className="mt-2 text-sm text-muted">
            Complaints raised by residents are managed from the office dashboard.
          </p>
          <Link href="/admin/complaints" className="btn-primary mt-6 text-sm">
            Go to the complaints dashboard
          </Link>
        </div>
      </main>
    );

  if (!userData?.email)
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">Log in to track your complaints</h1>
          <p className="mt-2 text-sm text-muted">
            Your complaints and their status are private to your account.
          </p>
          <button onClick={() => router.push("/login")} className="btn-primary mt-6 text-sm">
            Log in
          </button>
        </div>
      </main>
    );

  const visible =
    filter === "all" ? complaints : complaints.filter((item) => item.status === filter);
  const counts = complaints.reduce(
    (totals, item) => ({ ...totals, [item.status]: (totals[item.status] || 0) + 1 }),
    {}
  );

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-8 sm:py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Your submissions</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">My complaints</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Track what you have reported to the Panchayat. Quote the complaint number when you
              visit the office.
            </p>
          </div>
          <button onClick={() => setCreating(true)} className="btn-primary shrink-0 text-sm">
            + New complaint
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {[{ value: "all", label: "All" }, ...COMPLAINT_STATUSES].map((option) => {
            const total = option.value === "all" ? complaints.length : counts[option.value] || 0;
            return (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === option.value
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-paper text-muted hover:bg-mist"
                }`}
              >
                {option.label} <span className="tabular-nums opacity-70">({total})</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="h-20 animate-pulse rounded-card bg-mist" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center">
            <h2 className="font-semibold text-ink">
              {complaints.length === 0 ? "No complaints yet" : "Nothing with this status"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {complaints.length === 0
                ? "Use the button on any page to report a problem in the village."
                : "Try a different filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop: full table. Scrolls sideways rather than squashing. */}
            <div className="hidden overflow-x-auto rounded-card border border-line bg-paper lg:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-line bg-mist text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Complaint ID</th>
                    <th className="px-4 py-3 font-medium">Complaint</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Attachments</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Raised on</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((complaint) => {
                    const editable = isEditableByOwner(complaint.status);
                    const latest = complaint.history?.[complaint.history.length - 1];
                    return (
                      <tr key={complaint._id} className="border-b border-line last:border-0 align-top">
                        <td className="px-4 py-3">
                          <span className="whitespace-nowrap font-mono text-xs font-medium text-ink">
                            {complaint.complaintId}
                          </span>
                        </td>
                        <td className="max-w-[200px] px-4 py-3 font-medium text-ink">
                          {complaint.title}
                        </td>
                        <td className="max-w-[280px] px-4 py-3">
                          <Clamped text={complaint.description} />
                          {latest?.note && complaint.status !== "submitted" && (
                            <p className="mt-2 rounded-md bg-mist px-2 py-1.5 text-xs text-muted">
                              <span className="font-medium text-ink">Office note:</span>{" "}
                              {latest.note}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <MediaStrip media={complaint.media} onOpen={setPreview} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={complaint.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                          {fmtDateTime(complaint.createdAt)}
                          {complaint.updatedAt !== complaint.createdAt && (
                            <span className="mt-0.5 block">
                              Updated {fmtDateTime(complaint.updatedAt)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {editable ? (
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setEditing(complaint)}
                                className="text-sm font-medium text-ink hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => withdraw(complaint)}
                                className="text-sm font-medium text-red-700 hover:underline"
                              >
                                Withdraw
                              </button>
                            </div>
                          ) : (
                            <span
                              className="text-xs text-muted"
                              title="The office has started work on this complaint"
                            >
                              Locked
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: the same data as stacked cards. */}
            <div className="space-y-3 lg:hidden">
              {visible.map((complaint) => {
                const editable = isEditableByOwner(complaint.status);
                const latest = complaint.history?.[complaint.history.length - 1];
                return (
                  <article
                    key={complaint._id}
                    className="rounded-card border border-line bg-paper p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-muted">{complaint.complaintId}</p>
                        <h2 className="mt-1 font-medium text-ink">{complaint.title}</h2>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <div className="mt-3">
                      <Clamped text={complaint.description} />
                    </div>
                    {latest?.note && complaint.status !== "submitted" && (
                      <p className="mt-2 rounded-md bg-mist px-2 py-1.5 text-xs text-muted">
                        <span className="font-medium text-ink">Office note:</span> {latest.note}
                      </p>
                    )}
                    {complaint.media?.length > 0 && (
                      <div className="mt-3">
                        <MediaStrip media={complaint.media} onOpen={setPreview} />
                      </div>
                    )}
                    <p className="mt-3 text-xs text-muted">
                      Raised {fmtDateTime(complaint.createdAt)}
                    </p>
                    {editable && (
                      <div className="mt-3 flex gap-3 border-t border-line pt-3">
                        <button
                          onClick={() => setEditing(complaint)}
                          className="text-sm font-medium text-ink hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => withdraw(complaint)}
                          className="text-sm font-medium text-red-700 hover:underline"
                        >
                          Withdraw
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </>
        )}

        <p className="mt-5 text-xs text-muted">
          You can edit or withdraw a complaint while it is still{" "}
          <strong className="font-medium text-ink">{statusMeta("submitted").label}</strong>. Once
          the office acknowledges it, the record is locked so the staff working on it always see
          what you originally reported.
        </p>
      </div>

      {(creating || editing) && (
        <div
          className="fixed inset-0 z-[950] flex items-end justify-center bg-ink/40 sm:items-center sm:p-4"
          onClick={() => {
            setCreating(false);
            setEditing(null);
          }}
          role="presentation"
        >
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-card border border-line bg-paper shadow-pop sm:rounded-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="sticky top-0 border-b border-line bg-paper px-5 py-4">
              <h2 className="font-semibold text-ink">
                {editing ? `Edit ${editing.complaintId}` : "Raise a complaint"}
              </h2>
            </div>
            <div className="px-5 py-5">
              <ComplaintForm
                complaint={editing}
                onCancel={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                onDone={() => {
                  setCreating(false);
                  setEditing(null);
                  load();
                }}
              />
            </div>
          </div>
        </div>
      )}

      <MediaViewer item={preview} onClose={() => setPreview(null)} />
    </main>
  );
}

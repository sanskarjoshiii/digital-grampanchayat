"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";

const emptyDraft = { title: "", description: "", media: [] };
const MAX_ATTACHMENTS = 10;

const describe = (error) => `${error?.name || ""} ${error?.message || ""} ${error?.code || ""}`.toLowerCase();

/** A stale or missing upload context, which re-initialising can fix. */
const isContextProblem = (error) => {
  const reason = describe(error);
  return (
    reason.includes("ctx") ||
    reason.includes("unauthor") ||
    reason.includes("not allowed") ||
    reason.includes("401") ||
    reason.includes("403")
  );
};

/**
 * Uploads are gated on the session cookie and capped by size and type, so a
 * failure is usually not a network problem. Say which one it actually was.
 */
const uploadFailureReason = (error) => {
  const reason = describe(error);
  if (isContextProblem(error))
    return "Your session has ended. Please log out and log in again, then retry.";
  if (reason.includes("size") || reason.includes("large"))
    return "That file is too large. Photos and videos must be under 50 MB.";
  if (reason.includes("type") || reason.includes("mime") || reason.includes("accept"))
    return "Only photos and videos can be attached.";
  return "Could not upload that file. Check your connection and try again.";
};

/**
 * The complaint composer, shared by the floating raiser and the edit dialog on
 * the tracking page. `complaint` set means edit, unset means raise a new one.
 */
export default function ComplaintForm({ complaint, onDone, onCancel }) {
  const { edgestore, reset: resetEdgeStore } = useEdgeStore();
  const [draft, setDraft] = useState(
    complaint
      ? { title: complaint.title, description: complaint.description, media: complaint.media || [] }
      : emptyDraft
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const cameraInput = useRef(null);
  const galleryInput = useRef(null);

  const addFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (draft.media.length + files.length > MAX_ATTACHMENTS)
      return toast.error(`Up to ${MAX_ATTACHMENTS} attachments per complaint`);

    const send = () =>
      Promise.all(
        files.map(async (file) => {
          const result = await edgestore.publicFiles.upload({ file });
          return {
            url: result.url,
            title: file.name,
            type: file.type.startsWith("video") ? "video" : "image",
          };
        })
      );

    setUploading(true);
    try {
      let uploaded;
      try {
        uploaded = await send();
      } catch (error) {
        // The cached upload context can be stale — signed out when the page
        // loaded, or expired. Resolve it again and retry once before giving up,
        // so a valid session never sees a spurious failure.
        if (!isContextProblem(error)) throw error;
        await resetEdgeStore();
        uploaded = await send();
      }
      setDraft((current) => ({ ...current, media: [...current.media, ...uploaded] }));
    } catch (error) {
      toast.error(uploadFailureReason(error));
    }
    setUploading(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return toast.error("Give the complaint a short title");
    if (!draft.description.trim()) return toast.error("Describe the problem");

    setSaving(true);
    const response = await fetch(
      complaint ? `/api/complaints/${complaint._id}` : "/api/complaints",
      {
        method: complaint ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      }
    );
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) return toast.error(data.message || "Could not save the complaint");
    toast.success(data.message || "Complaint saved");
    setDraft(emptyDraft);
    onDone?.(data.complaint);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="ds-label" htmlFor="complaint-title">
          What is the problem?
        </label>
        <input
          id="complaint-title"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          className="ds-input"
          placeholder="e.g. Street light not working near the school"
          maxLength={120}
          required
        />
      </div>

      <div>
        <label className="ds-label" htmlFor="complaint-description">
          Describe it in detail
        </label>
        <textarea
          id="complaint-description"
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          className="ds-input min-h-28 resize-y"
          placeholder="Where exactly is it, since when, and what should be done?"
          maxLength={3000}
          required
        />
        <p className="mt-1 text-right text-xs text-muted">{draft.description.length}/3000</p>
      </div>

      <div>
        <span className="ds-label">Photos or videos (optional)</span>
        <div className="flex flex-wrap gap-2">
          {/* capture="environment" opens the rear camera straight away on a
              phone; on a desktop browser it falls back to the file picker. */}
          <button
            type="button"
            onClick={() => cameraInput.current?.click()}
            disabled={uploading}
            className="btn-ghost px-4 py-2 text-sm"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/camera--v1.png"
              width={16}
              height={16}
              alt=""
            />
            Take a photo
          </button>
          <button
            type="button"
            onClick={() => galleryInput.current?.click()}
            disabled={uploading}
            className="btn-ghost px-4 py-2 text-sm"
          >
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/image--v1.png"
              width={16}
              height={16}
              alt=""
            />
            Choose from phone
          </button>
          {uploading && <span className="self-center text-sm text-muted">Uploading…</span>}
        </div>
        <input
          ref={cameraInput}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={addFiles}
        />
        <input
          ref={galleryInput}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={addFiles}
        />

        {draft.media.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {draft.media.map((item, index) => (
              <div key={`${item.url}-${index}`} className="relative overflow-hidden rounded-lg bg-mist">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, media: draft.media.filter((_, i) => i !== index) })
                  }
                  className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-sm text-white"
                  aria-label={`Remove attachment ${index + 1}`}
                >
                  ×
                </button>
                {item.type === "video" ? (
                  <video src={item.url} className="h-20 w-full object-cover" />
                ) : (
                  <img src={item.url} alt="" className="h-20 w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-1">
        <button className="btn-primary text-sm" disabled={saving || uploading}>
          {saving ? "Saving…" : complaint ? "Save changes" : "Submit complaint"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

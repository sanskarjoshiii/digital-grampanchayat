"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { useGlobalContext } from "../context/context";
import { toInputDate, money, statusLabel } from "../utils/format";
import { CURRENT_SARPANCH } from "../config/panchayat";

const emptyForm = {
  workId: "",
  schemeName: "",
  address: "",
  description: "",
  workName: "",
  sanctionedAmount: "",
  receivedAmount: "",
  startDate: "",
  expectedCompletionDate: "",
  status: "pending",
  amountUtilized: "",
  progress: "",
  contractor: "",
  engineer: "",
  sarpanch: CURRENT_SARPANCH,
  finalCompletionDate: "",
  documents: [],
  resultMedia: [],
};

const WorkForm = ({ mode = "add", initialData = null }) => {
  const router = useRouter();
  const { setLoader } = useGlobalContext();
  const { edgestore } = useEdgeStore();

  const [form, setForm] = useState(() => {
    if (!initialData) return emptyForm;
    return {
      ...emptyForm,
      ...initialData,
      sanctionedAmount: initialData.sanctionedAmount ?? "",
      receivedAmount: initialData.receivedAmount ?? "",
      amountUtilized: initialData.amountUtilized ?? "",
      progress: initialData.progress ?? "",
      startDate: toInputDate(initialData.startDate),
      expectedCompletionDate: toInputDate(initialData.expectedCompletionDate),
      finalCompletionDate: toInputDate(initialData.finalCompletionDate),
      documents: initialData.documents || [],
      resultMedia: initialData.resultMedia || [],
    };
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingResult, setUploadingResult] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const change = (e) => set(e.target.id, e.target.value);

  const started = form.status === "ongoing" || form.status === "completed";
  const remaining =
    Number(form.receivedAmount || 0) -
    (started ? Number(form.amountUtilized || 0) : 0);

  const uploadDoc = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await edgestore.publicFiles.upload({ file });
      set("documents", [...form.documents, { title: file.name, url: res.url }]);
      toast.success("Document uploaded");
    } catch (err) {
      toast.error("Upload failed");
    }
    setUploading(false);
    e.target.value = "";
  };

  const removeDoc = (i) =>
    set(
      "documents",
      form.documents.filter((_, idx) => idx !== i)
    );

  const uploadResult = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResult(true);
    try {
      const res = await edgestore.publicFiles.upload({ file });
      const type = file.type?.startsWith("video") ? "video" : "image";
      set("resultMedia", [
        ...form.resultMedia,
        { url: res.url, type, title: file.name },
      ]);
      toast.success("Result media uploaded");
    } catch (err) {
      toast.error("Upload failed");
    }
    setUploadingResult(false);
    e.target.value = "";
  };

  const removeResult = (i) =>
    set(
      "resultMedia",
      form.resultMedia.filter((_, idx) => idx !== i)
    );

  const submit = async (e) => {
    e.preventDefault();
    if (!form.workId.trim()) return toast.error("Work ID is required");
    if (!form.schemeName.trim()) return toast.error("Scheme Name is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (form.status === "completed" && !form.finalCompletionDate)
      return toast.error("Final completion date is required for completed work");

    setLoader(true);
    const url = mode === "edit" ? `/api/works/${initialData._id}` : "/api/works";
    const method = mode === "edit" ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: localStorage.getItem("email") || "",
        }),
      });
      const res = await response.json();
      if (response.status === 200) {
        toast.success(res.message || "Saved");
        router.push("/panchayat_funds");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Check your connection");
    }
    setLoader(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      {/* Identification */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Identification
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="workId" className="ds-label">
              Work ID <span className="text-red-500">*</span>
            </label>
            <input
              id="workId"
              value={form.workId}
              onChange={change}
              className="ds-input"
              placeholder="e.g. CHD-2026-014"
              required
            />
          </div>
          <div>
            <label htmlFor="schemeName" className="ds-label">
              Scheme Name <span className="text-red-500">*</span>
            </label>
            <input
              id="schemeName"
              value={form.schemeName}
              onChange={change}
              className="ds-input"
              placeholder="e.g. MGNREGA"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="workName" className="ds-label">
              Work Name
            </label>
            <input
              id="workName"
              value={form.workName}
              onChange={change}
              className="ds-input"
              placeholder="e.g. Construction of village drainage line"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="ds-label">
              Address / Location <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              value={form.address}
              onChange={change}
              className="ds-input"
              placeholder="e.g. Ward 3, near Zilla Parishad School, Chandgaon"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="ds-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={change}
              rows={4}
              className="ds-input resize-y"
              placeholder="Describe the scheme / work — what is being done and its purpose for the village."
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Status & progress */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Status &amp; Progress
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="ds-label">
              Current Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={change}
              className="ds-input"
            >
              <option value="pending">{statusLabel("pending")}</option>
              <option value="ongoing">{statusLabel("ongoing")}</option>
              <option value="completed">{statusLabel("completed")}</option>
            </select>
          </div>
          {form.status === "ongoing" && (
            <div>
              <label htmlFor="progress" className="ds-label">
                Progress (%)
              </label>
              <input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={change}
                className="ds-input"
                placeholder="0 – 100"
              />
            </div>
          )}
          {form.status === "pending" && (
            <p className="text-xs text-muted self-end pb-3">
              Progress is 0% while pending.
            </p>
          )}
          {form.status === "completed" && (
            <p className="text-xs text-muted self-end pb-3">
              Progress is set to 100% when completed.
            </p>
          )}
        </div>
      </fieldset>

      {/* Financials */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Financials
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sanctionedAmount" className="ds-label">
              Sanctioned Amount (₹)
            </label>
            <input
              id="sanctionedAmount"
              type="number"
              min="0"
              value={form.sanctionedAmount}
              onChange={change}
              className="ds-input"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="receivedAmount" className="ds-label">
              Received Amount (₹)
            </label>
            <input
              id="receivedAmount"
              type="number"
              min="0"
              value={form.receivedAmount}
              onChange={change}
              className="ds-input"
              placeholder="0"
            />
          </div>
          {started && (
            <>
              <div>
                <label htmlFor="amountUtilized" className="ds-label">
                  Amount Utilized (₹)
                </label>
                <input
                  id="amountUtilized"
                  type="number"
                  min="0"
                  value={form.amountUtilized}
                  onChange={change}
                  className="ds-input"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="ds-label">Remaining Balance (₹)</label>
                <div className="ds-input bg-mist flex items-center text-muted">
                  {money(remaining)}
                  <span className="ml-2 text-xs">(auto)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </fieldset>

      {/* Timeline */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Timeline
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="ds-label">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={change}
              className="ds-input"
            />
          </div>
          <div>
            <label htmlFor="expectedCompletionDate" className="ds-label">
              Expected Completion Date
            </label>
            <input
              id="expectedCompletionDate"
              type="date"
              value={form.expectedCompletionDate}
              onChange={change}
              className="ds-input"
            />
          </div>
          {form.status === "completed" && (
            <div>
              <label htmlFor="finalCompletionDate" className="ds-label">
                Final Completion Date <span className="text-red-500">*</span>
              </label>
              <input
                id="finalCompletionDate"
                type="date"
                value={form.finalCompletionDate}
                onChange={change}
                className="ds-input"
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* People (optional) */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Responsible parties (optional)
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contractor" className="ds-label">
              Contractor / Agency
            </label>
            <input
              id="contractor"
              value={form.contractor}
              onChange={change}
              className="ds-input"
              placeholder="Name of contractor or agency"
            />
          </div>
          <div>
            <label htmlFor="engineer" className="ds-label">
              Engineer / Officer Responsible
            </label>
            <input
              id="engineer"
              value={form.engineer}
              onChange={change}
              className="ds-input"
              placeholder="Name of engineer or officer"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sarpanch" className="ds-label">
              Sarpanch during this work
            </label>
            <input
              id="sarpanch"
              value={form.sarpanch}
              onChange={change}
              className="ds-input"
              placeholder="Name of the Sarpanch when this work was carried out"
            />
            <p className="text-xs text-muted mt-1">
              Pre-filled with the current Sarpanch — change it for works done under
              a previous Sarpanch.
            </p>
          </div>
        </div>
      </fieldset>

      {/* Documents */}
      <fieldset>
        <legend className="text-xs uppercase tracking-wide text-muted mb-3">
          Supporting Documents
        </legend>
        <label
          htmlFor="workdoc"
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-card text-muted h-24 bg-cream hover:bg-mist transition-colors cursor-pointer"
        >
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios/50/8a8a82/upload--v1.png"
            alt=""
          />
          <span className="text-sm">
            {uploading ? "Uploading…" : "Click to upload a document"}
          </span>
        </label>
        <input
          id="workdoc"
          type="file"
          className="hidden"
          onChange={uploadDoc}
          disabled={uploading}
        />
        {form.documents.length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {form.documents.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between ds-card-muted px-3 py-2"
              >
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink truncate hover:underline"
                >
                  {d.title}
                </a>
                <button
                  type="button"
                  onClick={() => removeDoc(i)}
                  className="text-xs text-red-600 hover:underline shrink-0 ml-3"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Result media — only once the work is completed */}
      {form.status === "completed" && (
        <fieldset>
          <legend className="text-xs uppercase tracking-wide text-muted mb-3">
            Result (photos / videos of completed work)
          </legend>
          <label
            htmlFor="resultmedia"
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-card text-muted h-24 bg-cream hover:bg-mist transition-colors cursor-pointer"
          >
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios/50/8a8a82/image--v1.png"
              alt=""
            />
            <span className="text-sm">
              {uploadingResult ? "Uploading…" : "Upload a photo or video"}
            </span>
          </label>
          <input
            id="resultmedia"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={uploadResult}
            disabled={uploadingResult}
          />
          {form.resultMedia.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {form.resultMedia.map((m, i) => (
                <div
                  key={i}
                  className="relative rounded-card overflow-hidden border border-line bg-mist"
                >
                  {m.type === "video" ? (
                    <video src={m.url} className="w-full h-28 object-cover" />
                  ) : (
                    <img
                      src={m.url}
                      alt={m.title || "result"}
                      className="w-full h-28 object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeResult(i)}
                    className="absolute top-1 right-1 bg-ink text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>
      )}

      <div>
        <button type="submit" className="btn-primary w-full sm:w-auto px-8">
          {mode === "edit" ? "Update work" : "Add work"}
        </button>
      </div>
    </form>
  );
};

export default WorkForm;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import Dropdown from "./Dropdown";
import { FUND_SOURCES, financialYearOptions, financialYearOf } from "../utils/funds";
import { money } from "../utils/format";

const blank = {
  financialYear: financialYearOf(),
  source: "goi",
  scheme: "",
  component: "Center Schemes/ Grants",
  expectedFund: "",
  actualFundReceived: "",
  previousYearBalance: "",
  revertedFund: "",
  actualExpenditure: "",
  description: "",
  progress: 0,
  documents: [],
};

/**
 * The only fields here are the ones the Government's report publishes, plus
 * three the Panchayat adds for its own residents: a description, a progress
 * figure and supporting documents.
 */
export default function FundForm({ fund, id }) {
  const router = useRouter();
  const { edgestore, reset: resetEdgeStore } = useEdgeStore();
  const [form, setForm] = useState(fund ? { ...blank, ...fund } : blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  // Money fields accept digits only; a stray letter would silently become 0.
  const setAmount = (key, value) => set(key, value.replace(/[^\d]/g, ""));

  const amounts = [
    { key: "expectedFund", label: "Expected Fund" },
    { key: "actualFundReceived", label: "Actual Fund Received" },
    { key: "previousYearBalance", label: "Previous Year Balance" },
    { key: "revertedFund", label: "Reverted / Surrendered Fund" },
    { key: "actualExpenditure", label: "Actual Expenditure" },
  ];

  const addDocuments = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (form.documents.length + files.length > 10)
      return toast.error("Up to 10 supporting documents");

    setUploading(true);
    const send = () =>
      Promise.all(
        files.map(async (file) => {
          const result = await edgestore.publicFiles.upload({ file });
          return { title: file.name, url: result.url };
        })
      );
    try {
      let uploaded;
      try {
        uploaded = await send();
      } catch {
        // A context cached while signed out rejects the upload; retry once.
        await resetEdgeStore().catch(() => {});
        uploaded = await send();
      }
      set("documents", [...form.documents, ...uploaded]);
    } catch {
      toast.error("Could not upload that file. Check your connection and try again.");
    }
    setUploading(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.scheme.trim()) return toast.error("Enter the scheme name");

    setSaving(true);
    const response = await fetch(id ? `/api/funds/${id}` : "/api/funds", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) return toast.error(data.message || "Could not save the record");
    toast.success(data.message || "Saved");
    router.push("/panchayat_funds");
  };

  return (
    <form onSubmit={submit} className="ds-card w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-5">
      <h1 className="text-xl font-semibold text-ink">
        {id ? "Edit fund record" : "Add fund record"}
      </h1>
      <p className="-mt-3 text-sm text-muted">
        These are the same fields the Panchayat reports to the Government.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="ds-label">Financial year</span>
          <Dropdown
            value={form.financialYear}
            options={financialYearOptions(10).map((y) => ({ value: y, label: y }))}
            onChange={(value) => set("financialYear", value)}
            className="w-full"
            ariaLabel="Financial year"
          />
        </div>
        <div>
          <span className="ds-label">Funding source</span>
          <Dropdown
            value={form.source}
            options={FUND_SOURCES.map((s) => ({ value: s.value, label: s.label }))}
            onChange={(value) => set("source", value)}
            className="w-full"
            ariaLabel="Funding source"
          />
        </div>
      </div>

      <div>
        <label className="ds-label" htmlFor="scheme">
          Scheme
        </label>
        <input
          id="scheme"
          value={form.scheme}
          onChange={(event) => set("scheme", event.target.value)}
          className="ds-input"
          placeholder="e.g. XV Finance Commission [1769]"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label className="ds-label" htmlFor="component">
          Component
        </label>
        <input
          id="component"
          value={form.component}
          onChange={(event) => set("component", event.target.value)}
          className="ds-input"
          placeholder="e.g. Center Schemes/ Grants"
          maxLength={200}
        />
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="ds-label mb-1">Amounts (₹)</legend>
        {amounts.map((field) => (
          <div key={field.key}>
            <label className="ds-label" htmlFor={field.key}>
              {field.label}
            </label>
            <input
              id={field.key}
              value={form[field.key]}
              onChange={(event) => setAmount(field.key, event.target.value)}
              className="ds-input tabular-nums"
              inputMode="numeric"
              placeholder="0"
            />
            {form[field.key] !== "" && (
              <p className="mt-1 text-xs text-muted">{money(form[field.key])}</p>
            )}
          </div>
        ))}
      </fieldset>

      <div className="border-t border-line pt-5">
        <p className="text-sm font-medium text-ink">Extra detail for villagers</p>
        <p className="mt-0.5 text-xs text-muted">
          Optional. Not part of the Government report, but shown on this site.
        </p>

        <div className="mt-4">
          <label className="ds-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            className="ds-input min-h-24 resize-y"
            placeholder="What was this money for, and what has been done with it?"
            maxLength={3000}
          />
        </div>

        <div className="mt-4">
          <label className="ds-label" htmlFor="progress">
            Progress — {form.progress}%
          </label>
          <input
            id="progress"
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.progress}
            onChange={(event) => set("progress", Number(event.target.value))}
            className="w-full accent-ink"
          />
        </div>

        <div className="mt-4">
          <span className="ds-label">Supporting documents</span>
          <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-cream px-4 text-center text-sm text-muted transition-colors hover:bg-mist">
            <span>{uploading ? "Uploading…" : "Add a document or photo"}</span>
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              className="hidden"
              onChange={addDocuments}
              disabled={uploading}
            />
          </label>

          {form.documents.length > 0 && (
            <ul className="mt-3 space-y-2">
              {form.documents.map((doc, index) => (
                <li
                  key={`${doc.url}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-line px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">{doc.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "documents",
                        form.documents.filter((_, i) => i !== index)
                      )
                    }
                    className="shrink-0 text-xs font-medium text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-3 border-t border-line pt-5">
        <button className="btn-primary text-sm" disabled={saving || uploading}>
          {saving ? "Saving…" : id ? "Save changes" : "Add record"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/panchayat_funds")}
          className="btn-ghost px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

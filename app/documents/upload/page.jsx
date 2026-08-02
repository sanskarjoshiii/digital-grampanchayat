"use client";
import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [file, setFile] = React.useState(null);
  const [description, setDescription] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const { edgestore, reset: resetEdgeStore } = useEdgeStore();
  const [progress, setProgress] = React.useState(0);

  const upload = async () => {
    if (!file) return toast.error("Select file first");
    setBusy(true);
    try {
      let res;
      try {
        res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => setProgress(progress),
        });
      } catch (error) {
        // A context cached while signed out rejects the upload; resolve it
        // again and retry once before giving up.
        await resetEdgeStore().catch(() => {});
        res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => setProgress(progress),
        });
      }

      const data = await fetch("/api/admin/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          description,
          url: res.url,
          createdAt: res.uploadedAt,
        }),
      });
      if (data.status == 200) {
        toast.success("File Uploaded Successfully");
        router.push("/documents");
      } else {
        const payload = await data.json().catch(() => ({}));
        toast.error(payload.message || "Could not save the document");
      }
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    }
    setBusy(false);
    setProgress(0);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink text-center mb-6">
          Upload your document
        </h1>
        <label
          className="w-full flex flex-col gap-2 items-center justify-center border-2 border-dashed border-line rounded-card text-muted h-[26vh] bg-cream hover:bg-mist transition-colors cursor-pointer"
          htmlFor="file"
        >
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/ios/50/8a8a82/upload--v1.png"
            alt=""
          />
          <span className="text-sm">
            {file ? file.name : "Click here to select a file"}
          </span>
        </label>
        <input
          name="file"
          id="file"
          className="hidden"
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />

        <div className="mt-5">
          <label className="ds-label" htmlFor="description">
            Description <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="ds-input min-h-24 resize-y"
            placeholder="What is this document about, and who does it concern? e.g. Gram Sabha meeting minutes for June 2026 — includes the water tank resolution."
            maxLength={1000}
          />
          <p className="mt-1 flex items-center justify-between text-xs text-muted">
            <span>Shown to villagers under the document name.</span>
            <span>{description.length}/1000</span>
          </p>
        </div>

        <div className="w-full py-2 flex flex-row items-center justify-center my-4">
          <button
            className="w-full h-12 rounded-lg bg-ink mx-auto relative text-white overflow-hidden font-medium disabled:opacity-50"
            disabled={busy}
            onClick={upload}
          >
            <span className="relative text-base z-50 text-white">
              {busy ? "Uploading…" : "Upload"}
            </span>
            <span
              className="bg-white/25 h-full z-20 absolute top-0 left-0 transition-all duration-150 ease-in-out"
              style={{ width: `${progress}%` }}
            ></span>
          </button>
        </div>
      </div>
    </div>
  );
}

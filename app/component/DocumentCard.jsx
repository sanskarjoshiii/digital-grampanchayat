import React from "react";
import { fmtDate } from "../utils/format";
import { pick } from "../utils/language";

const DocumentCard = ({ data, isAdmin, onDelete, language = "english" }) => {
  return (
    <div className="ds-card w-[88%] max-w-2xl mx-auto my-3 py-4 px-4 flex flex-row items-start justify-between gap-4">
      <div className="flex flex-row items-start gap-3 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-mist border border-line flex items-center justify-center shrink-0">
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios/50/1f1f1f/pdf.png"
            alt="pdf"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-ink break-words min-w-0">{data.title}</p>
          {/* Blank on documents uploaded before descriptions existed. */}
          {data.description && (
            <p className="mt-1 text-sm leading-6 text-muted break-words whitespace-pre-wrap">
              {data.description}
            </p>
          )}
          {data.createdAt && (
            <p className="mt-1 text-xs text-muted">{fmtDate(data.createdAt)}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <a
          href={data.url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary text-sm"
        >
          {pick(language, { en: "View", mr: "पाहा", hi: "देखें" })}
        </a>
        {isAdmin && (
          <button
            onClick={() => onDelete(data)}
            className="text-sm font-medium text-red-700 hover:underline"
          >
            {pick(language, { en: "Delete", mr: "काढा", hi: "हटाएँ" })}
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;

import React from "react";

const DocumentCard = ({ data }) => {
  return (
    <div className="ds-card w-[88%] max-w-2xl mx-auto my-3 py-4 px-4 flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-mist border border-line flex items-center justify-center shrink-0">
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios/50/1f1f1f/pdf.png"
            alt="pdf"
          />
        </div>
        <p className="text-sm text-ink break-words min-w-0">{data.title}</p>
      </div>
      <a
        href={data.url}
        target="_blank"
        rel="noreferrer"
        className="btn-primary text-sm shrink-0"
      >
        View
      </a>
    </div>
  );
};

export default DocumentCard;

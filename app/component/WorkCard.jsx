"use client";
import Link from "next/link";
import React from "react";
import { useGlobalContext } from "../context/context";
import {
  fmtDate,
  yearOf,
  statusLabel,
  statusClasses,
} from "../utils/format";

const WorkCard = ({ data }) => {
  const { language } = useGlobalContext();
  const en = language == "english";
  const refDate = data.startDate || data.createdAt;

  return (
    <div className="ds-card w-[92%] max-w-2xl mx-auto my-4 p-5">
      {/* Top row: full date (left) + year (right) */}
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <img
            width="14"
            height="14"
            src="https://img.icons8.com/material-rounded/24/8a8a82/calendar--v1.png"
            alt=""
          />
          {fmtDate(refDate)}
        </span>
        {yearOf(refDate) && (
          <span className="ds-pill">{yearOf(refDate)}</span>
        )}
      </div>

      {/* Title + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-ink leading-tight truncate">
            {data.workName || data.schemeName}
          </h3>
          <p className="text-sm text-muted mt-0.5 truncate">
            {data.schemeName} · #{data.workId}
          </p>
          {data.address && (
            <p className="flex items-center gap-1 text-xs text-muted mt-1 truncate">
              <img
                width="12"
                height="12"
                src="https://img.icons8.com/ios/50/8a8a82/marker.png"
                alt=""
              />
              {data.address}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 text-xs font-medium border rounded-full px-2.5 py-1 ${statusClasses(
            data.status
          )}`}
        >
          {statusLabel(data.status, en)}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted">
            {en ? "Progress" : "प्रगति"}
          </span>
          <span className="text-xs font-semibold text-ink">
            {data.progress || 0}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-mist overflow-hidden">
          <div
            className="h-full bg-ink rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, data.progress || 0)}%` }}
          />
        </div>
      </div>

      {/* Result media (completed works) */}
      {data.status === "completed" &&
        data.resultMedia &&
        data.resultMedia.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted mb-2">
              {en ? "Result" : "परिणाम"}
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {data.resultMedia.slice(0, 4).map((m, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-24 h-20 rounded-lg overflow-hidden border border-line bg-mist"
                >
                  {m.type === "video" ? (
                    <>
                      <video src={m.url} className="w-full h-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/25 text-white text-lg">
                        ▶
                      </span>
                    </>
                  ) : (
                    <img
                      src={m.url}
                      alt="result"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {data.resultMedia.length > 4 && (
                <div className="shrink-0 w-24 h-20 rounded-lg border border-line bg-mist flex items-center justify-center text-sm text-muted">
                  +{data.resultMedia.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="ds-card-muted p-3">
          <p className="text-xs text-muted">{en ? "Start date" : "प्रारंभ तिथि"}</p>
          <p className="text-sm font-medium text-ink mt-0.5">
            {fmtDate(data.startDate)}
          </p>
        </div>
        <div className="ds-card-muted p-3">
          <p className="text-xs text-muted">
            {en ? "Est. completion" : "अनुमानित पूर्णता"}
          </p>
          <p className="text-sm font-medium text-ink mt-0.5">
            {fmtDate(data.expectedCompletionDate)}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-end mt-4">
        <Link
          href={`/panchayat_funds/work/${data._id}`}
          className="btn-primary text-sm"
        >
          {en ? "More details" : "अधिक जानकारी"}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkCard;

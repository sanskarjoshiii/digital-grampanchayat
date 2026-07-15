"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGlobalContext } from "@/app/context/context";
import {
  fmtDate,
  money,
  statusLabel,
  statusClasses,
} from "@/app/utils/format";

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-line last:border-0">
    <span className="text-sm text-muted">{label}</span>
    <span className="text-sm font-medium text-ink text-right">{value}</span>
  </div>
);

const Page = ({ params }) => {
  const router = useRouter();
  const { setLoader, userData, language } = useGlobalContext();
  const en = language == "english";
  const [work, setWork] = useState(null);

  const fetchWork = async () => {
    setLoader(true);
    const res = await fetch(`/api/works/${params.id}`);
    if (res.status === 200) setWork(await res.json());
    else router.push("/panchayat_funds");
    setLoader(false);
  };

  useEffect(() => {
    fetchWork();
  }, []);

  const handleDelete = async () => {
    const res = await fetch(`/api/works/${params.id}`, { method: "DELETE" });
    if (res.status === 200) {
      toast.success("Work deleted");
      router.push("/panchayat_funds");
    } else {
      toast.error("Could not delete");
    }
  };

  if (!work) return <div className="min-h-[91vh] bg-paper" />;

  const started = work.status === "ongoing" || work.status === "completed";

  return (
    <div className="w-full min-h-[91vh] bg-paper py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/panchayat_funds"
          className="text-sm text-muted hover:text-ink"
        >
          ← {en ? "Back to works" : "कामांकडे परत"}
        </Link>

        {/* Header */}
        <div className="ds-card p-6 mt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="ds-pill">#{work.workId}</span>
              <h1 className="text-2xl font-semibold text-ink mt-2">
                {work.workName || work.schemeName}
              </h1>
              <p className="text-sm text-muted mt-1">{work.schemeName}</p>
              {work.address && (
                <p className="flex items-center gap-1.5 text-sm text-muted mt-2">
                  <img
                    width="14"
                    height="14"
                    src="https://img.icons8.com/ios/50/8a8a82/marker.png"
                    alt=""
                  />
                  {work.address}
                </p>
              )}
            </div>
            <span
              className={`shrink-0 text-xs font-medium border rounded-full px-3 py-1 ${statusClasses(
                work.status
              )}`}
            >
              {statusLabel(work.status, en)}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted">
                {en ? "Progress" : "प्रगति"}
              </span>
              <span className="text-xs font-semibold text-ink">
                {work.progress || 0}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-mist overflow-hidden">
              <div
                className="h-full bg-ink rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, work.progress || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {work.description && (
          <div className="ds-card p-6 mt-4">
            <h2 className="text-sm font-semibold text-ink mb-2">
              {en ? "About this work" : "इस काम के बारे में"}
            </h2>
            <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">
              {work.description}
            </p>
          </div>
        )}

        {/* Financials */}
        <div className="ds-card p-6 mt-4">
          <h2 className="text-sm font-semibold text-ink mb-2">
            {en ? "Financials" : "वित्तीय"}
          </h2>
          <Row
            label={en ? "Sanctioned Amount" : "मंज़ूर राशि"}
            value={money(work.sanctionedAmount)}
          />
          <Row
            label={en ? "Received Amount" : "प्राप्त राशि"}
            value={money(work.receivedAmount)}
          />
          {started && (
            <>
              <Row
                label={en ? "Amount Utilized" : "उपयोग की गई राशि"}
                value={money(work.amountUtilized)}
              />
              <Row
                label={en ? "Remaining Balance" : "शेष राशि"}
                value={money(work.remainingBalance)}
              />
            </>
          )}
        </div>

        {/* Timeline */}
        <div className="ds-card p-6 mt-4">
          <h2 className="text-sm font-semibold text-ink mb-2">
            {en ? "Timeline" : "समयरेखा"}
          </h2>
          <Row
            label={en ? "Start Date" : "प्रारंभ तिथि"}
            value={fmtDate(work.startDate)}
          />
          <Row
            label={en ? "Expected Completion" : "अनुमानित पूर्णता"}
            value={fmtDate(work.expectedCompletionDate)}
          />
          {work.status === "completed" && (
            <Row
              label={en ? "Final Completion" : "अंतिम पूर्णता"}
              value={fmtDate(work.finalCompletionDate)}
            />
          )}
        </div>

        {/* Responsible parties */}
        {(work.contractor || work.engineer || work.sarpanch) && (
          <div className="ds-card p-6 mt-4">
            <h2 className="text-sm font-semibold text-ink mb-2">
              {en ? "Responsible parties" : "जिम्मेदार पक्ष"}
            </h2>
            {work.sarpanch && (
              <Row
                label={en ? "Sarpanch (during tenure)" : "सरपंच (कार्यकाल के दौरान)"}
                value={work.sarpanch}
              />
            )}
            {work.contractor && (
              <Row
                label={en ? "Contractor / Agency" : "ठेकेदार / एजेंसी"}
                value={work.contractor}
              />
            )}
            {work.engineer && (
              <Row
                label={en ? "Engineer / Officer" : "अभियंता / अधिकारी"}
                value={work.engineer}
              />
            )}
            {work.sarpanch && (
              <p className="text-xs text-muted mt-3 italic">
                {en
                  ? `This work was carried out during the tenure of Sarpanch ${work.sarpanch}.`
                  : `यह काम सरपंच ${work.sarpanch} के कार्यकाल के दौरान किया गया।`}
              </p>
            )}
          </div>
        )}

        {/* Documents */}
        {work.documents && work.documents.length > 0 && (
          <div className="ds-card p-6 mt-4">
            <h2 className="text-sm font-semibold text-ink mb-3">
              {en ? "Supporting Documents" : "सहायक दस्तऐवज"}
            </h2>
            <div className="flex flex-col gap-2">
              {work.documents.map((d, i) => (
                <a
                  key={i}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 ds-card-muted px-3 py-2.5 hover:bg-mist"
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/ios/50/1f1f1f/pdf.png"
                    alt=""
                  />
                  <span className="text-sm text-ink truncate">{d.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Result media (completed works) */}
        {work.resultMedia && work.resultMedia.length > 0 && (
          <div className="ds-card p-6 mt-4">
            <h2 className="text-sm font-semibold text-ink mb-3">
              {en ? "Result of completed work" : "पूर्ण काम का परिणाम"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {work.resultMedia.map((m, i) =>
                m.type === "video" ? (
                  <video
                    key={i}
                    src={m.url}
                    controls
                    className="w-full rounded-card border border-line bg-mist"
                  />
                ) : (
                  <a
                    key={i}
                    href={m.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={m.url}
                      alt={m.title || "result"}
                      className="w-full h-48 object-cover rounded-card border border-line"
                    />
                  </a>
                )
              )}
            </div>
          </div>
        )}

        {/* Admin actions */}
        {userData.userType === "admin" && (
          <div className="flex items-center gap-3 mt-6">
            <Link
              href={`/admin/editwork/${work._id}`}
              className="btn-ghost text-sm flex-1"
            >
              {en ? "Edit work" : "संपादित करें"}
            </Link>
            <button
              onClick={handleDelete}
              className="btn-primary text-sm flex-1"
            >
              {en ? "Delete work" : "हटाएं"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

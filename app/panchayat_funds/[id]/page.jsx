"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGlobalContext } from "../../context/context";
import { money } from "../../utils/format";
import { sourceMeta } from "../../utils/funds";

const Figure = ({ label, value, tone = "text-ink" }) => (
  <div className="ds-card p-4">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p className={`mt-1 text-lg font-semibold tabular-nums ${tone}`}>{money(value)}</p>
  </div>
);

export default function FundDetail({ params }) {
  const { setOpenSidebar, language, userData } = useGlobalContext();
  const en = language == "english";
  const isAdmin = userData?.userType === "admin";
  const [fund, setFund] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/funds/${params.id}`);
      if (!response.ok) return setState("missing");
      setFund(await response.json());
      setState("ready");
    })();
  }, [params.id]);

  if (state === "loading")
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-paper px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-mist" />
          <div className="h-64 animate-pulse rounded-card bg-mist" />
        </div>
      </div>
    );

  if (state === "missing")
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-paper px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-xl font-semibold text-ink">
            {en ? "Fund record not found" : "निधि नोंद नहीं मिली"}
          </h1>
          <Link href="/panchayat_funds" className="btn-primary mt-6 text-sm">
            {en ? "Back to funds" : "निधि पर वापस"}
          </Link>
        </div>
      </div>
    );

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-paper px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-3xl">
        <Link
          href="/panchayat_funds"
          className="text-sm font-medium text-muted hover:text-ink hover:underline"
        >
          ← {en ? "All fund records" : "सभी निधि नोंदी"}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="ds-pill">{fund.financialYear}</span>
          <span className="ds-pill">
            {en ? sourceMeta(fund.source).label : sourceMeta(fund.source).hi}
          </span>
          {isAdmin && (
            <Link
              href={`/admin/editfunds/${fund._id}`}
              className="ml-auto text-sm font-medium text-ink hover:underline"
            >
              {en ? "Edit this record" : "यह नोंद संपादित करें"}
            </Link>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-semibold leading-snug text-ink">{fund.scheme}</h1>
        {fund.component && (
          <p className="mt-1 text-sm text-muted">
            {en ? "Component" : "घटक"}:{" "}
            <span className="font-medium text-ink">{fund.component}</span>
          </p>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Figure label={en ? "Expected Fund" : "अपेक्षित निधि"} value={fund.expectedFund} />
          <Figure
            label={en ? "Actual Fund Received" : "प्रत्यक्ष प्राप्त निधि"}
            value={fund.actualFundReceived}
            tone="text-emerald-700"
          />
          <Figure
            label={en ? "Previous Year Balance" : "पिछले वर्ष का शेष"}
            value={fund.previousYearBalance}
            tone="text-emerald-700"
          />
          <Figure
            label={en ? "Reverted / Surrendered Fund" : "वापस / समर्पित निधि"}
            value={fund.revertedFund}
            tone="text-emerald-700"
          />
          <Figure
            label={en ? "Actual Expenditure" : "प्रत्यक्ष व्यय"}
            value={fund.actualExpenditure}
            tone="text-red-700"
          />
        </div>

        {fund.progress > 0 && (
          <div className="mt-5 ds-card p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink">{en ? "Progress" : "प्रगति"}</span>
              <span className="tabular-nums text-muted">{fund.progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-mist">
              <div className="h-full bg-ink" style={{ width: `${fund.progress}%` }} />
            </div>
          </div>
        )}

        {fund.description && (
          <section className="mt-5 ds-card p-5">
            <h2 className="font-semibold text-ink">{en ? "About this fund" : "इस निधि के बारे में"}</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
              {fund.description}
            </p>
          </section>
        )}

        {fund.documents?.length > 0 && (
          <section className="mt-5 ds-card p-5">
            <h2 className="font-semibold text-ink">
              {en ? "Supporting documents" : "समर्थक दस्तऐवज"}
            </h2>
            <div className="mt-3 space-y-2">
              {fund.documents.map((doc, index) => (
                <a
                  key={`${doc.url}-${index}`}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:bg-mist"
                >
                  <img
                    src="https://img.icons8.com/ios/50/1f1f1f/pdf.png"
                    width={18}
                    height={18}
                    alt=""
                    className="shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink">
                    {doc.title || (en ? "Document" : "दस्तऐवज")}
                  </span>
                  <span aria-hidden className="shrink-0 text-muted">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

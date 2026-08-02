"use client";

import Link from "next/link";
import { money } from "../utils/format";
import { pick } from "../utils/language";

const Row = ({ label, value, tone }) => (
  <div className="flex items-baseline justify-between gap-3 py-2">
    <span className="text-sm text-muted">{label}</span>
    <span className={`text-sm font-semibold tabular-nums ${tone}`}>{money(value)}</span>
  </div>
);

/**
 * One scheme's fund position for one year, laid out in the same order and with
 * the same wording as the Government's Meri Panchayat report, so a villager can
 * hold the two side by side and check they agree.
 */
const FundCard = ({ fund, isAdmin, onDelete, language = "english" }) => (
  <article className="ds-card p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-muted">
          {pick(language, { en: "Scheme", mr: "योजना", hi: "योजना" })}:{" "}
          <span className="font-semibold text-ink">{fund.scheme}</span>
        </p>
        {fund.component && (
          <p className="mt-0.5 text-sm text-muted">
            {pick(language, { en: "Component", mr: "घटक", hi: "घटक" })}:{" "}
            <span className="font-semibold text-ink">{fund.component}</span>
          </p>
        )}
      </div>
      {isAdmin && (
        <div className="flex shrink-0 gap-3">
          <Link
            href={`/admin/editfunds/${fund._id}`}
            className="text-sm font-medium text-ink hover:underline"
          >
            {pick(language, { en: "Edit", mr: "बदला", hi: "संपादित" })}
          </Link>
          <button
            onClick={() => onDelete(fund)}
            className="text-sm font-medium text-red-700 hover:underline"
          >
            {pick(language, { en: "Delete", mr: "काढा", hi: "हटाएँ" })}
          </button>
        </div>
      )}
    </div>

    <div className="mt-4 divide-y divide-line border-y border-line">
      <Row label={pick(language, { en: "Expected Fund", mr: "अपेक्षित निधी", hi: "अपेक्षित निधि" })} value={fund.expectedFund} tone="text-ink" />
      <Row
        label={pick(language, { en: "Actual Fund Received", mr: "प्रत्यक्ष मिळालेली निधी", hi: "प्रत्यक्ष प्राप्त निधि" })}
        value={fund.actualFundReceived}
        tone="text-emerald-700"
      />
      <Row
        label={pick(language, { en: "Previous Year Balance", mr: "मागील वर्षाची शिल्लक", hi: "पिछले वर्ष का शेष" })}
        value={fund.previousYearBalance}
        tone="text-emerald-700"
      />
      <Row
        label={pick(language, { en: "Reverted / Surrendered Fund", mr: "परत / समर्पित निधी", hi: "वापस / समर्पित निधि" })}
        value={fund.revertedFund}
        tone="text-emerald-700"
      />
      <Row
        label={pick(language, { en: "Actual Expenditure", mr: "प्रत्यक्ष खर्च", hi: "प्रत्यक्ष व्यय" })}
        value={fund.actualExpenditure}
        tone="text-red-700"
      />
    </div>

    {fund.progress > 0 && (
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{pick(language, { en: "Progress", mr: "प्रगती", hi: "प्रगति" })}</span>
          <span className="tabular-nums">{fund.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div className="h-full bg-ink" style={{ width: `${fund.progress}%` }} />
        </div>
      </div>
    )}

    {(fund.description || fund.documents?.length > 0) && (
      <Link
        href={`/panchayat_funds/${fund._id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline"
      >
        {pick(language, { en: "Details and documents", mr: "तपशील व कागदपत्रे", hi: "विवरण और दस्तावेज़" })}
        <span aria-hidden>→</span>
      </Link>
    )}
  </article>
);

export default FundCard;

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import FundCard from "../component/FundCard";
import NoDataFound from "../component/NoDataFound";
import Dropdown from "../component/Dropdown";
import { FUND_SOURCES, totalsOf } from "../utils/funds";
import { money } from "../utils/format";
import { pick } from "../utils/language";

export default function PanchayatFunds() {
  const { setOpenSidebar, language, userData } = useGlobalContext();
  const isAdmin = userData?.userType === "admin";

  const [funds, setFunds] = useState([]);
  const [years, setYears] = useState([]);
  // "all" rather than a guessed year: the page used to fetch every year, then
  // set the year and fetch again, and whichever response landed last won — so a
  // refresh could show all twenty records under a single year's heading.
  const [year, setYear] = useState("all");
  const [source, setSource] = useState("goi");
  const [loading, setLoading] = useState(true);
  // Ignores a slow response once a newer filter has been chosen.
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const ticket = ++requestId.current;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (year && year !== "all") params.set("year", year);
      const response = await fetch(`/api/funds?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (ticket !== requestId.current) return;
      setFunds(data.funds);
      setYears(data.years);
    } catch (error) {
      if (ticket === requestId.current)
        toast.error(error.message || "Could not load fund records");
    }
    if (ticket === requestId.current) setLoading(false);
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (fund) => {
    if (!window.confirm(`Delete this ${fund.scheme} record for ${fund.financialYear}?`)) return;
    const response = await fetch(`/api/funds/${fund._id}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return toast.error(data.message || "Could not delete the record");
    toast.success("Fund record deleted");
    setFunds((current) => current.filter((item) => item._id !== fund._id));
  };

  // The source tabs filter what is already loaded, so switching them is instant.
  const visible = useMemo(
    () => funds.filter((fund) => fund.source === source),
    [funds, source]
  );
  const totals = useMemo(() => totalsOf(visible), [visible]);

  const summary = [
    { label: pick(language, { en: "Expected", mr: "अपेक्षित", hi: "अपेक्षित" }), value: totals.expectedFund },
    { label: pick(language, { en: "Received", mr: "मिळालेली", hi: "प्राप्त" }), value: totals.actualFundReceived },
    { label: pick(language, { en: "Previous balance", mr: "मागील शिल्लक", hi: "पिछला शेष" }), value: totals.previousYearBalance },
    { label: pick(language, { en: "Reverted", mr: "परत गेलेली", hi: "वापस" }), value: totals.revertedFund },
    { label: pick(language, { en: "Spent", mr: "खर्च", hi: "व्यय" }), value: totals.actualExpenditure },
  ];

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-paper px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-4xl">
        <h1 className="text-lg font-semibold text-ink">
          {pick(language, {
            en: "Scheme-wise Fund Receipt & Expenditure",
            mr: "योजनानिहाय निधी जमा व खर्च",
            hi: "योजना अनुसार निधि प्राप्ति व व्यय",
          })}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(language, {
            en: "The same figures the Panchayat reports to the Government, published here for every resident to check.",
            mr: "पंचायत जे आकडे शासनाला कळवते, तेच इथे प्रत्येक गावकऱ्याला तपासता यावेत म्हणून दिले आहेत.",
            hi: "पंचायत जो आँकड़े सरकार को देती है, वही यहाँ हर नागरिक के देखने के लिए प्रकाशित हैं।",
          })}
        </p>

        {/* Year picker */}
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {pick(language, { en: "Select Year", mr: "वर्ष निवडा", hi: "वर्ष चुनें" })}
            </span>
            <Dropdown
              value={year}
              options={[
                { value: "all", label: pick(language, { en: "All time", mr: "सर्व वर्षे", hi: "सभी वर्ष" }) },
                ...years.map((y) => ({ value: y, label: y })),
              ]}
              onChange={setYear}
              className="min-w-[160px]"
              ariaLabel={pick(language, { en: "Financial year", mr: "आर्थिक वर्ष", hi: "वित्तीय वर्ष" })}
              placeholder={pick(language, { en: "Loading…", mr: "उघडत आहे…", hi: "लोड हो रहा है…" })}
            />
          </div>
          {isAdmin && (
            <Link href="/admin/addfunds" className="btn-primary text-sm">
              + {pick(language, { en: "Add fund record", mr: "नवीन निधी नोंद", hi: "नई निधि प्रविष्टि" })}
            </Link>
          )}
        </div>

        {/* Funding source */}
        <div className="mt-4 flex rounded-lg border border-line bg-paper p-1 text-sm">
          {FUND_SOURCES.map((option) => {
            const count = funds.filter((fund) => fund.source === option.value).length;
            return (
              <button
                key={option.value}
                onClick={() => setSource(option.value)}
                className={`flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
                  source === option.value ? "bg-ink text-white" : "text-muted hover:bg-mist"
                }`}
              >
                {pick(language, option)}
                <span className="ml-1 tabular-nums opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Year totals for the selected source */}
        {visible.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {summary.map((item) => (
              <div key={item.label} className="ds-card-muted px-3 py-3">
                <p className="text-[11px] uppercase tracking-wide text-muted">{item.label}</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-ink">
                  {money(item.value)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Records */}
        <div className="mt-5 space-y-4">
          {loading ? (
            [1, 2, 3].map((row) => (
              <div key={row} className="h-64 animate-pulse rounded-card bg-mist" />
            ))
          ) : visible.length === 0 ? (
            <NoDataFound />
          ) : (
            visible.map((fund) => (
              <FundCard
                key={fund._id}
                fund={fund}
                isAdmin={isAdmin}
                onDelete={remove}
                language={language}
              />
            ))
          )}
        </div>

        {!loading && visible.length > 0 && (
          <p className="mt-6 text-xs leading-5 text-muted">
            {pick(language, {
              en: "Figures are as reported for Chandgaon Gram Panchayat (LGD code 170972). An amount of ₹0 means nothing was received or spent under that head in this year.",
              mr: "हे आकडे चांदगाव ग्रामपंचायत (LGD क्रमांक 170972) साठी नोंदवल्याप्रमाणे आहेत. ₹0 म्हणजे त्या वर्षी त्या बाबीत काहीही मिळाले नाही किंवा खर्च झाले नाही.",
              hi: "आँकड़े चांदगांव ग्राम पंचायत (LGD कोड 170972) के लिए दर्ज अनुसार हैं। ₹0 का अर्थ है कि उस वर्ष उस मद में कुछ प्राप्त या खर्च नहीं हुआ।",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

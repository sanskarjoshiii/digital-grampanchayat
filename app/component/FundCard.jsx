"use client";
import Link from "next/link";
import React from "react";
import { useGlobalContext } from "../context/context";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const FundCard = ({ data }) => {
  const { language } = useGlobalContext();
  const t =
    language == "english"
      ? {
          expected: "Expected Funds",
          actual: "Actual Funds Received",
          expenditure: "Actual Expenditure",
          more: "More details",
        }
      : {
          expected: "अपेक्षित निधि",
          actual: "वास्तविक प्राप्त निधि",
          expenditure: "वास्तविक व्यय",
          more: "अधिक जानकारी",
        };

  const rows = [
    { label: t.expected, value: data.total_expected_funds },
    { label: t.actual, value: data.total_actual_funds },
    { label: t.expenditure, value: data.total_actual_expenditure },
  ];

  return (
    <div className="ds-card w-[88%] max-w-2xl mx-auto my-4 p-5">
      <div className="flex flex-row items-center justify-between mb-4">
        <span className="ds-pill">
          <img
            width="14"
            height="14"
            src="https://img.icons8.com/material-rounded/24/1f1f1f/calendar--v1.png"
            alt="year"
          />
          {data.year}–{data.year + 1}
        </span>
      </div>

      <div className="divide-y divide-line">
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex flex-row items-center justify-between py-3"
          >
            <span className="text-sm text-muted">{r.label}</span>
            <span className="text-sm font-semibold text-ink">
              {money(r.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-end mt-4">
        <Link href={`/panchayat_funds/${data.year}`} className="btn-primary text-sm">
          {t.more}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
};

export default FundCard;

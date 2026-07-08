"use client";
import React from "react";
import { useGlobalContext } from "../context/context";
import Link from "next/link";
import toast from "react-hot-toast";

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const FundDetailCard = ({ data, year }) => {
  const { userData, language } = useGlobalContext();

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/panchayat_funds/${data._id}`, {
      method: "delete",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status == 200) {
      toast.success("Deleted successfully");
    }
  };

  const t =
    language == "english"
      ? {
          scheme: "Scheme",
          component: "Component",
          expected: "Expected Funds",
          actual: "Actual Funds Received",
          reverted: "Reverted / Surrendered Funds",
          expenditure: "Actual Expenditure",
          edit: "Edit",
          del: "Delete",
        }
      : {
          scheme: "योजना",
          component: "घटक",
          expected: "अपेक्षित निधि",
          actual: "वास्तविक प्राप्त निधि",
          reverted: "वापस/समर्पित निधि",
          expenditure: "वास्तविक व्यय",
          edit: "संपादित करें",
          del: "हटाएं",
        };

  const rows = [
    { label: t.expected, value: data.expected_funds },
    { label: t.actual, value: data.actual_funds },
    { label: t.reverted, value: data.reverted_funds },
    { label: t.expenditure, value: data.actual_expenditure },
  ];

  return (
    <div className="ds-card w-[88%] max-w-2xl mx-auto my-4 p-5">
      <div className="pb-4 border-b border-line">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-baseline gap-2">
            <span className="text-xs uppercase tracking-wide text-muted">
              {t.scheme}
            </span>
            <span className="text-base font-semibold text-ink">
              {data.scheme}
            </span>
          </div>
          <div className="flex flex-row items-baseline gap-2">
            <span className="text-xs uppercase tracking-wide text-muted">
              {t.component}
            </span>
            <span className="text-sm font-medium text-ink">
              {data.component}
            </span>
          </div>
        </div>
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

      {userData.userType == "admin" && (
        <div className="flex flex-row items-center gap-3 pt-4">
          <Link
            href={`/admin/editfunds/${data._id}`}
            className="btn-ghost text-sm flex-1"
          >
            {t.edit}
          </Link>
          <button
            onClick={handleDelete}
            className="btn-primary text-sm flex-1 bg-ink"
          >
            {t.del}
          </button>
        </div>
      )}
    </div>
  );
};

export default FundDetailCard;

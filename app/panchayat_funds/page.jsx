"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import WorkCard from "../component/WorkCard";
import NoDataFound from "../component/NoDataFound";
import Link from "next/link";
import { statusLabel } from "../utils/format";

const FILTERS = ["all", "pending", "ongoing", "completed"];

const Page = () => {
  const { setOpenSidebar, setLoader, language, userData } = useGlobalContext();
  const en = language == "english";
  const [works, setWorks] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchWorks = async (status) => {
    setLoader(true);
    const response = await fetch(`/api/works?status=${status}`, {
      method: "get",
    });
    if (response.status == 200) {
      setWorks(await response.json());
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchWorks(filter);
  }, [filter]);

  return (
    <div
      onClick={() => setOpenSidebar(false)}
      className="w-full min-h-[91vh] bg-paper"
    >
      {userData.userType == "admin" && (
        <Link
          href={"/admin/addwork"}
          className="fixed bottom-8 right-8 z-40 btn-primary rounded-full w-14 h-14 p-0 text-2xl shadow-pop"
          aria-label="Add work"
        >
          +
        </Link>
      )}

      <div className="border-b border-line px-6 py-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">
          {en ? "Panchayat Works & Schemes" : "पंचायत कामे व योजना"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {en
            ? "Track every sanctioned work — funds, progress and status, openly."
            : "प्रत्येक मंज़ूर काम पर नज़र रखें — निधि, प्रगति और स्थिति, पारदर्शी रूप से।"}
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-row items-center justify-center gap-2 flex-wrap py-5 px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-medium rounded-full px-4 py-1.5 border transition-colors ${
              filter === f
                ? "bg-ink text-white border-ink"
                : "bg-paper text-ink border-line hover:bg-mist"
            }`}
          >
            {f === "all" ? (en ? "All" : "सभी") : statusLabel(f, en)}
          </button>
        ))}
      </div>

      <div className="pb-24">
        {works.length === 0 && <NoDataFound />}
        {works.map((w) => (
          <WorkCard key={w._id} data={w} />
        ))}
      </div>
    </div>
  );
};

export default Page;

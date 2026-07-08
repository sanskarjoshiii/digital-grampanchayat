"use client";
import FundDetailCard from "@/app/component/FundDetailCard";
import NoDataFound from "@/app/component/NoDataFound";
import { useGlobalContext } from "@/app/context/context";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = ({ params }) => {
  const [fundsData, setFundsData] = useState([]);
  const { setOpenSidebar, setLoader, userData ,language} = useGlobalContext();
  const fetchFundsData = async () => {
    setLoader(true);
    const response = await fetch(`/api/user/panchayat_funds/${params.year}`, {
      method: "get",
    });
    if (response.status == 200) {
      const res = await response.json();
      setFundsData(res);
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchFundsData();
  }, []);
  return (
    <div
      className="w-full h-auto px-2 py-6 bg-paper min-h-[91vh]"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="border-b border-line pb-6 text-center">
        <h1 className="text-xl lg:text-2xl font-semibold text-ink px-4">
          {language == "english"
            ? "Scheme-wise fund receipt and expenditure"
            : "योजना अनुसार निधि प्राप्ति और व्यय"}
        </h1>
        <span className="ds-pill mt-3">
          {params.year}–{parseInt(params.year) + 1}
        </span>
      </div>
      <div className="w-full h-auto py-4 max-w-2xl mx-auto">
        {userData.userType == "admin" && (
          <div className="w-[88%] mx-auto flex flex-row justify-end mb-2">
            <Link className="btn-ghost text-sm" href={"/admin/addfunds"}>
              + Add funds details
            </Link>
          </div>
        )}
        {fundsData && fundsData.length == 0 && <NoDataFound />}
        {fundsData &&
          fundsData.map((data, index) => {
            return (
              <FundDetailCard data={data} year={params.year} key={index} />
            );
          })}
      </div>
    </div>
  );
};

export default Page;

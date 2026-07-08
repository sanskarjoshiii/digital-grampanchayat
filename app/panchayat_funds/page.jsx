"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import FundCard from "../component/FundCard";
import NoDataFound from "../component/NoDataFound";
import Link from "next/link";

const Page = () => {
  const { setOpenSidebar, setLoader, language ,userData} = useGlobalContext();
  const [fundsData, setFundsData] = useState([]);
  const fetchFundsData = async () => {
    setLoader(true);
    const response = await fetch(`/api/user/panchayat_funds`, {
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
      onClick={() => setOpenSidebar(false)}
      className="w-full h-[91vh] overflow-hidden bg-paper"
    >
      {userData.userType == "admin" && (
        <Link
          href={"/admin/addfunds"}
          className="fixed bottom-8 right-8 z-40 btn-primary rounded-full w-14 h-14 p-0 text-2xl shadow-pop"
          aria-label="Add funds"
        >
          +
        </Link>
      )}
      <div className="border-b border-line px-6 py-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">
          {language == "english" ? "Funds Details" : "निधि विवरण"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {language == "english"
            ? "View the list of funds received, year by year"
            : "प्राप्त निधियों की सूची देखें"}
        </p>
      </div>
      <div
        data-lenis-prevent
        className="w-full h-[78vh] py-6 overflow-x-hidden overflow-y-auto no-scrollbar"
      >
        {fundsData && fundsData.length == 0 && <NoDataFound />}
        {fundsData &&
          fundsData.map((data, index) => <FundCard data={data} key={index} />)}
        <div className="w-full h-16"></div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import FundDetailCard from "@/app/component/FundDetailCard";
import NoDataFound from "@/app/component/NoDataFound";
import { useGlobalContext } from "@/app/context/context";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [fundsData, setFundsData] = useState([]);
  const [selectYear, setSelectYear] = useState(2024);
  const { setOpenSidebar, setLoader, userData, language } = useGlobalContext();

  const fetchFundsData = async () => {
    setLoader(true);
    const response = await fetch(`/api/user/panchayat_funds/${selectYear}`, {
      method: "get",
    });
    if (response.status == 200) {
      const res = await response.json();
      setFundsData(res);
    } else {
      setFundsData(null);
    }
    setLoader(false);
  };
  console.log(fundsData);
  useEffect(() => {
    fetchFundsData();
  }, [selectYear]);

  return (
    <div
      className="w-full h-auto px-2 py-6"
      onClick={() => setOpenSidebar(false)}
    >
      {language == "english" ? (
        <h1 className="w-full text-xl lg:text-2xl font-semibold h-auto flex flex-row text-center items-center justify-center py-4 border-y-2 border-gray-400 ">
          Scheme-wise fund receipt and expenditure
        </h1>
      ) : (
        <h1 className="w-full text-xl lg:text-2xl font-semibold h-auto flex flex-row text-center items-center justify-center py-4 border-y-2 border-gray-400">
          योजना अनुसार निधि प्राप्ति और व्यय
        </h1>
      )}
      <div className="flex flex-col py-4 px-6">
        {language == "english" ? (
          <label>Select Year</label>
        ) : (
          <label>वर्ष चुनें</label>
        )}{" "}
        <select
          onChange={(e) => setSelectYear(e.target.value)}
          className="w-40 h-10 my-2 bg-white border-2 border-gray-700"
          value={selectYear}
        >
          <option value={2024} className="text-center">
            2024
          </option>
          <option value={2023} className="text-center">
            2023
          </option>
          <option value={2022} className="text-center">
            2022
          </option>
          <option value={2021} className="text-center">
            2021
          </option>
          <option value={2020} className="text-center">
            2020
          </option>
          <option value={2019} className="text-center">
            2019
          </option>
        </select>
      </div>
      <div className="w-full h-auto py-2">
        {fundsData.length == 0 && <NoDataFound />}
        {fundsData &&
          fundsData.map((data, index) => (
            <FundDetailCard data={data} year={selectYear} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Page;

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
      className="w-full h-auto px-2 py-6"
      onClick={() => setOpenSidebar(false)}
    >
     {language=="english"? <h1 className="w-full text-xl lg:text-2xl font-semibold h-auto flex flex-row text-center items-center justify-center py-4 border-y-2 border-gray-400 ">
        Scheme-wise fund receipt and expenditure
      </h1>:<h1 className="w-full text-xl lg:text-2xl font-semibold h-auto flex flex-row text-center items-center justify-center py-4 border-y-2 border-gray-400">
  योजना अनुसार निधि प्राप्ति और व्यय
</h1>
}
      <p className="w-fit mx-auto flex-row text-xl font-semibold flex justify-center h-auto py-4 px-2 border-b-2 border-gray-400">
        {params.year}-{parseInt(params.year) + 1}
      </p>
      <div className="w-full h-auto py-2">
        {userData.userType == "admin" ? (
          <div className="w-[90%] h-auto py-0 px-2 mt-4 flex flex-row justify-end ">
            <Link
              className=" rounded-md w-auto hover:bg-green-600 hover:border-white hover:text-white h-10 bg-none border-2 border-green-600 px-4 py-2"
              href={"/admin/addfunds"}
            >
              Add Funds Details
            </Link>
          </div>
        ) : (
          ""
        )}{" "}
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

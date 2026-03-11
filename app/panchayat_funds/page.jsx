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
      className="w-full h-[90vh] overflow-hidden"
    >
     {userData.userType=="admin" && <Link
        href={"/admin/addfunds"}
        className="w-[10vh] h-[10vh]  fixed bottom-10 right-8"
        style={{ borderRadius: "50%" }}
      >
        <img
          width="90"
          height="90"
          className="hover:rotate-90 transition-all duration-200"
          src="https://img.icons8.com/color/48/plus--v1.png"
          alt="plus--v1"
        />
      </Link>}
      {language == "english" ? (
        <h1 className="w-full h-16 border-y-2 border-gray-400 flex flex-row items-center justify-center ">
          Funds Details
        </h1>
      ) : (
        <h1 className="w-full h-16 border-y-2 border-gray-400 flex flex-row items-center justify-center">
          निधि विवरण
        </h1>
      )}
      {language == "english" ? (
        <h1 className="w-full h-20  text-gray-400 flex flex-row items-center justify-center ">
          View list of Funds Received
        </h1>
      ) : (
        <h1 className="w-full h-20 text-gray-400 flex flex-row items-center justify-center">
          प्राप्त निधियों की सूची देखें
        </h1>
      )}
      <div
        className="w-full h-[80vh] py-8 overflow-x-hidden overflow-y-scroll "
        style={{ scrollbarWidth: "none" }}
      >
        {fundsData && fundsData.length == 0 && <NoDataFound />}

        {fundsData
          ? fundsData.map((data, index) => {
              return <FundCard data={data} key={index} />;
            })
          : "No Data Found"}
        <div className="w-full h-20"></div>
      </div>
    </div>
  );
};

export default Page;

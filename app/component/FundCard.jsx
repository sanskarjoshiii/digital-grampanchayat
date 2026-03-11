"use client";
import Link from "next/link";
import React from "react";
import { useGlobalContext } from "../context/context";

const FundCard = ({ data }) => {
  const { language } = useGlobalContext();
  return (
    <>
      {language == "english" ? (
        <div className="box-shadow w-[85%] h-[auto] mx-auto my-4">
          <p className="w-full  text-gray-600 px-4 py-6 gap-6 justify-end flex flex-row">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-rounded/24/calendar--v1.png"
              alt="calendar--v1"
            />
            <span>
              {data.year}-{data.year + 1}
            </span>
          </p>
          <div className="w-[95%] h-10 mx-auto border-b-2">
            Expected Funds : ₹{data.total_expected_funds}
          </div>
          <div className="w-[95%] h-10 mx-auto border-b-2 flex flex-row justify-between items-center py-8 ">
            <span>Actual Funds Received : ₹{data.total_actual_funds} </span>
          </div>
          <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-4">
            <span>Actual Expenditure : ₹{data.total_actual_expenditure} </span>
          </div>
          <div className="w-full h-auto px-4 py-2 flex flex-row items-center justify-end">
            <Link
              href={`/panchayat_funds/${data.year}`}
              className="w-[30vh] h-[6vh] flex flex-row items-center justify-center bg-green-500 text-white"
            >
              More Details
            </Link>
          </div>
        </div>
      ) : (
        <div className="box-shadow w-[85%] h-[auto] mx-auto my-4">
          <p className="w-full text-gray-600 px-4 py-6 gap-6 justify-end flex flex-row">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/material-rounded/24/calendar--v1.png"
              alt="calendar--v1"
            />
            <span>
              {data.year}-{data.year + 1}
            </span>
          </p>
          <div className="w-[95%] h-10 mx-auto border-b-2">
            अपेक्षित निधि : ₹{data.total_expected_funds}
          </div>
          <div className="w-[95%] h-10 mx-auto border-b-2 flex flex-row justify-between items-center py-8">
            <span>वास्तविक प्राप्त निधि : ₹{data.total_actual_funds} </span>
          </div>
          <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-4">
            <span>वास्तविक व्यय : ₹{data.total_actual_expenditure} </span>
          </div>
          <div className="w-full h-auto px-4 py-2 flex flex-row items-center justify-end">
            <Link
              href={`/panchayat_funds/${data.year}`}
              className="w-[30vh] h-[6vh] flex flex-row items-center justify-center bg-green-500 text-white"
            >
              अधिक जानकारी
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default FundCard;

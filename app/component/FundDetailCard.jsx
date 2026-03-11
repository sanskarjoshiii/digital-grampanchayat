"use client";
import React from "react";
import { useGlobalContext } from "../context/context";
import Link from "next/link";
import toast from "react-hot-toast";

const FundDetailCard = ({ data, year }) => {
  const { userData,language } = useGlobalContext();

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/panchayat_funds/${data._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status == 200) {
      toast.success("delete successfully");
    }
  };
  return (
   <>
   {language=="english"? <div className="box-shadow w-[85%] h-auto mx-auto my-4 bg-white rounded-lg p-4">
      <div className="w-[95%] h-auto py-2 mx-auto border-b-2  flex flex-col">
        <div className="flex flex-row items-center py-2 gap-2">
          <span className="font-bold text-black text-xl">Scheme:</span>
          <span className="text-black font-extrabold">{data.scheme}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className=" text-xl font-bold text-black">Component:</span>
          <span className="text-black font-extrabold">{data.component}</span>
        </div>
      </div>
      <div className="w-[95%] h-auto py-2 mx-auto border-b-2">
        <span className="font-bold text-black">Expected Funds:</span>
        <span className="text-green-900 font-bold">₹{data.expected_funds}</span>
      </div>
      <div className="w-[95%] h-auto mx-auto border-b-2 flex flex-row justify-between items-center py-4">
        <span>
          <span className="font-bold text-black">Actual Funds Received:</span>
          <span className="text-purple-800 font-bold">
          ₹{data.actual_funds}
          </span>
        </span>
      </div>
      <div className="w-[95%] h-auto mx-auto border-b-2 flex flex-row justify-between items-center py-2">
        <span>
          <span className="font-bold text-black">
            Reverted/Surrendered Funds:
          </span>
          <span className="text-violet-700 font-bold ">
          ₹{data.reverted_funds}
          </span>
        </span>
      </div>
      <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-2">
        <span>
          <span className="font-bold text-black">Actual Expenditure:</span>
          <span className="text-red-700 font-bold">
          ₹
          {data.actual_expenditure}
          </span>
        </span>
      </div>
      {userData.userType == "admin" ? (
        <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-2 gap-6">
          <button className="w-[20vh] h-10 bg-green-600 text-white rounded-md">
            <Link href={`/admin/editfunds/${data._id}`}>Edit</Link>
          </button>
          <button
            className="w-[20vh] h-10 bg-red-600 text-white rounded-md"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>: 
    <div className="box-shadow w-[85%] h-auto mx-auto my-4 bg-white rounded-lg p-4">
      <div className="w-[95%] h-auto py-2 mx-auto border-b-2 flex flex-col">
        <div className="flex flex-row items-center py-2 gap-2">
          <span className="font-bold text-black text-xl">योजना:</span>
          <span className="text-black font-extrabold">{data.scheme}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="text-xl font-bold text-black">घटक:</span>
          <span className="text-black font-extrabold">{data.component}</span>
        </div>
      </div>
      <div className="w-[95%] h-auto py-2 mx-auto border-b-2">
        <span className="font-bold text-black">अपेक्षित निधि:</span>
        <span className="text-green-900 font-bold">₹{data.expected_funds}</span>
      </div>
      <div className="w-[95%] h-auto mx-auto border-b-2 flex flex-row justify-between items-center py-4">
        <span>
          <span className="font-bold text-black">वास्तविक प्राप्त निधि:</span>
          <span className="text-purple-800 font-bold">
            ₹{data.actual_funds}
          </span>
        </span>
      </div>
      <div className="w-[95%] h-auto mx-auto border-b-2 flex flex-row justify-between items-center py-2">
        <span>
          <span className="font-bold text-black">वापस/समर्पित निधि:</span>
          <span className="text-violet-700 font-bold">
            ₹{data.reverted_funds}
          </span>
        </span>
      </div>
      <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-2">
        <span>
          <span className="font-bold text-black">वास्तविक व्यय:</span>
          <span className="text-red-700 font-bold">
            ₹{data.actual_expenditure}
          </span>
        </span>
      </div>
      {userData.userType == "admin" ? (
        <div className="w-[95%] h-auto mx-auto flex flex-row justify-between items-center py-2 gap-6">
          <button className="w-[20vh] h-10 bg-green-600 text-white rounded-md">
            <Link href={`/admin/editfunds/${data._id}`}>संपादित करें</Link>
          </button>
          <button
            className="w-[20vh] h-10 bg-red-600 text-white rounded-md"
            onClick={() => {
              handleDelete();
            }}
          >
            हटाएं
          </button>
        </div>
      ) : (
        ""
      )}
    </div>}
   </>
  );
};

export default FundDetailCard;

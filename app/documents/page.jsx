"use client";
import React, { useEffect, useState } from "react";
import DocumentCard from "../component/DocumentCard";
import NoDataFound from "../component/NoDataFound";
import Link from "next/link";
import { useGlobalContext } from "../context/context";

const Page = () => {
  const [document, setDocument] = useState([]);
  const { setLoader,language ,userData} = useGlobalContext();
  const fetchData = async () => {
    setLoader(true);
    const data = await fetch("api/admin/document", {
      method: "get",
    });
    if (data.status == 200) {
      const res = await data.json();
      console.log(res);
      setDocument(res);
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full min-h-[91vh] bg-paper flex flex-col items-center">
      {userData.userType == "admin" && (
        <Link
          href={"/documents/upload"}
          className="fixed bottom-8 right-8 z-40 btn-primary rounded-full w-14 h-14 p-0 text-2xl shadow-pop"
          aria-label="Upload document"
        >
          +
        </Link>
      )}
      <div className="w-full border-b border-line px-6 py-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">
          {language == "english" ? "Documents" : "दस्तावेज़"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {language == "english"
            ? "Official records and circulars"
            : "आधिकारिक दस्तावेज़ और परिपत्र"}
        </p>
      </div>
      <div className="w-full flex flex-col items-center py-6 overflow-y-auto no-scrollbar">
        {document.length == 0 && <NoDataFound />}
        {document.map((data, index) => (
          <DocumentCard key={index} data={data} />
        ))}
      </div>
    </div>
  );
};

export default Page;

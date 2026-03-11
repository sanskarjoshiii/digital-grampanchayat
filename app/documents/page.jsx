"use client";
import React, { useEffect, useState } from "react";
import DocumentCard from "../component/DocumentCard";
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
    <div className="w-full h-[80vh] overflow-hidden flex flex-col items-center my-4  ">
     {userData.userType=="admin" && <Link
        href={"/documents/upload"}
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
        <h1 className="my-6 text-2xl font-medium">Documents</h1>
      ) : (
        <h1 className="my-6 text-2xl font-medium">दस्तावेज़</h1>
      )}{" "}
      <div className="flex flex-col items-center my-0 overflow-y-auto">
        {document.map((data, index) => {
          return <DocumentCard key={index} data={data} />;
        })}
      </div>
    </div>
  );
};

export default Page;

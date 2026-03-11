"use client";

import { useRouter } from "next/navigation";
import Sidebar from "./component/Sidebar";
import { useEffect, useState } from "react";
import Header from "./component/Header";
import { useGlobalContext } from "./context/context";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { toggleSidebar, openSidebar, setOpenSidebar,language } = useGlobalContext();
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      router.push("/login");
    }
  });

  return (
    <>
      {/* <Sidebar /> */}
      {language == "english" ? (
        <div
          className="w-full bg-gray-900 h-[100vh]"
          onClick={() => setOpenSidebar(false)}
        >
          <div className="flex flex-col w-[40%] mx-auto items-start justify-center py-10 gap-4 text-emerald-700 text-4xl">
            <h1 className="text-4xl font-medium">
              <span className="text-6xl text-orange-600">W</span>elcome
            </h1>
            <h1>
              <span className="text-6xl text-red-600">T</span>O
            </h1>
            <h1>
              <span className="text-6xl text-green-600">D</span>igital
            </h1>
            <h1>
              <span className="text-6xl text-yellow-600">G</span>ram
            </h1>
            <h1>
              <span className="text-6xl text-orange-600">P</span>anchayat
            </h1>
          </div>
          <div className="w-full flex flex-row items-center justify-center">
            <Link
              href={"/about"}
              className="text-white text-xl bg-none border-2 border-green-400 border-dotted py-2 px-4 mx-auto"
            >
              Know More About Us
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="w-full bg-gray-900 h-[100vh]"
          onClick={() => setOpenSidebar(false)}
        >
          <div className="flex flex-col w-[40%] mx-auto items-start justify-center py-10 gap-4 text-emerald-700 text-4xl">
            <h1 className="text-4xl font-medium">
              <span className="text-6xl text-orange-600">स्वा</span>गत है
            </h1>
            <h1>
              <span className="text-6xl text-red-600">यहाँ</span>{" "}
            </h1>
            <h1>
              <span className="text-6xl text-green-600">डिजिटल</span>
            </h1>
            <h1>
              <span className="text-6xl text-yellow-600">ग्राम</span>
            </h1>
            <h1>
              <span className="text-6xl text-orange-600">पंचायत</span>
            </h1>
          </div>
          <div className="w-full flex flex-row items-center justify-center">
            <Link
              href={"/about"}
              className="text-white text-xl bg-none border-2 border-green-400 border-dotted py-2 px-4 mx-auto"
            >
              हमारे बारे में अधिक जानें
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

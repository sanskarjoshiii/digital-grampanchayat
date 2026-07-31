"use client";
import React from "react";
import Loader from "./component/Loader";
import { useGlobalContext } from "./context/context";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import SmoothScroll from "./component/SmoothScroll";
import RouteProgress from "./component/RouteProgress";
import { usePathname } from "next/navigation";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ComplaintFab from "./component/ComplaintFab";
const Provider = ({ children }) => {
  const { setOpenSidebar, loader } = useGlobalContext();
  const pathname = usePathname();
  return (
    <>
      <RouteProgress />
      <SmoothScroll />
      {pathname != "/login" &&
      pathname != "/signup" &&
      pathname != "/login/forget_password" ? (
        <Header />
      ) : (
        ""
      )}
      <Sidebar />

      <div onClick={() => setOpenSidebar(false)}>
        {loader && <Loader />}
        <EdgeStoreProvider>
          {children}
          {/* Mounted here so the raiser is available on every page. */}
          <ComplaintFab />
        </EdgeStoreProvider>
      </div>
    </>
  );
};

export default Provider;

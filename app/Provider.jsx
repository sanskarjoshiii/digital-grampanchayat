"use client";
import React from "react";
import Loader from "./component/Loader";
import { useGlobalContext } from "./context/context";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { usePathname } from "next/navigation";
import { EdgeStoreProvider } from "@/lib/edgestore";
const Provider = ({ children }) => {
  const { setOpenSidebar, loader } = useGlobalContext();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
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
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </div>
    </>
  );
};

export default Provider;

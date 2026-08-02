"use client";
import React from "react";
import { useGlobalContext } from "./context/context";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import SmoothScroll from "./component/SmoothScroll";
import RouteProgress from "./component/RouteProgress";
import { usePathname } from "next/navigation";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ComplaintFab from "./component/ComplaintFab";
import HelpButton from "./component/HelpButton";
import Footer from "./component/Footer";
const Provider = ({ children }) => {
  const { setOpenSidebar } = useGlobalContext();
  const pathname = usePathname();
  const hidesHeader =
    pathname == "/login" ||
    pathname == "/signup" ||
    pathname == "/login/forget_password";
  return (
    <>
      <RouteProgress />
      <SmoothScroll />
      {!hidesHeader ? <Header /> : ""}
      {/* The header carries the help button everywhere else; the sign-in pages
          hide the header, so it is placed on the page itself instead. */}
      {hidesHeader && (
        <div className="fixed right-4 top-4 z-50">
          <HelpButton />
        </div>
      )}
      <Sidebar />

      {/* No full-screen overlay while loading: it blanked the page on every
          section change. RouteProgress shows the top bar instead and the
          current page stays visible until the next one is ready. */}
      <div onClick={() => setOpenSidebar(false)}>
        <EdgeStoreProvider>
          {children}
          {/* Mounted here so the raiser is available on every page. */}
          <ComplaintFab />
        </EdgeStoreProvider>
        {/* One shared footer rather than one per page, so the line cannot drift
            or go missing on a route that forgot to include it. */}
        <Footer />
      </div>
    </>
  );
};

export default Provider;

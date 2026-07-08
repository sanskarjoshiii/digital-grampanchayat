"use client";
import React from "react";
import Avatar from "./Avatar";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalContext } from "../context/context";
import { navItems, label } from "./navItems";

const Sidebar = () => {
  const { language, openSidebar, setOpenSidebar, setUserData, userData } =
    useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = Boolean(userData?.email);

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        onClick={() => setOpenSidebar(false)}
        style={{
          zIndex: 999,
          transition: "opacity .3s ease",
          opacity: openSidebar ? 1 : 0,
          pointerEvents: openSidebar ? "auto" : "none",
        }}
        className="fixed inset-0 bg-ink/30 lg:hidden"
      />
      <aside
        className="w-[300px] max-w-[85vw] h-[100vh] bg-paper border-r border-line flex flex-col lg:hidden"
        style={{
          zIndex: 1000,
          transition: "left .35s cubic-bezier(0.4,0,0.2,1)",
          position: "fixed",
          top: 0,
          left: openSidebar ? 0 : "-320px",
        }}
      >
        {isLoggedIn ? (
          <div className="w-full px-4 py-4 border-b border-line">
            <Avatar />
          </div>
        ) : (
          <div className="w-full px-4 py-5 border-b border-line flex items-center gap-2">
            <img src="/merilogo.png" width={30} height={30} alt="logo" />
            <span className="font-semibold text-ink">MeriPanchayat</span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto no-scrollbar py-3">
          <p className="px-5 pb-2 text-xs font-medium uppercase tracking-wide text-muted">
            {language == "english" ? "Menu" : "मेनू"}
          </p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => setOpenSidebar(false)}
                className={`mx-3 my-0.5 rounded-lg flex flex-row items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-ink text-white" : "text-ink hover:bg-mist"
                }`}
              >
                <img
                  src={item.img}
                  alt=""
                  width={19}
                  height={19}
                  style={{ filter: active ? "invert(1)" : "none" }}
                />
                <span>{label(item, language)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="w-full px-4 py-4 border-t border-line flex flex-col gap-2">
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("email");
                setUserData({ email: "", phoneNo: "", name: "", profile: "" });
                setOpenSidebar(false);
                router.push("/login");
              }}
              className="btn-primary w-full text-sm"
            >
              {language == "english" ? "Logout" : "लॉग आउट"}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpenSidebar(false)}
                className="btn-ghost w-full text-sm"
              >
                {language == "english" ? "Log in" : "लॉग इन"}
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpenSidebar(false)}
                className="btn-primary w-full text-sm"
              >
                {language == "english" ? "Sign up" : "साइन अप"}
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

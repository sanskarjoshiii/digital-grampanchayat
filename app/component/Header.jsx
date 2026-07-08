"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGlobalContext } from "../context/context";
import { navItems, label } from "./navItems";
import ModuleSearch from "./ModuleSearch";

const Header = () => {
  const { toggleSidebar, language, setLanguage, userData, setUserData } =
    useGlobalContext();
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = Boolean(userData?.email);

  const logout = () => {
    localStorage.removeItem("email");
    setUserData({ email: "", phoneNo: "", name: "", profile: "" });
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-line bg-paper sticky top-0 z-40">
      <div className="w-full px-5 sm:px-8 h-16 flex items-center gap-4 xl:gap-6">
        {/* Mobile: hamburger */}
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-mist transition-colors shrink-0"
        >
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios-filled/50/1f1f1f/menu--v1.png"
            alt="menu"
          />
        </button>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-1 xl:mr-2">
          <img src="/merilogo.png" width={34} height={34} alt="logo" />
          <span className="font-semibold text-lg text-ink hidden sm:inline tracking-tight">
            MeriPanchayat
          </span>
        </Link>

        {/* Desktop: module search */}
        <div className="hidden xl:block w-64 shrink-0">
          <ModuleSearch />
        </div>

        {/* Desktop: horizontal nav tabs with sliding active pill */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-lg text-[15px] font-medium whitespace-nowrap"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-ink rounded-lg"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? "text-white" : "text-ink hover:text-black"
                  }`}
                >
                  {label(item, language)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">
          <select
            className="h-9 px-2 rounded-lg border border-line bg-paper text-sm text-ink outline-none focus:border-ink transition-colors"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value={"english"}>EN</option>
            <option value={"marathi"}>हिं</option>
          </select>

          {isLoggedIn ? (
            <>
              <Link
                href="/edit"
                className="hidden sm:flex items-center gap-2 h-9 pl-1 pr-3 rounded-full border border-line hover:bg-mist transition-colors"
              >
                <img
                  className="w-7 h-7 rounded-full object-cover border border-line"
                  src={!userData.profile ? "/merilogo.png" : userData.profile}
                  alt="profile"
                />
                <span className="text-sm text-ink max-w-[100px] truncate">
                  {userData.name || "Profile"}
                </span>
              </Link>
              <button
                onClick={logout}
                className="btn-ghost h-9 px-3 py-0 text-sm hidden sm:inline-flex"
              >
                {language == "english" ? "Logout" : "लॉग आउट"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost h-9 px-4 py-0 text-sm">
                {language == "english" ? "Log in" : "लॉग इन"}
              </Link>
              <Link href="/signup" className="btn-primary h-9 px-4 py-0 text-sm">
                {language == "english" ? "Sign up" : "साइन अप"}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

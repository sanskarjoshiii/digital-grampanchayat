"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useGlobalContext } from "../context/context";
import { navItemsFor, label } from "./navItems";
import ModuleSearch from "./ModuleSearch";
import HelpButton from "./HelpButton";
import Dropdown from "./Dropdown";
import UserMenu from "./UserMenu";
import { LANGUAGES, pick } from "../utils/language";

const Header = () => {
  const { toggleSidebar, language, setLanguage, userData } = useGlobalContext();
  const pathname = usePathname();
  const isLoggedIn = Boolean(userData?.email);

  return (
    <header className="w-full border-b border-line bg-paper sticky top-0 z-40">
      {/* Full width with equal padding both sides, so the gutters match and
          nothing gets clipped on a wide screen. Capping this at a fixed width
          squeezed eight nav modules plus the account controls into 1280px and
          pushed the last item off the edge. */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Below xl the eight nav modules cannot fit, so navigation moves into
            the drawer. Sidebar.jsx uses the same breakpoint. */}
        <button
          onClick={toggleSidebar}
          aria-label="Open menu"
          className="xl:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-mist transition-colors shrink-0"
        >
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios-filled/50/1f1f1f/menu--v1.png"
            alt="menu"
          />
        </button>

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-1 sm:mr-3">
          <img src="/panchayatx-logo.png" width={32} height={32} alt="logo" />
          <span className="font-semibold text-lg text-ink hidden sm:inline tracking-tight">
            PanchayatX
          </span>
        </Link>

        {/* Kept narrow so the eight nav modules and the right-hand controls all
            fit on one row. It only appears once there is room to spare. */}
        <div className="hidden 2xl:block w-40 shrink-0">
          <ModuleSearch />
        </div>

        {/* Desktop: horizontal nav tabs with sliding active pill */}
        <nav className="hidden xl:flex items-center gap-1.5 mx-auto">
          {navItemsFor(userData).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
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
        <div className="flex items-center gap-2 ml-auto xl:ml-0 shrink-0">
          {/* Explains whichever page the villager is currently on. */}
          <HelpButton />
          <Dropdown
            value={language}
            options={LANGUAGES.map((l) => ({ value: l.value, label: l.short }))}
            onChange={setLanguage}
            ariaLabel="Language"
          />

          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              {/* On a phone these two would push the row past the screen edge;
                  the drawer carries the same links there. */}
              <Link href="/login" className="btn-ghost h-9 px-3 py-0 text-sm hidden sm:inline-flex">
                {pick(language, { en: "Log in", mr: "लॉग इन", hi: "लॉग इन" })}
              </Link>
              <Link href="/signup" className="btn-primary h-9 px-3 py-0 text-sm hidden sm:inline-flex">
                {pick(language, { en: "Sign up", mr: "नोंदणी करा", hi: "साइन अप" })}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

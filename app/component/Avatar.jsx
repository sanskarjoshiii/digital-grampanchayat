import Link from "next/link";
import React from "react";
import { useGlobalContext } from "../context/context";

const Avatar = () => {
  const { userData, language } = useGlobalContext();
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3">
        <img
          className="rounded-full h-12 w-12 object-cover border border-line"
          width={48}
          height={48}
          src={!userData?.profile ? "/merilogo.png" : userData.profile}
          alt="profile"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-ink">
            {userData?.name || (language == "english" ? "Guest" : "अतिथि")}
          </span>
          <span className="text-xs text-muted truncate max-w-[150px]">
            {userData?.email || ""}
          </span>
        </div>
      </div>
      <Link
        href="/edit"
        className="text-xs font-medium text-ink border border-line rounded-lg px-3 py-1.5 text-center hover:bg-mist transition-colors"
      >
        {language == "english" ? "Edit profile" : "प्रोफ़ाइल संपादित करें"}
      </Link>
    </div>
  );
};

export default Avatar;

import React from "react";
import Name from "./Name";

const LoginBanner = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      <img src="/merilogo.png" className="w-14" alt="MeriPanchayat" />
      <div className="text-center">
        <Name breaks={false} />
      </div>
    </div>
  );
};

export default LoginBanner;

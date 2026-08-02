import React from "react";
import Name from "./Name";

const LoginBanner = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-3">
      <img src="/panchayatx-logo.png" className="w-14" alt="PanchayatX" />
      <Name />
    </div>
  );
};

export default LoginBanner;

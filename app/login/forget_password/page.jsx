"use client";
import { useGlobalContext } from "@/app/context/context";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
    const router = useRouter();
  const [otp, setOtp] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const { setLoader } = useGlobalContext();
  const handleOtp = async () => {
    if (userData.email == "") {
      return toast.error("Enter a valid email");
    }
    setLoader(true);
    const response = await fetch("/api/user/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userData.email }),
    });
    if (response.status == 200) {
      toast.success("Otp Send Successfully");
      setOtp(true);
    } else {
      toast.error("Enter a valid email");
    }
    setLoader(false);
  };
  const handleChangePassword = async()=>{
try {
    if (userData.email == "") {
        return toast.error("Enter a valid email");
      }
      setLoader(true);
      const response = await fetch("/api/user/forgetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email ,otp:userData.otp,password:userData.password}),
      });
      if (response.status == 200) {
        toast.success("Password Change Successfully");
        setOtp(true);
      } else {
        toast.error("Invalid Otp");
      }
      setLoader(false);
} catch (error) {
    toast.error("Check the Internet");

}
  }
  const handleSUbmit = (e) => {
    e.preventDefault();
    if (otp == false) {
      handleOtp();
    }
    else{
        handleChangePassword();
        router.push("/login")
    }
  };
  return (
    <div className="w-full min-h-[100vh] bg-cream overflow-hidden flex flex-row items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSUbmit}
        className="ds-card w-full max-w-md py-10 px-8"
      >
        <h1 className="text-center text-xl font-semibold text-ink mb-6">
          Forgot Password
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="ds-label"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="ds-input"
            placeholder="name@gmail.com"
            required
          />
        </div>
        {otp && (
          <div className="mb-5">
            <label
              htmlFor="otp"
              className="ds-label"
            >
              Your Otp
            </label>
            <input
              type="number"
              id="otp"
              onChange={(e) =>
                setUserData({ ...userData, otp: e.target.value })
              }
              className="ds-input"
              placeholder="Enter Otp"
              required
            />
          </div>
        )}
        {otp && (
          <div className="mb-5">
            <label
              htmlFor="passowrd"
              className="ds-label"
            >
              Enter Password
            </label>
            <input
              type="text"
              id="passowrd"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="ds-input"
              placeholder="Enter Otp"
              required
            />
          </div>
        )}
        <button className="btn-primary w-full">
          {otp ? "Change password" : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default Page;

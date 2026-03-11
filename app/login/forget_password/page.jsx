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
    <div className="w-full h-[70vh] overflow-hidden flex flex-row items-center justify-center">
      <form
        onSubmit={handleSUbmit}
        className="w-[70%] h-auto py-4 px-4 box-shadow"
      >
        <h1 className="text-center text-xl font-semibold py-4">
          Forget Password
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@gmail.com"
            required
          />
        </div>
        {otp && (
          <div className="mb-5">
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Your Otp
            </label>
            <input
              type="number"
              id="otp"
              onChange={(e) =>
                setUserData({ ...userData, otp: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Otp"
              required
            />
          </div>
        )}
        {otp && (
          <div className="mb-5">
            <label
              htmlFor="passowrd"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Enter Password
            </label>
            <input
              type="text"
              id="passowrd"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Otp"
              required
            />
          </div>
        )}
        <button className="w-40 h-10 py-2 rounded-md bg-blue-500 text-white">
          Send Otp
        </button>
      </form>
    </div>
  );
};

export default Page;

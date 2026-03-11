"use client"
import React, { useState } from "react";
import Banner from "../component/Banner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import LoginBanner from "../component/LoginBanner";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Using react-icons for eye icons

const Page = () => {
  
  const router = useRouter();
  const [userData, setUserData] = useState({ email: "", password: ""});
  const [showPassword, setShowPassword] = useState(false);

  const {getUserData,setLoader}=useGlobalContext();
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoader(true)
    const response = await fetch(`/api/user/login`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email:userData.email ,password:userData.password})
    })
    if(response.status==200){
      toast.success("Login Successfully");
      localStorage.setItem("email",userData.email)
      getUserData();
      router.push("/")
    }
    else{
      toast.error("Invalid Credentials")

    }
    setLoader(false)
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-auto">
        <LoginBanner/>
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto box-shadow w-[auto] h-[auto] px-10 py-16">
          <h1 className="w-full text-center h-8 font-semibold text-xl mb-6">
            Login to your account
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
              value={userData.email}
              onChange={(e)=>setUserData({...userData,email:e.target.value})}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Your password
            </label>
            <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        placeholder="Enter password"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
          </div>
          <div className="flex flex-col gap-4 items-start mb-6">
            <div className="flex items-center h-6 w-full">
              <Link href={"/signup"} className=" w-full text-right text-purple-500 underline-offset-2 underline">Create a account</Link>
            </div>
            <div className="flex items-center h-6 w-full">
              <Link href={"/login/forget_password"} className=" w-full text-right text-red-500 underline-offset-2 underline">Forget Password?</Link>
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Page;

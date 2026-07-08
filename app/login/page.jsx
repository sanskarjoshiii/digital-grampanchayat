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
    <div className="min-h-[100vh] w-full bg-cream flex flex-col justify-center items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="ds-card w-full max-w-sm px-8 py-10"
      >
        <div className="mb-8">
          <LoginBanner />
        </div>
        <h1 className="w-full text-center font-semibold text-xl mb-6 text-ink">
          Login to your account
        </h1>
        <div className="mb-4">
          <label htmlFor="email" className="ds-label">
            Your email
          </label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            id="email"
            className="ds-input"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="ds-label">
            Your password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              placeholder="Enter password"
              className="ds-input pr-10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mb-6 text-sm">
          <Link
            href={"/signup"}
            className="text-ink font-medium hover:underline underline-offset-2"
          >
            Create account
          </Link>
          <Link
            href={"/login/forget_password"}
            className="text-muted hover:text-ink hover:underline underline-offset-2"
          >
            Forgot password?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Page;

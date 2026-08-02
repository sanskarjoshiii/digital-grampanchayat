"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import { pick } from "../utils/language";
import LoginBanner from "../component/LoginBanner";
import { useEdgeStore } from "@/lib/edgestore";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Using react-icons for eye icons

const Page = () => {

  const router = useRouter();
  const [userData, setUserData] = useState({ email: "", password: ""});
  const [showPassword, setShowPassword] = useState(false);

  const {getUserData,setLoader,language}=useGlobalContext();
  const t = (strings) => pick(language, strings);
  // EdgeStore resolves the upload context once when the provider mounts. After
  // logging in we ask it to resolve again, otherwise a context cached while
  // signed out keeps rejecting this account's uploads.
  const { reset: resetEdgeStore } = useEdgeStore();
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
      toast.success(t({ en: "Logged in", mr: "लॉग इन झाले", hi: "लॉग इन हो गया" }));
      localStorage.setItem("email",userData.email)
      await resetEdgeStore().catch(() => {});
      getUserData();
      router.push("/")
    }
    else{
      toast.error(t({ en: "Wrong email or password", mr: "ईमेल किंवा पासवर्ड चुकीचा आहे", hi: "ईमेल या पासवर्ड ग़लत है" }))

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
          {t({
            en: "Login to your account",
            mr: "तुमच्या खात्यात लॉग इन करा",
            hi: "अपने खाते में लॉग इन करें",
          })}
        </h1>
        <div className="mb-4">
          <label htmlFor="email" className="ds-label">
            {t({ en: "Your email", mr: "तुमचा ईमेल", hi: "आपका ईमेल" })}
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
            {t({ en: "Your password", mr: "तुमचा पासवर्ड", hi: "आपका पासवर्ड" })}
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              placeholder={t({ en: "Enter password", mr: "पासवर्ड टाका", hi: "पासवर्ड डालें" })}
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
            {t({ en: "Create account", mr: "नवीन खाते काढा", hi: "नया खाता बनाएँ" })}
          </Link>
          <Link
            href={"/login/forget_password"}
            className="text-muted hover:text-ink hover:underline underline-offset-2"
          >
            {t({ en: "Forgot password?", mr: "पासवर्ड विसरलात?", hi: "पासवर्ड भूल गए?" })}
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full">
          {t({ en: "Login", mr: "लॉग इन करा", hi: "लॉग इन करें" })}
        </button>
      </form>
    </div>
  );
};

export default Page;

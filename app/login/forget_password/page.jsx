"use client";
import { useGlobalContext } from "@/app/context/context";
import { pick } from "@/app/utils/language";
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
  const { setLoader, language } = useGlobalContext();
  const t = (strings) => pick(language, strings);
  const handleOtp = async () => {
    if (userData.email == "") {
      return toast.error(t({ en: "Enter a valid email", mr: "योग्य ईमेल टाका", hi: "सही ईमेल डालें" }));
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
      toast.success(t({ en: "OTP sent to your email", mr: "तुमच्या ईमेलवर OTP पाठवला", hi: "आपके ईमेल पर OTP भेजा गया" }));
      setOtp(true);
    } else {
      toast.error(t({ en: "Enter a valid email", mr: "योग्य ईमेल टाका", hi: "सही ईमेल डालें" }));
    }
    setLoader(false);
  };
  const handleChangePassword = async()=>{
try {
    if (userData.email == "") {
        return toast.error(t({ en: "Enter a valid email", mr: "योग्य ईमेल टाका", hi: "सही ईमेल डालें" }));
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
        toast.success(t({ en: "Password changed — please log in", mr: "पासवर्ड बदलला — आता लॉग इन करा", hi: "पासवर्ड बदल गया — अब लॉग इन करें" }));
        setOtp(true);
      } else {
        toast.error(t({ en: "Wrong OTP", mr: "OTP चुकीचा आहे", hi: "OTP ग़लत है" }));
      }
      setLoader(false);
} catch (error) {
    toast.error(t({ en: "Check your internet connection", mr: "इंटरनेट तपासा", hi: "इंटरनेट जाँचें" }));

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
          {t({ en: "Forgot password", mr: "पासवर्ड विसरलात", hi: "पासवर्ड भूल गए" })}
        </h1>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="ds-label"
          >
            {t({ en: "Your email", mr: "तुमचा ईमेल", hi: "आपका ईमेल" })}
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
              {t({ en: "Your OTP", mr: "तुमचा OTP", hi: "आपका OTP" })}
            </label>
            <input
              type="number"
              id="otp"
              onChange={(e) =>
                setUserData({ ...userData, otp: e.target.value })
              }
              className="ds-input"
              placeholder={t({ en: "Enter OTP", mr: "OTP टाका", hi: "OTP डालें" })}
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
              {t({ en: "New password", mr: "नवीन पासवर्ड", hi: "नया पासवर्ड" })}
            </label>
            <input
              type="password"
              id="passowrd"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              className="ds-input"
              placeholder={t({ en: "Enter new password", mr: "नवीन पासवर्ड टाका", hi: "नया पासवर्ड डालें" })}
              required
            />
          </div>
        )}
        <button className="btn-primary w-full">
          {otp ? t({ en: "Change password", mr: "पासवर्ड बदला", hi: "पासवर्ड बदलें" }) : t({ en: "Send OTP", mr: "OTP पाठवा", hi: "OTP भेजें" })}
        </button>
      </form>
    </div>
  );
};

export default Page;

"use client"
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import LoginBanner from "../component/LoginBanner";
import { useGlobalContext } from "../context/context";

const Page = () => {
  const [openModal,setOpenModal]=useState(false);
  const router = useRouter();
  const [otp,setOtp]=useState("")
  const {setLoader}=useGlobalContext()
  const [userData, setUserData] = useState({ email: "", password: "",name:"" });
  const handleOtp =async () => {
    if(userData.email==""){
      return toast.error("Enter a valid email")
    }
    setLoader(true)
    const response = await fetch('/api/user/otp', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email:userData.email })
  });
if(response.status==200){
  toast.success("Otp Send Successfully");
  setOpenModal(true)
}
else{
  const res = await response.json().catch(() => ({}));
  toast.error(res.message || "Could not send OTP. Please try again.")
}
setLoader(false)
  };
  const handleSubmit = async() => {
    if(userData.email==""){
      return toast.error("Enter a valid email")
    }
    if(userData.password==""){
      return toast.error("Enter a valid password")
    }
    if(userData.name=="" && userData.name.length<3){
      return toast.error("Enter a valid name or name length must be greater than 2")
    }
    setLoader(true)
    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email:userData.email,password:userData.password,name:userData.name,otp:otp })
  });
  const res= await response.json();
if(response.status==200){
  toast.success("Account Created Successfully");
  localStorage.setItem("email",userData.email);
  router.push("/")
}
else{
  toast.error(res.message)
}
setLoader(false)
  };

  return (
    <div className="min-h-[100vh] w-full bg-cream flex flex-col justify-center items-center px-4 py-10">
      <div className="ds-card w-full max-w-sm px-8 py-10">
        <div className="mb-8">
          <LoginBanner />
        </div>
        <h1 className="w-full text-center font-semibold text-xl mb-6 text-ink">
          Create your account
        </h1>
        <div className="mb-4">
          <label htmlFor="name" className="ds-label">
            Your name
          </label>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="ds-input"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="ds-label">
            Your email
          </label>
          <input
            type="email"
            id="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="ds-input"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="ds-label">
            Your password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            id="password"
            className="ds-input"
            required
          />
        </div>
        {openModal && (
          <div className="mb-4">
            <label htmlFor="otp" className="ds-label">
              Your OTP
            </label>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              id="otp"
              className="ds-input"
              required
            />
          </div>
        )}
        <div className="flex items-center justify-end mb-6 text-sm">
          <Link
            href={"/login"}
            className="text-ink font-medium hover:underline underline-offset-2"
          >
            Already have an account?
          </Link>
        </div>
        {openModal == false ? (
          <button onClick={handleOtp} className="btn-primary w-full">
            Send OTP
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary w-full">
            Create account
          </button>
        )}
      </div>
    </div>
  );
};

export default Page;

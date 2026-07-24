"use client"
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import LoginBanner from "../component/LoginBanner";
import { useGlobalContext } from "../context/context";
import { useEdgeStore } from "@/lib/edgestore";

const Page = () => {
  const [openModal,setOpenModal]=useState(false);
  const router = useRouter();
  const [otp,setOtp]=useState("")
  const {setLoader}=useGlobalContext()
  const { edgestore } = useEdgeStore();
  const [userData, setUserData] = useState({ email: "", password: "", username: "", name:"", profile: "" });
  const [usernameStatus, setUsernameStatus] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const checkUsername = async () => {
    const username = userData.username.trim().toLowerCase();
    if (!username) return setUsernameStatus("");
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return setUsernameStatus("Use 3–20 lowercase letters, numbers, or underscores.");
    try {
      const response = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameStatus(data.available ? "Available" : "This username is already taken.");
    } catch { setUsernameStatus("Could not check username right now."); }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const result = await edgestore.publicFiles.upload({ file });
      setUserData({ ...userData, profile: result.url });
      toast.success("Profile photo added");
    } catch { toast.error("Could not upload profile photo"); }
    setUploadingPhoto(false);
  };
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
    if(!/^[a-z0-9_]{3,20}$/.test(userData.username.trim().toLowerCase())){
      return toast.error("Choose a valid username first")
    }
    if(usernameStatus !== "Available"){
      return toast.error("Please choose an available username")
    }
    if(userData.name=="" || userData.name.length<3){
      return toast.error("Enter a valid name or name length must be greater than 2")
    }
    setLoader(true)
    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email:userData.email,password:userData.password,username:userData.username,name:userData.name,profile:userData.profile,otp:otp })
  });
  const res= await response.json();
if(response.status==200){
  toast.success("Account created — please log in");
  router.push("/login")
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
        <div className="mb-6 flex flex-col items-center gap-2">
          <label htmlFor="profile" className="group relative cursor-pointer">
            <img src={userData.profile || "/merilogo.png"} alt="Profile preview" className="h-20 w-20 rounded-full border border-line object-cover" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/50 px-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">{uploadingPhoto ? "Uploading…" : "Add photo"}</span>
          </label>
          <input id="profile" type="file" accept="image/*" className="hidden" onChange={uploadPhoto} disabled={uploadingPhoto} />
          <p className="text-xs text-muted">Profile photo is optional</p>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="ds-label">
            Unique username
          </label>
          <input
            type="text"
            id="username"
            value={userData.username}
            onChange={(e) => { setUserData({ ...userData, username: e.target.value.toLowerCase().replace(/\s/g, "") }); setUsernameStatus(""); }}
            onBlur={checkUsername}
            className="ds-input"
            placeholder="e.g. ramesh_patil"
            required
          />
          {usernameStatus && <p className={`mt-1 text-xs ${usernameStatus === "Available" ? "text-green-700" : "text-red-700"}`}>{usernameStatus}</p>}
        </div>
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

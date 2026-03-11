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
  toast.error("Enter a valid email")
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
    <>
     
      <div className="flex flex-col justify-center items-center w-full h-auto">
<LoginBanner/>
        <div className="max-w-sm mx-auto box-shadow w-[auto] h-[auto] px-10 py-16">
          <h1 className="w-full text-center h-8 font-semibold text-xl mb-6">
            Create your account
          </h1>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
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
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
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
            <input
              type="password"
              placeholder="Enter password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
        {openModal &&  <div className="mb-5">
            <label
              htmlFor="otp"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Your Otp
                          </label>
            <input
              type="number"
              placeholder="Enter Otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value )
              }
              id="otp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>}
          <div className="flex items-start mb-6">
            <div className="flex items-center h-6 w-full">
              <Link
                href={"/login"}
                className=" w-full text-right text-blue-500 underline-offset-2 underline"
              >
                Already has a account?
              </Link>
            </div>
          </div>
         {openModal==false ? <button
          onClick={handleOtp}
            
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Send Otp
          </button>
          :
          <button
          onClick={handleSubmit}
            
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create
          </button>
          
          }
        </div>
      </div>
    </>
  );
};

export default Page;

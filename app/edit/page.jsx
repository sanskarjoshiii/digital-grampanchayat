"use client";
import React, { useState } from "react";
import { useGlobalContext } from "../context/context";

const Page = () => {
  const { userData, handleUserData, updateUser, setOpenSidebar } =
    useGlobalContext();
  const handlePic = async (e) => {
    const filedata = e.target.files?.[0];
    if (!filedata) return;

    const formData = new FormData();
    formData.append("file", filedata);
    formData.append("upload_preset", "gsceswka");
    formData.append("cloud_name", "dge7wv4zo");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dge7wv4zo/image/upload",
        {
          method: "post",
          body: formData,
        }
      );
      const result = await res.json();
      handleUserData("profile", result.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-[83vh] overflow bg-green-400 flex flex-row items-center justify-center"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="w-[60%] h-auto px-4 py-10 flex flex-col justify-center">
        <div className="mb-5 flex flex-row items-center justify-center">
          <h2 className="text-2xl font-medium">Profile</h2>
        </div>
        <div className="mb-5 flex flex-row items-center justify-center">
          <label htmlFor="uploadimg">
            <img
              src={userData.profile==""?"/merilogo.png":userData.profile}
              width={70}
              className="bg-white h-[10vh] box-shadow"
              style={{borderRadius:"50%"}}
            />
          </label>
          <input
            onChange={handlePic}
            hidden
            id="uploadimg"
            type="file"
            accept="image/*"
          />
        </div>

        <div>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Name
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={handleUserData}
              id="name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="phoneNo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
            >
              Phone
            </label>
            <input
              type="number"
              value={userData.phoneNo}
              onChange={handleUserData}
              id="phoneNo"
              name="phoneNo"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <button
            onClick={updateUser}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
//

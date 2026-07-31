"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { useGlobalContext } from "../context/context";

const Page = () => {
  const { userData, handleUserData, updateUser, setOpenSidebar } =
    useGlobalContext();
  const { edgestore } = useEdgeStore();

  // Was posting straight to Cloudinary with the cloud name and unsigned preset
  // hardcoded in this file, which is a second storage account nobody watches
  // and an open upload endpoint. Profile photos now go to the same bucket the
  // rest of the app uses.
  const handlePic = async (e) => {
    const filedata = e.target.files?.[0];
    if (!filedata) return;

    try {
      const result = await edgestore.profileImages.upload({ file: filedata });
      handleUserData("profile", result.url);
    } catch (error) {
      toast.error("Could not upload profile photo");
      console.log(error);
    }
  };

  return (
    <div
      className="w-full min-h-[91vh] bg-cream flex flex-row items-center justify-center px-4 py-10"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="ds-card w-full max-w-md px-8 py-10">
        <h2 className="text-2xl font-semibold text-ink text-center mb-6">
          Profile
        </h2>
        <div className="mb-6 flex flex-col items-center gap-2">
          <label htmlFor="uploadimg" className="cursor-pointer relative group">
            <img
              src={!userData.profile ? "/panchayatx-logo.png" : userData.profile}
              width={84}
              height={84}
              className="bg-paper h-[84px] w-[84px] object-cover rounded-full border border-line"
              alt="profile"
            />
            <span className="absolute inset-0 rounded-full bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
              Change
            </span>
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
          <div className="mb-4">
            <label htmlFor="name" className="ds-label">
              Name
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={handleUserData}
              id="name"
              name="name"
              className="ds-input"
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phoneNo" className="ds-label">
              Phone
            </label>
            <input
              type="number"
              value={userData.phoneNo}
              onChange={handleUserData}
              id="phoneNo"
              name="phoneNo"
              className="ds-input"
              placeholder="Your phone number"
              required
            />
          </div>
          <button onClick={updateUser} type="submit" className="btn-primary w-full">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
//

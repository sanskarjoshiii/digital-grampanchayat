"use client"
import React, { useContext } from "react";
import { AppContext, useGlobalContext } from "../context/context";
import Name from "./Name";

const Header = () => {
  const {toggleSidebar,language,setLanguage}=useGlobalContext();
  return (
    <div className="w-full h-[10vh]  bg-white-500 border-2 flex  justify-between items-center">
      <div className="w-[30%] h-full flex flex-row items-center justify-start px-2">
        <img
        onClick={toggleSidebar}
          width="30"
          className="cursor-pointer"
          height="30"
          src="https://img.icons8.com/ios-filled/50/menu--v1.png"
          alt="menu--v1"
        />
      </div>
      <div className="w-full flex flex-row gap-2">
        <img src="/merilogo.png" width={40} />
        <div className="flex flex-col line-0 gap-0">
          <Name breaks={true}/>
        </div>
      </div>
      <div className="w-[20%] h-auto">
        <select className="w-[10vh]   p-1 mr-[4vh] border-2 border-gray-300 my-1" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value={"english"}>English</option>
          <option value={"marathi"}>Hindi</option>
        </select>
      </div>
    </div>
  );
};

export default Header;

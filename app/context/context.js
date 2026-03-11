//create a context
"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

//provider needed
export const AppProvider = ({ children }) => {
  const router = useRouter();
  //defining login

  //logic for loader
  const [language, setLanguage] = useState("english");

  const [loader, setLoader] = useState(false);

  //logic for sidebar
  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(true);
  };

  //user data modification login
  const [userData, setUserData] = useState({
    email: "",
    phoneNo: "",
    name: "",
    profile: "",
  });

  const handleUserData = (e, profile) => {
    if (e == "profile") {
      setUserData({ ...userData, profile: profile });
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };
  //to get user current data
  const getUserData = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    });
    if (response.status == 200) {
      const res = await response.json();
      console.log(res);
      setUserData(res);
    } else {
      // toast.error("check your internet connection")
      // router.push("/login")
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  const updateUser = async () => {
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        phoneNo: userData.phoneNo,
        profile: userData.profile,
        name: userData.name,
      }),
    });
    if (response.status == 200) {
      const res = await response.json();
      toast.success("Update Successfullly");
      router.push("/");
      getUserData();
    } else {
      toast.error("Check your internet connection");
    }
  };

  return (
    <AppContext.Provider
      value={{
        handleUserData,
        updateUser,
        userData,
        toggleSidebar,
        getUserData,
        openSidebar,
        setOpenSidebar,
        setUserData,
        setLoader,
        loader,
        setLanguage,
        language,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
//consumer implementation

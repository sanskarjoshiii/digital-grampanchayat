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
  const emptyUser = { email: "", phoneNo: "", name: "", profile: "" };

  // Ask the server who this browser is, using the signed session cookie rather
  // than the email in localStorage. localStorage outlives the cookie, so
  // trusting it left the UI looking signed in while uploads were rejected as
  // anonymous — with a misleading "check your connection" error.
  const getUserData = async () => {
    let response;
    try {
      response = await fetch("/api/user/session");
    } catch {
      return; // Offline — keep whatever is on screen rather than signing out.
    }
    if (response.status === 503) return; // Server-side problem, not a logout.

    const result = await response.json().catch(() => ({}));

    if (result.authenticated) {
      setUserData(result.user);
      localStorage.setItem("email", result.user.email);
      return;
    }

    // No valid session. If the browser still believed it was logged in, say so
    // plainly instead of letting the next action fail for no visible reason.
    if (localStorage.getItem("email")) {
      localStorage.removeItem("email");
      toast("Your session has ended — please log in again", { icon: "🔒" });
    }
    setUserData(emptyUser);
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

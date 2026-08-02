//create a context
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LANGUAGE_STORAGE_KEY, LANGUAGE_VALUES } from "../utils/language";

export const AppContext = createContext();

//provider needed
export const AppProvider = ({ children }) => {
  //defining login

  //logic for loader
  // Remembered across visits: a Marathi reader should not have to switch the
  // site back to Marathi every time they open a page.
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (LANGUAGE_VALUES.includes(saved)) setLanguage(saved);
  }, []);

  const chooseLanguage = (value) => {
    if (!LANGUAGE_VALUES.includes(value)) return;
    setLanguage(value);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  };

  const [loader, setLoader] = useState(false);

  //logic for sidebar
  const [openSidebar, setOpenSidebar] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebar(true);
  };

  //user data modification login
  const emptyUser = { email: "", phoneNo: "", name: "", profile: "" };
  const [userData, setUserData] = useState(emptyUser);

  // Ask the server who this browser is, using the signed session cookie rather
  // than the email in localStorage. localStorage outlives the cookie, so
  // trusting it left the UI looking signed in while uploads were rejected as
  // anonymous, with a misleading "check your connection" error.
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

  return (
    <AppContext.Provider
      value={{
        userData,
        toggleSidebar,
        getUserData,
        openSidebar,
        setOpenSidebar,
        setUserData,
        setLoader,
        loader,
        setLanguage: chooseLanguage,
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

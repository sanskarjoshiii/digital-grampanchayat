"use client"
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import LoginBanner from "../component/LoginBanner";
import { useGlobalContext } from "../context/context";
import { useEdgeStore } from "@/lib/edgestore";
import { avatarSrc } from "../utils/avatar";
import { pick } from "../utils/language";
import { shrinkImage, readableSize } from "../utils/image";
import { DEFAULT_PANCHAYAT } from "../config/panchayat";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Page = () => {
  const [openModal,setOpenModal]=useState(false);
  const router = useRouter();
  const [otp,setOtp]=useState("")
  const {setLoader,language}=useGlobalContext()
  const t = (strings) => pick(language, strings);
  const { edgestore } = useEdgeStore();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
    profile: "",
    // Pre-filled today because the site serves one village. Kept as real
    // fields so that adding a second Panchayat later is a data change, not a
    // rewrite of the signup flow.
    village: DEFAULT_PANCHAYAT.village,
    district: DEFAULT_PANCHAYAT.district,
    state: DEFAULT_PANCHAYAT.state,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const checkUsername = async () => {
    const username = userData.username.trim().toLowerCase();
    if (!username) return setUsernameStatus("");
    if (!/^[a-z0-9_]{3,20}$/.test(username)) return setUsernameStatus(t({ en: "Use 3–20 lowercase letters, numbers, or underscores.", mr: "3 ते 20 लहान अक्षरे, अंक किंवा अंडरस्कोर वापरा.", hi: "3 से 20 छोटे अक्षर, अंक या अंडरस्कोर लिखें." }));
    try {
      const response = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameStatus(data.available ? t({ en: "Available", mr: "उपलब्ध आहे", hi: "उपलब्ध है" }) : t({ en: "This username is already taken.", mr: "हे वापरकर्तानाव आधीच घेतले आहे.", hi: "यह उपयोगकर्ता नाम पहले से लिया गया है." }));
    } catch { setUsernameStatus(t({ en: "Could not check username right now.", mr: "आत्ता तपासता आले नाही.", hi: "अभी जाँच नहीं हो सकी." })); }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      // profileImages: the only bucket that accepts an upload without a session,
      // because the account does not exist yet at this point in signup.
      const result = await edgestore.profileImages.upload({ file });
      setUserData({ ...userData, profile: result.url });
      toast.success(t({ en: "Profile photo added", mr: "फोटो जोडला", hi: "फ़ोटो जोड़ी गई" }));
    } catch { toast.error(t({ en: "Could not upload profile photo", mr: "फोटो चढवता आला नाही", hi: "फ़ोटो अपलोड नहीं हो सकी" })); }
    setUploadingPhoto(false);
  };
  const handleOtp =async () => {
    if(userData.email==""){
      return toast.error(t({ en: "Enter a valid email", mr: "योग्य ईमेल टाका", hi: "सही ईमेल डालें" }))
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
  toast.success(t({ en: "OTP sent to your email", mr: "तुमच्या ईमेलवर OTP पाठवला", hi: "आपके ईमेल पर OTP भेजा गया" }));
  setOpenModal(true)
}
else{
  const res = await response.json().catch(() => ({}));
  toast.error(res.message || t({ en: "Could not send OTP. Please try again.", mr: "OTP पाठवता आला नाही. पुन्हा प्रयत्न करा.", hi: "OTP नहीं भेजा जा सका। फिर कोशिश करें।" }))
}
setLoader(false)
  };
  const handleSubmit = async() => {
    if(userData.email==""){
      return toast.error(t({ en: "Enter a valid email", mr: "योग्य ईमेल टाका", hi: "सही ईमेल डालें" }))
    }
    if(userData.password==""){
      return toast.error(t({ en: "Enter a valid password", mr: "योग्य पासवर्ड टाका", hi: "सही पासवर्ड डालें" }))
    }
    if(userData.password.length < 6){
      return toast.error(t({ en: "Password must be at least 6 characters", mr: "पासवर्ड किमान 6 अक्षरांचा हवा", hi: "पासवर्ड कम से कम 6 अक्षर का हो" }))
    }
    if(userData.password !== confirmPassword){
      return toast.error(t({ en: "The two passwords do not match", mr: "दोन्ही पासवर्ड जुळत नाहीत", hi: "दोनों पासवर्ड मेल नहीं खाते" }))
    }
    if(!/^[a-z0-9_]{3,20}$/.test(userData.username.trim().toLowerCase())){
      return toast.error(t({ en: "Choose a valid username first", mr: "आधी योग्य वापरकर्तानाव निवडा", hi: "पहले सही उपयोगकर्ता नाम चुनें" }))
    }
    if(usernameStatus !== "Available"){
      return toast.error(t({ en: "Please choose an available username", mr: "उपलब्ध असलेले वापरकर्तानाव निवडा", hi: "उपलब्ध उपयोगकर्ता नाम चुनें" }))
    }
    if(userData.name=="" || userData.name.length<3){
      return toast.error(t({ en: "Enter your name — at least 3 letters", mr: "तुमचे नाव टाका — किमान 3 अक्षरे", hi: "अपना नाम डालें — कम से कम 3 अक्षर" }))
    }
    setLoader(true)
    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email:userData.email,password:userData.password,username:userData.username,name:userData.name,profile:userData.profile,otp:otp,village:userData.village,district:userData.district,state:userData.state })
  });
  const res= await response.json();
if(response.status==200){
  toast.success(t({ en: "Account created — please log in", mr: "खाते तयार झाले — आता लॉग इन करा", hi: "खाता बन गया — अब लॉग इन करें" }));
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
          {t({ en: "Create your account", mr: "तुमचे खाते काढा", hi: "अपना खाता बनाएँ" })}
        </h1>
        <div className="mb-6 flex flex-col items-center gap-2">
          <label htmlFor="profile" className="group relative cursor-pointer">
            <img src={avatarSrc(userData.profile)} alt="Profile preview" className="h-20 w-20 rounded-full border border-line object-cover" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/50 px-2 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">{uploadingPhoto ? t({ en: "Uploading…", mr: "चढवत आहे…", hi: "अपलोड हो रहा है…" }) : t({ en: "Add photo", mr: "फोटो जोडा", hi: "फ़ोटो जोड़ें" })}</span>
          </label>
          <input id="profile" type="file" accept="image/*" className="hidden" onChange={uploadPhoto} disabled={uploadingPhoto} />
          <p className="text-xs text-muted">{t({ en: "Profile photo is optional", mr: "फोटो ऐच्छिक आहे", hi: "फ़ोटो वैकल्पिक है" })}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="ds-label">
            {t({ en: "Unique username", mr: "वेगळे वापरकर्तानाव", hi: "अलग उपयोगकर्ता नाम" })}
          </label>
          <input
            type="text"
            id="username"
            value={userData.username}
            onChange={(e) => { setUserData({ ...userData, username: e.target.value.toLowerCase().replace(/\s/g, "") }); setUsernameStatus(""); }}
            onBlur={checkUsername}
            className="ds-input"
            placeholder={t({ en: "e.g. ramesh_patil", mr: "उदा. ramesh_patil", hi: "जैसे ramesh_patil" })}
            required
          />
          {usernameStatus && <p className={`mt-1 text-xs ${usernameStatus === "Available" ? "text-green-700" : "text-red-700"}`}>{usernameStatus}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="ds-label">
            {t({ en: "Your name", mr: "तुमचे नाव", hi: "आपका नाम" })}
          </label>
          <input
            type="text"
            id="name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="ds-input"
            placeholder={t({ en: "Enter your name", mr: "तुमचे नाव टाका", hi: "अपना नाम डालें" })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="ds-label">
            {t({ en: "Your email", mr: "तुमचा ईमेल", hi: "आपका ईमेल" })}
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
            {t({ en: "Your password", mr: "तुमचा पासवर्ड", hi: "आपका पासवर्ड" })}
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t({ en: "Enter password", mr: "पासवर्ड टाका", hi: "पासवर्ड डालें" })}
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              id="password"
              className="ds-input pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted"
              aria-label={t({ en: "Show password", mr: "पासवर्ड दाखवा", hi: "पासवर्ड दिखाएँ" })}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="ds-label">
            {t({ en: "Re-enter password", mr: "पासवर्ड पुन्हा टाका", hi: "पासवर्ड दोबारा डालें" })}
          </label>
          <div className="relative w-full">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder={t({ en: "Type the same password again", mr: "तोच पासवर्ड पुन्हा टाका", hi: "वही पासवर्ड दोबारा डालें" })}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
              className="ds-input pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted"
              aria-label={t({ en: "Show password", mr: "पासवर्ड दाखवा", hi: "पासवर्ड दिखाएँ" })}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Say it as they type, not only when they press the button. */}
          {confirmPassword && userData.password !== confirmPassword && (
            <p className="mt-1 text-xs text-red-700">
              {t({ en: "The two passwords do not match", mr: "दोन्ही पासवर्ड जुळत नाहीत", hi: "दोनों पासवर्ड मेल नहीं खाते" })}
            </p>
          )}
        </div>

        {/* Which Panchayat this account belongs to. */}
        <div className="mb-4 rounded-lg border border-line bg-cream px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {t({ en: "Your Gram Panchayat", mr: "तुमची ग्रामपंचायत", hi: "आपकी ग्राम पंचायत" })}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { key: "village", en: "Village", mr: "गाव", hi: "गाँव" },
              { key: "district", en: "District", mr: "जिल्हा", hi: "ज़िला" },
              { key: "state", en: "State", mr: "राज्य", hi: "राज्य" },
            ].map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-[10px] text-muted">
                  {t(field)}
                </label>
                <input
                  id={field.key}
                  value={userData[field.key]}
                  readOnly
                  className="ds-input mt-0.5 cursor-not-allowed bg-mist px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[10px] leading-4 text-muted">
            {t({
              en: "PanchayatX currently serves this village. More Panchayats will be selectable here as they join.",
              mr: "सध्या PanchayatX याच गावासाठी आहे. पुढे इतर ग्रामपंचायती जोडल्यावर त्या इथे निवडता येतील.",
              hi: "फ़िलहाल PanchayatX इसी गाँव के लिए है। आगे और ग्राम पंचायतें जुड़ने पर यहाँ चुनी जा सकेंगी।",
            })}
          </p>
        </div>
        {openModal && (
          <div className="mb-4">
            <label htmlFor="otp" className="ds-label">
              {t({ en: "Your OTP", mr: "तुमचा OTP", hi: "आपका OTP" })}
            </label>
            <input
              type="number"
              placeholder={t({ en: "Enter OTP", mr: "OTP टाका", hi: "OTP डालें" })}
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
            {t({ en: "Already have an account?", mr: "आधीच खाते आहे?", hi: "पहले से खाता है?" })}
          </Link>
        </div>
        {openModal == false ? (
          <button onClick={handleOtp} className="btn-primary w-full">
            {t({ en: "Send OTP", mr: "OTP पाठवा", hi: "OTP भेजें" })}
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary w-full">
            {t({ en: "Create account", mr: "खाते काढा", hi: "खाता बनाएँ" })}
          </button>
        )}
      </div>
    </div>
  );
};

export default Page;

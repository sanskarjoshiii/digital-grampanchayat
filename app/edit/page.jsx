"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { useGlobalContext } from "../context/context";
import { avatarSrc } from "../utils/avatar";
import { pick } from "../utils/language";
import { shrinkImage, readableSize } from "../utils/image";
import { DEFAULT_PANCHAYAT } from "../config/panchayat";

const Page = () => {
  const { userData, setUserData, getUserData, setOpenSidebar, language } = useGlobalContext();
  const { edgestore, reset: resetEdgeStore } = useEdgeStore();
  const t = (strings) => pick(language, strings);

  const [form, setForm] = useState({
    name: "",
    phoneNo: "",
    username: "",
    email: "",
    profile: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fill the form once the session has loaded the account.
  useEffect(() => {
    setForm({
      name: userData?.name || "",
      phoneNo: userData?.phoneNo || "",
      username: userData?.username || "",
      email: userData?.email || "",
      profile: userData?.profile || "",
    });
  }, [userData?.email, userData?.name, userData?.phoneNo, userData?.username, userData?.profile]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handlePic = async (event) => {
    const original = event.target.files?.[0];
    event.target.value = "";
    if (!original) return;

    setUploading(true);
    try {
      // Shrink first: a phone photo is routinely 4–9 MB, over the bucket's
      // 5 MB limit, and costs a villager that much mobile data for an image
      // shown at 84 pixels.
      const file = await shrinkImage(original);
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(
          t({
            en: `That picture is ${readableSize(file.size)}. Please choose one under 5 MB.`,
            mr: `हा फोटो ${readableSize(file.size)} आहे. कृपया 5 MB पेक्षा लहान निवडा.`,
            hi: `यह फ़ोटो ${readableSize(file.size)} है। कृपया 5 MB से छोटी चुनें।`,
          })
        );
      }
      let result;
      try {
        result = await edgestore.profileImages.upload({ file });
      } catch {
        await resetEdgeStore().catch(() => {});
        result = await edgestore.profileImages.upload({ file });
      }
      set("profile", result.url);
      toast.success(t({ en: "Photo uploaded", mr: "फोटो चढवला", hi: "फ़ोटो अपलोड हुई" }));
    } catch (error) {
      toast.error(
        error?.message?.includes("MB")
          ? error.message
          : t({
              en: "Could not upload that photo. Check your connection and try again.",
              mr: "फोटो चढवता आला नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.",
              hi: "फ़ोटो अपलोड नहीं हो सकी। इंटरनेट जाँचकर फिर कोशिश करें।",
            })
      );
    }
    setUploading(false);
  };

  const save = async () => {
    if (!form.name.trim())
      return toast.error(t({ en: "Enter your name", mr: "तुमचे नाव टाका", hi: "अपना नाम डालें" }));
    setSaving(true);
    const response = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok)
      return toast.error(data.message || t({ en: "Could not save", mr: "जतन झाले नाही", hi: "सहेजा नहीं जा सका" }));

    setUserData((current) => ({ ...current, ...data.user }));
    if (data.emailChanged) localStorage.setItem("email", data.user.email);
    getUserData();
    toast.success(t({ en: "Profile updated", mr: "प्रोफाइल अपडेट झाली", hi: "प्रोफ़ाइल अपडेट हुई" }));
  };

  if (!userData?.email)
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-cream px-4 py-16">
        <div className="mx-auto max-w-md rounded-card border border-line bg-paper px-6 py-12 text-center">
          <h1 className="text-lg font-semibold text-ink">
            {t({ en: "Log in to see your profile", mr: "प्रोफाइल पाहण्यासाठी लॉग इन करा", hi: "प्रोफ़ाइल देखने के लिए लॉग इन करें" })}
          </h1>
          <Link href="/login" className="btn-primary mt-6 text-sm">
            {t({ en: "Log in", mr: "लॉग इन करा", hi: "लॉग इन करें" })}
          </Link>
        </div>
      </div>
    );

  const panchayat = [
    { label: t({ en: "Village", mr: "गाव", hi: "गाँव" }), value: userData.village || DEFAULT_PANCHAYAT.village },
    { label: t({ en: "District", mr: "जिल्हा", hi: "ज़िला" }), value: userData.district || DEFAULT_PANCHAYAT.district },
    { label: t({ en: "State", mr: "राज्य", hi: "राज्य" }), value: userData.state || DEFAULT_PANCHAYAT.state },
  ];

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-cream px-4 sm:px-6 lg:px-8 py-8 sm:py-10"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="ds-card mx-auto w-full max-w-md px-5 py-8 sm:px-8 sm:py-10">
        <h2 className="mb-6 text-center text-xl sm:text-2xl font-semibold text-ink">
          {t({ en: "Profile", mr: "प्रोफाइल", hi: "प्रोफ़ाइल" })}
        </h2>

        <div className="mb-6 flex flex-col items-center gap-2">
          <label htmlFor="uploadimg" className="group relative cursor-pointer">
            <img
              src={avatarSrc(form.profile)}
              width={84}
              height={84}
              className="h-[84px] w-[84px] rounded-full border border-line bg-paper object-cover"
              alt=""
            />
            {/* The spinner sits over the photo for as long as the upload runs,
                so nobody wonders whether their tap registered. */}
            {uploading ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/60">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/40 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {t({ en: "Change", mr: "बदला", hi: "बदलें" })}
              </span>
            )}
          </label>
          <input
            onChange={handlePic}
            hidden
            id="uploadimg"
            type="file"
            accept="image/*"
            disabled={uploading}
          />
          <p className="text-xs text-muted">
            {uploading
              ? t({ en: "Uploading your photo…", mr: "फोटो चढवत आहे…", hi: "फ़ोटो अपलोड हो रही है…" })
              : t({ en: "Tap the photo to change it", mr: "बदलण्यासाठी फोटोवर टॅप करा", hi: "बदलने के लिए फ़ोटो पर टैप करें" })}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="ds-label">
            {t({ en: "Name", mr: "नाव", hi: "नाम" })}
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="ds-input"
            placeholder={t({ en: "Your full name", mr: "तुमचे पूर्ण नाव", hi: "आपका पूरा नाम" })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="ds-label">
            {t({ en: "Username", mr: "वापरकर्तानाव", hi: "उपयोगकर्ता नाम" })}
          </label>
          <input
            id="username"
            value={form.username}
            onChange={(e) => set("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
            className="ds-input"
            placeholder="e.g. ramesh_patil"
          />
          <p className="mt-1 text-xs text-muted">
            {t({
              en: "Shown next to your comments. 3–20 lowercase letters, numbers or underscores.",
              mr: "तुमच्या टिप्पण्यांशेजारी दिसते. 3–20 लहान अक्षरे, अंक किंवा अंडरस्कोर.",
              hi: "आपकी टिप्पणियों के साथ दिखता है। 3–20 छोटे अक्षर, अंक या अंडरस्कोर।",
            })}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="ds-label">
            {t({ en: "Email", mr: "ईमेल", hi: "ईमेल" })}
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="ds-input"
            placeholder="name@gmail.com"
          />
          <p className="mt-1 text-xs text-muted">
            {t({
              en: "You log in with this address. Changing it changes your login.",
              mr: "याच पत्त्याने तुम्ही लॉग इन करता. तो बदलल्यास लॉग इनही बदलतो.",
              hi: "आप इसी पते से लॉग इन करते हैं। इसे बदलने पर लॉग इन भी बदलेगा।",
            })}
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNo" className="ds-label">
            {t({ en: "Mobile number", mr: "मोबाइल क्रमांक", hi: "मोबाइल नंबर" })}
          </label>
          <input
            id="phoneNo"
            inputMode="numeric"
            value={form.phoneNo}
            onChange={(e) => set("phoneNo", e.target.value.replace(/\D/g, ""))}
            className="ds-input"
            placeholder={t({ en: "Your mobile number", mr: "तुमचा मोबाइल क्रमांक", hi: "आपका मोबाइल नंबर" })}
          />
          <p className="mt-1 text-xs text-muted">
            {t({
              en: "Only the Panchayat office sees this, to reach you about a complaint.",
              mr: "हा फक्त पंचायत कार्यालयाला दिसतो, तक्रारीबाबत संपर्कासाठी.",
              hi: "यह केवल पंचायत कार्यालय देखता है, शिकायत के बारे में संपर्क के लिए।",
            })}
          </p>
        </div>

        {/* Which Panchayat this account belongs to. */}
        <div className="mb-6 rounded-lg border border-line bg-cream px-3 py-2.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {t({ en: "Your Gram Panchayat", mr: "तुमची ग्रामपंचायत", hi: "आपकी ग्राम पंचायत" })}
          </p>
          <dl className="mt-2 space-y-1">
            {panchayat.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 text-sm">
                <dt className="text-muted">{row.label}</dt>
                <dd className="font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-[10px] leading-4 text-muted">
            {t({
              en: "Set when you signed up. It will become changeable once more Panchayats join.",
              mr: "नोंदणीच्या वेळी ठरते. पुढे इतर ग्रामपंचायती जोडल्यावर हे बदलता येईल.",
              hi: "साइन अप के समय तय होता है। आगे और पंचायतें जुड़ने पर इसे बदला जा सकेगा।",
            })}
          </p>
        </div>

        <button onClick={save} disabled={saving || uploading} className="btn-primary w-full">
          {saving
            ? t({ en: "Saving…", mr: "जतन करत आहे…", hi: "सहेजा जा रहा है…" })
            : t({ en: "Save changes", mr: "बदल जतन करा", hi: "बदलाव सहेजें" })}
        </button>
      </div>
    </div>
  );
};

export default Page;

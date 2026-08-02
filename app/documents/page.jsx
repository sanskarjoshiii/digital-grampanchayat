"use client";
import React, { useEffect, useState } from "react";
import DocumentCard from "../component/DocumentCard";
import NoDataFound from "../component/NoDataFound";
import Link from "next/link";
import { useGlobalContext } from "../context/context";
import toast from "react-hot-toast";
import { pick } from "../utils/language";

const Page = () => {
  const [document, setDocument] = useState([]);
  const { setLoader,language ,userData} = useGlobalContext();
  const fetchData = async () => {
    setLoader(true);
    const data = await fetch("api/admin/document", {
      method: "get",
    });
    if (data.status == 200) {
      const res = await data.json();
      console.log(res);
      setDocument(res);
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const isAdmin = userData?.userType === "admin";

  const removeDocument = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    const response = await fetch("api/admin/document", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc._id }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return toast.error(payload.message || "Could not delete the document");
    }
    toast.success("Document deleted");
    // Drop it from the list rather than refetching, so the page does not flash.
    setDocument((current) => current.filter((item) => item._id !== doc._id));
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-paper flex flex-col items-center">
      {userData.userType == "admin" && (
        <Link
          href={"/documents/upload"}
          className="fixed bottom-8 right-8 z-40 btn-primary rounded-full w-14 h-14 p-0 text-2xl shadow-pop"
          aria-label="Upload document"
        >
          +
        </Link>
      )}
      {/* No page title or blurb: the section name is in the top nav and the
          explanation is in the help panel. */}
      {/* Guides for the documents villagers must obtain themselves, as opposed
          to the circulars the office publishes below. */}
      <div className="w-full max-w-3xl px-6 pt-8">
        <Link
          href="/documents/apply"
          className="flex items-center gap-4 rounded-card border border-line bg-cream p-5 transition-colors hover:bg-mist"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-paper">
            <img
              src="https://img.icons8.com/ios/50/1f1f1f/identification-documents.png"
              width={22}
              height={22}
              alt=""
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">
              {language == "english"
                ? "Need an Aadhaar, ration card or birth certificate?"
                : "आधार, राशन कार्ड या जन्म प्रमाणपत्र चाहिए?"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {language == "english"
                ? "Simple step-by-step guides, with the papers you need and official links."
                : "आसान चरण-दर-चरण मार्गदर्शन, ज़रूरी कागज़ों और आधिकारिक लिंक के साथ।"}
            </p>
          </div>
          <span className="shrink-0 text-xl text-muted">→</span>
        </Link>
      </div>

      {/* No overflow-y here: an inner scroll container inside a page that also
          scrolls is what produced the second scrollbar. The page scrolls, the
          sections do not. */}
      <div className="w-full flex flex-col items-center py-6">
        <h2 className="w-full max-w-3xl px-6 pb-2 text-sm font-medium uppercase tracking-wide text-muted">
          {language == "english" ? "Published by the office" : "कार्यालय द्वारा प्रकाशित"}
        </h2>
        {document.length == 0 && <NoDataFound />}
        {document.map((data) => (
          <DocumentCard
            key={data._id}
            data={data}
            isAdmin={isAdmin}
            onDelete={removeDocument}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

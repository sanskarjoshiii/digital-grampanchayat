"use client";

import { useGlobalContext } from "./context/context";
import Link from "next/link";
import {
  ENQUIRY_NUMBER,
  ENQUIRY_HOURS_EN,
  ENQUIRY_HOURS_HI,
} from "./config/panchayat";

export default function Home() {
  // Public landing — anyone can browse without logging in.
  const { setOpenSidebar, language } = useGlobalContext();

  const t =
    language == "english"
      ? {
          eyebrow: "Digital Gram Panchayat",
          welcome: "Welcome to",
          brand: "MeriPanchayat",
          tagline:
            "Transparent, accessible and paperless village governance — funds, documents and services, in one place.",
          cta: "Know more about us",
          funds: "Panchayat Funds",
          docs: "Documents",
          services: "Nearby Services",
          enquiryLabel: "Enquiry helpline",
          enquiryTitle: "Have a question about the Panchayat?",
          enquiryText:
            "Call the Panchayat office and our staff will help you with schemes, documents, funds or any village service.",
          callNow: "Call now",
          hours: ENQUIRY_HOURS_EN,
        }
      : {
          eyebrow: "डिजिटल ग्राम पंचायत",
          welcome: "आपका स्वागत है",
          brand: "मेरी पंचायत",
          tagline:
            "पारदर्शी, सुलभ और कागज़-रहित ग्राम शासन — निधि, दस्तऐवज और सेवाएँ, एक ही स्थान पर।",
          cta: "हमारे बारे में अधिक जानें",
          funds: "पंचायत निधि",
          docs: "दस्तऐवज",
          services: "जवळच्या सेवा",
          enquiryLabel: "पूछताछ हेल्पलाइन",
          enquiryTitle: "पंचायत के बारे में कोई प्रश्न है?",
          enquiryText:
            "पंचायत कार्यालय पर कॉल करें — योजनाएँ, दस्तऐवज, निधि या किसी भी ग्राम सेवा की जानकारी हमारे कर्मचारी देंगे।",
          callNow: "अभी कॉल करें",
          hours: ENQUIRY_HOURS_HI,
        };

  const quickLinks = [
    {
      title: t.funds,
      href: "/panchayat_funds",
      img: "https://img.icons8.com/ios/50/1f1f1f/coins--v1.png",
    },
    {
      title: t.docs,
      href: "/documents",
      img: "https://img.icons8.com/ios/50/1f1f1f/document--v1.png",
    },
    {
      title: t.services,
      href: "/nearby_services",
      img: "https://img.icons8.com/ios/50/1f1f1f/services--v1.png",
    },
  ];

  return (
    <div
      className="w-full min-h-[91vh] bg-paper px-4 sm:px-8 py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="ds-panel-cream px-6 sm:px-10 py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-wide text-muted mb-4">
            {t.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink leading-[1.1]">
            {t.welcome}
            <br />
            {t.brand}
          </h1>
          <p className="mt-5 max-w-xl text-muted text-base sm:text-lg">
            {t.tagline}
          </p>
          <Link href="/about" className="btn-primary mt-8 text-sm">
            {t.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {quickLinks.map((q, i) => (
            <Link
              key={i}
              href={q.href}
              className="ds-card p-5 flex flex-row items-center gap-4 hover:shadow-pop transition-shadow"
            >
              <div className="w-11 h-11 rounded-lg bg-mist border border-line flex items-center justify-center shrink-0">
                <img src={q.img} width={22} height={22} alt="" />
              </div>
              <span className="text-sm font-medium text-ink">{q.title}</span>
              <span className="ml-auto text-muted" aria-hidden>
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Enquiry helpline */}
        <div className="ds-panel-cream mt-6 px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {t.enquiryLabel}
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-ink mt-2">
              {t.enquiryTitle}
            </h2>
            <p className="text-sm text-muted mt-2 max-w-md">{t.enquiryText}</p>
            <p className="text-xs text-muted mt-3">{t.hours}</p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
            <a
              href={`tel:${ENQUIRY_NUMBER}`}
              className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold text-ink hover:text-black transition-colors"
            >
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/ios-filled/50/1f1f1f/phone.png"
                alt=""
              />
              {ENQUIRY_NUMBER}
            </a>
            <a href={`tel:${ENQUIRY_NUMBER}`} className="btn-primary text-sm">
              {t.callNow}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

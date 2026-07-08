"use client";

import { useGlobalContext } from "./context/context";
import Link from "next/link";

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
      </div>
    </div>
  );
}

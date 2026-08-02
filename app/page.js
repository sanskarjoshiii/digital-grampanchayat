"use client";

import { useGlobalContext } from "./context/context";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProjectIntro from "./component/ProjectIntro";
import { pick } from "./utils/language";

// Client-only and code-split: the demo and GSAP are fetched after the page is
// usable, never as part of the first load a villager pays for.
const HeroDemo = dynamic(() => import("./component/hero/HeroDemo"), { ssr: false });

export default function Home() {
  // Public landing — anyone can browse without logging in. This page is about
  // the project itself; everything specific to Chandgaon, including the links
  // into its records, lives on the About page.
  const { setOpenSidebar, language } = useGlobalContext();

  const t = {
    eyebrow: pick(language, {
      en: "Digital Gram Panchayat",
      mr: "डिजिटल ग्रामपंचायत",
      hi: "डिजिटल ग्राम पंचायत",
    }),
    welcome: pick(language, {
      en: "Welcome to",
      mr: "आपले स्वागत आहे",
      hi: "आपका स्वागत है",
    }),
    brand: "PanchayatX",
    tagline: pick(language, {
      en: "Transparent, accessible and paperless village governance — funds, documents and services, in one place.",
      mr: "पारदर्शक, सोपा आणि कागदाविना गावकारभार — निधी, कागदपत्रे आणि सेवा, सगळं एकाच ठिकाणी.",
      hi: "पारदर्शी, सुलभ और कागज़-रहित ग्राम शासन — निधि, दस्तऐवज और सेवाएँ, एक ही स्थान पर।",
    }),
    cta: pick(language, {
      en: "Go to my Panchayat",
      mr: "माझी पंचायत पाहा",
      hi: "मेरी पंचायत देखें",
    }),
  };

  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)] bg-paper px-4 sm:px-6 lg:px-8 py-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero — words on the left, the product showing itself on the right. */}
        <div className="ds-panel-cream px-5 py-9 sm:px-10 sm:py-14">
          <div className="grid items-center gap-0 lg:gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-muted mb-3 sm:mb-4">
                {t.eyebrow}
              </p>
              <h1 className="text-[26px] sm:text-4xl lg:text-5xl font-semibold text-ink leading-[1.15] sm:leading-[1.1]">
                {t.welcome}
                <br />
                {t.brand}
              </h1>
              <p className="mt-4 sm:mt-5 max-w-xl text-muted text-sm sm:text-base lg:text-lg">
                {t.tagline}
              </p>
              <Link href="/about" className="btn-primary mt-6 sm:mt-8 text-sm">
                {t.cta}
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Only from lg up: the demo needs the width, and below that a
                phone should not download GSAP at all. */}
            <div className="hidden lg:block">
              <HeroDemo />
            </div>
          </div>
        </div>

        {/* What the project is and why it exists. */}
        <ProjectIntro />
      </div>
    </div>
  );
}

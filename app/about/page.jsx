"use client";
import React from "react";
import AboutUsPara from "@/app/component/AboutUsPara";
import VillageInfo from "@/app/component/VillageInfo";
import PanchayatTeam from "@/app/component/PanchayatTeam";
import Footer from "@/app/component/Footer";
import { useGlobalContext } from "@/app/context/context";

const Page = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  return (
    <div className="w-full min-h-[91vh] bg-paper pb-6">
      {/* Hero */}
      <section className="w-full bg-cream">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-xs uppercase tracking-wide text-muted">
            {en ? "Digital Gram Panchayat" : "डिजिटल ग्राम पंचायत"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink mt-3 leading-tight">
            {en ? "Chandgaon Gram Panchayat" : "चांदगांव ग्राम पंचायत"}
          </h1>
          <p className="text-muted mt-4 max-w-xl mx-auto">
            {en
              ? "A progressive rural body bringing transparent, accessible and paperless governance to every resident."
              : "पारदर्शी, सुलभ और कागज़-रहित शासन को हर नागरिक तक पहुँचाने वाली एक प्रगतिशील ग्रामीण संस्था।"}
          </p>
        </div>
      </section>

      <div className="pt-12">
        <VillageInfo />
        <PanchayatTeam />
        <AboutUsPara />
      </div>

      <Footer />
    </div>
  );
};

export default Page;

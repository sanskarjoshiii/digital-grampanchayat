"use client";
import React from "react";
import VillageAmenities from "@/app/component/VillageAmenities";
import QuickLinks from "@/app/component/QuickLinks";
import EnquiryHelpline from "@/app/component/EnquiryHelpline";
import VillageInfo from "@/app/component/VillageInfo";
import PanchayatTeam from "@/app/component/PanchayatTeam";
import PanchayatBuilding from "@/app/component/PanchayatBuilding";
import { useGlobalContext } from "@/app/context/context";

const Page = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-paper pb-6">
      {/* Hero */}
      <section className="w-full bg-cream">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <p className="text-xs uppercase tracking-wide text-muted">
            {en ? "Digital Gram Panchayat" : "डिजिटल ग्राम पंचायत"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink mt-3 leading-tight">
            {en ? "Chandgaon Gram Panchayat" : "चांदगांव ग्राम पंचायत"}
          </h1>
        </div>
      </section>

      {/* Everything here is specific to this village. What PanchayatX is as a
          project is explained on the Home page. */}
      <div className="pt-12">
        <VillageInfo />
        <PanchayatTeam />
        <PanchayatBuilding />
        <VillageAmenities />
        <QuickLinks />
        <EnquiryHelpline />
      </div>

    </div>
  );
};

export default Page;

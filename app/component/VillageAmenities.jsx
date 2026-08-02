"use client";

import { useGlobalContext } from "../context/context";

/**
 * Facilities that exist in Chandgaon. Village-specific, so it lives on the
 * About page — the project-level explanation is on Home in ProjectIntro.
 */
const amenities = [
  { img: "https://img.icons8.com/?size=100&id=2539&format=png&color=1f1f1f", en: "Toilets", hi: "शौचालय" },
  { img: "https://img.icons8.com/?size=100&id=10726&format=png&color=1f1f1f", en: "Parking", hi: "पार्किंग" },
  { img: "https://img.icons8.com/?size=100&id=1954&format=png&color=1f1f1f", en: "Schools", hi: "विद्यालय" },
  { img: "https://img.icons8.com/?size=100&id=12449&format=png&color=1f1f1f", en: "Anganwadis", hi: "आंगनवाड़ी" },
  { img: "https://img.icons8.com/?size=100&id=23043&format=png&color=1f1f1f", en: "ATMs", hi: "एटीएम" },
  { img: "https://img.icons8.com/?size=100&id=5035&format=png&color=1f1f1f", en: "Police", hi: "पुलिस" },
  { img: "https://img.icons8.com/?size=100&id=wEgBU9peD99C&format=png&color=1f1f1f", en: "Banks", hi: "बैंक" },
  { img: "https://img.icons8.com/?size=100&id=4192&format=png&color=1f1f1f", en: "Petrol Pump", hi: "पेट्रोल पंप" },
  { img: "https://img.icons8.com/?size=100&id=3675&format=png&color=1f1f1f", en: "Railway", hi: "रेलवे" },
  { img: "https://img.icons8.com/?size=100&id=241&format=png&color=1f1f1f", en: "Bus Stand", hi: "बस स्टैंड" },
  { img: "https://img.icons8.com/?size=100&id=12442&format=png&color=1f1f1f", en: "Service Center", hi: "सेवा केंद्र" },
];

const VillageAmenities = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <p className="text-xs uppercase tracking-wide text-muted mb-3">
        {en ? "Village amenities" : "गाँव की सुविधाएँ"}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {amenities.map((a) => (
          <div
            key={a.en}
            className="ds-card px-2 py-4 flex flex-col items-center gap-2 text-center"
          >
            <img src={a.img} width={24} height={24} alt="" />
            <span className="text-xs font-medium text-ink">{en ? a.en : a.hi}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VillageAmenities;

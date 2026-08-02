"use client";

import Link from "next/link";
import { useGlobalContext } from "../context/context";

/**
 * Shortcuts into this village's records. They sit on the About page with the
 * rest of the Chandgaon-specific content; Home describes the project itself.
 */
const QuickLinks = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  const links = [
    {
      title: en ? "Panchayat Funds" : "पंचायत निधि",
      href: "/panchayat_funds",
      img: "https://img.icons8.com/ios/50/1f1f1f/coins--v1.png",
    },
    {
      title: en ? "Documents" : "दस्तऐवज",
      href: "/documents",
      img: "https://img.icons8.com/ios/50/1f1f1f/document--v1.png",
    },
    {
      title: en ? "Nearby Services" : "जवळच्या सेवा",
      href: "/nearby_services",
      img: "https://img.icons8.com/ios/50/1f1f1f/services--v1.png",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <p className="text-xs uppercase tracking-wide text-muted mb-3">
        {en ? "Village records" : "गाँव के अभिलेख"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {links.map((q) => (
          <Link
            key={q.href}
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
    </section>
  );
};

export default QuickLinks;

"use client";

import { useGlobalContext } from "../context/context";
import {
  ENQUIRY_NUMBER,
  ENQUIRY_HOURS_EN,
  ENQUIRY_HOURS_HI,
} from "../config/panchayat";

/**
 * The Panchayat office's own number and opening hours — specific to Chandgaon,
 * so it belongs on About rather than the Home page, which describes the
 * project itself.
 */
const EnquiryHelpline = () => {
  const { language } = useGlobalContext();
  const en = language == "english";

  const t = en
    ? {
        label: "Enquiry helpline",
        title: "Have a question about the Panchayat?",
        text: "Call the Panchayat office and our staff will help you with schemes, documents, funds or any village service.",
        callNow: "Call now",
        hours: ENQUIRY_HOURS_EN,
      }
    : {
        label: "पूछताछ हेल्पलाइन",
        title: "पंचायत के बारे में कोई प्रश्न है?",
        text: "पंचायत कार्यालय पर कॉल करें — योजनाएँ, दस्तऐवज, निधि या किसी भी ग्राम सेवा की जानकारी हमारे कर्मचारी देंगे।",
        callNow: "अभी कॉल करें",
        hours: ENQUIRY_HOURS_HI,
      };

  return (
    <section className="max-w-4xl mx-auto px-4 mt-12">
      <div className="ds-panel-cream px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{t.label}</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-ink mt-2">{t.title}</h2>
          <p className="text-sm text-muted mt-2 max-w-md">{t.text}</p>
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
    </section>
  );
};

export default EnquiryHelpline;

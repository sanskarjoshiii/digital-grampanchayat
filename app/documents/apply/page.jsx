"use client";

import Link from "next/link";
import { useGlobalContext } from "../../context/context";
import { DOCUMENT_GUIDES, guideCopy } from "../../utils/documentGuides";

export default function ApplyIndex() {
  const { language, setOpenSidebar } = useGlobalContext();
  const en = language == "english";

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-5xl">
        <Link href="/documents" className="text-sm font-medium text-muted hover:text-ink hover:underline">
          ← {en ? "Back to documents" : "दस्तऐवज पर वापस"}
        </Link>

        <div className="mt-4">
          <p className="text-sm font-medium text-muted">
            {en ? "Step-by-step guides" : "चरण-दर-चरण मार्गदर्शन"}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {en ? "How to get a document" : "दस्तऐवज कैसे प्राप्त करें"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {en
              ? "What each document is for, which papers you need, and exactly what to do — online and at the office. All of these are government services; most are free."
              : "हर दस्तऐवज किस काम आता है, कौन-से कागज़ चाहिए, और क्या करना है — ऑनलाइन और कार्यालय दोनों तरीके। ये सब सरकारी सेवाएँ हैं; अधिकांश निःशुल्क हैं।"}
          </p>
        </div>

        <div className="mt-4 rounded-card border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">
            <strong className="font-semibold">{en ? "Beware of fake websites. " : "नकली वेबसाइटों से सावधान। "}</strong>
            {en
              ? "Only the links on these pages are official. A genuine site's address always ends in .gov.in or .nic.in. Never pay an agent for a free service, and never share your Aadhaar OTP."
              : "इन पन्नों पर दिए लिंक ही आधिकारिक हैं। असली सरकारी वेबसाइट का पता हमेशा .gov.in या .nic.in पर समाप्त होता है। निःशुल्क सेवा के लिए किसी एजेंट को पैसे न दें, और अपना आधार OTP कभी साझा न करें।"}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {DOCUMENT_GUIDES.map((guide) => {
            const copy = guideCopy(guide, language);
            return (
              <Link
                key={guide.slug}
                href={`/documents/apply/${guide.slug}`}
                className="group flex gap-4 rounded-card border border-line bg-paper p-5 transition-colors hover:bg-mist"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-cream">
                  <img src={guide.icon} width={22} height={22} alt="" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold text-ink">{copy.name}</h2>
                  <p className="mt-1 text-sm text-muted">{copy.tagline}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-ink group-hover:underline">
                    {en ? "See the steps →" : "चरण देखें →"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

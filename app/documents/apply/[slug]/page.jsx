"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useGlobalContext } from "../../../context/context";
import { guideBySlug, guideCopy, DOCUMENT_GUIDES } from "../../../utils/documentGuides";
import { ENQUIRY_HOURS_EN, ENQUIRY_HOURS_HI, ENQUIRY_NUMBER } from "../../../config/panchayat";

const Section = ({ title, children }) => (
  <section className="rounded-card border border-line bg-paper p-5">
    <h2 className="font-semibold text-ink">{title}</h2>
    <div className="mt-3">{children}</div>
  </section>
);

const Steps = ({ items }) => (
  <ol className="space-y-3">
    {items.map((step, index) => (
      <li key={index} className="flex gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
          {index + 1}
        </span>
        <span className="pt-0.5 text-sm leading-6 text-ink">{step}</span>
      </li>
    ))}
  </ol>
);

const Bullets = ({ items }) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex gap-2.5 text-sm leading-6 text-ink">
        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function GuidePage({ params }) {
  const { language, setOpenSidebar } = useGlobalContext();
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const en = language == "english";
  const copy = guideCopy(guide, language);
  const others = DOCUMENT_GUIDES.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      onClick={() => setOpenSidebar(false)}
    >
      <div className="mx-auto max-w-3xl">
        <Link
          href="/documents/apply"
          className="text-sm font-medium text-muted hover:text-ink hover:underline"
        >
          ← {en ? "All document guides" : "सभी दस्तऐवज मार्गदर्शन"}
        </Link>

        <header className="mt-4 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-card border border-line bg-paper">
            <img src={guide.icon} width={26} height={26} alt="" />
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">{copy.name}</h1>
            <p className="mt-1 text-sm text-muted">{copy.tagline}</p>
          </div>
        </header>

        <p className="mt-5 text-[15px] leading-7 text-ink">{copy.about}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-paper p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {en ? "Cost" : "शुल्क"}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink">{copy.fee}</p>
          </div>
          <div className="rounded-card border border-line bg-paper p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {en ? "How long it takes" : "कितना समय लगता है"}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink">{copy.time}</p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <Section title={en ? "Who this is for" : "यह किसके लिए है"}>
            <p className="text-sm leading-6 text-ink">{copy.whoFor}</p>
          </Section>

          <Section title={en ? "Papers to keep ready" : "कौन-से कागज़ तैयार रखें"}>
            <Bullets items={copy.needed} />
          </Section>

          <Section title={en ? "Applying online" : "ऑनलाइन आवेदन"}>
            <Steps items={copy.online} />
          </Section>

          <Section title={en ? "Applying in person" : "कार्यालय जाकर आवेदन"}>
            <Steps items={copy.offline} />
          </Section>

          <Section title={en ? "Official links" : "आधिकारिक लिंक"}>
            <div className="space-y-2">
              {guide.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:bg-mist"
                >
                  <img
                    src="https://img.icons8.com/ios/50/1f1f1f/external-link.png"
                    width={16}
                    height={16}
                    alt=""
                    className="shrink-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {en ? link.label : link.labelHi}
                    </span>
                    <span className="block truncate text-xs text-muted">{link.url}</span>
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted">
              {en
                ? "A genuine government address ends in .gov.in or .nic.in. Sites that copy a government name but end in something else are not official."
                : "असली सरकारी पते का अंत .gov.in या .nic.in होता है। सरकारी नाम की नकल करने वाली, पर किसी और नाम पर समाप्त होने वाली वेबसाइटें आधिकारिक नहीं हैं।"}
            </p>
          </Section>

          <Section title={en ? "Good to know" : "ध्यान रखने योग्य बातें"}>
            <Bullets items={copy.tips} />
          </Section>
        </div>

        <div className="mt-6 rounded-card border border-line bg-paper p-5">
          <h2 className="font-semibold text-ink">{en ? "Need help?" : "मदद चाहिए?"}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {en
              ? "The Panchayat office will guide you through any of this in person."
              : "पंचायत कार्यालय इनमें से किसी भी काम में आपकी मदद करेगा।"}
          </p>
          <a href={`tel:${ENQUIRY_NUMBER}`} className="btn-primary mt-3 text-sm">
            {en ? "Call " : "कॉल करें "}
            {ENQUIRY_NUMBER}
          </a>
          <p className="mt-2 text-xs text-muted">{en ? ENQUIRY_HOURS_EN : ENQUIRY_HOURS_HI}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            {en ? "Other documents" : "अन्य दस्तऐवज"}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/documents/apply/${item.slug}`}
                className="rounded-card border border-line bg-paper p-4 transition-colors hover:bg-mist"
              >
                <img src={item.icon} width={20} height={20} alt="" />
                <p className="mt-2 text-sm font-medium text-ink">
                  {guideCopy(item, language).name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

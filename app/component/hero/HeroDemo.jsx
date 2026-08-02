"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context/context";
import { pick } from "../../utils/language";
import { money } from "../../utils/format";
import { COMPLAINT_STATUSES } from "../../utils/complaints";
import FundCard from "../FundCard";
import DemoCursor from "./DemoCursor";
import useHeroTimeline from "../../hooks/useHeroTimeline";
import {
  DEMO_AMENITIES,
  DEMO_COMPLAINT_ID,
  DEMO_FUNDS,
  DEMO_PHOTO,
  DEMO_TEAM,
  DEMO_TOTALS,
} from "../../utils/heroScript";

/**
 * A miniature of the real product, played through on a loop: the village
 * details, the published fund record, and — at length — a villager raising a
 * complaint and watching it get resolved.
 *
 * Every element the animation touches carries a `data-demo` attribute; the
 * timeline finds them by query inside this root and aims the cursor at their
 * real bounding boxes. Nothing here knows GSAP exists.
 */
// The demo is laid out at this width and then scaled to whatever column it is
// dropped into, so the composition never has to be redesigned per breakpoint.
const DESIGN_WIDTH = 720;

export default function HeroDemo() {
  const { language } = useGlobalContext();
  const rootRef = useRef(null);
  const scalerRef = useRef(null);
  const cursorRef = useRef(null);
  const rippleRef = useRef(null);
  const [box, setBox] = useState({ scale: 1, height: 0 });

  // Fit the fixed-width composition to the available column, and give the
  // outer element the resulting height so it still occupies real space in the
  // grid — a scaled element keeps its unscaled layout box otherwise.
  useEffect(() => {
    const root = rootRef.current;
    const scaler = scalerRef.current;
    if (!root || !scaler) return;
    const fit = () => {
      const available = root.clientWidth;
      if (!available) return;
      const scale = Math.min(1, available / DESIGN_WIDTH);
      setBox({ scale, height: scaler.offsetHeight * scale });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    return () => observer.disconnect();
  }, [language]);

  const { ready, paused } = useHeroTimeline({ rootRef, cursorRef, rippleRef, language });

  const t = (strings) => pick(language, strings);
  const tabs = [
    { key: "home", label: t({ en: "Home", mr: "मुख्यपृष्ठ", hi: "मुख्य पृष्ठ" }) },
    { key: "about", label: t({ en: "About", mr: "पंचायतीविषयी", hi: "पंचायत के बारे में" }) },
    { key: "funds", label: t({ en: "Funds", mr: "पंचायत निधी", hi: "पंचायत निधि" }) },
    { key: "complaints", label: t({ en: "My Complaints", mr: "माझ्या तक्रारी", hi: "मेरी शिकायतें" }) },
  ];

  return (
    <div
      ref={rootRef}
      className="relative w-full select-none"
      // Decoration over the real page; screen readers and keyboards go straight
      // to the actual navigation instead.
      aria-hidden="true"
      data-ready={ready ? "true" : "false"}
      data-paused={paused ? "true" : "false"}
      style={{ height: box.height || undefined }}
    >
      <div
        ref={scalerRef}
        data-demo="scaler"
        className="origin-top-left"
        style={{ width: DESIGN_WIDTH, transform: `scale(${box.scale})` }}
      >
      {/* Camera. Zooms and pans apply here, never to the browser. */}
      <div data-demo="stage" className="origin-center [transform:translate3d(0,0,0)]">
        <div
          data-demo="window"
          className="relative w-full overflow-hidden rounded-card border border-line bg-paper shadow-pop"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-line bg-mist px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="ml-3 truncate rounded-md bg-paper px-3 py-1 text-[11px] text-muted">
              panchayatx
            </span>
          </div>

          {/* App header */}
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
            <img src="/panchayatx-logo.png" width={20} height={20} alt="" />
            <span className="text-sm font-semibold tracking-tight text-ink">PanchayatX</span>
            <nav className="ml-3 flex items-center gap-1">
              {tabs.map((tab) => (
                <span
                  key={tab.key}
                  data-demo={`tab-${tab.key}`}
                  className="relative rounded-md px-2.5 py-1 text-[11px] font-medium"
                >
                  <span
                    data-demo={`pill-${tab.key}`}
                    className="absolute inset-0 rounded-md bg-ink opacity-0"
                  />
                  <span data-demo={`tabtext-${tab.key}`} className="relative text-muted">
                    {tab.label}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          {/* All screens share one box; the timeline cross-fades between them. */}
          <div className="relative h-[360px] overflow-hidden bg-paper">
            {/* ---------- Screen: Home ---------- */}
            <div
              data-demo="screen-home"
              className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
            >
              <p className="text-[10px] uppercase tracking-wide text-muted">
                {t({ en: "Digital Gram Panchayat", mr: "डिजिटल ग्रामपंचायत", hi: "डिजिटल ग्राम पंचायत" })}
              </p>
              <h3 className="mt-2 text-3xl font-semibold leading-tight text-ink">
                {t({ en: "Welcome to", mr: "आपले स्वागत आहे", hi: "आपका स्वागत है" })}
                <br />
                PanchayatX
              </h3>
              <p className="mt-3 max-w-sm text-xs leading-5 text-muted">
                {t({
                  en: "Transparent, accessible and paperless village governance.",
                  mr: "पारदर्शक, सोपा आणि कागदाविना गावकारभार.",
                  hi: "पारदर्शी, सुलभ और कागज़-रहित ग्राम शासन।",
                })}
              </p>
              <span className="btn-primary mt-5 px-4 py-2 text-xs">
                {t({ en: "Go to my Panchayat", mr: "माझी पंचायत पाहा", hi: "मेरी पंचायत देखें" })}
                <span aria-hidden>→</span>
              </span>
            </div>

            {/* ---------- Screen: About ---------- */}
            <div data-demo="screen-about" className="absolute inset-0 px-6 pt-5 opacity-0">
              <p className="text-center text-[10px] uppercase tracking-wide text-muted">
                {t({ en: "Digital Gram Panchayat", mr: "डिजिटल ग्रामपंचायत", hi: "डिजिटल ग्राम पंचायत" })}
              </p>
              <h3 className="mt-1 text-center text-xl font-semibold text-ink">
                {t({ en: "Chandgaon Gram Panchayat", mr: "चांदगाव ग्रामपंचायत", hi: "चांदगांव ग्राम पंचायत" })}
              </h3>

              {/* The elected body, as the tree on the About page */}
              <div data-demo="team" className="mt-4 flex flex-col items-center">
                <div className="ds-card px-3 py-2 text-center">
                  <span className="ds-pill text-[9px]">{t(DEMO_TEAM.sarpanch)}</span>
                  <p className="mt-1 text-[11px] font-semibold text-ink">
                    {DEMO_TEAM.sarpanch.name}
                  </p>
                </div>
                <span className="h-3 w-px bg-line" />
                <div className="ds-card px-3 py-1.5 text-center">
                  <span className="ds-pill text-[9px]">{t(DEMO_TEAM.upSarpanch)}</span>
                  <p className="mt-1 text-[11px] font-semibold text-ink">
                    {DEMO_TEAM.upSarpanch.name}
                  </p>
                </div>
                <span className="h-3 w-px bg-line" />
                <div className="grid w-full grid-cols-5 gap-1.5">
                  {DEMO_TEAM.members.map((name) => (
                    <div
                      key={name}
                      data-demo="member"
                      className="ds-card px-1.5 py-1.5 text-center text-[8.5px] font-medium leading-tight text-ink"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[9px] uppercase tracking-wide text-muted">
                {t({ en: "Village amenities", mr: "गावातील सुविधा", hi: "गाँव की सुविधाएँ" })}
              </p>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                {DEMO_AMENITIES.map((item) => (
                  <div
                    key={item.en}
                    data-demo="amenity"
                    className="ds-card px-2 py-1.5 text-center text-[9px] font-medium text-ink"
                  >
                    {t(item)}
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Screen: Funds ---------- */}
            <div data-demo="screen-funds" className="absolute inset-0 overflow-hidden px-5 pt-4 opacity-0">
              <p className="text-xs font-semibold text-ink">
                {t({
                  en: "Scheme-wise Fund Receipt & Expenditure",
                  mr: "योजनानिहाय निधी जमा व खर्च",
                  hi: "योजना अनुसार निधि प्राप्ति व व्यय",
                })}
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {DEMO_TOTALS.map((total) => (
                  <div key={total.key} data-demo="total" className="ds-card-muted px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-wide text-muted">{t(total)}</p>
                    <p
                      data-demo="count"
                      data-value={total.value}
                      className="mt-0.5 text-xs font-semibold tabular-nums text-ink"
                    >
                      {money(0)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex h-12 items-end gap-1.5">
                {[38, 62, 45, 88, 54, 71, 33].map((height, index) => (
                  <span
                    key={index}
                    data-demo="bar"
                    data-height={height}
                    className="flex-1 rounded-sm bg-ink/70"
                    style={{ height: 0 }}
                  />
                ))}
              </div>

              <div className="mt-3 space-y-2.5">
                {DEMO_FUNDS.map((fund) => (
                  <div key={fund._id} data-demo="fund-card" className="origin-top scale-[0.82]">
                    <FundCard fund={fund} language={language} />
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Screen: My complaints (tracking) ---------- */}
            <div data-demo="screen-track" className="absolute inset-0 px-5 pt-5 opacity-0">
              <p className="text-xs font-semibold text-ink">
                {t({ en: "My complaints", mr: "माझ्या तक्रारी", hi: "मेरी शिकायतें" })}
              </p>
              <div className="mt-3 overflow-hidden rounded-card border border-line">
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-line bg-mist px-3 py-2 text-[9px] uppercase tracking-wide text-muted">
                  <span>{t({ en: "Complaint ID", mr: "तक्रार क्रमांक", hi: "शिकायत क्रमांक" })}</span>
                  <span>{t({ en: "Complaint", mr: "तक्रार", hi: "शिकायत" })}</span>
                  <span>{t({ en: "Status", mr: "स्थिती", hi: "स्थिति" })}</span>
                </div>
                <div
                  data-demo="track-row"
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3"
                >
                  <span className="font-mono text-[10px] font-medium text-ink">
                    {DEMO_COMPLAINT_ID}
                  </span>
                  <span data-demo="track-title" className="truncate text-[11px] text-ink" />
                  {/* One chip per status, cross-faded in place. */}
                  <span className="relative block h-6 w-[104px]">
                    {COMPLAINT_STATUSES.map((status) => (
                      <span
                        key={status.value}
                        data-demo={`chip-${status.value}`}
                        className={`absolute inset-0 flex items-center justify-center rounded-md border text-[9.5px] font-medium opacity-0 ${status.className}`}
                      >
                        {pick(language, { en: status.label, mr: status.mr, hi: status.hi })}
                      </span>
                    ))}
                  </span>
                </div>
                <div data-demo="track-note" className="px-3 pb-3 opacity-0">
                  <p className="rounded-md bg-mist px-2 py-1.5 text-[9.5px] text-muted">
                    <span className="font-medium text-ink">
                      {t({ en: "Office note", mr: "कार्यालयाची नोंद", hi: "कार्यालय की टिप्पणी" })}:
                    </span>{" "}
                    <span data-demo="note-text" />
                  </p>
                </div>
              </div>
              <div data-demo="track-photo" className="mt-3 flex items-center gap-2 opacity-0">
                <img
                  src={DEMO_PHOTO}
                  alt=""
                  className="h-12 w-16 rounded-md border border-line object-cover"
                />
                <p className="text-[9.5px] text-muted">
                  {t({
                    en: "Photo you attached, visible to the office",
                    mr: "तुम्ही जोडलेला फोटो, कार्यालयाला दिसतो",
                    hi: "आपका जोड़ा फ़ोटो, कार्यालय को दिखता है",
                  })}
                </p>
              </div>
            </div>

            {/* Raise-a-complaint button, as on every real page */}
            <span
              data-demo="fab"
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-ink px-3 py-2 text-[11px] font-medium text-white shadow-pop"
            >
              <img
                src="https://img.icons8.com/ios-filled/50/ffffff/complaint.png"
                width={13}
                height={13}
                alt=""
              />
              {t({ en: "Raise a complaint", mr: "तक्रार नोंदवा", hi: "शिकायत दर्ज करें" })}
            </span>

            {/* ---------- Complaint dialog ---------- */}
            <div
              data-demo="dialog"
              className="absolute inset-x-6 bottom-4 z-20 rounded-card border border-line bg-paper p-3.5 opacity-0 shadow-pop"
            >
              <p className="text-xs font-semibold text-ink">
                {t({ en: "Raise a complaint", mr: "तक्रार नोंदवा", hi: "शिकायत दर्ज करें" })}
              </p>

              <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-muted">
                {t({ en: "What is the problem?", mr: "अडचण काय आहे?", hi: "समस्या क्या है?" })}
              </p>
              <div
                data-demo="field-title"
                className="mt-1 rounded-lg border border-line bg-cream px-2.5 py-1.5"
              >
                <span data-demo="typed-title" className="text-[10.5px] text-ink" />
                <span data-demo="caret-title" className="ml-px inline-block h-2.5 w-px align-middle bg-ink opacity-0" />
              </div>

              <p className="mt-2 text-[9px] font-medium uppercase tracking-wide text-muted">
                {t({ en: "Describe it in detail", mr: "सविस्तर लिहा", hi: "विस्तार से बताएँ" })}
              </p>
              <div
                data-demo="field-detail"
                className="mt-1 min-h-[38px] rounded-lg border border-line bg-cream px-2.5 py-1.5"
              >
                <span data-demo="typed-detail" className="text-[10.5px] leading-4 text-ink" />
                <span data-demo="caret-detail" className="ml-px inline-block h-2.5 w-px align-middle bg-ink opacity-0" />
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <span data-demo="btn-photo" className="btn-ghost px-2.5 py-1 text-[10px]">
                  <img
                    src="https://img.icons8.com/ios/50/1f1f1f/camera--v1.png"
                    width={11}
                    height={11}
                    alt=""
                  />
                  {t({ en: "Take a photo", mr: "फोटो काढा", hi: "फ़ोटो लें" })}
                </span>
                <span className="text-[9px] text-muted">
                  {t({ en: "or choose from phone", mr: "किंवा फोनमधून निवडा", hi: "या फ़ोन से चुनें" })}
                </span>
                <div data-demo="photo-thumb" className="ml-auto opacity-0">
                  <img
                    src={DEMO_PHOTO}
                    alt=""
                    className="h-9 w-12 rounded-md border border-line object-cover"
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <span data-demo="btn-submit" className="btn-primary px-3 py-1.5 text-[10.5px]">
                  {t({ en: "Submit complaint", mr: "तक्रार पाठवा", hi: "शिकायत भेजें" })}
                </span>
              </div>
            </div>

            {/* Camera flash when the photo is taken */}
            <span
              data-demo="flash"
              className="pointer-events-none absolute inset-0 z-30 bg-white opacity-0"
            />

            {/* ---------- Success toast ---------- */}
            <div
              data-demo="toast"
              className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-2.5 rounded-lg bg-ink px-3.5 py-2.5 opacity-0 shadow-pop"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-ink">
                ✓
              </span>
              <span className="text-[11px] text-white">
                {t({ en: "Complaint registered", mr: "तक्रार नोंदवली", hi: "शिकायत दर्ज हुई" })}
                <span className="ml-1.5 font-mono opacity-80">{DEMO_COMPLAINT_ID}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

        <DemoCursor ref={cursorRef} rippleRef={rippleRef} />
      </div>
    </div>
  );
}

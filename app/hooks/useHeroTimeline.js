"use client";

import { useEffect, useRef, useState } from "react";
import { money } from "../utils/format";
import { pick } from "../utils/language";
import { createPointer, loadGsap, measureTargets, typeInto } from "./heroMotion";
import {
  DEMO_COMPLAINT,
  DEMO_STATUS_FLOW,
  LOOP_SECONDS,
  SCENES,
} from "../utils/heroScript";

/**
 * Drives the hero demo.
 *
 * All of the motion lives here so the markup stays a plain description of the
 * screens. Elements are addressed by their `data-demo` name, which is the only
 * contract between this file and HeroDemo.jsx.
 *
 * The cursor aims at the measured centre of whatever it is about to click, so
 * it lands on the button itself rather than at a coordinate that has to be
 * re-guessed every time the layout changes.
 *
 * Three deliberate limits, because this site is used by villagers on cheap
 * phones over mobile data:
 *   - GSAP is imported dynamically, so it is never part of the first load.
 *   - The demo only runs from `lg` upward; smaller screens keep the plain hero
 *     and download nothing extra.
 *   - It respects prefers-reduced-motion, and pauses whenever it scrolls out of
 *     view so it is not burning battery off-screen.
 */
export default function useHeroTimeline({ rootRef, cursorRef, rippleRef, language }) {
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const timelineRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    const ripple = rippleRef.current;
    if (!root || !cursor || !ripple) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const roomToPlay = window.matchMedia("(min-width: 1024px)").matches;

    const q = (name) => root.querySelector(`[data-demo="${name}"]`);
    const qa = (name) => Array.from(root.querySelectorAll(`[data-demo="${name}"]`));

    // Anyone who cannot or should not see the animation gets a finished frame
    // rather than an empty box.
    const showStillFrame = () => {
      qa("count").forEach((el) => (el.textContent = money(Number(el.dataset.value || 0))));
      qa("bar").forEach((el) => (el.style.height = `${el.dataset.height}%`));
      setReady(true);
    };

    if (reduced || !roomToPlay) {
      showStillFrame();
      return;
    }

    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const gsap = await loadGsap();
      if (cancelled) return;

      const ctx = gsap.context(() => {
        const stage = q("stage");
        const windowEl = q("window");
        const screens = {
          home: q("screen-home"),
          about: q("screen-about"),
          funds: q("screen-funds"),
          track: q("screen-track"),
        };
        const fab = q("fab");
        const dialog = q("dialog");
        const toast = q("toast");
        const flash = q("flash");
        const photoThumb = q("photo-thumb");
        const trackRow = q("track-row");
        const trackTitle = q("track-title");
        const trackNote = q("track-note");
        const noteText = q("note-text");
        const trackPhoto = q("track-photo");
        const counts = qa("count");
        const bars = qa("bar");
        const cards = qa("fund-card");
        const totals = qa("total");
        const members = qa("member");
        const amenities = qa("amenity");
        const team = q("team");
        const chips = Object.fromEntries(
          DEMO_STATUS_FLOW.map(({ status }) => [status, q(`chip-${status}`)])
        );
        const tabKeys = ["home", "about", "funds", "complaints"];

        /**
         * Every element the cursor clicks, measured once up front.
         *
         * Measuring has to happen with the panels sitting exactly where they
         * will be when open. At rest the dialog is parked at y:18 scale:0.98,
         * and getBoundingClientRect reports that transformed box — so the
         * fields inside it measured ~18px low and slightly pulled toward the
         * dialog's centre, which is why the pointer missed them.
         */
        const CLICK_TARGETS = [
          "tab-home",
          "tab-about",
          "tab-funds",
          "tab-complaints",
          "fab",
          "field-title",
          "field-detail",
          "btn-photo",
          "btn-submit",
        ];

        const scaler = q("scaler");

        // The dialog rests at y:18 scale:0.98; measure it where it will be
        // when open, or every field inside reads ~18px low.
        const settle = (g) => g.set([dialog, toast], { y: 0, scale: 1 });
        const unsettle = (g) => g.set([dialog, toast], { y: 18, scale: 0.98 });

        // Back to frame zero. Runs before building and again on every repeat,
        // so the last frame equals the first exactly.
        const resetAll = () => {
          gsap.set(stage, { scale: 1, x: 0, y: 0, transformOrigin: "50% 50%" });
          gsap.set(windowEl, { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 });
          gsap.set(screens.home, { opacity: 1, y: 0 });
          gsap.set([screens.about, screens.funds, screens.track], { opacity: 0, y: 14 });
          gsap.set([dialog, toast], { opacity: 0, y: 18, scale: 0.98 });
          gsap.set(fab, { opacity: 1, scale: 1 });
          gsap.set(flash, { opacity: 0 });
          gsap.set(photoThumb, { opacity: 0, scale: 0.85 });
          gsap.set([trackNote, trackPhoto], { opacity: 0, y: 8 });
          gsap.set(trackRow, { backgroundColor: "rgba(0,0,0,0)" });
          gsap.set(Object.values(chips), { opacity: 0 });
          gsap.set(cards, { opacity: 0, y: 22 });
          gsap.set([totals, members, amenities], { opacity: 0, y: 12 });
          gsap.set(team, { opacity: 1 });
          gsap.set(bars, { height: 0 });
          gsap.set(cursor, { opacity: 0, scale: 1 });
          gsap.set(ripple, { opacity: 0, scale: 0.3 });
          tabKeys.forEach((key) => {
            gsap.set(q(`pill-${key}`), { opacity: 0 });
            gsap.set(q(`tabtext-${key}`), { color: "#8a8a82" });
          });
          counts.forEach((el) => (el.textContent = money(0)));
          [q("typed-title"), q("typed-detail")].forEach((el) => el && (el.textContent = ""));
          gsap.set([q("caret-title"), q("caret-detail")], { opacity: 0 });
          if (trackTitle) trackTitle.textContent = "";
          if (noteText) noteText.textContent = "";
        };

        resetAll();
        const targets = measureTargets({
          gsap,
          root,
          scaler,
          names: CLICK_TARGETS,
          settle,
          unsettle,
        });

        const master = gsap.timeline({
          repeat: -1,
          defaults: { ease: "power3.out" },
          onRepeat: resetAll,
        });
        timelineRef.current = master;

        const pointer = createPointer({ gsap, master, cursor, ripple, targets, scaler });
        gsap.set(cursor, { ...pointer.park(), opacity: 0 });
        const { moveTo, hover, click } = pointer;

        /** Light up a nav tab and dim the rest. */
        const activateTab = (key, at) => {
          master.to(q(`pill-${key}`), { opacity: 1, duration: 0.35, ease: "power2.out" }, at);
          master.to(q(`tabtext-${key}`), { color: "#ffffff", duration: 0.35 }, at);
          tabKeys
            .filter((other) => other !== key)
            .forEach((other) => {
              master.to(q(`pill-${other}`), { opacity: 0, duration: 0.3 }, at);
              master.to(q(`tabtext-${other}`), { color: "#8a8a82", duration: 0.3 }, at);
            });
        };

        /** Cross-fade one screen out and the next in. */
        const showScreen = (from, to, at) => {
          master.to(screens[from], { opacity: 0, y: -12, duration: 0.45, ease: "power2.inOut" }, at);
          master.to(screens[to], { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, at + 0.12);
        };

        const type = (targetName, caretName, text, { at, duration }) =>
          typeInto({
            master,
            target: q(targetName),
            caret: q(caretName),
            text,
            at,
            duration,
          });

        // ---- Scene 1 — the product settles into view ----------------------
        master
          .fromTo(
            windowEl,
            { opacity: 0, scale: 0.95, filter: "blur(10px)", y: 18 },
            { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, duration: 1.3, ease: "expo.out" },
            SCENES.intro
          )
          .fromTo(
            screens.home.children,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
            SCENES.intro + 0.25
          );

        // ---- Scene 2 — About: who runs the village ------------------------
        master.to(cursor, { opacity: 1, duration: 0.35 }, SCENES.toAbout - 0.35);
        moveTo("tab-about", { at: SCENES.toAbout, duration: 1.0, bend: 90 });
        hover(SCENES.toAbout + 0.95);
        click(SCENES.toAbout + 1.35);
        activateTab("about", SCENES.toAbout + 1.4);
        showScreen("home", "about", SCENES.toAbout + 1.45);

        master
          .to(team.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, SCENES.about)
          .to(members, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, SCENES.about + 0.35)
          .to(amenities, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, SCENES.about + 0.8)
          .to(stage, { scale: 1.08, y: -12, duration: 1.3, ease: "power2.inOut" }, SCENES.about + 0.6)
          .to(stage, { scale: 1, y: 0, duration: 1.0, ease: "power2.inOut" }, SCENES.about + 2.4);

        // ---- Scene 3 — Funds: the money, counted -------------------------
        moveTo("tab-funds", { at: SCENES.toFunds, duration: 0.85, bend: 60 });
        hover(SCENES.toFunds + 0.8);
        click(SCENES.toFunds + 1.2);
        activateTab("funds", SCENES.toFunds + 1.25);
        showScreen("about", "funds", SCENES.toFunds + 1.3);

        master
          .to(totals, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, SCENES.funds)
          .to(
            bars,
            { height: (i, el) => `${el.dataset.height}%`, duration: 0.7, stagger: 0.05 },
            SCENES.funds + 0.25
          )
          .to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.14 }, SCENES.funds + 0.45);

        counts.forEach((el, index) => {
          const counter = { value: 0 };
          master.to(
            counter,
            {
              value: Number(el.dataset.value || 0),
              duration: 1.25,
              ease: "power2.out",
              onUpdate: () => (el.textContent = money(Math.round(counter.value))),
            },
            SCENES.funds + 0.1 + index * 0.08
          );
        });

        master
          .to(stage, { scale: 1.12, y: -20, duration: 1.4, ease: "power2.inOut" }, SCENES.funds + 0.7)
          .to(stage, { scale: 1, y: 0, duration: 1.1, ease: "power2.inOut" }, SCENES.funds + 2.7);

        // ---- Scene 4 — raising a complaint, at length ---------------------
        moveTo("fab", { at: SCENES.toComplaint, duration: 1.0, bend: -80 });
        hover(SCENES.toComplaint + 0.95);
        click(SCENES.toComplaint + 1.35);

        master
          .to(fab, { scale: 0.94, duration: 0.14, ease: "power2.out" }, SCENES.toComplaint + 1.35)
          .to(fab, { scale: 1, opacity: 0, duration: 0.3 }, ">")
          .to(dialog, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "expo.out" }, SCENES.toComplaint + 1.5);

        // Click into the title field, then type.
        moveTo("field-title", { at: SCENES.typeTitle - 0.9, duration: 0.7, bend: 40 });
        click(SCENES.typeTitle - 0.2);
        type("typed-title", "caret-title", pick(language, DEMO_COMPLAINT.title), {
          at: SCENES.typeTitle,
          duration: 1.9,
        });

        // Click into the description, then type.
        moveTo("field-detail", { at: SCENES.typeDetail - 0.8, duration: 0.6, bend: 30 });
        click(SCENES.typeDetail - 0.15);
        type("typed-detail", "caret-detail", pick(language, DEMO_COMPLAINT.detail), {
          at: SCENES.typeDetail,
          duration: 3.0,
        });

        // Take a photo: press the button, flash, thumbnail lands.
        moveTo("btn-photo", { at: SCENES.addPhoto - 0.85, duration: 0.65, bend: -40 });
        hover(SCENES.addPhoto - 0.3);
        click(SCENES.addPhoto);
        master
          .to(flash, { opacity: 0.85, duration: 0.09, ease: "power2.out" }, SCENES.addPhoto + 0.25)
          .to(flash, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, ">")
          .to(
            photoThumb,
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
            SCENES.addPhoto + 0.5
          );

        // Submit.
        moveTo("btn-submit", { at: SCENES.submit - 0.8, duration: 0.65, bend: 45 });
        hover(SCENES.submit - 0.25);
        click(SCENES.submit);

        // ---- Scene 5 — it worked ------------------------------------------
        master
          .to(dialog, { opacity: 0, y: 14, scale: 0.98, duration: 0.4, ease: "power2.in" }, SCENES.success)
          .fromTo(
            toast,
            { opacity: 0, y: -16, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "expo.out" },
            SCENES.success + 0.3
          )
          .to(toast, { opacity: 0, y: -14, duration: 0.5, ease: "power2.in" }, SCENES.success + 2.2);

        // ---- Scene 6 — the complaint gets tracked -------------------------
        moveTo("tab-complaints", { at: SCENES.toTracking - 1.1, duration: 0.95, bend: 80 });
        hover(SCENES.toTracking - 0.35);
        click(SCENES.toTracking);
        activateTab("complaints", SCENES.toTracking + 0.05);
        showScreen("funds", "track", SCENES.toTracking + 0.1);

        master.set(trackTitle, {
          onComplete: () => (trackTitle.textContent = pick(language, DEMO_COMPLAINT.title)),
        }, SCENES.toTracking + 0.3);
        master
          .fromTo(trackRow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, SCENES.toTracking + 0.4)
          .to(trackPhoto, { opacity: 1, y: 0, duration: 0.5 }, SCENES.toTracking + 0.8)
          .to(stage, { scale: 1.14, y: -10, duration: 1.2, ease: "power2.inOut" }, SCENES.toTracking + 0.9);

        // The status walks its lifecycle, with the office's note underneath.
        DEMO_STATUS_FLOW.forEach(({ status, at, note }, index) => {
          const when = SCENES.statusFlow + at;
          const previous = DEMO_STATUS_FLOW[index - 1];
          if (previous) {
            master.to(chips[previous.status], { opacity: 0, duration: 0.3, ease: "power2.inOut" }, when);
          }
          master.fromTo(
            chips[status],
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
            when + (previous ? 0.15 : 0)
          );
          if (note) {
            master.set(trackNote, {
              onComplete: () => (noteText.textContent = pick(language, note)),
            }, when + 0.2);
            master.fromTo(
              trackNote,
              { opacity: 0, y: 6 },
              { opacity: 1, y: 0, duration: 0.4 },
              when + 0.25
            );
          }
        });

        master.to(stage, { scale: 1, y: 0, duration: 1.1, ease: "power2.inOut" }, SCENES.outro - 1.2);

        // ---- Scene 7 — back to the start ----------------------------------
        moveTo("offscreen", { at: SCENES.outro, duration: 1.15, bend: 110 });
        master
          .to(cursor, { opacity: 0, duration: 0.5 }, SCENES.outro + 0.7)
          .to(screens.track, { opacity: 0, y: 12, duration: 0.55, ease: "power2.inOut" }, SCENES.outro + 0.5)
          .to(screens.home, { opacity: 1, y: 0, duration: 0.6 }, SCENES.outro + 0.75)
          .to(fab, { opacity: 1, duration: 0.4 }, SCENES.outro + 0.75);
        tabKeys.forEach((key) => {
          master.to(q(`pill-${key}`), { opacity: 0, duration: 0.4 }, SCENES.outro + 0.5);
          master.to(q(`tabtext-${key}`), { color: "#8a8a82", duration: 0.4 }, SCENES.outro + 0.5);
        });

        // Hold on the opening frame, then loop.
        master.to({}, { duration: Math.max(0.2, LOOP_SECONDS - SCENES.reset) }, SCENES.reset);

        setReady(true);

        // Only animate what the visitor can actually see.
        const observer = new IntersectionObserver(
          ([entry]) => {
            entry.isIntersecting ? master.play() : master.pause();
            setPaused(!entry.isIntersecting);
          },
          { threshold: 0.15 }
        );
        observer.observe(root);

        // A resize moves every target, so rebuild rather than let the pointer
        // drift away from the buttons it is pointing at.
        let resizeTimer;
        const onResize = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            master.pause(0);
            ctx.revert();
          }, 250);
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          observer.disconnect();
          window.removeEventListener("resize", onResize);
          clearTimeout(resizeTimer);
        };
      }, root);

      if (cancelled) {
        ctx.revert();
        return;
      }
      const inner = cleanup;
      cleanup = () => {
        inner();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
      timelineRef.current = null;
    };
  }, [rootRef, cursorRef, rippleRef, language]);

  return { ready, paused };
}

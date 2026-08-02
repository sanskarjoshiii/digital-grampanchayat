"use client";

/**
 * Motion primitives for the hero demo: measuring targets, and moving, hovering
 * and clicking the pointer.
 *
 * Separated from useHeroTimeline so the cursor maths sits in one reviewable
 * place — it has needed two corrections already (a dialog measured while parked
 * at an offset, and measurements taken in scaled rather than layout pixels),
 * and both were easy to miss buried among the scene definitions.
 */

/**
 * How much the composition has been shrunk to fit its column.
 *
 * getBoundingClientRect reports screen pixels, but the cursor's x/y are set
 * inside the scaled box — so measurements must be divided back out, or the
 * pointer lands progressively further from its target the smaller the demo is.
 */
export const scaleFactorOf = (scaler) => {
  if (!scaler || !scaler.offsetWidth) return 1;
  return scaler.getBoundingClientRect().width / scaler.offsetWidth || 1;
};

/**
 * Measure the centre of every click target, once, in unscaled space.
 *
 * `settle` is given the chance to move panels to their open position first:
 * a dialog resting at y:18 scale:0.98 reports that transformed box, which is
 * what previously left the pointer ~18px below every field.
 */
export const measureTargets = ({ gsap, root, scaler, names, settle, unsettle }) => {
  settle?.(gsap);
  const origin = (scaler || root).getBoundingClientRect();
  const factor = scaleFactorOf(scaler);
  const map = {};
  names.forEach((name) => {
    const el = root.querySelector(`[data-demo="${name}"]`);
    if (!el) return;
    const box = el.getBoundingClientRect();
    map[name] = {
      x: (box.left - origin.left + box.width / 2) / factor,
      y: (box.top - origin.top + box.height / 2) / factor,
    };
  });
  unsettle?.(gsap);
  return map;
};

/**
 * Cursor behaviour bound to one timeline: travel, hover and click.
 * Returns helpers that also track where the pointer currently is, so each
 * move can be curved from its real position rather than teleporting.
 */
export const createPointer = ({ gsap, master, cursor, ripple, targets, scaler }) => {
  const fallback = () => ({
    x: (scaler?.offsetWidth || 0) / 2,
    y: (scaler?.offsetHeight || 0) / 2,
  });

  const offscreen = () => ({
    x: (scaler?.offsetWidth || 0) * 1.1,
    y: (scaler?.offsetHeight || 0) * 1.1,
  });

  const centreOf = (name) => targets[name] || fallback();

  let at = offscreen();

  /** Curved travel with easing at both ends — never a straight teleport. */
  const moveTo = (name, { at: when, duration = 0.95, bend = 70 } = {}) => {
    const from = at;
    const to = name === "offscreen" ? offscreen() : centreOf(name);
    const mid = { x: (from.x + to.x) / 2 + bend, y: (from.y + to.y) / 2 - bend };
    master.to(
      cursor,
      {
        duration,
        ease: "power2.inOut",
        motionPath: { path: [from, mid, to], curviness: 1.35 },
      },
      when
    );
    at = to;
  };

  /** The pointer swells slightly as it settles on a target. */
  const hover = (when) =>
    master
      .to(cursor, { scale: 1.14, duration: 0.22, ease: "power2.out" }, when)
      .to(cursor, { scale: 1, duration: 0.3, ease: "power2.inOut" }, ">");

  /** 1 → 0.9 → 1 with a ripple at the exact point of contact. */
  const click = (when) => {
    const here = at;
    master
      .to(cursor, { scale: 0.9, duration: 0.1, ease: "power2.out" }, when)
      .to(cursor, { scale: 1, duration: 0.26, ease: "back.out(2.4)" }, ">")
      .set(ripple, { x: here.x, y: here.y, scale: 0.35, opacity: 0.85 }, when)
      .to(ripple, { scale: 2.1, opacity: 0, duration: 0.6, ease: "power2.out" }, when);
  };

  const park = () => {
    at = offscreen();
    return at;
  };

  return { moveTo, hover, click, centreOf, offscreen, park };
};

/** Type a string one character at a time, with a blinking caret. */
export const typeInto = ({ master, target, caret, text, at, duration }) => {
  if (!target) return;
  const letters = { count: 0 };
  master.set(caret, { opacity: 1 }, at);
  master.to(
    letters,
    {
      count: text.length,
      duration,
      ease: "none",
      onUpdate: () => (target.textContent = text.slice(0, Math.round(letters.count))),
    },
    at
  );
  master.to(
    caret,
    { opacity: 0, duration: 0.4, repeat: Math.ceil(duration / 0.8), yoyo: true, ease: "steps(1)" },
    at
  );
  master.set(caret, { opacity: 0 }, at + duration + 0.1);
};

/** Load GSAP and the one plugin both variants need, on demand. */
export const loadGsap = async () => {
  const [{ gsap }, { MotionPathPlugin }] = await Promise.all([
    import("gsap"),
    import("gsap/MotionPathPlugin"),
  ]);
  gsap.registerPlugin(MotionPathPlugin);
  return gsap;
};

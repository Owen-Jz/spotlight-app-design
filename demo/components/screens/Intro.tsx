"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNav } from "../nav";

const EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_AT = 5600; // ms

/* The stage, in px inside a W×H box centred on screen. The puck art is a
   Blender render; TOP_* is where its top face sits in that image. */
const W = 320;
const H = 580;
const APEX = { x: W / 2, y: 36 };
const PUCK = { w: 370, top: 262, ratio: 800 / 1400 };
const PH = PUCK.w * PUCK.ratio;
const TOP_Y = PUCK.top + PH * 0.408; // centre of the top face (measured from the render)
const TOP_RX = PUCK.w * 0.3; // where the beam lands, about as wide as the S
const TOP_RY = PH * 0.19;

const T = {
  lamp: 0.25,
  puck: 0.35,
  beam: 1.0, // the light strikes
  land: 1.45, // and hits the stage
  glint: 2.0,
  word: 2.15,
  tag: 3.2,
};

const SHOWS = [
  { t: "Talent", c: "#ff5a1f" },
  { t: "Ideas", c: "#f2b53a" },
];

/** Dust caught in the beam: fixed positions so every render is identical. */
const MOTES = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  const y = APEX.y + 60 + r(1) * (TOP_Y - APEX.y - 90);
  const spread = ((y - APEX.y) / (TOP_Y - APEX.y)) * TOP_RX * 0.8;
  return { x: APEX.x + (r(2) * 2 - 1) * spread, y, s: 1 + r(3) * 1.6, d: 3 + r(4) * 3, delay: r(5) * 2 };
});

const img = (name: string) => `/brand/${name}.png`;

/**
 * The app intro, built from the Spotlight logo taken apart: a lamp flickers
 * on in the dark, the stage puck rises out of focus, the beam strikes down
 * and lights the silver S, a glint runs across it, then SPOTLIGHT pulls into
 * focus letter by letter. Leaving dives into the light.
 */
export function Intro() {
  const { reset } = useNav();
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const leave = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    setTimeout(() => reset({ name: "welcome" }), 520);
  }, [reset]);

  useEffect(() => {
    const t = setTimeout(leave, EXIT_AT);
    return () => clearTimeout(t);
  }, [leave]);

  const beamPath = `M ${APEX.x - 2} ${APEX.y} L ${APEX.x + 2} ${APEX.y} L ${APEX.x + TOP_RX} ${TOP_Y} L ${APEX.x - TOP_RX} ${TOP_Y} Z`;

  return (
    <button onClick={leave} className="relative h-full w-full overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={leaving ? { scale: 1.6, opacity: 0, filter: "blur(18px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: [0.7, 0, 0.84, 0] }}
        style={{ transformOrigin: `50% calc(50% - ${H / 2 - TOP_Y}px)` }}
      >
        <div className="relative shrink-0" style={{ width: W, height: H }}>
          {/* ---- the beam ---- */}
          <motion.svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            className="absolute inset-0 overflow-visible"
            style={{ mixBlendMode: "screen" }}
            initial={{ clipPath: "inset(-40px -200px 100% -200px)", opacity: 0, filter: "blur(14px)" }}
            animate={{ clipPath: "inset(-40px -200px -120px -200px)", opacity: [0, 1, 0.45, 1, 0.8, 1], filter: "blur(0px)" }}
            transition={{
              delay: T.beam,
              clipPath: { delay: T.beam, duration: 0.5, ease: [0.5, 0, 0.2, 1] },
              opacity: { delay: T.beam, duration: 0.7, times: [0, 0.2, 0.35, 0.5, 0.7, 1] },
              filter: { delay: T.beam, duration: 0.9, ease: EASE },
            }}
          >
            <defs>
              <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fffaf0" stopOpacity="0.95" />
                <stop offset="0.35" stopColor="#f4efe4" stopOpacity="0.42" />
                <stop offset="1" stopColor="#e9e3d6" stopOpacity="0.16" />
              </linearGradient>
              <linearGradient id="beamEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#000" stopOpacity="1" />
                <stop offset="0.5" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="1" />
              </linearGradient>
              <filter id="soft" x="-50%" y="-10%" width="200%" height="120%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="softer" x="-50%" y="-10%" width="200%" height="120%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            {/* wide haze, then the beam itself, then a hot core */}
            <path d={beamPath} fill="url(#beam)" filter="url(#softer)" opacity={0.55} transform={`translate(${W / 2} 0) scale(1.35 1) translate(${-W / 2} 0)`} />
            <motion.g animate={{ opacity: [1, 0.82, 1, 0.9, 1] }} transition={{ delay: T.land + 0.6, duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <path d={beamPath} fill="url(#beam)" filter="url(#soft)" />
              <path d={beamPath} fill="url(#beam)" opacity={0.5} transform={`translate(${W / 2} 0) scale(0.45 1) translate(${-W / 2} 0)`} filter="url(#soft)" />
            </motion.g>
          </motion.svg>

          {/* the lamp */}
          <motion.div
            className="absolute rounded-full bg-white"
            style={{ left: APEX.x - 5, top: APEX.y - 5, width: 10, height: 10, boxShadow: "0 0 14px 5px rgba(255,250,235,.9), 0 0 50px 16px rgba(255,245,225,.35)" }}
            initial={{ opacity: 0, scale: 0.2, filter: "blur(10px)" }}
            animate={{ opacity: [0, 1, 0.25, 1, 0.5, 1], scale: 1, filter: "blur(1px)" }}
            transition={{ delay: T.lamp, duration: 0.8, times: [0, 0.2, 0.35, 0.55, 0.7, 1], ease: "easeOut" }}
          />

          {/* dust in the beam */}
          {MOTES.map((m, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: m.x, top: m.y, width: m.s, height: m.s }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: [0, 14, 28], x: [0, i % 2 ? 4 : -4, 0] }}
              transition={{ delay: T.land + m.delay, duration: m.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* floor glow around the base */}
          <motion.div
            className="absolute rounded-[50%]"
            style={{
              left: W / 2 - PUCK.w * 0.75,
              width: PUCK.w * 1.5,
              top: PUCK.top + PH * 0.7,
              height: 90,
              background: "radial-gradient(closest-side, rgba(255,248,235,.22), transparent)",
              filter: "blur(8px)",
            }}
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: T.land, duration: 1.2, ease: EASE }}
          />

          {/* ---- the stage puck: dark, then lit when the beam lands ---- */}
          <motion.div
            className="absolute"
            style={{ left: W / 2 - PUCK.w / 2, top: PUCK.top, width: PUCK.w, height: PH }}
            initial={{ opacity: 0, y: 34, filter: "blur(16px)", scale: 0.92 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: [0.92, 1, 1.025, 1] }}
            transition={{
              delay: T.puck,
              duration: 1.2,
              ease: EASE,
              scale: { delay: T.puck, duration: T.land - T.puck + 0.5, times: [0, 0.7, 0.82, 1] },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("puck-dark")} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
            <motion.img
              src={img("puck-lit")}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ delay: T.land - 0.05, duration: 0.6, times: [0, 0.3, 0.55, 1] }}
            />
            {/* a glint runs across the S */}
            <motion.img
              src={img("puck-glint")}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full"
              style={{
                mixBlendMode: "screen",
                WebkitMaskImage: "linear-gradient(100deg, transparent 40%, #000 50%, transparent 60%)",
                maskImage: "linear-gradient(100deg, transparent 40%, #000 50%, transparent 60%)",
                WebkitMaskSize: "300% 100%",
                maskSize: "300% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "var(--gx) 0",
                maskPosition: "var(--gx) 0",
              }}
              initial={{ "--gx": "100%" } as never}
              animate={{ "--gx": "0%" } as never}
              transition={{ delay: T.glint, duration: 1.1, ease: [0.45, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* the flash where the light hits */}
          <motion.div
            className="absolute rounded-[50%]"
            style={{
              left: W / 2 - TOP_RX * 1.3,
              top: TOP_Y - TOP_RY * 1.3,
              width: TOP_RX * 2.6,
              height: TOP_RY * 2.6,
              background: "radial-gradient(closest-side, rgba(255,255,250,.95), rgba(255,245,225,.35) 45%, transparent)",
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 1, 0], scale: [0.2, 1, 1.6] }}
            transition={{ delay: T.land - 0.05, duration: 0.9, times: [0, 0.2, 1], ease: "easeOut" }}
          />

          {/* ---- the name ---- */}
          <div className="absolute inset-x-[-40px] flex flex-col items-center" style={{ top: PUCK.top + PH * 0.84 + 30 }}>
            <div className="relative">
              <motion.div
                className="font-brand flex text-[23px] uppercase leading-none text-white"
                initial={{ letterSpacing: "0.9em" }}
                animate={{ letterSpacing: "0.34em" }}
                transition={{ delay: T.word, duration: 1.6, ease: EASE }}
                style={{ marginRight: "-0.34em" }}
              >
                {"SPOTLIGHT".split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(14px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    // from the middle letter outward, like the beam spreading
                    transition={{ delay: T.word + Math.abs(i - 4) * 0.08, duration: 0.9, ease: EASE }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </motion.div>
              {/* light sweep across the letters */}
              <motion.div
                aria-hidden
                className="font-brand pointer-events-none absolute inset-0 text-[23px] uppercase leading-none text-transparent"
                style={{
                  letterSpacing: "0.34em",
                  backgroundImage: "linear-gradient(100deg, transparent 38%, rgba(255,255,255,1) 50%, transparent 62%)",
                  backgroundSize: "300% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,.6))",
                }}
                initial={{ backgroundPositionX: "100%" }}
                animate={{ backgroundPositionX: "0%" }}
                transition={{ delay: T.word + 1.2, duration: 1, ease: EASE }}
              >
                Spotlight
              </motion.div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              {SHOWS.map((s, i) => (
                <motion.span
                  key={s.t}
                  className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55"
                  initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ delay: T.tag + i * 0.12, duration: 0.8, ease: EASE }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 8px ${s.c}` }} />
                  {s.t}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <div className="grain pointer-events-none absolute inset-0 opacity-40" />
      </motion.div>

      <motion.span
        className="absolute bottom-[max(env(safe-area-inset-bottom),24px)] left-0 right-0 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ delay: leaving ? 0 : 1 }}
      >
        Tap to skip
      </motion.span>
    </button>
  );
}

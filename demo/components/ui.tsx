"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SHOWS, countryCode, type Contestant, type ShowKey } from "@/lib/data";
import { useNav } from "./nav";

/** A looping, muted clip that only plays while it's on screen. */
function Clip({ slug, still }: { slug: string; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.55), { threshold: [0, 0.55, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visible && !still) el.play().catch(() => {});
    else el.pause();
  }, [visible, still]);

  return (
    <video
      ref={ref}
      src={`/media/v/${slug}.mp4`}
      poster={`/media/v/${slug}.jpg`}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/**
 * A contestant's "video": a real clip when there is one, otherwise a stage
 * photo drifting slowly (Ken Burns), graded with the contestant's colours.
 */
export function Media({
  hue,
  img,
  video,
  label,
  className = "",
  still,
  children,
}: {
  hue: [string, string];
  img?: string;
  video?: string;
  label?: string;
  className?: string;
  still?: boolean;
  children?: ReactNode;
}) {
  const [a, b] = hue;
  return (
    <div className={`grain absolute inset-0 overflow-hidden bg-[#0b0b10] ${className}`}>
      {video ? (
        <Clip slug={video} still={still} />
      ) : img ? (
        <motion.div
          className="absolute -inset-[8%] bg-cover bg-center"
          style={{ backgroundImage: `url(/media/${img}.jpg)` }}
          initial={{ scale: 1.08 }}
          animate={still ? { scale: 1.08 } : { scale: [1.08, 1.2, 1.08], x: ["0%", "-3%", "0%"], y: ["0%", "2%", "0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <>
          <motion.div
            className="absolute -left-1/4 -top-1/4 h-[90%] w-[110%] rounded-full blur-3xl"
            style={{ background: a, opacity: 0.55 }}
            animate={{ x: ["0%", "18%", "-6%", "0%"], y: ["0%", "12%", "22%", "0%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 h-[80%] w-[100%] rounded-full blur-3xl"
            style={{ background: b, opacity: 0.6 }}
            animate={{ x: ["0%", "-20%", "8%", "0%"], y: ["0%", "-16%", "-4%", "0%"] }}
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      {/* colour grade — light on real footage, heavier on stage photos */}
      {(img || video) && (
        <div
          className={video ? "absolute inset-0 mix-blend-soft-light" : "absolute inset-0 mix-blend-color"}
          style={{ background: `linear-gradient(160deg, ${a}, ${b})`, opacity: video ? 0.35 : 0.55 }}
        />
      )}
      {label && !video && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[22vw] font-black uppercase leading-none tracking-tighter text-white/[0.06] sm:text-[88px]">
            {label}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/85" />
      {children}
    </div>
  );
}

export function Avatar({ c, size = 40, ring }: { c: Contestant; size?: number; ring?: string }) {
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-extrabold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${c.hue[0]}, ${c.hue[1]})`,
        boxShadow: ring ? `0 0 0 2px #040404, 0 0 0 4px ${ring}` : undefined,
      }}
    >
      <span className="relative">{initials}</span>
      {c.slug && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/media/a/${c.slug}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
    </div>
  );
}

/** Real flag image (emoji flags render as letters on some devices). */
export function Flag({ country, size = 16, className = "" }: { country: string; size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${countryCode(country)}.svg`}
      alt={country}
      title={country}
      width={Math.round(size * 1.4)}
      height={size}
      className={`inline-block shrink-0 rounded-[3px] object-cover ${className}`}
      style={{ width: Math.round(size * 1.4), height: size }}
    />
  );
}

export function ShowBadge({ show, small }: { show: ShowKey; small?: boolean }) {
  const s = SHOWS[show];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold uppercase tracking-wider backdrop-blur-md ${
        small ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"
      }`}
      style={{ background: `${s.color}26`, color: s.color, border: `1px solid ${s.color}55` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
      {s.name}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  color,
  className = "",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "white";
  color?: string;
  className?: string;
  disabled?: boolean;
}) {
  // the default primary is Spotlight's own: lit silver on black. Shows pass their colour.
  const styles =
    variant === "primary" && !color
      ? {
          background: "linear-gradient(180deg, #ffffff, #d6d6da)",
          color: "#040404",
          boxShadow: "inset 0 1px 0 #fff, inset 0 -2px 0 rgba(0,0,0,.12), 0 14px 34px -14px rgba(255,255,255,.55)",
        }
      : variant === "primary"
      ? {
          background: `linear-gradient(180deg, ${color}, color-mix(in srgb, ${color} 78%, black))`,
          color: "#fff",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.28), 0 12px 30px -12px ${color}`,
        }
      : variant === "white"
        ? { background: "#fff", color: "#040404" }
        : { background: "rgba(255,255,255,.06)", color: "#fff", border: "1px solid rgba(255,255,255,.1)" };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-[15px] font-bold transition-opacity disabled:opacity-40 ${className}`}
      style={styles}
    >
      {children}
    </motion.button>
  );
}

export function TopBar({ title, right, transparent }: { title?: string; right?: ReactNode; transparent?: boolean }) {
  const { pop } = useNav();
  return (
    <div
      className={`safe-top relative z-20 flex items-center justify-between px-4 pb-3 ${
        transparent ? "" : "border-b border-white/[0.04] bg-ink/75 backdrop-blur-2xl"
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={pop}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl"
        aria-label="Back"
      >
        <ChevronLeft size={22} />
      </motion.button>
      {title && <div className="font-display text-[13px] font-semibold tracking-wide">{title}</div>}
      <div className="flex h-10 min-w-10 items-center justify-end">{right}</div>
    </div>
  );
}

/**
 * Expanding rings — the "signal" motif. Pure CSS keyframes with negative
 * delays, so every ring is already mid-cycle on first paint (no frozen ring
 * waiting for its delay, which read as a flicker).
 */
export function Pulse({ color = "#ff5a1f", size = 180, count = 3, duration = 3 }: { color?: string; size?: number; count?: number; duration?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="pulse-ring absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${color}`,
            animationDuration: `${duration}s`,
            animationDelay: `${(-duration / count) * i}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Frosted surface. */
export const glass = "border border-white/[0.08] bg-white/[0.045] backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.06)]";

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
export const rise = {
  hidden: { opacity: 0, y: 18 },
  // no filter here: a filtered ancestor would break backdrop-blur on glass children
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
};

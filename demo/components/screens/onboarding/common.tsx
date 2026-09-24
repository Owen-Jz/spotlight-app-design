"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { ShowKey } from "@/lib/data";
import type { Role, Route } from "../../nav";
import { useNav } from "../../nav";
import { Button, TopBar, rise, stagger } from "../../ui";

/* ---------------- flow: which steps each role walks through ---------------- */

export type FlowStep = "role" | "signup" | "talentSetup" | "fanSetup" | "brandSetup" | "plan" | "interests";

export const FLOWS: Record<Role, FlowStep[]> = {
  talent: ["role", "signup", "talentSetup", "plan", "interests"],
  fan: ["role", "signup", "fanSetup", "plan"],
  brand: ["role", "signup", "brandSetup", "plan"],
};

export const ROLE_COLOR: Record<Role, string> = { talent: "#ff5a1f", fan: "#ff2e7a", brand: "#f2b53a" };

/** Push whatever comes after `from` in this user's flow (or the celebration). */
export function useFlow() {
  const { user, push } = useNav();
  return {
    next: (from: FlowStep, role: Role = user.role) => {
      const f = FLOWS[role];
      const i = f.indexOf(from);
      const to: Route = i >= 0 && i < f.length - 1 ? { name: f[i + 1] } : { name: "celebrate" };
      push(to);
    },
  };
}

/**
 * Onboarding answers the User type has no field for (shows entered, intro
 * timing, organisation type). Plain module state: written from event
 * handlers, read by the celebration.
 */
export const draft: { shows: ShowKey[]; recordNow: boolean; orgType: string } = {
  shows: ["talent"],
  recordNow: true,
  orgType: "",
};

/* ---------------- step layout ---------------- */

export function Step({
  at,
  role,
  title,
  sub,
  children,
  cta,
  onNext,
  disabled,
  color,
  footer,
}: {
  at: FlowStep;
  /** override the role used to count steps (the role picker previews its choice) */
  role?: Role;
  title: string;
  sub: string;
  children: ReactNode;
  cta: string;
  onNext: () => void;
  disabled?: boolean;
  color?: string;
  footer?: ReactNode;
}) {
  const { user } = useNav();
  const flow = FLOWS[role ?? user.role];
  const step = Math.max(1, flow.indexOf(at) + 1);
  const total = flow.length;
  const accent = color ?? "#ff5a1f";

  return (
    <div className="flex h-full flex-col">
      <TopBar
        transparent
        right={
          <span className="text-xs font-bold tabular-nums text-white/40">
            {step}
            <span className="text-white/20">/{total}</span>
          </span>
        }
      />
      <div className="px-6">
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, k) => k + 1).map((n) => (
            <motion.div key={n} layout className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
                initial={{ width: n < step ? "100%" : "0%" }}
                animate={{ width: n <= step ? "100%" : "0%" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="no-bar flex-1 overflow-y-auto px-6 pt-7">
        <motion.h1 variants={rise} className="font-display text-[27px] font-extrabold leading-[1.1] tracking-tight">
          {title}
        </motion.h1>
        <motion.p variants={rise} className="mt-2 text-[15px] leading-snug text-white/55">
          {sub}
        </motion.p>
        <div className="mt-7 pb-6">{children}</div>
      </motion.div>
      <div className="safe-bottom px-6 pt-3">
        <Button color={accent} onClick={onNext} disabled={disabled}>
          {cta}
        </Button>
        {footer}
      </div>
    </div>
  );
}

/* ---------------- form bits ---------------- */

export function Label({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <div className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: color ?? "rgba(255,255,255,.4)" }}>
      {children}
    </div>
  );
}

export function Field({
  label,
  placeholder,
  prefix,
  value,
  onChange,
  type = "text",
  inputMode,
}: {
  label: string;
  placeholder: string;
  prefix?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "tel" | "email";
}) {
  return (
    <motion.label variants={rise} className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-white/40">{label}</span>
      <div className="mt-2 flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-talent focus-within:bg-white/[0.06]">
        {prefix && <span className="mr-2 font-semibold text-white/50">{prefix}</span>}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-4 text-[16px] font-medium outline-none placeholder:text-white/25"
        />
      </div>
    </motion.label>
  );
}

export function Chips({
  items,
  color,
  picked,
  toggle,
}: {
  items: string[];
  color: string;
  picked: string[];
  toggle: (x: string) => void;
}) {
  return (
    <motion.div variants={stagger} className="flex flex-wrap gap-2">
      {items.map((x) => {
        const on = picked.includes(x);
        return (
          <motion.button
            key={x}
            variants={rise}
            whileTap={{ scale: 0.92 }}
            onClick={() => toggle(x)}
            className="flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition-colors"
            style={{
              borderColor: on ? color : "rgba(255,255,255,.1)",
              background: on ? `color-mix(in srgb, ${color} 85%, black)` : "rgba(255,255,255,.03)",
              color: on ? "#fff" : "rgba(255,255,255,.75)",
            }}
          >
            <AnimatePresence initial={false}>
              {on && (
                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 14, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
            {x}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

/** Round check that pops in on selected cards. */
export function Tick({ on, color }: { on: boolean; color: string }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: color, boxShadow: `0 0 14px ${color}` }}
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const toggleIn = <T,>(list: T[], x: T) => (list.includes(x) ? list.filter((y) => y !== x) : [...list, x]);

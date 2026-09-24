"use client";

import { motion } from "motion/react";
import { Bell, Lightbulb, Phone, Timer } from "lucide-react";
import { type ReactNode } from "react";
import { useNav } from "../../nav";
import { stagger } from "../../ui";

export function IconBtn({ children, onClick, label }: { children: ReactNode; onClick: () => void; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-xl"
    >
      {children}
    </motion.button>
  );
}

/** Notifications bell with unread count — lives in every tab's top bar. */
export function BellButton() {
  const { push, alerts } = useNav();
  const unread = alerts.filter((a) => a.unread).length;
  return (
    <IconBtn onClick={() => push({ name: "notifications" })} label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
      <Bell size={19} />
      {unread > 0 && (
        <motion.span
          key={unread}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-call px-1 text-[9px] font-extrabold shadow-[0_0_10px_rgba(255,90,31,.8)]"
        >
          {unread}
        </motion.span>
      )}
    </IconBtn>
  );
}

/* ---------------- Page chrome for non-feed tabs ---------------- */

/** Title on the left; any extra actions, then the notifications bell, on the right. */
export function Page({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="no-bar relative h-full overflow-y-auto pb-32">
      {/* soft ambient light behind the page */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-full bg-white/[0.07] blur-[90px]" />
      <div className="safe-top sticky top-0 z-10 flex items-center justify-between bg-ink/70 px-5 pb-3 backdrop-blur-2xl">
        <h1 className="font-display text-[26px] font-extrabold tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          {right}
          <BellButton />
        </div>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative px-5">
        {children}
      </motion.div>
    </div>
  );
}

export const SHOW_ICON = { call: Phone, task: Timer, idea: Lightbulb };

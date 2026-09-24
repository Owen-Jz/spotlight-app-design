"use client";

import { AnimatePresence, motion } from "motion/react";
import { House, Plus, Trophy, User, Video } from "lucide-react";
import { useState } from "react";
import { Home } from "./tabs/Home";
import { Shows } from "./tabs/Shows";
import { Enter } from "./tabs/Enter";
import { Ranks } from "./tabs/Ranks";
import { Me } from "./tabs/Me";

type Tab = "home" | "shows" | "enter" | "ranks" | "me";

export function Main() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          className="absolute inset-0"
          initial={{ opacity: 0, filter: "blur(8px)", scale: 0.985 }}
          animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.22 }}
        >
          {tab === "home" && <Home />}
          {tab === "shows" && <Shows />}
          {tab === "enter" && <Enter />}
          {tab === "ranks" && <Ranks />}
          {tab === "me" && <Me />}
        </motion.div>
      </AnimatePresence>

      <TabBar tab={tab} setTab={setTab} />
    </div>
  );
}

/* ---------------- Floating glass tab bar ---------------- */

// Minimal: icons only, a frosted pill, and a glowing bead under the active tab.
function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { k: Tab; icon: typeof House; label: string }[] = [
    { k: "home", icon: House, label: "Home" },
    { k: "shows", icon: Video, label: "Shows" },
    { k: "enter", icon: Plus, label: "Enter a show" },
    { k: "ranks", icon: Trophy, label: "Rankings" },
    { k: "me", icon: User, label: "Profile" },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-6 pb-[max(env(safe-area-inset-bottom),14px)]">
      <div
        className="pointer-events-auto relative flex w-full max-w-[300px] items-center justify-between rounded-full border border-white/[0.12] px-2 py-1.5"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.03))",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.25), 0 18px 40px -12px rgba(0,0,0,.75)",
        }}
      >
        {items.map((it) => {
          const on = tab === it.k;
          if (it.k === "enter")
            return (
              <motion.button
                key={it.k}
                whileTap={{ scale: 0.86 }}
                onClick={() => setTab("enter")}
                aria-label={it.label}
                className="relative flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  background: on ? "linear-gradient(180deg,#ff7a45,#e8440f)" : "rgba(255,255,255,.1)",
                  boxShadow: on ? "0 6px 18px -4px #ff5a1f, inset 0 1px 0 rgba(255,255,255,.35)" : "inset 0 1px 0 rgba(255,255,255,.15)",
                }}
              >
                <Plus size={21} strokeWidth={2.4} />
              </motion.button>
            );
          return (
            <motion.button
              key={it.k}
              whileTap={{ scale: 0.86 }}
              onClick={() => setTab(it.k)}
              aria-label={it.label}
              className="relative flex h-11 w-12 items-center justify-center"
            >
              {on && (
                <motion.span
                  layoutId="tabglow"
                  className="absolute inset-1 rounded-full bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <it.icon size={21} strokeWidth={on ? 2.3 : 1.7} className={`relative transition-colors ${on ? "text-white" : "text-white/45"}`} />
              {on && (
                <motion.span
                  layoutId="tabbead"
                  className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-talent shadow-[0_0_8px_2px_rgba(255,90,31,.7)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

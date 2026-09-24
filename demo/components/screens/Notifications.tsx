"use client";

import { AnimatePresence, motion } from "motion/react";
import { BellOff, CheckCheck, Gift, Heart, Phone, Radio, Trash2, Trophy, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DAILY_FREE_VOTES, HOST, findPerson, type Contestant } from "@/lib/data";
import { useNav, type Alert, type Route } from "../nav";
import { Avatar, Flag, TopBar } from "../ui";

type Kind = Alert["kind"] | "gift";

const KIND: Record<Kind, { icon: typeof Phone; c: string }> = {
  call: { icon: Phone, c: "#ff5a1f" },
  live: { icon: Radio, c: "#ff2e5a" },
  vote: { icon: Heart, c: "#ff2e7a" },
  follow: { icon: UserPlus, c: "#4c7dff" },
  result: { icon: Trophy, c: "#f2b53a" },
  gift: { icon: Gift, c: "#22e58a" },
};

type Item = { id: number | string; kind: Kind; title: string; body: string; time: string; unread: boolean; go?: Route };

/** Older, already-read history so the screen has a past, not just a present. */
const EARLIER: Item[] = [
  { id: "e1", kind: "gift", title: `Your ${DAILY_FREE_VOTES} free votes refilled`, body: "A fresh 10 every day at midnight. Spend them on anyone.", time: "1d", unread: false },
  { id: "e2", kind: "follow", title: "Amara Okafor posted", body: "\"60 seconds to tell you who I am.\"", time: "1d", unread: false, go: { name: "profile", id: "c3" } },
  { id: "e3", kind: "result", title: "Round 1 results are out", body: "Tolu, Rafa and Amara lead The Call.", time: "2d", unread: false, go: { name: "hub", show: "call" } },
];

const isToday = (t: string) => t === "now" || /^\d+(s|m|h)$/.test(t);

/** The person an alert is about, when it's about someone. */
function personFor(a: Item): Contestant | null {
  if (a.go?.name === "profile") return findPerson(a.go.id);
  if (a.kind === "live") return HOST;
  return null;
}

export function Notifications() {
  const { alerts, readAlerts, push, toast } = useNav();
  const [hidden, setHidden] = useState<(number | string)[]>([]);
  const [opened, setOpened] = useState<(number | string)[]>([]);

  // leaving the screen counts as having seen everything (clears the bell),
  // but the dots stay while you're here so you can see what's new
  useEffect(() => () => readAlerts(), [readAlerts]);

  const all: Item[] = [...alerts, ...EARLIER].filter((a) => !hidden.includes(a.id));
  const unread = all.filter((a) => a.unread && !opened.includes(a.id)).length;
  const groups = [
    { t: "Today", items: all.filter((a) => isToday(a.time)) },
    { t: "Earlier", items: all.filter((a) => !isToday(a.time)) },
  ].filter((g) => g.items.length);

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Notifications"
        right={
          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={!unread}
            onClick={() => {
              readAlerts();
              toast("All caught up ✓");
            }}
            className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 text-[12px] font-bold backdrop-blur-xl transition-opacity disabled:opacity-35"
            aria-label="Mark all read"
          >
            <CheckCheck size={15} /> Read all
          </motion.button>
        }
      />
      <div className="no-bar flex-1 overflow-y-auto px-4 pb-12 pt-2">
        {groups.map((g) => (
          <div key={g.t} className="mt-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/40">{g.t}</span>
              {g.t === "Today" && unread > 0 && <span className="text-[12px] font-bold text-call">{unread} new</span>}
            </div>
            <div className="space-y-2">
              <AnimatePresence initial={true}>
                {g.items.map((a, i) => (
                  <Row
                    key={a.id}
                    a={a}
                    i={i}
                    dot={a.unread && !opened.includes(a.id)}
                    onOpen={() => {
                      setOpened((o) => [...o, a.id]);
                      if (a.go) push(a.go);
                    }}
                    onDismiss={() => {
                      setHidden((h) => [...h, a.id]);
                      toast("Notification cleared");
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06]">
              <BellOff size={24} className="text-white/50" />
            </div>
            <div className="mt-5 font-display text-[17px] font-bold">You&apos;re all caught up</div>
            <p className="mt-2 max-w-[240px] text-[13px] text-white/50">When Spotlight calls, a show goes live, or someone you follow posts, it lands here.</p>
          </motion.div>
        )}

        {groups.length > 0 && <p className="mt-6 text-center text-[11px] text-white/30">Swipe left to clear</p>}
      </div>
    </div>
  );
}

function Row({ a, i, dot, onOpen, onDismiss }: { a: Item; i: number; dot: boolean; onOpen: () => void; onDismiss: () => void }) {
  const k = KIND[a.kind];
  const p = personFor(a);
  const dragged = useRef(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: -120, height: 0, marginTop: 0 }}
      transition={{ delay: i * 0.04, type: "spring", stiffness: 320, damping: 32 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* revealed behind the card on swipe */}
      <div className="absolute inset-0 flex items-center justify-end rounded-2xl bg-[#e5484d]/25 pr-5 text-[#ff8a8a]">
        <Trash2 size={18} />
      </div>
      <motion.button
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0.05 }}
        onDragStart={() => (dragged.current = true)}
        onDragEnd={(_, info) => {
          if (info.offset.x < -90 || info.velocity.x < -500) onDismiss();
          setTimeout(() => (dragged.current = false), 0);
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => !dragged.current && onOpen()}
        // opaque, so the delete strip behind it only shows when swiped
        className="relative flex w-full items-start gap-3 rounded-2xl border border-white/[0.08] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
        style={{ touchAction: "pan-y", background: dot ? "linear-gradient(120deg, #221a18, #161617)" : "#131314" }}
      >
        {p ? (
          <div className="relative shrink-0">
            <Avatar c={p} size={42} />
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#111112]"
              style={{ background: k.c }}
            >
              <k.icon size={10} fill={a.kind === "vote" ? "white" : "none"} />
            </span>
          </div>
        ) : (
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl" style={{ background: `${k.c}22`, color: k.c }}>
            <k.icon size={18} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2 pr-3">
            <span className={`text-[14px] ${dot ? "font-extrabold" : "font-bold text-white/85"}`}>{a.title}</span>
            <span className="shrink-0 text-[11px] text-white/40">{a.time}</span>
          </div>
          <div className="mt-0.5 text-[13px] leading-snug text-white/55">{a.body}</div>
          {p && p.id !== "host" && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-white/40">
              <Flag country={p.country} size={10} /> {p.handle}
            </div>
          )}
        </div>
        {dot && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-call shadow-[0_0_8px_#ff5a1f]" />}
      </motion.button>
    </motion.div>
  );
}

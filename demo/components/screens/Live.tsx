"use client";

import { AnimatePresence, motion } from "motion/react";
import { Crown, Eye, Heart, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FINALISTS, HOST, fmt } from "@/lib/data";
import { useNav } from "../nav";
import { Avatar, Button, Flag, Media } from "../ui";

const CHAT = [
  ["ada_lagos", "TOLU!!! 🔥🔥🔥"],
  ["kofi.gh", "Rafa moves like water 🔥"],
  ["zee", "Amara's poem had me in tears"],
  ["mide", "who else voted 50 times 😭"],
  ["jay_ke", "ZAWADI FOR THE WIN 💚"],
  ["bisi", "this split screen is too tense"],
  ["sam", "the host is stalling on purpose 😂"],
  ["nneka", "vote vote vote ❤️"],
  ["tomi", "Lagos stand up!!"],
  ["yinka", "Amara deserves this fr"],
  ["kwame.gh", "watching from Accra 👀"],
  ["lulu", "the lighting on Rafa's screen 😍"],
  ["dayo", "my 10 free votes are GONE"],
  ["ife", "Tolu's high note at the end though"],
  ["wanjiru", "Zawadi made me cry laughing"],
  ["chi", "who's the host's stylist??"],
  ["seun", "shared 3 times for bonus votes 😂"],
  ["abena", "this is better than the Grammys"],
];

const NAME_HUES = ["#ff8a5c", "#7ea2ff", "#f2c14e", "#5de0a0", "#ff6f9a", "#b48cff"];
const hueFor = (u: string) => NAME_HUES[[...u].reduce((a, ch) => a + ch.charCodeAt(0), 0) % NAME_HUES.length];

type Msg = { id: number; u: string; m: string; mine?: boolean; gift?: string };


const CONFETTI = Array.from({ length: 46 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  d: 1.6 + Math.random() * 1.6,
  delay: Math.random() * 0.6,
  r: Math.random() * 720 - 360,
  c: ["#ff5a1f", "#f2b53a", "#4c7dff", "#ffffff", "#ff2e7a"][i % 5],
  w: 6 + Math.random() * 6,
}));

export function Live() {
  const { pop, openVote, user } = useNav();
  const [phase, setPhase] = useState<"live" | "drum" | "winner">("live");
  const [count, setCount] = useState(3);
  const [share, setShare] = useState([31, 27, 24, 18]);
  const [viewers, setViewers] = useState(12400);
  const [chat, setChat] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const winner = FINALISTS[0];
  const leader = share.indexOf(Math.max(...share));

  function heart() {
    const id = Date.now() + Math.random();
    setHearts((h) => [...h.slice(-14), { id, x: Math.random() * 40 - 20 }]);
    setTimeout(() => setHearts((h) => h.filter((x) => x.id !== id)), 1800);
  }

  // live vote swing and viewers
  useEffect(() => {
    if (phase !== "live") return;
    const t = setInterval(() => {
      setShare((s) => {
        const next = s.map((v) => Math.max(8, v + (Math.random() - 0.5) * 4));
        const sum = next.reduce((a, b) => a + b, 0);
        return next.map((v) => (v / sum) * 100);
      });
      setViewers((v) => v + Math.floor(Math.random() * 40));
    }, 1400);
    return () => clearInterval(t);
  }, [phase]);

  // the crowd: a steady stream of chat, vote shout-outs and hearts
  useEffect(() => {
    if (phase !== "live") return;
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      t = setTimeout(() => {
        i++;
        const id = Date.now() + Math.random();
        const [u, m] = CHAT[Math.floor(Math.random() * CHAT.length)];
        if (i % 5 === 0) {
          const f = FINALISTS[Math.floor(Math.random() * FINALISTS.length)];
          const n = [5, 10, 25, 50][Math.floor(Math.random() * 4)];
          setChat((c) => [...c.slice(-6), { id, u, m: `sent ${n} votes to ${f.name.split(" ")[0]}`, gift: f.hue[0] }]);
        } else {
          setChat((c) => [...c.slice(-6), { id, u, m }]);
        }
        if (Math.random() < 0.45) heart();
        next();
      }, 450 + Math.random() * 700);
    };
    next();
    return () => clearTimeout(t);
  }, [phase]);

  // drum roll
  useEffect(() => {
    if (phase !== "drum") return;
    const t = setTimeout(() => (count > 1 ? setCount((c) => c - 1) : setPhase("winner")), 900);
    return () => clearTimeout(t);
  }, [phase, count]);



  return (
    <div className="relative flex h-full flex-col bg-black">
      {/* header */}
      <div className="safe-top relative z-20 flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md bg-call px-2 py-1 text-[11px] font-extrabold tracking-wider">
            <motion.span className="h-1.5 w-1.5 rounded-full bg-white" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            LIVE
          </span>
          <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] font-bold">
            <Eye size={12} /> {fmt(viewers)}
          </span>
        </div>
        <div className="font-display text-[12px] font-semibold tracking-wide text-white/80">GRAND FINAL</div>
        <button onClick={pop} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {phase !== "winner" ? (
        <>
          {/* split screen */}
          <div className="relative grid h-[50%] shrink-0 grid-cols-2 gap-1 px-1">
            {FINALISTS.map((c, i) => (
              <motion.button
                layoutId={`tile-${c.id}`}
                key={c.id}
                onClick={() => openVote(c)}
                className="relative overflow-hidden rounded-xl text-left"
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Media hue={c.hue} video={c.slug} />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <div className="flex items-center gap-1.5 text-[12px] font-bold drop-shadow">
                    {c.name.split(" ")[0]} <Flag country={c.country} size={10} />
                    {i === leader && phase === "live" && (
                      <motion.span layoutId="leader" className="ml-auto rounded bg-idea px-1 text-[9px] font-extrabold text-ink">
                        LEADS
                      </motion.span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
                      <motion.div className="h-full rounded-full bg-white" animate={{ width: `${share[i]}%` }} transition={{ duration: 1 }} />
                    </div>
                    <span className="w-8 text-right text-[11px] font-extrabold">{Math.round(share[i])}%</span>
                  </div>
                </div>
              </motion.button>
            ))}

            <AnimatePresence>
              {phase === "drum" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-white/60">And the winner is</div>
                  <motion.div
                    key={count}
                    initial={{ scale: 2.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-[96px] font-black text-call"
                  >
                    {count}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* host strip */}
          <div className="flex items-center gap-3 px-3 py-3">
            <motion.div layoutId="host" className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
              <Media hue={HOST.hue} video="host" />
              <span className="absolute bottom-1 left-1.5 flex items-center gap-1 text-[10px] font-bold">
                <motion.span className="h-1 w-1 rounded-full bg-call" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                LIVE
              </span>
            </motion.div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[12px] font-bold">
                <Avatar c={HOST} size={20} /> {HOST.name} <Flag country={HOST.country} size={9} />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-1 text-[13px] leading-snug text-white/65"
                >
                  {phase === "drum" ? "“Only one screen stays on…”" : "Tap a finalist to vote. Voting closes when the host calls it."}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* chat */}
          <div className="relative flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-4 pb-2 [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
            <AnimatePresence initial={false}>
              {chat.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={c.gift ? "self-start rounded-full py-0.5 pl-1.5 pr-2.5 text-[12px] font-semibold" : "text-[13px] [text-shadow:0_1px_4px_rgba(0,0,0,.6)]"}
                  style={c.gift ? { background: `${c.gift}26`, border: `1px solid ${c.gift}55` } : undefined}
                >
                  {c.gift && <Heart size={11} fill={c.gift} strokeWidth={0} className="mr-1 inline-block align-[-1px]" />}
                  <span className="font-bold" style={{ color: c.mine ? "#ff5a1f" : c.gift ? "#fff" : hueFor(c.u) }}>
                    {c.u}
                  </span>{" "}
                  <span className="text-white/85">{c.m}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                className="pointer-events-none absolute bottom-4 right-8 text-2xl"
                initial={{ y: 0, opacity: 1, x: 0, scale: 0.6 }}
                animate={{ y: -220, opacity: 0, x: h.x, scale: 1.2 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
              >
                ❤️
              </motion.span>
            ))}
          </div>

          <div className="safe-bottom flex items-center gap-2 px-3 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter" || !draft.trim()) return;
                setChat((c) => [...c.slice(-6), { id: Date.now(), u: user.handle.slice(1), m: draft.trim(), mine: true }]);
                setDraft("");
                heart();
              }}
              placeholder="Say something…"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-[16px] outline-none placeholder:text-white/40 focus:border-call"
            />
            <motion.button whileTap={{ scale: 0.8 }} onClick={heart} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10" aria-label="React">
              <Heart size={20} fill="#ff2e5a" className="text-[#ff2e5a]" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={phase === "drum"}
              onClick={() => setPhase("drum")}
              className="flex h-11 items-center gap-1.5 rounded-full bg-idea px-4 text-[12px] font-extrabold text-ink"
            >
              <Crown size={14} /> Reveal
            </motion.button>
          </div>
        </>
      ) : (
        /* the winner alone with the caller */
        <div className="relative flex min-h-0 flex-1 flex-col gap-1 px-1 pb-1">
          <motion.div layoutId={`tile-${winner.id}`} className="relative flex-[1.3] overflow-hidden rounded-2xl">
            <Media hue={winner.hue} video={winner.slug} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute inset-x-0 bottom-0 p-5"
            >
              <div className="flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-idea">
                <Crown size={14} fill="#f2b53a" /> Winner · Season 1
              </div>
              <div className="mt-1 flex items-center gap-2.5 font-display text-[32px] font-black leading-none">
                {winner.name} <Flag country={winner.country} size={20} />
              </div>
              <div className="mt-2 text-[13px] text-white/70">{fmt(winner.votes)} votes · {winner.category}</div>
            </motion.div>
          </motion.div>
          <motion.div layoutId="host" className="relative flex-1 overflow-hidden rounded-2xl">
            <Media hue={HOST.hue} video="host" />
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 py-1 pl-1 pr-2.5 text-[11px] font-bold backdrop-blur-md">
              <Avatar c={HOST} size={20} /> {HOST.name} · on the call
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="safe-bottom absolute inset-x-4 bottom-2 flex gap-2"
          >
            <Button variant="white" onClick={pop}>
              Close
            </Button>
            <Button onClick={() => openVote(winner)}>
              <Send size={16} /> Congratulate
            </Button>
          </motion.div>

          {/* confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {CONFETTI.map((p) => (
              <motion.span
                key={p.id}
                className="absolute top-0 rounded-sm"
                style={{ left: `${p.x}%`, width: p.w, height: p.w * 0.45, background: p.c }}
                initial={{ y: -20, rotate: 0, opacity: 1 }}
                animate={{ y: 900, rotate: p.r, opacity: [1, 1, 0] }}
                transition={{ duration: p.d, delay: 0.3 + p.delay, ease: "easeIn" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

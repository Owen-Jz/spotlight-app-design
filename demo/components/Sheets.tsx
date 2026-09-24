"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Heart, Link2, MessageCircle, Send, Share2, Wallet } from "lucide-react";
import { useState, type ReactNode } from "react";
import { DAILY_FREE_VOTES, SHOWS, type Contestant } from "@/lib/data";
import { useNav, type SheetState } from "./nav";
import { Avatar, Button, Flag } from "./ui";

export function SheetHost({ sheet, onClose }: { sheet: SheetState; onClose: () => void }) {
  return (
    <AnimatePresence>
      {sheet && (
        <Frame key={sheet.type + ("c" in sheet ? sheet.c.id : "")} onClose={onClose} tall={sheet.type === "comments"}>
          {sheet.type === "vote" && <VoteBody c={sheet.c} onClose={onClose} />}
          {sheet.type === "comments" && <CommentsBody c={sheet.c} />}
          {sheet.type === "share" && <ShareBody c={sheet.c} onClose={onClose} />}
          {sheet.type === "topup" && <TopUpBody onClose={onClose} />}
        </Frame>
      )}
    </AnimatePresence>
  );
}

function Frame({ children, onClose, tall }: { children: ReactNode; onClose: () => void; tall?: boolean }) {
  return (
    <>
      <motion.div
        className="absolute inset-0 z-[60] bg-black/55 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className={`safe-bottom absolute inset-x-0 bottom-0 z-[70] flex flex-col rounded-t-[32px] border-t border-white/10 bg-[#111112]/92 px-5 pt-3 shadow-[0_-30px_80px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl ${
          tall ? "h-[72%]" : ""
        }`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => (i.offset.y > 90 || i.velocity.y > 450) && onClose()}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-white/20" />
        {children}
      </motion.div>
    </>
  );
}

/* ---------------- Vote ---------------- */

const AMOUNTS = [1, 5, 10, 25];

function VoteBody({ c, onClose }: { c: Contestant; onClose: () => void }) {
  const { votesLeft, freeVotes, addVote, extraVotes, toast, sheet } = useNav();
  const [n, setN] = useState(Math.min(5, Math.max(1, freeVotes + votesLeft)));
  const have = freeVotes + votesLeft;
  const [burst, setBurst] = useState(0);
  const total = c.votes + (extraVotes[c.id] ?? 0);
  const color = SHOWS[c.show].color;

  const cast = () => {
    if (!addVote(c.id, n)) {
      toast(have ? `You have ${have} vote${have === 1 ? "" : "s"} left` : "Out of votes. Share to earn more, or top up.");
      return;
    }
    setBurst((b) => b + 1);
    toast(`${n} vote${n > 1 ? "s" : ""} for ${c.name.split(" ")[0]} ❤️`);
    setTimeout(onClose, 650);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar c={c} size={52} ring={color} />
        <div className="flex-1">
          <div className="flex items-center gap-2 font-display text-[17px] font-bold">
            {c.name} <Flag country={c.country} size={13} />
          </div>
          <div className="text-[12px] text-white/50">
            {SHOWS[c.show].name} ·{" "}
            <motion.span key={total} initial={{ color: "#fff" }} animate={{ color: "rgba(255,255,255,.5)" }}>
              {total.toLocaleString()} votes
            </motion.span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {AMOUNTS.map((a) => (
          <motion.button
            key={a}
            whileTap={{ scale: 0.92 }}
            disabled={a > have}
            onClick={() => setN(a)}
            className="relative rounded-2xl border py-3.5 text-center transition-colors disabled:opacity-30"
            style={{ borderColor: n === a ? color : "rgba(255,255,255,.1)", background: n === a ? `${color}22` : "rgba(255,255,255,.02)" }}
          >
            <div className="font-display text-xl font-extrabold">{a}</div>
            <div className="text-[10px] font-semibold text-white/50">vote{a > 1 ? "s" : ""}</div>
          </motion.button>
        ))}
      </div>

      {/* free votes first — nobody has to pay to vote */}
      <div className="mt-4 rounded-2xl bg-white/[0.04] p-4">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold">
            🎁 Free votes today <span className="text-white/40">· refills at midnight</span>
          </span>
          <span className="font-extrabold">
            {freeVotes}
            <span className="text-white/40">/{DAILY_FREE_VOTES}</span>
          </span>
        </div>
        <div className="mt-2.5 flex gap-1">
          {Array.from({ length: DAILY_FREE_VOTES }).map((_, i) => (
            <motion.span
              key={i}
              className="h-1.5 flex-1 rounded-full"
              animate={{ background: i < freeVotes ? color : "rgba(255,255,255,.1)" }}
              transition={{ delay: i * 0.02 }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[12px] text-white/55">
          <span>Bonus votes: <b className="text-white">{votesLeft}</b></span>
          <span className="flex gap-2">
            <button onClick={() => sheet({ type: "share", c })} className="rounded-full bg-white/10 px-3 py-1 font-bold text-white">
              Share for +2
            </button>
            <button onClick={() => sheet({ type: "topup" })} className="rounded-full px-2 py-1 font-bold text-white/50">
              Buy more
            </button>
          </span>
        </div>
      </div>

      <div className="relative mb-3 mt-5">
        <Button color={color} onClick={cast} disabled={!have}>
          <Heart size={18} fill="white" /> {have ? `Cast ${n} vote${n > 1 ? "s" : ""}${n <= freeVotes ? " · free" : ""}` : "No votes left today"}
        </Button>
        <AnimatePresence>
          {burst > 0 &&
            Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={`${burst}-${i}`}
                className="pointer-events-none absolute left-1/2 top-1/2 text-xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ x: Math.cos((i / 10) * Math.PI * 2) * 110, y: Math.sin((i / 10) * Math.PI * 2) * 55 - 45, opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                ❤️
              </motion.span>
            ))}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ---------------- Comments ---------------- */

function CommentsBody({ c }: { c: Contestant }) {
  const { comments, addComment } = useNav();
  const [text, setText] = useState("");
  const [liked, setLiked] = useState<number[]>([]);
  const list = comments[c.id] ?? [];

  const send = () => {
    const t = text.trim();
    if (!t) return;
    addComment(c.id, t);
    setText("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-display text-[15px] font-bold">{list.length} comments</div>
        <MessageCircle size={18} className="text-white/40" />
      </div>
      <div className="no-bar -mx-5 min-h-0 flex-1 overflow-y-auto px-5">
        <AnimatePresence initial={false}>
          {list.map((m) => {
            const on = liked.includes(m.id);
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="flex gap-3 py-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-bold"
                  style={{ background: m.mine ? "#ff5a1f" : "rgba(255,255,255,.08)" }}
                >
                  {m.user[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-white/50">
                    {m.user} {m.mine && <span className="text-call">· you</span>}
                  </div>
                  <div className="mt-0.5 text-[14px] leading-snug">{m.text}</div>
                </div>
                <button
                  onClick={() => setLiked((l) => (on ? l.filter((x) => x !== m.id) : [...l, m.id]))}
                  className="flex flex-col items-center gap-0.5 pt-1"
                  aria-label="Like comment"
                >
                  <motion.span animate={on ? { scale: [1, 1.4, 1] } : { scale: 1 }}>
                    <Heart size={16} fill={on ? "#ff2e5a" : "none"} className={on ? "text-[#ff2e5a]" : "text-white/40"} />
                  </motion.span>
                  <span className="text-[10px] text-white/40">{m.likes + (on ? 1 : 0)}</span>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 border-t border-white/5 pb-2 pt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Hype up ${c.name.split(" ")[0]}…`}
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-[16px] outline-none placeholder:text-white/30 focus:border-call"
        />
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={send}
          disabled={!text.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-call transition-opacity disabled:opacity-30"
          aria-label="Send"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}

/* ---------------- Share ---------------- */

const APPS = [
  { t: "WhatsApp", c: "#25d366", l: "W" },
  { t: "Instagram", c: "#e1306c", l: "IG" },
  { t: "X", c: "#e7e7e7", l: "X" },
  { t: "TikTok", c: "#25f4ee", l: "TT" },
];

// sharing earns bonus votes, once per contestant per session
const sharedOnce = new Set<string>();

function ShareBody({ c, onClose }: { c: Contestant; onClose: () => void }) {
  const { toast, earnFree } = useNav();
  const reward = () => {
    if (sharedOnce.has(c.id)) return false;
    sharedOnce.add(c.id);
    earnFree(2, `shared ${c.name.split(" ")[0]}`);
    return true;
  };
  const [copied, setCopied] = useState(false);
  const link = `spotlight.app/${c.handle.slice(1)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`);
    } catch {}
    setCopied(true);
    if (!reward()) toast("Link copied 🔗");
    setTimeout(onClose, 700);
  };

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Vote ${c.name} on Spotlight`, text: `Vote for ${c.name} on Spotlight`, url: `https://${link}` });
      } catch {}
    } else copy();
  };

  return (
    <>
      <div className="font-display text-[15px] font-bold">Share {c.name.split(" ")[0]}&apos;s entry</div>
      <p className="mt-1 text-[13px] text-white/50">
        Every share brings them more votes, and earns <b className="text-white">you +2 bonus votes</b> (once per contestant).
      </p>
      <div className="mt-5 grid grid-cols-4 gap-3">
        {APPS.map((a, i) => (
          <motion.button
            key={a.t}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (!reward()) toast(`Opening ${a.t}…`);
              onClose();
            }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-[13px] font-black text-ink"
              style={{ background: a.c, boxShadow: `0 10px 24px -10px ${a.c}` }}
            >
              {a.l}
            </span>
            <span className="text-[11px] font-semibold text-white/60">{a.t}</span>
          </motion.button>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 pl-4">
        <Link2 size={16} className="text-white/40" />
        <span className="flex-1 truncate text-[13px] text-white/70">{link}</span>
        <motion.button whileTap={{ scale: 0.92 }} onClick={copy} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[12px] font-extrabold text-ink">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
        </motion.button>
      </div>
      <div className="mb-3 mt-3">
        <Button variant="ghost" onClick={native}>
          <Share2 size={16} /> More options
        </Button>
      </div>
    </>
  );
}

/* ---------------- Top up ---------------- */

const PACKS = [
  { v: 50, p: "₦500" },
  { v: 150, p: "₦1,200", tag: "Save 20%" },
  { v: 500, p: "₦3,500", tag: "Best value" },
];

function TopUpBody({ onClose }: { onClose: () => void }) {
  const { topUp, toast, votesLeft } = useNav();
  const [pick, setPick] = useState(150);
  const [stage, setStage] = useState<"pick" | "paying" | "done">("pick");
  const pack = PACKS.find((p) => p.v === pick)!;

  const pay = () => {
    setStage("paying");
    setTimeout(() => {
      topUp(pick);
      setStage("done");
      toast(`+${pick} votes added ⚡`);
      setTimeout(onClose, 1100);
    }, 1400);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-[15px] font-bold">Top up votes</div>
          <div className="text-[12px] text-white/50">You have {votesLeft} left</div>
        </div>
        <Wallet size={20} className="text-call" />
      </div>
      <div className="mt-5 space-y-2">
        {PACKS.map((p) => {
          const on = p.v === pick;
          return (
            <motion.button
              key={p.v}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPick(p.v)}
              disabled={stage !== "pick"}
              className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors"
              style={{ borderColor: on ? "#ff5a1f" : "rgba(255,255,255,.08)", background: on ? "#ff5a1f14" : "rgba(255,255,255,.02)" }}
            >
              <span className="font-display text-2xl font-black">{p.v}</span>
              <span className="flex-1 text-[13px] text-white/60">votes</span>
              {p.tag && <span className="rounded-full bg-call/15 px-2 py-0.5 text-[10px] font-bold text-call">{p.tag}</span>}
              <span className="font-bold">{p.p}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="mb-3 mt-5">
        <Button onClick={pay} disabled={stage !== "pick"}>
          <AnimatePresence mode="wait" initial={false}>
            {stage === "pick" && (
              <motion.span key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                Pay {pack.p}
              </motion.span>
            )}
            {stage === "paying" && (
              <motion.span key="b" className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
                Processing…
              </motion.span>
            )}
            {stage === "done" && (
              <motion.span key="c" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <Check size={18} /> Votes added
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <p className="mt-2 text-center text-[11px] text-white/35">Demo only. No real payment is made.</p>
      </div>
    </>
  );
}


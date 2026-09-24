"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { CONTESTANTS, DAILY_FREE_VOTES, SEED_ALERTS, SEED_COMMENTS, type Contestant } from "@/lib/data";
import { NavContext, type Alert, type Comment, type Entry, type Route, type SheetState, type StackItem, type User } from "./nav";
import { SheetHost } from "./Sheets";
import { StatusBar } from "./StatusBar";
import { Intro } from "./screens/Intro";
import { Welcome, Signup, Role, Plan, Interests, TalentSetup, FanSetup, BrandSetup, Celebrate } from "./screens/Onboarding";
import { Main } from "./screens/Main";
import { Hub } from "./screens/Hub";
import { Record } from "./screens/Record";
import { Incoming } from "./screens/Incoming";
import { Live } from "./screens/Live";
import { Profile } from "./screens/Profile";
import { Search } from "./screens/Search";
import { Notifications } from "./screens/Notifications";
import { Settings } from "./screens/Settings";
import { EntryViewer } from "./screens/EntryViewer";

type Anim = { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition };

const SLIDE: Anim = { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
const UP: Anim = { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
const FADE: Anim = {
  initial: { opacity: 0, scale: 1.04 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};
// the intro rushes out of focus; welcome pulls back into it
const FOCUS: Anim = {
  initial: { opacity: 0, scale: 0.92, filter: "blur(18px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0 },
};

const ANIM: Record<Route["name"], Anim> = {
  intro: FADE,
  welcome: FOCUS,
  signup: SLIDE,
  role: SLIDE,
  talentSetup: SLIDE,
  fanSetup: SLIDE,
  brandSetup: SLIDE,
  celebrate: FADE,
  plan: SLIDE,
  interests: SLIDE,
  main: FADE,
  hub: SLIDE,
  record: UP,
  incoming: FADE,
  live: UP,
  profile: SLIDE,
  search: FADE,
  notifications: SLIDE,
  settings: SLIDE,
  entry: UP,
};

function render(r: StackItem) {
  switch (r.name) {
    case "intro":
      return <Intro />;
    case "welcome":
      return <Welcome />;
    case "signup":
      return <Signup />;
    case "role":
      return <Role />;
    case "talentSetup":
      return <TalentSetup />;
    case "fanSetup":
      return <FanSetup />;
    case "brandSetup":
      return <BrandSetup />;
    case "celebrate":
      return <Celebrate />;
    case "plan":
      return <Plan />;
    case "interests":
      return <Interests />;
    case "main":
      return <Main />;
    case "hub":
      return <Hub show={r.show} />;
    case "record":
      return <Record task={r.task} />;
    case "incoming":
      return <Incoming />;
    case "live":
      return <Live />;
    case "profile":
      return <Profile id={r.id} />;
    case "search":
      return <Search />;
    case "notifications":
      return <Notifications />;
    case "settings":
      return <Settings />;
    case "entry":
      return <EntryViewer id={r.id} />;
  }
}

const seedComments = () => {
  const out: Record<string, Comment[]> = {};
  CONTESTANTS.forEach((c, ci) => {
    out[c.id] = SEED_COMMENTS.map(([user, text, likes], i) => ({ id: ci * 100 + i, user, text, likes: Math.max(3, likes - ci * 7) }));
  });
  return out;
};

export function Shell() {
  const keyRef = useRef(1);
  const [stack, setStack] = useState<StackItem[]>([{ name: "intro", key: 0 }]);
  const [sheet, setSheet] = useState<SheetState>(null);
  const [statusBar, setStatusBar] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [user, setUserState] = useState<User>({ name: "Tobi Ade", handle: "@tobiade", role: "fan", plan: "free", country: "Nigeria", interests: ["Music", "Dance"] });
  const [freeVotes, setFreeVotes] = useState(DAILY_FREE_VOTES);
  const [votesLeft, setVotesLeft] = useState(0);
  const [myVotes, setMyVotes] = useState<Record<string, number>>({});
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [extraVotes, setExtraVotes] = useState<Record<string, number>>({});
  const [following, setFollowing] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>(seedComments);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(() => SEED_ALERTS.map((a, i) => ({ ...a, id: i, unread: i < 3 })));

  const mk = (r: Route): StackItem => ({ ...r, key: keyRef.current++ });

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-1), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  }, []);

  // free votes are spent first, then paid/bonus ones
  const addVote = useCallback(
    (id: string, n: number) => {
      if (n > freeVotes + votesLeft) return false;
      const fromFree = Math.min(n, freeVotes);
      setFreeVotes((f) => f - fromFree);
      setVotesLeft((v) => v - (n - fromFree));
      setExtraVotes((e) => ({ ...e, [id]: (e[id] ?? 0) + n }));
      setMyVotes((m) => ({ ...m, [id]: (m[id] ?? 0) + n }));
      return true;
    },
    [freeVotes, votesLeft],
  );

  // stable, so screens can call it from an effect without re-triggering it
  const readAlerts = useCallback(() => setAlerts((a) => (a.some((x) => x.unread) ? a.map((x) => ({ ...x, unread: false })) : a)), []);

  const nav = useMemo(
    () => ({
      push: (r: Route) => setStack((s) => [...s, mk(r)]),
      pop: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      replace: (r: Route) => setStack((s) => [...s.slice(0, -1), mk(r)]),
      reset: (r: Route) => setStack([mk(r)]),
      sheet: setSheet,
      openVote: (c: Contestant) => setSheet({ type: "vote", c }),
      toast,
      user,
      setUser: (u: Partial<User>) => setUserState((x) => ({ ...x, ...u })),
      freeVotes,
      votesLeft,
      topUp: (n: number) => setVotesLeft((v) => v + n),
      earnFree: (n: number, why: string) => {
        setVotesLeft((v) => v + n);
        toast(`+${n} bonus votes · ${why}`);
      },
      myVotes,
      shortlist,
      toggleShortlist: (id: string) => setShortlist((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])),
      extraVotes,
      addVote,
      following,
      toggleFollow: (id: string) => setFollowing((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
      comments,
      addComment: (id: string, text: string) =>
        setComments((c) => ({ ...c, [id]: [{ id: Date.now(), user: user.handle.slice(1), text, likes: 0, mine: true }, ...(c[id] ?? [])] })),
      entries,
      addEntry: (e: Omit<Entry, "id" | "at" | "status">) =>
        setEntries((x) => [{ ...e, id: `e${Date.now()}`, at: "Just now", status: "In review" as const }, ...x]),
      alerts,
      readAlerts,
      addAlert: (a: Omit<Alert, "id" | "time" | "unread">) => setAlerts((x) => [{ ...a, id: Date.now(), time: "now", unread: true }, ...x]),
    }),
    [toast, readAlerts, user, freeVotes, votesLeft, myVotes, shortlist, extraVotes, addVote, following, comments, entries, alerts],
  );

  return (
    <NavContext.Provider value={nav}>
      <div className="flex min-h-dvh items-center justify-center bg-black sm:bg-[radial-gradient(ellipse_at_top,#1a1a22,#000)]">
        <div
          style={{ "--sb": statusBar ? "50px" : "12px" } as React.CSSProperties}
          className="relative h-dvh w-full overflow-hidden bg-ink sm:h-[860px] sm:max-h-[94dvh] sm:w-[400px] sm:rounded-[48px] sm:border-[8px] sm:border-[#1c1c22] sm:shadow-[0_40px_120px_-20px_rgba(255,90,31,.25)]">
          {/* no initial={false}: it would propagate down and freeze the intro's entrance animations */}
          <AnimatePresence>
            {stack.map((r, i) => {
              const a = ANIM[r.name];
              return (
                <motion.div
                  key={r.key}
                  // isolate: each screen is its own stacking context, so a lower
                  // screen's z-indexed chrome (tab bar, feed overlay) can't leak above
                  className="absolute inset-0 isolate overflow-hidden bg-ink"
                  style={{ zIndex: i + 1 }}
                  initial={a.initial}
                  animate={a.animate}
                  exit={a.exit}
                  transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
                >
                  {render(r)}
                </motion.div>
              );
            })}
          </AnimatePresence>

          <SheetHost sheet={sheet} onClose={() => setSheet(null)} />
          <StatusBar onChange={setStatusBar} />

          <div className="safe-top pointer-events-none absolute inset-x-0 top-0 z-[80] flex flex-col items-center gap-2">
            <AnimatePresence>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ y: -40, opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                  className="rounded-full border border-white/10 bg-[#1a1a1c]/85 px-4 py-2.5 text-[13px] font-semibold shadow-2xl backdrop-blur-2xl"
                >
                  {t.msg}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </NavContext.Provider>
  );
}

"use client";

import { createContext, useContext } from "react";
import type { Contestant, ShowKey } from "@/lib/data";

export type Route =
  | { name: "intro" }
  | { name: "welcome" }
  | { name: "signup" }
  | { name: "role" }
  | { name: "talentSetup" }
  | { name: "fanSetup" }
  | { name: "brandSetup" }
  | { name: "celebrate" }
  | { name: "plan" }
  | { name: "interests" }
  | { name: "main" }
  | { name: "hub"; show: ShowKey }
  | { name: "record"; task?: string }
  | { name: "incoming" }
  | { name: "live" }
  | { name: "profile"; id: string }
  | { name: "search" }
  | { name: "notifications" }
  | { name: "settings" }
  | { name: "entry"; id: string };

export type StackItem = Route & { key: number };

export type SheetState =
  | { type: "vote"; c: Contestant }
  | { type: "comments"; c: Contestant }
  | { type: "share"; c: Contestant }
  | { type: "topup" }
  | null;

export type Comment = { id: number; user: string; text: string; likes: number; mine?: boolean };
export type Entry = { id: string; show: ShowKey; title: string; category: string; status: "In review" | "Live"; at: string };
export type Alert = { id: number; kind: "call" | "live" | "vote" | "follow" | "result"; title: string; body: string; time: string; unread: boolean; go?: Route };

export type Role = "talent" | "fan" | "brand";

export type User = {
  name: string;
  handle: string;
  role: Role;
  plan: "free" | "fan" | "talent" | "scout";
  country: string;
  interests: string[];
  /** talent */
  talent?: string;
  stageName?: string;
  bio?: string;
  /** brand / investor */
  company?: string;
  lookingFor?: "talent" | "ideas" | "both";
  budget?: string;
};

type Nav = {
  push: (r: Route) => void;
  pop: () => void;
  replace: (r: Route) => void;
  reset: (r: Route) => void;
  sheet: (s: SheetState) => void;
  openVote: (c: Contestant) => void;
  toast: (msg: string) => void;

  user: User;
  setUser: (u: Partial<User>) => void;
  /** free votes left today (refills daily) — used before paid votes */
  freeVotes: number;
  /** paid / bonus votes */
  votesLeft: number;
  topUp: (n: number) => void;
  earnFree: (n: number, why: string) => void;
  extraVotes: Record<string, number>;
  /** my votes per contestant */
  myVotes: Record<string, number>;
  addVote: (id: string, n: number) => boolean;
  /** brand/investor shortlist */
  shortlist: string[];
  toggleShortlist: (id: string) => void;
  following: string[];
  toggleFollow: (id: string) => void;
  comments: Record<string, Comment[]>;
  addComment: (id: string, text: string) => void;
  entries: Entry[];
  addEntry: (e: Omit<Entry, "id" | "at" | "status">) => void;
  alerts: Alert[];
  readAlerts: () => void;
  addAlert: (a: Omit<Alert, "id" | "time" | "unread">) => void;
};

export const NavContext = createContext<Nav | null>(null);

export function useNav() {
  const n = useContext(NavContext);
  if (!n) throw new Error("useNav outside Shell");
  return n;
}

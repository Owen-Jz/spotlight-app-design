"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Role } from "../../nav";
import { useNav } from "../../nav";
import { Flag, glass, rise } from "../../ui";

export const ROLE_META: Record<Role, { label: string; color: string; hue: [string, string] }> = {
  talent: { label: "Talent", color: "#ff5a1f", hue: ["#ff5a1f", "#7a1fff"] },
  fan: { label: "Fan", color: "#ff2e7a", hue: ["#ff2e7a", "#ffb01f"] },
  brand: { label: "Scout", color: "#f2b53a", hue: ["#f2b53a", "#b8410f"] },
};

/** The signed-in user's avatar (initials on their role gradient). */
export function MeAvatar({ size = 84 }: { size?: number }) {
  const { user } = useNav();
  const meta = ROLE_META[user.role];
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="relative rounded-full p-[3px]"
      style={{ background: `conic-gradient(from 200deg, ${meta.hue[0]}, ${meta.hue[1]}, ${meta.hue[0]})`, boxShadow: `0 14px 36px -12px ${meta.color}` }}
    >
      <div className="rounded-full bg-ink p-[3px]">
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-full font-display font-black"
          style={{ width: size, height: size, fontSize: size * 0.32, background: `linear-gradient(135deg, ${meta.hue[0]}, ${meta.hue[1]})` }}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_55%)]" />
          <span className="relative">{initials}</span>
        </div>
      </div>
      <span className="absolute -bottom-0.5 -right-1">
        <Flag country={user.country} size={15} />
      </span>
    </div>
  );
}

/** Identity block shared by all three roles. */
export function MeHeader({ title, subtitle, chips, badge }: { title: string; subtitle?: ReactNode; chips?: ReactNode; badge?: ReactNode }) {
  const { user } = useNav();
  return (
    <motion.div variants={rise} className="flex items-center gap-4">
      <MeAvatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-display text-[21px] font-extrabold leading-tight">{title}</span>
          {badge}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-white/50">
          {subtitle ?? (
            <>
              <span className="truncate">{user.handle}</span>
              <span className="text-white/25">·</span>
              <Flag country={user.country} size={11} />
              <span className="truncate">{user.country}</span>
            </>
          )}
        </div>
        {chips && <div className="mt-2 flex flex-wrap gap-1.5">{chips}</div>}
      </div>
    </motion.div>
  );
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
      style={color ? { background: `${color}22`, color } : { background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.8)" }}
    >
      {children}
    </span>
  );
}

/** Demo-only control so the owner can preview all three profiles. */
export function RoleSwitch() {
  const { user, setUser, toast } = useNav();
  return (
    <motion.div variants={rise} className={`mt-5 flex items-center gap-2 rounded-2xl p-1 pl-3 ${glass}`}>
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-white/35">Demo · view as</span>
      <div className="flex flex-1">
        {(Object.keys(ROLE_META) as Role[]).map((r) => {
          const on = user.role === r;
          return (
            <button
              key={r}
              onClick={() => {
                if (on) return;
                setUser({ role: r });
                toast(`Previewing the ${ROLE_META[r].label.toLowerCase()} profile`);
              }}
              className="relative flex-1 rounded-xl py-2 text-[12px] font-bold"
              style={{ color: on ? "#040404" : "rgba(255,255,255,.55)" }}
            >
              {on && <motion.span layoutId="me-role" className="absolute inset-0 rounded-xl" style={{ background: ROLE_META[r].color }} />}
              <span className="relative">{ROLE_META[r].label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

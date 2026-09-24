"use client";

import { motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { fmt } from "@/lib/data";
import { DOWN, UP } from "./model";

/** Tiny 7-day line with soft area fill and a glowing end dot. */
export function Sparkline({ data, color, w = 58, h = 22 }: { data: number[]; color: string; w?: number; h?: number }) {
  const id = useId();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (w - pad * 2), pad + (1 - (v - min) / span) * (h - pad * 2)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <circle cx={ex} cy={ey} r={2.4} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </svg>
  );
}

const WEEK = ["S", "M", "T", "W", "T", "F", "S"];

/** 7 day bars, today highlighted, with the peak and today labelled. */
export function TrendBars({ data, color, now }: { data: number[]; color: string; now: number }) {
  const max = Math.max(...data) || 1;
  const peak = data.indexOf(max);
  const todayDow = new Date((now || 0) * 1000).getDay();
  const labels = data.map((_, i) => (i === data.length - 1 ? "Today" : WEEK[(todayDow - (data.length - 1 - i) + 14) % 7]));
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  return (
    <div className="relative">
      <div className="relative flex h-[92px] items-end gap-1.5">
        {/* 7-day average guide */}
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-white/15"
          style={{ bottom: `${(avg / max) * 72}px` }}
        >
          <span className="absolute -top-3.5 right-0 text-[9px] font-semibold text-white/35">avg {fmt(Math.round(avg))}</span>
        </div>
        {data.map((v, i) => {
          const today = i === data.length - 1;
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              {(today || i === peak) && (
                <span className="mb-1 text-[9px] font-bold tabular-nums" style={{ color: today ? color : "rgba(255,255,255,.55)" }}>
                  {fmt(v)}
                </span>
              )}
              <motion.div
                className="w-full rounded-t-md"
                style={{
                  background: today ? `linear-gradient(${color}, ${color}66)` : "linear-gradient(rgba(255,255,255,.22), rgba(255,255,255,.06))",
                  boxShadow: today ? `0 0 16px -2px ${color}` : undefined,
                }}
                initial={{ height: 0 }}
                animate={{ height: Math.max(4, (v / max) * 72) }}
                transition={{ type: "spring", stiffness: 180, damping: 20, delay: i * 0.035 }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {labels.map((l, i) => (
          <span key={i} className={`flex-1 text-center text-[9px] font-semibold ${i === labels.length - 1 ? "text-white/80" : "text-white/35"}`}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** ▲3 / ▼1 / — movement badge. */
export function Move({ n, big }: { n: number; big?: boolean }) {
  const color = n > 0 ? UP : n < 0 ? DOWN : "rgba(255,255,255,.35)";
  const label = n > 0 ? `Up ${n} places` : n < 0 ? `Down ${-n} places` : "No change";
  return (
    <span
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-0.5 font-extrabold tabular-nums leading-none ${big ? "text-[12px]" : "text-[9.5px]"}`}
      style={{ color }}
    >
      {n > 0 ? "▲" : n < 0 ? "▼" : "–"}
      {n !== 0 && Math.abs(n)}
    </span>
  );
}

/** Circular progress ring (free votes left). */
export function Ring({ value, max, color, size = 44, children }: { value: number; max: number; color: string; size?: number; children?: ReactNode }) {
  const r = size / 2 - 3.5;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={3.5} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, value / (max || 1))) }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="relative">{children}</span>
    </div>
  );
}

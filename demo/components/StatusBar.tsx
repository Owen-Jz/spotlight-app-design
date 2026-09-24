"use client";

import { useEffect, useState } from "react";

/**
 * A mock iPhone status bar (time, signal, 5G, Wi-Fi, battery) so the demo
 * reads as a real phone. Hidden when the site runs as an installed iOS web
 * app, where the real status bar already sits in this spot.
 */
export function StatusBar({ onChange }: { onChange?: (shown: boolean) => void }) {
  const [time, setTime] = useState("9:41");
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const t0 = setTimeout(() => {
      setShown(!standalone);
      onChange?.(!standalone);
    }, 0);
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 15000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, [onChange]);

  if (!shown) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[95] flex h-[46px] items-center justify-between px-7 pt-1 text-white mix-blend-difference">
      <span className="w-14 text-[15px] font-semibold tracking-tight [font-feature-settings:'tnum']">{time}</span>
      <div className="flex items-center gap-[6px]">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <span className="text-[13px] font-semibold">5G</span>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .8 10.2 10.2 0 0 0 .9 3.6L2 4.8a8.6 8.6 0 0 1 6-2.4Z" />
          <path d="M8 5.6c1.4 0 2.7.5 3.7 1.4l1.1-1.2A7 7 0 0 0 8 4a7 7 0 0 0-4.8 1.8L4.3 7A5.4 5.4 0 0 1 8 5.6Z" />
          <path d="M8 8.8c.6 0 1.1.2 1.5.6L8 11 6.5 9.4c.4-.4.9-.6 1.5-.6Z" />
        </svg>
        {/* battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" />
        </svg>
      </div>
    </div>
  );
}

/**
 * The Spotlight mark: a beam of light falling on a black stage puck with a
 * silver "S". The puck is a Blender render (public/brand), so it looks the
 * same here as in the intro.
 */

/** The app icon (beam + puck on black), as a rounded tile. */
export function LogoMark({ size = 32 }: { size?: number }) {
  const src = size > 64 ? "/brand/icon-512.png" : "/brand/icon-192.png";
  return (
    <span
      className="relative inline-flex shrink-0 overflow-hidden bg-black"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,.1)",
          `inset 0 ${Math.max(1, size / 120)}px 0 rgba(255,255,255,.18)`,
          `0 ${size / 6}px ${size / 2.4}px -${size / 10}px rgba(255,255,255,.28)`,
        ].join(","),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={size} height={size} className="h-full w-full scale-[1.3] object-cover" style={{ transformOrigin: "50% 62%" }} draggable={false} />
    </span>
  );
}

/** "SPOTLIGHT" in the brand face: wide, tracked out, brushed silver. */
export function Wordmark({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`font-brand inline-block whitespace-nowrap uppercase leading-none ${className}`}
      style={{
        fontSize: size,
        letterSpacing: "0.32em",
        marginRight: "-0.32em", // tracking adds space after the last letter too
        backgroundImage: "linear-gradient(180deg, #ffffff 20%, #c9c9cf 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      Spotlight
    </span>
  );
}

/** Mark + wordmark, for headers. */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <Wordmark size={size * 0.44} />
    </span>
  );
}

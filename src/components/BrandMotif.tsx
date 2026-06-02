/**
 * CommonSpirit brand motifs.
 *
 * SparkMark — an abstract nod to CommonSpirit's emblem: four petal/ray shapes
 * coming together to form a "bright guiding star." Multi-hue by default
 * (magenta-led, with the emblem's warm + cool accents), or single-tone.
 *
 * BrandSweep — the brand's signature "sweep": soft overlapping curves used as
 * a tertiary background accent. Per the brand system it should stay light and
 * never dominate, so opacities are intentionally low.
 */

interface SparkMarkProps {
  size?: number;
  className?: string;
  /** Render in a single brand tone instead of the multi-hue emblem palette. */
  mono?: boolean;
}

const PETALS = [
  { rotate: 0, fill: "#982f6a" },   // brand magenta
  { rotate: 90, fill: "#d8527c" },  // warm rose
  { rotate: 180, fill: "#e8843f" }, // ember
  { rotate: 270, fill: "#2f9c95" }, // teal
];

export function SparkMark({ size = 28, className = "", mono = false }: SparkMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(50 50)">
        {PETALS.map((p, i) => (
          <path
            key={i}
            transform={`rotate(${p.rotate})`}
            d="M0 0 C 14 -8 30 -8 42 0 C 30 8 14 8 0 0 Z"
            fill={mono ? "currentColor" : p.fill}
            opacity={mono ? 0.9 - i * 0.12 : 0.92}
          />
        ))}
      </g>
    </svg>
  );
}

interface BrandSweepProps {
  className?: string;
  /** Tone of the sweep. "light" for white/airy surfaces, "dark" for ink shells. */
  tone?: "light" | "dark";
}

export function BrandSweep({ className = "", tone = "light" }: BrandSweepProps) {
  const stops =
    tone === "dark"
      ? { a: "#cf5e93", b: "#2f9c95", base: 0.16 }
      : { a: "#982f6a", b: "#e8843f", base: 0.1 };

  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cs-sweep-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stops.a} stopOpacity={stops.base * 2.4} />
          <stop offset="100%" stopColor={stops.a} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cs-sweep-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stops.b} stopOpacity={stops.base * 1.8} />
          <stop offset="100%" stopColor={stops.b} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-40 360 C 140 220 360 520 660 300 L 660 660 L -40 660 Z"
        fill="url(#cs-sweep-a)"
      />
      <path
        d="M-40 460 C 200 360 380 600 660 420 L 660 660 L -40 660 Z"
        fill="url(#cs-sweep-b)"
      />
    </svg>
  );
}

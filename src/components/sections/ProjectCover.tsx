import type { ProjectCover as CoverKind } from "@/content/types";

/**
 * Illustrative, code-drawn covers (not screenshots). Weightless, crisp at any
 * DPR, and consistent across cards. Replace with real captures when available.
 */
const ACCENT = "var(--color-accent)";
const LINE = "rgb(24 22 18 / 0.14)";
const FILL = "rgb(255 255 255 / 0.7)";

function Bookstore() {
  const spines = [70, 92, 64, 100, 80, 58, 88, 96, 72, 84, 60, 90];
  return (
    <>
      {[0, 1].map((shelf) => (
        <g key={shelf} transform={`translate(40 ${40 + shelf * 100})`}>
          {spines.map((h, i) => {
            const height = h * 0.8 - (shelf ? (i % 3) * 6 : 0);
            return (
              <rect
                key={i}
                x={i * 27}
                y={80 - height}
                width={20}
                height={height}
                rx={3}
                fill={(i + shelf) % 5 === 1 ? ACCENT : FILL}
                fillOpacity={(i + shelf) % 5 === 1 ? 0.75 : 1}
                stroke={LINE}
              />
            );
          })}
          <line x1={-8} x2={330} y1={82} y2={82} stroke={LINE} strokeWidth={2} />
        </g>
      ))}
    </>
  );
}

function Food() {
  return (
    <>
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => {
          const x = 40 + col * 108;
          const y = 34 + row * 104;
          const hot = col === 1 && row === 0;
          return (
            <g key={`${col}-${row}`}>
              <rect x={x} y={y} width={92} height={90} rx={12} fill={FILL} stroke={hot ? ACCENT : LINE} />
              <circle cx={x + 46} cy={y + 36} r={22} fill={hot ? ACCENT : "none"} fillOpacity={0.2} stroke={hot ? ACCENT : LINE} />
              <rect x={x + 14} y={y + 68} width={40} height={6} rx={3} fill={LINE} />
              <rect x={x + 62} y={y + 66} width={16} height={10} rx={5} fill={hot ? ACCENT : LINE} />
            </g>
          );
        }),
      )}
    </>
  );
}

function Tasks() {
  const rows = [
    { done: true, w: 180 },
    { done: true, w: 140 },
    { done: false, w: 210 },
    { done: false, w: 120 },
  ];
  return (
    <>
      <rect x={70} y={26} width={260} height={30} rx={8} fill={FILL} stroke={LINE} />
      <rect x={282} y={32} width={42} height={18} rx={5} fill={ACCENT} fillOpacity={0.8} />
      {rows.map((r, i) => (
        <g key={i} transform={`translate(70 ${74 + i * 40})`}>
          <rect width={260} height={32} rx={8} fill={FILL} stroke={LINE} />
          <rect x={10} y={8} width={16} height={16} rx={4} fill={r.done ? ACCENT : "none"} stroke={r.done ? ACCENT : LINE} />
          {r.done ? <path d="M14 16l3 3 6-7" fill="none" stroke="var(--color-accent-fg)" strokeWidth={2} strokeLinecap="round" /> : null}
          <rect x={38} y={13} width={r.w * 0.8} height={6} rx={3} fill={LINE} opacity={r.done ? 0.5 : 1} />
        </g>
      ))}
    </>
  );
}

const covers: Record<CoverKind, () => React.JSX.Element> = { bookstore: Bookstore, food: Food, tasks: Tasks };

export function ProjectCover({ kind }: { kind: CoverKind }) {
  const Cover = covers[kind];
  return (
    <svg viewBox="0 0 400 250" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`glow-${kind}`} cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0.18} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={400} height={250} fill={`url(#glow-${kind})`} />
      <Cover />
    </svg>
  );
}

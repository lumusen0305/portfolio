"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";

/* ============================================================================
   Logic Circuit — one interactive schematic, FOUR outputs.

   The visitor clicks the three INPUT PORTS (A, B, C) directly inside the
   schematic to flip them 0 ↔ 1. Three signals fan out into four small, correct
   gate networks — each output is a different CATEGORY of intro:

       OUT1 = Ā · B          → About
       OUT2 = A ⊕ C          → Selected work
       OUT3 = B + A · C       → Silicon & research
       OUT4 = A · B · C       → Get in touch

   Any number of outputs can be HIGH at once → any number of category cards
   pop up (scale + fade). prefers-reduced-motion is respected.

   Truth-table sanity (verified):
     A=0,B=1,C=0 → OUT1=1 & OUT3=1
     A=1,B=1,C=1 → OUT3=1 & OUT4=1
     A=1,B=0,C=0 → OUT2=1
   ========================================================================== */

const EASE = [0.22, 1, 0.36, 1] as const;

type Bit = 0 | 1;
type InputId = "A" | "B" | "C";
type State = Record<InputId, Bit>;
type OutId = "OUT1" | "OUT2" | "OUT3" | "OUT4";

/* ---- the four gate networks (compute correctly) -------------------------- */
const outputs = ({ A, B, C }: State): Record<OutId, Bit> => {
  const a = A === 1;
  const b = B === 1;
  const c = C === 1;
  return {
    OUT1: (!a && b ? 1 : 0) as Bit, // Ā · B
    OUT2: (a !== c ? 1 : 0) as Bit, // A ⊕ C
    OUT3: (b || (a && c) ? 1 : 0) as Bit, // B + A · C
    OUT4: (a && b && c ? 1 : 0) as Bit, // A · B · C
  };
};

/* ---- per-output reveal copy (the categories) ----------------------------- */
type Category = {
  id: OutId;
  expr: string; // pretty boolean expression
  name: string; // category title
  lines: string[]; // body readout
  contact?: { field: string; value: string }[];
  motto?: string;
  cta?: { label: string; href: string };
};

const CATEGORIES: Category[] = [
  {
    id: "OUT1",
    expr: "Ā · B",
    name: "About",
    lines: [
      "ChienHsien Wu — freelance AI & full-stack engineer, and a digital-IC / ASIC physical-design engineer at NVIDIA.",
      "I build products end to end and bring hardware-grade rigor to software — verified, instrumented, stress-tested before production.",
    ],
    motto: 'Dream big and dare to fail.',
  },
  {
    id: "OUT2",
    expr: "A ⊕ C",
    name: "Selected work",
    lines: [
      "QuantClash — an AI-agent quant-trading platform: DAG-orchestrated agent workflows + a full backtesting engine.",
      "AI Meeting — CV + NLP smart-space. QTNet — deep-RL trading.",
      "FPGA / SoC: real-time vision, Connect6 and DNN accelerators on ZYNQ.",
    ],
  },
  {
    id: "OUT3",
    expr: "B + A · C",
    name: "Silicon & research",
    lines: [
      "Full RTL-to-GDSII flow — synthesis, floorplanning, STA, timing closure, FPGA prototyping.",
      "TSMC intern: tuned an N7 ADPLL to −16% power, −21% area.",
      "CHROMA — resilient multi-GPU graph coloring, up to 14× speedup; peer-reviewed, accepted at GrAPL '26.",
    ],
  },
  {
    id: "OUT4",
    expr: "A · B · C",
    name: "Get in touch",
    lines: ["Open to freelance work — AI products, full-stack, or prototypes."],
    contact: [
      { field: "email", value: "lumusen890305@gmail.com" },
      { field: "github", value: "github.com/lumusen0305" },
      { field: "linkedin", value: "linkedin.com/in/chienhsien-wu-9a1086268" },
    ],
    cta: { label: "Get in touch →", href: "#contact" },
  },
];

/* ----------------------------------------------------------------------------
   Wire color helpers — accent (electron blue) when carrying a 1, muted otherwise.
   ------------------------------------------------------------------------- */
const HI = "var(--accent)";
const wireColor = (live: boolean) => (live ? HI : "var(--hairline-strong)");
const sw = (live: boolean) => (live ? 2.2 : 1.3);

/* ============================================================================
   SCHEMATIC (SVG) — clickable input ports → four gate networks → four LEDs.

   Compact viewBox (0 0 600 360). Signal flows left → right:

     ports (x≈54)  →  tap bus  →  4 stacked gate cells  →  OUT1..OUT4 LEDs

   Ports A, B, C are <g role="button"> nodes: click / Enter / Space flips the bit.
   Each row's gate symbol lights when its output is HIGH; the LED + its label
   glow accent-blue. The whole SVG scales fluidly so it never overflows mobile.
   ========================================================================== */

const PORT_X = 54;
const yA = 60;
const yB = 180;
const yC = 300;
const portY: Record<InputId, number> = { A: yA, B: yB, C: yC };

// four gate-cell rows (vertical center of each)
const ROW_Y: Record<OutId, number> = {
  OUT1: 58,
  OUT2: 142,
  OUT3: 226,
  OUT4: 310,
};
const GATE_X = 322; // gate symbol left edge
const GATE_W = 60;
const LED_X = 540;
const BUS_X = 168; // vertical fan-out bus column

function Schematic({ s, onToggle }: { s: State; onToggle: (id: InputId) => void }) {
  const A = s.A === 1;
  const B = s.B === 1;
  const C = s.C === 1;
  const out = outputs(s);

  // Per-row input liveness (which signals feed each gate) drives the short
  // "stub" wires that run from the bus into each gate cell.
  return (
    <svg
      viewBox="0 0 600 360"
      className="h-auto w-full"
      role="group"
      aria-label="Interactive logic schematic: click input ports A, B and C to drive four outputs — OUT1 = NOT A AND B, OUT2 = A XOR C, OUT3 = B OR (A AND C), OUT4 = A AND B AND C."
    >
      <defs>
        <filter id="lc-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="360">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---- fan-out bus: each port runs right to the bus column, then the bus
              taps down into the gate rows. Drawn under everything. --------- */}
      {/* horizontal feeders from each port to its bus tap */}
      <Wire d={`M${PORT_X + 56} ${yA} H${BUS_X}`} live={A} />
      <Wire d={`M${PORT_X + 56} ${yB} H${BUS_X}`} live={B} />
      <Wire d={`M${PORT_X + 56} ${yC} H${BUS_X}`} live={C} />

      {/* bus tap nodes (little dots where a signal can branch) */}
      <BusDot x={BUS_X} y={yA} live={A} />
      <BusDot x={BUS_X} y={yB} live={B} />
      <BusDot x={BUS_X} y={yC} live={C} />

      {/* ---- ROW 1 · OUT1 = Ā · B  (NOT A, AND B) ----------------------- */}
      {/* A → inverter → gate top input ; B → gate bottom input */}
      <Wire d={`M${BUS_X} ${yA} V${ROW_Y.OUT1 - 12} H${GATE_X - 40}`} live={A} />
      <Wire d={`M${BUS_X} ${yB} V${ROW_Y.OUT1 + 12} H${GATE_X}`} live={B} />
      <Inverter x={GATE_X - 40} y={ROW_Y.OUT1 - 12} live={A} negLive={!A} />
      {/* inverter out (= !A) into gate top */}
      <Wire d={`M${GATE_X - 12} ${ROW_Y.OUT1 - 12} H${GATE_X}`} live={!A} />
      <AndGate x={GATE_X} y={ROW_Y.OUT1 - 22} live={out.OUT1 === 1} label="&amp;" />
      <Wire d={`M${GATE_X + GATE_W - 4} ${ROW_Y.OUT1} H${LED_X - 13}`} live={out.OUT1 === 1} />

      {/* ---- ROW 2 · OUT2 = A ⊕ C  (XOR) -------------------------------- */}
      <Wire d={`M${BUS_X} ${yA} V${ROW_Y.OUT2 - 12} H${GATE_X}`} live={A} />
      <Wire d={`M${BUS_X} ${yC} V${ROW_Y.OUT2 + 12} H${GATE_X}`} live={C} />
      <XorGate x={GATE_X} y={ROW_Y.OUT2 - 22} live={out.OUT2 === 1} />
      <Wire d={`M${GATE_X + GATE_W + 4} ${ROW_Y.OUT2} H${LED_X - 13}`} live={out.OUT2 === 1} />

      {/* ---- ROW 3 · OUT3 = B + A · C  (AND feeds OR) ------------------- */}
      {/* small AND (A·C) sits before the OR */}
      <Wire d={`M${BUS_X} ${yA} V${ROW_Y.OUT3 - 18} H${GATE_X - 78}`} live={A} />
      <Wire d={`M${BUS_X} ${yC} V${ROW_Y.OUT3 + 2} H${GATE_X - 78}`} live={C} />
      <AndGate
        x={GATE_X - 78}
        y={ROW_Y.OUT3 - 18}
        live={A && C}
        small
        label="&amp;"
      />
      {/* AND out (A·C) → OR bottom input */}
      <Wire d={`M${GATE_X - 78 + 40} ${ROW_Y.OUT3 - 8} H${GATE_X - 6} V${ROW_Y.OUT3 + 12} H${GATE_X}`} live={A && C} />
      {/* B → OR top input */}
      <Wire d={`M${BUS_X} ${yB} V${ROW_Y.OUT3 - 12} H${GATE_X}`} live={B} />
      <OrGate x={GATE_X} y={ROW_Y.OUT3 - 22} live={out.OUT3 === 1} />
      <Wire d={`M${GATE_X + GATE_W + 4} ${ROW_Y.OUT3} H${LED_X - 13}`} live={out.OUT3 === 1} />

      {/* ---- ROW 4 · OUT4 = A · B · C  (3-input AND) ------------------- */}
      <Wire d={`M${BUS_X} ${yA} V${ROW_Y.OUT4 - 16} H${GATE_X}`} live={A} />
      <Wire d={`M${BUS_X} ${yB} V${ROW_Y.OUT4} H${GATE_X}`} live={B} />
      <Wire d={`M${BUS_X} ${yC} V${ROW_Y.OUT4 + 16} H${GATE_X}`} live={C} />
      <AndGate x={GATE_X} y={ROW_Y.OUT4 - 22} live={out.OUT4 === 1} label="&amp;" three />
      <Wire d={`M${GATE_X + GATE_W - 4} ${ROW_Y.OUT4} H${LED_X - 13}`} live={out.OUT4 === 1} />

      {/* ---- four output LEDs ------------------------------------------- */}
      {(Object.keys(ROW_Y) as OutId[]).map((id, i) => {
        const live = out[id] === 1;
        return (
          <g key={id}>
            <circle
              cx={LED_X}
              cy={ROW_Y[id]}
              r={11}
              fill={live ? HI : "var(--surface-2)"}
              stroke={wireColor(live)}
              strokeWidth={1.6}
              filter={live ? "url(#lc-glow)" : undefined}
            />
            <text
              x={LED_X + 20}
              y={ROW_Y[id] - 6}
              fontSize={10.5}
              fontFamily="var(--font-mono)"
              fontWeight={700}
              letterSpacing="0.08em"
              fill={live ? HI : "var(--faint)"}
            >
              {`OUT${i + 1}`}
            </text>
            <text
              x={LED_X + 20}
              y={ROW_Y[id] + 11}
              fontSize={13}
              fontFamily="var(--font-mono)"
              fontWeight={700}
              fill={live ? HI : "var(--faint)"}
            >
              {live ? "1" : "0"}
            </text>
          </g>
        );
      })}

      {/* ---- input ports (clickable, drawn last = on top) --------------- */}
      <Port id="A" x={PORT_X} y={portY.A} on={A} onToggle={onToggle} />
      <Port id="B" x={PORT_X} y={portY.B} on={B} onToggle={onToggle} />
      <Port id="C" x={PORT_X} y={portY.C} on={C} onToggle={onToggle} />
    </svg>
  );
}

/* ---- small bus tap dot ---------------------------------------------------- */
function BusDot({ x, y, live }: { x: number; y: number; live: boolean }) {
  return <circle cx={x} cy={y} r={live ? 3.4 : 2.6} fill={wireColor(live)} filter={live ? "url(#lc-glow)" : undefined} />;
}

/* ----------------------------------------------------------------------------
   Clickable input PORT — an SVG <g> with button semantics. Pill-shaped pad
   with the label + live value; lights accent-blue when 1.
   ------------------------------------------------------------------------- */
function Port({
  id,
  x,
  y,
  on,
  onToggle,
}: {
  id: InputId;
  x: number;
  y: number;
  on: boolean;
  onToggle: (id: InputId) => void;
}) {
  const w = 64;
  const h = 40;
  const left = x - 8;
  const top = y - h / 2;
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={on}
      aria-label={`Input ${id}, currently ${on ? 1 : 0}. Click to toggle.`}
      onClick={() => onToggle(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(id);
        }
      }}
      className="lc-port"
      style={{ cursor: "pointer" }}
    >
      {/* pad */}
      <rect
        x={left}
        y={top}
        width={w}
        height={h}
        rx={11}
        fill={on ? "var(--accent-soft)" : "var(--surface-2)"}
        stroke={on ? HI : "var(--hairline-strong)"}
        strokeWidth={1.6}
        filter={on ? "url(#lc-glow)" : undefined}
      />
      {/* label */}
      <text
        x={left + 18}
        y={y + 5}
        textAnchor="middle"
        fontSize={14}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={on ? HI : "var(--muted)"}
      >
        {id}
      </text>
      {/* divider */}
      <line
        x1={left + 33}
        y1={top + 8}
        x2={left + 33}
        y2={top + h - 8}
        stroke={on ? "color-mix(in oklab, var(--accent), transparent 55%)" : "var(--hairline-strong)"}
        strokeWidth={1}
      />
      {/* value */}
      <text
        x={left + 48}
        y={y + 5}
        textAnchor="middle"
        fontSize={15}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={on ? HI : "var(--faint)"}
      >
        {on ? "1" : "0"}
      </text>
      {/* output stub so the port reads as a terminal */}
      <circle cx={left + w} cy={y} r={on ? 3 : 2.4} fill={wireColor(on)} />
    </g>
  );
}

/* ---- wire primitive ------------------------------------------------------- */
function Wire({ d, live }: { d: string; live: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={wireColor(live)}
      strokeWidth={sw(live)}
      strokeLinecap="round"
      strokeLinejoin="round"
      filter={live ? "url(#lc-glow)" : undefined}
    />
  );
}

/* ---- gate symbols --------------------------------------------------------- */
function gateFill(live: boolean) {
  return live ? "var(--accent-soft)" : "var(--surface-2)";
}
function gateStroke(live: boolean) {
  return live ? HI : "var(--hairline-strong)";
}

// AND: flat back, rounded D front. anchor = back-top corner.
function AndGate({
  x,
  y,
  live,
  label = "&amp;",
  small = false,
  three = false,
}: {
  x: number;
  y: number;
  live: boolean;
  label?: string;
  small?: boolean;
  three?: boolean;
}) {
  const w = small ? 40 : 60;
  const h = small ? 36 : 44;
  const r = h / 2;
  const cy = y + h / 2;
  const d = `M${x} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x} Z`;
  return (
    <g filter={live ? "url(#lc-glow)" : undefined}>
      <path d={d} fill={gateFill(live)} stroke={gateStroke(live)} strokeWidth={1.6} />
      <text
        x={x + (w - r) / 2 + 3}
        y={cy + 4}
        textAnchor="middle"
        fontSize={small ? 9.5 : 11}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={live ? HI : "var(--faint)"}
        dangerouslySetInnerHTML={{ __html: three ? "&amp;&amp;&amp;" : label }}
      />
    </g>
  );
}

// OR: curved back, pointed front. anchor = back-top.
function OrGate({ x, y, live }: { x: number; y: number; live: boolean }) {
  const w = 60;
  const h = 44;
  const cy = y + h / 2;
  const d = `M${x} ${y}
    Q${x + 13} ${cy} ${x} ${y + h}
    Q${x + 34} ${y + h} ${x + w} ${cy}
    Q${x + 34} ${y} ${x} ${y} Z`;
  return (
    <g filter={live ? "url(#lc-glow)" : undefined}>
      <path d={d} fill={gateFill(live)} stroke={gateStroke(live)} strokeWidth={1.6} />
      <text
        x={x + 26}
        y={cy + 4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={live ? HI : "var(--faint)"}
      >
        ≥1
      </text>
    </g>
  );
}

// XOR: OR with an extra concave back-arc. anchor = back-top.
function XorGate({ x, y, live }: { x: number; y: number; live: boolean }) {
  const w = 60;
  const h = 44;
  const cy = y + h / 2;
  const body = `M${x + 6} ${y}
    Q${x + 19} ${cy} ${x + 6} ${y + h}
    Q${x + 40} ${y + h} ${x + w + 6} ${cy}
    Q${x + 40} ${y} ${x + 6} ${y} Z`;
  return (
    <g filter={live ? "url(#lc-glow)" : undefined}>
      {/* extra back arc that distinguishes XOR from OR */}
      <path
        d={`M${x} ${y} Q${x + 13} ${cy} ${x} ${y + h}`}
        fill="none"
        stroke={gateStroke(live)}
        strokeWidth={1.6}
      />
      <path d={body} fill={gateFill(live)} stroke={gateStroke(live)} strokeWidth={1.6} />
      <text
        x={x + 30}
        y={cy + 4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="var(--font-mono)"
        fontWeight={700}
        fill={live ? HI : "var(--faint)"}
      >
        =1
      </text>
    </g>
  );
}

// Inverter: small triangle + bubble. anchor = left tip.
function Inverter({
  x,
  y,
  live,
  negLive,
}: {
  x: number;
  y: number;
  live: boolean;
  negLive: boolean;
}) {
  const w = 22;
  const h = 18;
  const d = `M${x} ${y - h / 2} L${x + w} ${y} L${x} ${y + h / 2} Z`;
  return (
    <g filter={negLive ? "url(#lc-glow)" : undefined}>
      <path d={d} fill={gateFill(negLive)} stroke={gateStroke(live || negLive)} strokeWidth={1.5} />
      <circle
        cx={x + w + 3.5}
        cy={y}
        r={3.2}
        fill={negLive ? HI : "var(--surface-2)"}
        stroke={gateStroke(negLive)}
        strokeWidth={1.4}
      />
    </g>
  );
}

/* ============================================================================
   CATEGORY REVEAL card (pops up when its OUT = 1).
   Reuses the mac-window terminal chrome (the owner's signature) but the body
   is category content — no shell-command prompts.
   ========================================================================== */
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: "color-mix(in oklab, var(--accent), transparent 55%)",
        background: "var(--surface)",
        boxShadow: "0 0 0 1px var(--accent-soft), 0 24px 60px -32px var(--accent-glow)",
      }}
    >
      {/* title bar — mac window chrome */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} aria-hidden />
        <span className="ml-2 truncate font-mono text-[0.66rem] tracking-[0.1em] text-faint">
          {`${cat.id} = 1 · ${cat.expr}`}
        </span>
      </div>

      {/* body */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {/* category header */}
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: "var(--accent)", boxShadow: "0 0 10px 1px var(--accent-glow)" }}
            aria-hidden
          />
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent">
            {`out${index + 1} high`}
          </span>
        </div>

        <h3 className="display mt-2 text-lg font-extrabold tracking-tight text-foreground">
          {cat.name}
        </h3>

        {/* readout lines */}
        <div className="mt-3 space-y-2 border-t border-hairline pt-3">
          {cat.lines.map((line, i) => (
            <p key={i} className="text-[0.8rem] leading-relaxed text-muted">
              {line}
            </p>
          ))}
          {cat.motto ? (
            <p className="pt-0.5 font-mono text-[0.72rem] leading-relaxed text-accent">
              {`// motto — “${cat.motto}”`}
            </p>
          ) : null}
        </div>

        {/* contact block (mono, field:value) — wraps / breaks so the long
            LinkedIn URL never overflows on mobile */}
        {cat.contact ? (
          <dl
            className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-1 rounded-lg border px-3 py-3"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}
          >
            {cat.contact.map((c) => (
              <div key={c.field} className="contents">
                <dt className="font-mono text-[0.62rem] uppercase tracking-[0.08em] text-faint">
                  {c.field}
                </dt>
                <dd className="min-w-0 break-all font-mono text-[0.66rem] leading-5 text-muted">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {/* CTA */}
        {cat.cta ? (
          <a
            href={cat.cta.href}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[0.82rem] font-semibold text-background transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5"
          >
            {cat.cta.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

/* ============================================================================
   SECTION
   ========================================================================== */
export function LogicCircuit() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<State>({ A: 0, B: 0, C: 0 });

  const toggle = (id: InputId) =>
    setState((s) => ({ ...s, [id]: s[id] === 1 ? 0 : 1 }));

  const out = useMemo(() => outputs(state), [state]);
  const live = CATEGORIES.filter((c) => out[c.id] === 1);
  const anyHigh = live.length > 0;

  return (
    <section
      id="logic"
      className="scroll-mt-20 border-t border-hairline px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      {/* Deliberately narrow column — this module reads as a tidy little widget,
          visibly smaller than the wide Work / Services sections. */}
      <div className="mx-auto max-w-2xl">
        <SectionHeader label="Logic" heading="Drive the outputs high." />
        <Reveal delay={0.08}>
          <p className="mt-3 max-w-md text-sm text-muted sm:mt-4 sm:text-base">
            Click the input ports to flip them 0 / 1. Three signals drive four
            gate networks — each output that reads{" "}
            <span className="font-mono text-foreground">1</span> opens a different
            chapter of the intro. More than one can light at once.
          </p>
        </Reveal>

        {/* SCHEMATIC — the ports inside are the controls. Capped width so the
            diagram stays small and never stretches to fill the column. */}
        <Reveal delay={0.16}>
          <div className="card mx-auto mt-6 max-w-lg overflow-hidden p-4 sm:mt-8 sm:p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                Schematic · 3 in → 4 out
              </p>
              <p className="font-mono text-[0.6rem] text-faint">tap a port ↻</p>
            </div>
            <Schematic s={state} onToggle={toggle} />

            {/* expression legend — keeps the four boolean networks readable */}
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-hairline pt-3 sm:grid-cols-4">
              {CATEGORIES.map((c, i) => {
                const hi = out[c.id] === 1;
                return (
                  <div key={c.id} className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: hi ? "var(--accent)" : "var(--hairline-strong)",
                        boxShadow: hi ? "0 0 8px 1px var(--accent-glow)" : "none",
                      }}
                      aria-hidden
                    />
                    <span
                      className="truncate font-mono text-[0.62rem] tracking-tight"
                      style={{ color: hi ? "var(--accent)" : "var(--faint)" }}
                    >
                      {`OUT${i + 1}=${c.expr}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* REVEALS / hint — compact 2-up tiles, not full-width tall blocks. */}
        <div className="mt-5 sm:mt-6" aria-live="polite">
          {anyHigh ? (
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:gap-4">
              <AnimatePresence initial={false}>
                {live.map((cat) => {
                  const index = CATEGORIES.findIndex((c) => c.id === cat.id);
                  return reduced ? (
                    <div key={cat.id}>
                      <CategoryCard cat={cat} index={index} />
                    </div>
                  ) : (
                    <motion.div
                      key={cat.id}
                      layout
                      initial={{ opacity: 0, scale: 0.94, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <CategoryCard cat={cat} index={index} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <motion.p
              key="hint"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-dashed border-hairline px-4 py-5 text-center font-mono text-[0.8rem] text-faint"
            >
              {"// click the ports to drive an output high"}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}

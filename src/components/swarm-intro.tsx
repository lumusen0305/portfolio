"use client";

/**
 * Opening animation: a swarm of multiplayer cursors orbits the mark, then
 * draws the first screen (crosshair boxes, typed text, a swept portrait)
 * and fades into the real page.
 *
 * Original choreography for this site. Inspired by the Swarm opening
 * (Joel Califa; the swarm-cursors extension), not a port of that engine.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NAMES = [
  "Aria", "Kai", "Noor", "Leo", "Mina", "Soren",
  "Priya", "Ellis", "Jun", "Vera", "Omar", "Nia",
  "Theo", "Hana", "Ren", "Ivo",
];

const COLORS = [
  "#FF5C39", "#A855F7", "#38BDF8", "#2DD4BF", "#FB7185", "#FBBF24",
  "#818CF8", "#F472B6", "#34D399", "#60A5FA", "#FB923C", "#22D3EE",
];

type Kind = "type" | "reveal" | "media" | "control";

type Target = {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  radius: string;
  line1: string;
  line2: string;
  /** Type target wraps onto more than one line, so the ghost keeps the column width. */
  wrap: boolean;
  source: HTMLElement;
};

type Ghost = {
  root: HTMLDivElement;
  fill: HTMLDivElement;
  body: HTMLDivElement;
  kind: Kind;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  line1: string;
  line2: string;
  l1: HTMLElement | null;
  l2: HTMLElement | null;
  pre: HTMLElement | null;
  rest: HTMLElement | null;
  caret: HTMLElement | null;
  img: HTMLImageElement | null;
  frame: HTMLDivElement;
  frameBadge: HTMLSpanElement;
  radius: string;
};

type Op =
  | { op: "hold"; dur: number; orbit: boolean }
  | { op: "move"; x: number; y: number; dur: number; bend: number }
  | { op: "drag"; dur: number; ghost: Ghost }
  | { op: "type"; dur: number; ghost: Ghost }
  | { op: "reveal"; dur: number; ghost: Ghost };

type Agent = {
  name: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  phase: number;
  radius: number;
  omega: number;
  builder: boolean;
  /** No piece left to draw — leave the screen instead of orbiting. */
  dismissed: boolean;
  shape: "arrow" | "cross" | "ibeam";
  press: number;
  script: Op[];
  i: number;
  seg: number;
  moveReady: boolean;
  x0: number;
  y0: number;
  el: HTMLDivElement;
  svg: SVGSVGElement;
  badge: HTMLSpanElement;
  nameEl: HTMLSpanElement;
};

const ARROW =
  "M0 0 L15.4 7.5 L8.7 9.3 L6.9 16.5 Z";

function cursorMarkup(shape: Agent["shape"], color: string) {
  const ink = `fill="${color}" stroke="#fff" stroke-width="1.35" stroke-linejoin="round"`;
  if (shape === "arrow") return `<path d="${ARROW}" ${ink}/>`;
  if (shape === "cross") {
    return (
      `<g stroke-linecap="round">` +
      `<path d="M0 -11 V11 M-11 0 H11" stroke="#fff" stroke-width="3.4"/>` +
      `<path d="M0 -11 V11 M-11 0 H11" stroke="${color}" stroke-width="1.5"/>` +
      `</g>`
    );
  }
  return (
    `<g fill="none" stroke-linecap="round">` +
    `<path d="M-4 -9 H4 M0 -9 V9 M-4 9 H4" stroke="#fff" stroke-width="3.4"/>` +
    `<path d="M-4 -9 H4 M0 -9 V9 M-4 9 H4" stroke="${color}" stroke-width="1.45"/>` +
    `</g>`
  );
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function kindOf(id: string): Kind {
  if (id === "portrait") return "media";
  if (id === "bio") return "reveal";
  if (id === "theme" || id === "menu" || id.startsWith("cta")) return "control";
  return "type";
}

function copyType(from: HTMLElement, to: HTMLElement) {
  const cs = getComputedStyle(from);
  to.style.fontFamily = cs.fontFamily;
  to.style.fontSize = cs.fontSize;
  to.style.fontWeight = cs.fontWeight;
  to.style.fontStyle = cs.fontStyle;
  to.style.letterSpacing = cs.letterSpacing;
  to.style.lineHeight = cs.lineHeight;
  to.style.textTransform = cs.textTransform;
  to.style.whiteSpace = cs.whiteSpace;
  to.style.color = cs.color;
}

function measure(): Target[] {
  const out: Target[] = [];
  for (const el of document.querySelectorAll<HTMLElement>("[data-build]")) {
    const id = el.dataset.build || "";
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const kind = kindOf(id);
    let line1 = "";
    const line2 = "";
    let box = r;
    let wrap = false;
    if (kind === "type" || kind === "reveal") {
      line1 = (el.innerText || "").replace(/\s+/g, " ").trim();
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((rect) => rect.width >= 1 && rect.height >= 1);
      const ink = range.getBoundingClientRect();
      if (rects.length > 1) {
        wrap = true;
        box = r;
      } else if (ink.width >= 2 && ink.height >= 2) {
        // Hug the glyphs horizontally, but keep the element's line box
        // vertically so the fade lands on the real text.
        box = new DOMRect(ink.left, r.top, ink.width, r.height);
      }
    }
    const cs = getComputedStyle(el);
    out.push({
      id,
      kind,
      x: box.left,
      y: box.top,
      w: box.width,
      h: box.height,
      radius: cs.borderRadius || "0px",
      line1,
      line2,
      wrap,
      source: el,
    });
  }
  return out;
}

function fillControl(t: Target, root: HTMLDivElement, body: HTMLDivElement) {
  const cs = getComputedStyle(t.source);
  root.dataset.bg = cs.backgroundColor;
  root.dataset.border = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
  root.dataset.color = cs.color;
  if (cs.boxShadow && cs.boxShadow !== "none") root.dataset.shadow = cs.boxShadow;
  // Flex items report display:block, which drops the pill's padding.
  // Center the label in the measured box instead.
  body.style.display = "flex";
  body.style.alignItems = "center";
  body.style.justifyContent = "center";
  body.style.gap = cs.gap;
  body.style.width = "100%";
  body.style.height = "100%";
  body.style.color = cs.color;
  copyType(t.source, body);
  for (const node of t.source.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && !(node.textContent || "").trim()) continue;
    const copy = node.cloneNode(true);
    if (copy instanceof HTMLElement || copy instanceof SVGElement) {
      copy.style.transform = "";
      copy.querySelectorAll<HTMLElement | SVGElement>("*").forEach((n) => {
        n.style.transform = "";
      });
    }
    body.appendChild(copy);
  }
}

function makeGhost(t: Target, stage: HTMLElement): Ghost {
  const root = document.createElement("div");
  root.className = "swarm-ghost";
  root.style.left = `${t.x}px`;
  root.style.top = `${t.y}px`;
  root.style.width = "0px";
  root.style.height = "0px";
  root.style.borderRadius = t.radius;
  const fill = document.createElement("div");
  fill.className = "swarm-ghost-fill";
  const body = document.createElement("div");
  body.className = "swarm-ghost-body";
  const frame = document.createElement("div");
  frame.className = "swarm-frame";
  frame.hidden = true;
  for (const place of ["tl", "tr", "bl", "br"]) {
    const handle = document.createElement("span");
    handle.className = `swarm-handle swarm-handle-${place}`;
    frame.appendChild(handle);
  }
  const frameBadge = document.createElement("span");
  frameBadge.className = "swarm-frame-badge";
  frame.appendChild(frameBadge);
  root.append(fill, body, frame);

  let l1: HTMLElement | null = null;
  let l2: HTMLElement | null = null;
  let pre: HTMLElement | null = null;
  let rest: HTMLElement | null = null;
  let caret: HTMLElement | null = null;
  let img: HTMLImageElement | null = null;

  if (t.kind === "media") {
    img = document.createElement("img");
    img.className = "swarm-ghost-img";
    img.alt = "";
    img.src = "/img/avatar.jpg";
    body.appendChild(img);
    const cs = getComputedStyle(t.source);
    root.dataset.shadow = cs.boxShadow;
    root.style.border = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
  } else if (t.kind === "control") {
    fillControl(t, root, body);
  } else if (t.kind === "reveal") {
    copyType(t.source, body);
    body.style.opacity = "0";
    body.textContent = t.line1;
  } else {
    copyType(t.source, body);
    if (!t.wrap) body.style.whiteSpace = "nowrap";
    body.style.opacity = "1";
    caret = document.createElement("span");
    caret.className = "swarm-caret";
    if (t.id === "wordmark") {
      pre = document.createElement("span");
      pre.className = "text-accent";
      rest = document.createElement("span");
      body.append(pre, rest, caret);
    } else {
      l1 = document.createElement("span");
      if (t.source.classList.contains("accent-text")) l1.classList.add("accent-text");
      body.append(l1);
      l1.appendChild(caret);
    }
  }

  stage.appendChild(root);
  return {
    root, fill, body, kind: t.kind, id: t.id,
    x: t.x, y: t.y, w: t.kind === "type" && !t.wrap ? t.w + 8 : t.w, h: t.h,
    line1: t.line1, line2: t.line2,
    l1, l2, pre, rest, caret, img,
    frame, frameBadge, radius: t.radius,
  };
}

function showSelect(g: Ghost, on: boolean) {
  g.root.classList.toggle("is-select", on);
  g.frame.hidden = !on;
  if (on) {
    if (g.root.style.border) g.root.dataset.borderBackup = g.root.style.border;
    g.root.style.border = "none";
    g.root.style.borderRadius = "0";
  } else {
    g.root.style.border = g.root.dataset.borderBackup || "";
    g.root.style.borderRadius = g.radius;
  }
}

function sizeGhost(g: Ghost, p: number) {
  const k = clamp(p, 0, 1);
  g.root.style.width = `${g.w * k}px`;
  g.root.style.height = `${g.h * k}px`;
}

function settleGhost(g: Ghost) {
  g.root.style.width = `${g.w}px`;
  g.root.style.height = `${g.h}px`;
}

function setTyped(g: Ghost, p: number) {
  const n1 = g.line1.length;
  const n2 = g.line2.length;
  const total = Math.max(1, n1 + n2);
  const n = Math.round(clamp(p, 0, 1) * total);
  if (g.id === "wordmark" && g.pre && g.rest) {
    const shown = g.line1.slice(0, n);
    g.pre.textContent = shown.slice(0, 2);
    g.rest.textContent = shown.slice(2);
    return;
  }
  if (g.l1) g.l1.textContent = g.line1.slice(0, Math.min(n, n1));
  if (g.l2) g.l2.textContent = n > n1 ? g.line2.slice(0, n - n1) : "";
  if (g.caret) {
    const host = n > n1 && g.l2 ? g.l2 : g.l1;
    host?.appendChild(g.caret);
  }
}

function textEnd(g: Ghost): DOMRect | null {
  const range = document.createRange();
  if (g.pre && g.rest) {
    range.setStartBefore(g.pre);
    range.setEndAfter(g.rest);
  } else if (g.l1) {
    const text = [...g.l1.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (text?.textContent) {
      range.setStart(text, 0);
      range.setEnd(text, text.textContent.length);
    } else {
      range.selectNodeContents(g.l1);
    }
  } else {
    range.selectNodeContents(g.body);
  }
  const rects = [...range.getClientRects()].filter((rect) => rect.width >= 1 && rect.height >= 1);
  return rects.length ? rects[rects.length - 1] : null;
}

function placeAtCaret(a: Agent, g: Ghost) {
  const r = textEnd(g);
  if (!r) return;
  a.x = r.right + 4;
  a.y = r.top + r.height * 0.72;
  if (!g.caret) return;
  const host = g.body.getBoundingClientRect();
  g.caret.style.position = "absolute";
  g.caret.style.marginLeft = "0";
  g.caret.style.left = `${r.right - host.left}px`;
  g.caret.style.top = `${r.top - host.top}px`;
}

function tickOrbit(
  a: Agent,
  t: number,
  dt: number,
  cx: number,
  cy: number,
  mouse: { x: number; y: number } | null,
  scale: number,
) {
  const ang = t * a.omega + a.phase;
  const breathe = 1 + 0.13 * Math.sin(t * 0.85 + a.phase);
  const R = a.radius * breathe * scale;
  const tx = cx + Math.cos(ang) * R + Math.sin(ang * 2) * 14;
  const ty = cy + Math.sin(ang) * R * 0.78 + Math.cos(ang * 2) * 10;
  const k = 1 - Math.exp(-2.6 * dt);
  const nx = a.x + (tx - a.x) * k;
  const ny = a.y + (ty - a.y) * k;
  a.vx = nx - a.x;
  a.vy = ny - a.y;
  a.x = nx;
  a.y = ny;
  if (mouse) {
    const dx = a.x - mouse.x;
    const dy = a.y - mouse.y;
    const d = Math.hypot(dx, dy);
    if (d < 72 && d > 0.01) {
      const push = ((72 - d) / 72) * 42;
      a.x += (dx / d) * push;
      a.y += (dy / d) * push;
    }
  }
}

const ARROW_TILT = Math.atan2(7.5, 15.4);

function face(a: Agent, dt: number) {
  if (a.shape !== "arrow") return;
  const sp = Math.hypot(a.vx, a.vy);
  if (sp < 0.35) return;
  const target = Math.atan2(a.vy, a.vx) - ARROW_TILT;
  let d = target - a.rot;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  a.rot += d * Math.min(1, dt * 9);
}

export function SwarmIntro() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const skipRef = useRef<() => void>(() => {});

  // The head script sets data-intro before first paint. Hydration can strip
  // that attribute because it is not a React prop, so put it back before paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.removeAttribute("data-intro");
      return;
    }
    root.setAttribute("data-intro", "on");
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active || !hostRef.current) return;
    const api = runSwarm(hostRef.current, () => setActive(false));
    skipRef.current = api.skip;
    return () => api.destroy();
  }, [active]);

  if (!active) return null;

  return (
    <div ref={hostRef} className="swarm-intro" role="region" aria-label="Opening animation">
      <button type="button" className="swarm-skip" onClick={() => skipRef.current()}>
        Skip
      </button>
    </div>
  );
}

function runSwarm(host: HTMLElement, onDone: () => void) {
  let stop = false;
  let finished = false;
  let raf = 0;
  let built = false;
  let fontsReady = !document.fonts;
  let last = performance.now();
  const t0 = last;
  let mouse: { x: number; y: number } | null = null;

  const stage = document.createElement("div");
  stage.className = "swarm-stage";
  host.prepend(stage);

  const mark = document.createElement("div");
  mark.className = "swarm-mark";
  mark.innerHTML = "<span></span>";
  stage.appendChild(mark);
  requestAnimationFrame(() => mark.classList.add("on"));

  const preload = new Image();
  preload.src = "/img/avatar.jpg";

  document.querySelectorAll("header, main, footer").forEach((el) => {
    el.setAttribute("inert", "");
  });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

  const vw0 = window.innerWidth;
  const vh0 = window.innerHeight;
  const count = vw0 < 768 ? 8 : 13;
  const agents: Agent[] = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "swarm-cursor";
    el.dataset.shape = "arrow";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 20 20");
    svg.innerHTML = cursorMarkup("arrow", COLORS[i % COLORS.length]);
    const nameEl = document.createElement("span");
    nameEl.className = "swarm-name";
    nameEl.textContent = NAMES[i % NAMES.length];
    nameEl.style.background = COLORS[i % COLORS.length];
    const badge = document.createElement("span");
    badge.className = "swarm-badge";
    badge.hidden = true;
    badge.style.background = COLORS[i % COLORS.length];
    el.append(svg, nameEl, badge);
    stage.appendChild(el);
    const side = i % 2 === 0;
    agents.push({
      name: NAMES[i % NAMES.length],
      color: COLORS[i % COLORS.length],
      x: side ? -30 - Math.random() * 180 : vw0 + 30 + Math.random() * 180,
      y: 36 + Math.random() * Math.max(80, vh0 - 72),
      vx: 0,
      vy: 0,
      rot: 0.4,
      phase: (i / count) * Math.PI * 2,
      radius: 86 + (i % 5) * 20,
      omega: (i % 3 === 0 ? -1 : 1) * (0.62 + (i % 4) * 0.08),
      builder: false,
      dismissed: false,
      shape: "arrow",
      press: 0,
      script: [],
      i: 0,
      seg: 0,
      moveReady: false,
      x0: 0,
      y0: 0,
      el,
      svg,
      badge,
      nameEl,
    });
  }

  document.fonts?.ready.then(() => {
    fontsReady = true;
  });

  function setShape(a: Agent, shape: Agent["shape"]) {
    if (a.shape === shape) return;
    a.shape = shape;
    a.el.dataset.shape = shape;
    if (shape === "arrow") {
      a.svg.setAttribute("viewBox", "0 0 20 20");
      a.svg.setAttribute("width", "20");
      a.svg.setAttribute("height", "20");
      a.svg.style.transform = "";
    } else {
      a.svg.setAttribute("viewBox", "-12 -12 24 24");
      a.svg.setAttribute("width", "24");
      a.svg.setAttribute("height", "24");
      a.svg.style.transform = "translate(-12px, -12px)";
    }
    a.svg.innerHTML = cursorMarkup(shape, a.color);
  }

  function paint(a: Agent, dt: number) {
    face(a, dt);
    a.press = Math.max(0, a.press - dt * 5);
    const rot = (a.rot * 180) / Math.PI;
    const sc = a.press > 0 ? 0.9 : 1;
    a.el.style.transform = `translate(${a.x}px, ${a.y}px) scale(${sc})`;
    a.svg.style.transform =
      a.shape === "arrow" ? `rotate(${rot}deg)` : "translate(-12px, -12px)";
    const flip = a.x > window.innerWidth - 96;
    a.nameEl.style.left = flip ? "auto" : "14px";
    a.nameEl.style.right = flip ? "18px" : "auto";
  }

  function enter(a: Agent, op: Op) {
    a.moveReady = false;
    a.seg = 0;
    if (op.op === "drag") {
      a.press = 1;
      setShape(a, "cross");
      showSelect(op.ghost, true);
      op.ghost.fill.style.opacity = "1";
      op.ghost.root.style.boxShadow = "none";
    } else if (op.op === "type") {
      setShape(a, "ibeam");
      showSelect(op.ghost, false);
      settleGhost(op.ghost);
      op.ghost.root.style.boxShadow = "none";
      op.ghost.root.style.overflow = "visible";
      op.ghost.fill.style.opacity = "0";
      op.ghost.body.style.opacity = "1";
      setTyped(op.ghost, 0);
    } else if (op.op === "reveal") {
      setShape(a, "arrow");
      showSelect(op.ghost, false);
      settleGhost(op.ghost);
      op.ghost.root.style.boxShadow = op.ghost.root.dataset.shadow || "none";
      op.ghost.fill.style.opacity = "0";
      op.ghost.body.style.opacity = "1";
      if (op.ghost.root.dataset.bg) {
        op.ghost.root.style.background = op.ghost.root.dataset.bg;
        op.ghost.root.style.border = op.ghost.root.dataset.border || "";
        op.ghost.root.style.color = op.ghost.root.dataset.color || "";
      }
      if (op.ghost.img) {
        op.ghost.img.style.opacity = "1";
        op.ghost.img.style.clipPath = "inset(0 0 100% 0)";
      }
    } else if (op.op === "move" || op.op === "hold") {
      setShape(a, "arrow");
      a.badge.hidden = true;
    }
  }

  function stepAgent(a: Agent, dt: number, t: number, cx: number, cy: number) {
    const op = a.script[a.i];
    if (!op) {
      if (!built) {
        tickOrbit(a, t, dt, cx, cy, mouse, 1);
      } else if (a.dismissed) {
        const dx = a.x - cx;
        const dy = a.y - cy;
        const L = Math.hypot(dx, dy) || 1;
        a.vx = (dx / L) * 18;
        a.vy = (dy / L) * 18;
        a.x += (dx / L) * 980 * dt;
        a.y += (dy / L) * 980 * dt;
      } else {
        a.vx = 0;
        a.vy = 0;
      }
      setShape(a, "arrow");
      a.badge.hidden = true;
      return;
    }
    if (a.seg === 0 && !a.moveReady && op.op !== "hold") enter(a, op);
    a.seg += dt;
    const p = clamp(a.seg / op.dur, 0, 1);

    if (op.op === "hold") {
      if (op.orbit) tickOrbit(a, t, dt, cx, cy, mouse, 1);
    } else if (op.op === "move") {
      if (!a.moveReady) {
        a.x0 = a.x;
        a.y0 = a.y;
        a.moveReady = true;
      }
      const e = easeOut(p);
      const dx = op.x - a.x0;
      const dy = op.y - a.y0;
      const L = Math.hypot(dx, dy) || 1;
      const off = Math.sin(Math.PI * e) * op.bend;
      const nx = a.x0 + dx * e + (-dy / L) * off;
      const ny = a.y0 + dy * e + (dx / L) * off;
      a.vx = nx - a.x;
      a.vy = ny - a.y;
      a.x = nx;
      a.y = ny;
    } else if (op.op === "drag") {
      const g = op.ghost;
      const nx = g.x + g.w * p;
      const ny = g.y + g.h * p;
      a.vx = nx - a.x;
      a.vy = ny - a.y;
      a.x = nx;
      a.y = ny;
      sizeGhost(g, Math.max(p, 0.02));
      a.badge.hidden = true;
      g.frameBadge.textContent = `${Math.round(g.w * p)} × ${Math.round(g.h * p)}`;
    } else if (op.op === "type") {
      setTyped(op.ghost, p);
      placeAtCaret(a, op.ghost);
      a.badge.hidden = true;
    } else if (op.op === "reveal") {
      const g = op.ghost;
      a.badge.hidden = true;
      if (g.img) g.img.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`;
      else g.body.style.opacity = String(p);
      a.x = g.x + g.w + 8;
      a.y = g.img ? g.y + g.h * p : g.y + Math.min(g.h * 0.55, 18);
    }

    if (p >= 1) {
      if (op.op === "drag") a.badge.hidden = true;
      if (op.op === "type" && op.ghost.caret) op.ghost.caret.style.display = "none";
      a.i += 1;
      a.seg = 0;
      a.moveReady = false;
      const next = a.script[a.i];
      if (next) enter(a, next);
    }
  }

  function jobCost(target: Target) {
    const travel = 0.45;
    if (target.kind === "type") {
      const chars = target.line1.length + target.line2.length;
      return travel + 0.42 + clamp(chars * 0.042, 0.32, 1.15);
    }
    if (target.kind === "media") return travel + 0.78 + 0.52;
    if (target.kind === "control") return travel + 0.55 + 0.28;
    return travel + 0.62 + 0.4;
  }

  function assign(targets: Target[]) {
    // Heaviest pieces land first, one per cursor, then extras stack on
    // whoever has the least left to do. Every cursor gets work when there
    // are at least as many pieces as cursors.
    const ranked = [...targets].sort((a, b) => jobCost(b) - jobCost(a));
    const loads = agents.map(() => 0);
    const buckets: Target[][] = agents.map(() => []);
    for (const target of ranked) {
      let best = 0;
      for (let i = 1; i < loads.length; i++) if (loads[i] < loads[best]) best = i;
      buckets[best].push(target);
      loads[best] += jobCost(target);
    }

    agents.forEach((a, idx) => {
      const mine = buckets[idx].sort((p, q) => p.y - q.y || p.x - q.x);
      a.el.dataset.jobs = mine.map((target) => target.id).join(",");
      if (mine.length === 0) {
        a.dismissed = true;
        a.builder = false;
        a.script = [];
        return;
      }
      const ops: Op[] = [{ op: "hold", dur: 0.04 + idx * 0.045, orbit: true }];
      mine.forEach((target, jobIdx) => {
        const ghost = makeGhost(target, stage);
        const dist = Math.hypot(target.x - a.x, target.y - a.y);
        const bend = ((idx + jobIdx) % 2 === 0 ? -1 : 1) * (18 + (jobIdx % 3) * 12);
        ops.push({
          op: "move",
          x: target.x,
          y: target.y,
          dur: clamp(0.28 + dist / 2400, 0.34, 0.72),
          bend,
        });
        const dragDur =
          target.kind === "media" ? 0.78 : target.kind === "reveal" ? 0.62 : target.kind === "control" ? 0.55 : 0.42;
        ops.push({ op: "drag", dur: dragDur, ghost });
        if (target.kind === "type") {
          const chars = target.line1.length + target.line2.length;
          ops.push({
            op: "type",
            dur: clamp(chars * 0.042, 0.32, 1.15),
            ghost,
          });
        } else {
          const revealDur = target.kind === "media" ? 0.52 : target.kind === "control" ? 0.28 : 0.4;
          ops.push({ op: "reveal", dur: revealDur, ghost });
        }
      });
      ops.push({ op: "hold", dur: 0.18, orbit: false });
      a.builder = true;
      a.dismissed = false;
      a.script = ops;
      a.i = 0;
      a.seg = 0;
      enter(a, ops[0]);
    });
    mark.classList.add("gone");
    built = true;
  }

  function finish() {
    if (finished) return;
    finished = true;
    host.classList.add("is-out");
    document.documentElement.removeAttribute("data-intro");
    document.querySelectorAll("header, main, footer").forEach((el) => {
      el.removeAttribute("inert");
    });
    window.setTimeout(() => {
      stop = true;
      cancelAnimationFrame(raf);
      onDone();
    }, 620);
  }

  function frame(now: number) {
    if (stop) return;
    const dt = clamp((now - last) / 1000, 0.001, 0.034);
    last = now;
    const t = (now - t0) / 1000;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.46;

    if (!finished && document.documentElement.getAttribute("data-intro") !== "on") {
      finish();
    }

    if (!built && fontsReady && t > 1.65) {
      const targets = measure();
      if (targets.length >= 4) assign(targets);
      else if (t > 3.4) finish();
    }

    for (const a of agents) {
      if (finished) {
        const dx = a.x - cx;
        const dy = a.y - cy;
        const L = Math.hypot(dx, dy) || 1;
        a.vx = (dx / L) * 14;
        a.vy = (dy / L) * 14;
        a.x += (dx / L) * 720 * dt;
        a.y += (dy / L) * 720 * dt;
        setShape(a, "arrow");
        a.badge.hidden = true;
      } else {
        stepAgent(a, dt, t, cx, cy);
      }
      paint(a, dt);
    }

    if (built && !finished && agents.filter((a) => a.builder).every((a) => a.i >= a.script.length)) {
      finish();
    }
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") finish();
  };
  const onMove = (e: PointerEvent) => {
    mouse = { x: e.clientX, y: e.clientY };
  };
  const prevent = (e: Event) => {
    if (!finished) e.preventDefault();
  };
  window.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });

  return {
    skip: finish,
    destroy() {
      stop = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      stage.remove();
      if (!finished) {
        document.querySelectorAll("header, main, footer").forEach((el) => {
          el.removeAttribute("inert");
        });
      }
    },
  };
}

"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp, useReducedMotion } from "../providers";
import { ArrowDown } from "../icons";

const EASE = [0.22, 1, 0.36, 1] as const;

// Typewriter headline — types line1, then line2 (accent), with a blinking caret.
// Keyed by language in <Hero> so it re-types when the language is switched.
function TypewriterTitle({
  line1,
  line2,
  reduced,
}: {
  line1: string;
  line2: string;
  reduced: boolean;
}) {
  const chars1 = Array.from(line1);
  const chars2 = Array.from(line2);
  const total = chars1.length + chars2.length;
  const [n, setN] = useState(reduced ? total : 0);

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let typer: ReturnType<typeof setInterval> | undefined;
    const starter = setTimeout(() => {
      typer = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= total && typer) clearInterval(typer);
      }, 60);
    }, 460);
    return () => {
      clearTimeout(starter);
      if (typer) clearInterval(typer);
    };
  }, [reduced, total]);

  const line1Done = n >= chars1.length;
  const shown1 = chars1.slice(0, line1Done ? chars1.length : n).join("");
  const shown2 = line1Done ? chars2.slice(0, n - chars1.length).join("") : "";

  const caret = (
    <motion.span
      aria-hidden
      className="ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.1em] rounded-full bg-accent"
      animate={reduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.9, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }
      }
    />
  );

  return (
    <>
      <span>
        {shown1}
        {!line1Done && caret}
      </span>
      <br />
      <span className="accent-text">
        {shown2}
        {line1Done && caret}
      </span>
    </>
  );
}

export function Hero() {
  const { t, lang } = useApp();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -80]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 55]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  };
  const item: Variants = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
      };

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20"
    >
      {/* animated grid backdrop */}
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10" />
      {/* accent glow — top-right */}
      <div
        className="pointer-events-none absolute -z-10 h-[44rem] w-[44rem] rounded-full blur-[130px]"
        style={{
          top: "-12%",
          right: "-10%",
          background: "radial-gradient(circle, var(--accent-glow), transparent 65%)",
          opacity: 0.45,
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 sm:gap-12 md:grid-cols-[1.45fr_1fr] md:gap-14">
        {/* text column */}
        <motion.div
          style={{ y: textY, opacity: fade }}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* eyebrow — 2-line wrap on mobile is intentional & clean at this size */}
          <motion.p
            variants={item}
            className="eyebrow mb-5 text-[0.6rem] leading-[1.6] text-accent sm:text-xs sm:leading-none"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="display whitespace-nowrap text-[clamp(2.2rem,6vw,5rem)] font-extrabold text-foreground"
          >
            {t.hero.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="display mt-3 text-[clamp(1.25rem,3.5vw,2.6rem)] font-semibold leading-[1.08] text-muted"
          >
            <TypewriterTitle
              key={lang}
              line1={t.hero.taglineLine1}
              line2={t.hero.taglineLine2}
              reduced={reduced}
            />
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:mt-7 sm:text-lg"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            {t.hero.bio}
          </motion.p>

          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <a
              href="#contact"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5 focus-visible:rounded-full sm:px-7"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#work"
              className="rounded-full border border-hairline px-6 py-3 text-sm font-medium text-foreground transition-[colors,border-color] duration-300 [transition-timing-function:var(--ease-out-quint)] hover:border-hairline-strong hover:bg-surface focus-visible:rounded-full sm:px-7"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </motion.div>

        {/* photo column — smaller on mobile so it doesn't dominate */}
        <motion.div
          style={{ y: photoY, opacity: fade }}
          initial={reduced ? false : { opacity: 0, scale: 0.93 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.22 }}
          className="relative mx-auto w-full max-w-[220px] sm:max-w-xs md:max-w-none"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-hairline shadow-2xl">
            <Image
              src="/img/avatar.jpg"
              alt="Portrait of ChienHsien Wu"
              fill
              priority
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
          </div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#services"
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-faint transition-colors hover:text-foreground"
        aria-label={t.hero.scrollCue}
      >
        <span className="eyebrow text-[0.62rem]">{t.hero.scrollCue}</span>
        <motion.span
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown width={17} height={17} />
        </motion.span>
      </motion.a>
    </section>
  );
}

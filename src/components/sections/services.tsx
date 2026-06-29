"use client";

import { motion } from "motion/react";
import { useApp, useReducedMotion } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";
import { services, type Service } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

// Inline SVG icons — one per service type, keeping the zero-dependency approach.
function ServiceIcon({ icon }: { icon: Service["icon"] }) {
  const base = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (icon) {
    case "web":
      return (
        <svg {...base}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case "ai":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
        </svg>
      );
    case "realtime":
      return (
        <svg {...base}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "quant":
      return (
        <svg {...base}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "chip":
      return (
        <svg {...base}>
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
        </svg>
      );
  }
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { lang } = useApp();
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 4) * 0.07 }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 transition-all duration-500 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg sm:gap-5 sm:p-7"
    >
      {/* accent glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(120% 100% at 10% 0%, var(--accent-soft), transparent 70%)" }}
      />

      <span className="w-fit rounded-xl bg-surface-2 p-2.5 text-accent">
        <ServiceIcon icon={service.icon} />
      </span>

      <div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground sm:min-h-[3.5rem]">
          {service.title[lang]}
        </h3>
        <p className="mt-2 min-h-[5.125rem] text-sm leading-relaxed text-muted sm:min-h-[7.125rem]">
          {service.description[lang]}
        </p>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { t } = useApp();

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-hairline bg-surface/30 px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader label={t.services.sectionLabel} heading={t.services.heading} />
        <Reveal delay={0.1}>
          <p className="mt-3 min-h-[3rem] max-w-md text-base text-muted sm:mt-5 sm:min-h-0 sm:text-lg">{t.services.subheading}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {services.map((svc, i) => (
            <ServiceCard key={svc.icon} service={svc} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

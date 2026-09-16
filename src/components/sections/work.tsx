"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback } from "react";
import { useApp, useReducedMotion } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";
import { ArrowUpRight } from "../icons";
import { projects, type Project } from "@/lib/data";
import { ProjectModal } from "../project-modal";

const EASE = [0.22, 1, 0.36, 1] as const;

type Filter = "sw" | "hw";

// ── Segmented Filter Control ─────────────────────────────────────────────────
function SegmentedFilter({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (f: Filter) => void;
}) {
  const { t } = useApp();
  const reduced = useReducedMotion();

  const options: { key: Filter; label: string }[] = [
    { key: "sw", label: t.work.filterSw },
    { key: "hw", label: t.work.filterHw },
  ];

  return (
    <div
      role="group"
      aria-label="Filter projects by category"
      className="inline-flex rounded-xl border border-hairline bg-surface p-1 shadow-sm"
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          aria-pressed={value === opt.key}
          className={`relative rounded-lg px-5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            value === opt.key
              ? "text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          {value === opt.key && (
            <motion.span
              layoutId="segment-pill"
              className="absolute inset-0 rounded-lg bg-surface-2 shadow-sm"
              style={{ zIndex: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 38 }
              }
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  isFlagship,
  onClick,
}: {
  project: Project;
  index: number;
  isFlagship: boolean;
  onClick: () => void;
}) {
  const { t, lang } = useApp();
  const reduced = useReducedMotion();
  const [a, b] = project.accent;
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.68,
        ease: EASE,
        delay: isFlagship ? 0 : (index % 2) * 0.07,
      }}
      className={`card group flex cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl ${
        isFlagship ? "flex-col sm:flex-row" : "flex-col"
      }`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`${project.title[lang]} — ${t.work.detailsHint}`}
    >
      {/* ── Media ──────────────────────────────────────────────────────── */}
      <div
        className={`relative shrink-0 overflow-hidden ${
          isFlagship
            ? "aspect-[16/10] sm:aspect-auto sm:w-[46%]"
            : "aspect-[16/10]"
        }`}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title[lang]}
            fill
            className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover:scale-105"
            style={{
              background: `radial-gradient(130% 120% at ${
                isEven ? "20% 15%" : "80% 85%"
              }, ${a}, ${b} 65%, #080810)`,
            }}
            aria-hidden
          >
            <span className="absolute bottom-4 left-5 select-none font-mono text-6xl font-bold text-white/10">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* "click for details" hint — appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <span className="scale-90 rounded-full bg-background/80 px-4 py-1.5 text-xs font-medium text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            {t.work.detailsHint}
          </span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* meta row */}
        <div className="mb-3 flex items-center gap-2.5">
          {project.period && (
            <span className="font-mono text-xs text-faint">{project.period}</span>
          )}
          {project.private && (
            <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[0.65rem] text-faint">
              {t.work.privateBadge}
            </span>
          )}
        </div>

        <h3 className="min-h-[3.5rem] text-xl font-semibold tracking-tight text-foreground sm:min-h-0">
          {project.title[lang]}
        </h3>
        <p className="mt-1 min-h-[2.5rem] text-sm font-medium text-accent">
          {project.oneLiner[lang]}
        </p>
        <p className="mt-3 min-h-[4.25rem] line-clamp-3 text-sm leading-relaxed text-muted">
          {project.description[lang]}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[0.68rem] text-faint"
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* inline links — still clickable (stop propagation so they don't open modal) */}
        <div className="mt-6 flex gap-4 border-t border-hairline pt-4 text-sm">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
            >
              {t.work.viewCode}
              <ArrowUpRight width={14} height={14} />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent"
            >
              {t.work.viewDemo}
              <ArrowUpRight width={14} height={14} />
            </a>
          )}
          {/* visual affordance when no direct links */}
          {!project.github && !project.demo && (
            <span className="inline-flex items-center gap-1 text-xs text-faint">
              {t.work.detailsHint} →
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Group heading ─────────────────────────────────────────────────────────────
function GroupHeading({ label }: { label: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4 pb-2">
        <span className="eyebrow text-xs text-faint">{label}</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>
    </Reveal>
  );
}

// ── Grid for a batch of cards ─────────────────────────────────────────────────
function ProjectGrid({
  items,
  globalOffset,
  flagshipTitle,
  onOpen,
}: {
  items: Project[];
  globalOffset: number;
  flagshipTitle: string;
  onOpen: (p: Project) => void;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((project, i) => {
        const isFlagship = project.title.en === flagshipTitle;
        return (
          <div key={project.title.en} className={isFlagship ? "sm:col-span-2" : ""}>
            <ProjectCard
              project={project}
              index={globalOffset + i}
              isFlagship={isFlagship}
              onClick={() => onOpen(project)}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Work Section ──────────────────────────────────────────────────────────────
export function Work() {
  const { t } = useApp();
  const [filter, setFilter] = useState<Filter>("sw");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const swProjects = projects.filter((p) => p.category === "sw");
  const hwProjects = projects.filter((p) => p.category === "hw");
  const flagshipTitle = swProjects[0]?.title.en ?? "";

  const openModal = useCallback((p: Project) => setActiveProject(p), []);
  const closeModal = useCallback(() => setActiveProject(null), []);

  const showSw = filter === "sw";
  const showHw = filter === "hw";

  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-hairline px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader label={t.work.sectionLabel} heading={t.work.heading} />
        <Reveal delay={0.1}>
          <p className="mt-3 min-h-[3rem] max-w-xl text-base text-muted sm:mt-5 sm:min-h-0 sm:text-lg">{t.work.subheading}</p>
        </Reveal>

        {/* Segmented filter */}
        <Reveal delay={0.14}>
          <div className="mt-8 sm:mt-10">
            <SegmentedFilter value={filter} onChange={setFilter} />
          </div>
        </Reveal>

        {/* Software group */}
        <AnimatePresence mode="wait">
          {showSw && (
            <motion.div
              key="sw-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-12 space-y-4"
            >
              <GroupHeading label={t.work.swLabel} />
              <ProjectGrid
                items={swProjects}
                globalOffset={0}
                flagshipTitle={flagshipTitle}
                onOpen={openModal}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hardware group */}
        <AnimatePresence mode="wait">
          {showHw && (
            <motion.div
              key="hw-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-14 space-y-4"
            >
              <GroupHeading label={t.work.hwLabel} />
              <ProjectGrid
                items={hwProjects}
                globalOffset={showSw ? swProjects.length : 0}
                flagshipTitle=""
                onOpen={openModal}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail modal — rendered outside the grid so it's above everything */}
      <ProjectModal project={activeProject} onClose={closeModal} />
    </section>
  );
}

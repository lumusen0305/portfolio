"use client";

/**
 * ProjectModal — full-detail overlay for a project card.
 *
 * Architecture:
 *  - ProjectModal (exported): outer shell — AnimatePresence + backdrop.
 *  - ModalContent (internal): keyed on project.title.en so React remounts it
 *    fresh for each project. galleryIdx starts at 0 every time with no
 *    setState-in-effect required.
 *
 * Features:
 *  - motion fade+scale entry, backdrop blur
 *  - close on Esc / backdrop click / close button
 *  - focus trap (Tab cycles within modal)
 *  - body-scroll lock while open
 *  - image gallery with dot-strip navigation (only when images.length > 1)
 *  - gradient fallback header when no images exist
 *  - role="dialog" aria-modal="true"
 *  - respects prefers-reduced-motion
 *  - mobile: full-width bottom sheet, scrollable
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useApp, useReducedMotion } from "./providers";
import { ArrowUpRight } from "./icons";
import type { Project } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  project: Project | null;
  onClose: () => void;
}

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),' +
        'textarea:not([disabled]),select:not([disabled]),' +
        '[tabindex]:not([tabindex="-1"])'
    )
  );
}

// ── Inner modal content ───────────────────────────────────────────────────────
// Keyed by project identity on the AnimatePresence child so it remounts fresh
// for each project — galleryIdx always initialises to 0 without any effect.
function ModalContent({
  project,
  onClose,
  onBackdropClick,
  overlayRef,
}: {
  project: Project;
  onClose: () => void;
  onBackdropClick: (e: React.MouseEvent) => void;
  overlayRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t, lang } = useApp();
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fresh on every mount — no effect needed to reset.
  const [galleryIdx, setGalleryIdx] = useState(0);

  const gallery: string[] =
    project.images && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : [];

  const categoryLabel =
    project.category === "hw" ? t.work.catHw : t.work.catSw;

  // Body scroll lock.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc + Tab focus trap.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = getFocusable(dialogRef.current);
        if (!focusable.length) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Auto-focus on mount.
  useEffect(() => {
    if (!dialogRef.current) return;
    const first = getFocusable(dialogRef.current)[0];
    (first ?? dialogRef.current).focus();
  }, []);

  const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: reduced ? 0 : 0.22, ease: EASE } },
    exit:  { opacity: 0, transition: { duration: reduced ? 0 : 0.18, ease: EASE } },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 16 },
    show:  { opacity: 1, scale: 1, y: 0,
             transition: { duration: reduced ? 0 : 0.3, ease: EASE } },
    exit:  { opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : 8,
             transition: { duration: reduced ? 0 : 0.2, ease: EASE } },
  };

  return (
    <motion.div
      ref={overlayRef}
      variants={overlayVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(12px)" }}
      onClick={onBackdropClick}
    >
      <motion.div
        ref={dialogRef}
        variants={dialogVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-label={project.title[lang]}
        tabIndex={-1}
        className="relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-hairline bg-surface shadow-2xl focus:outline-none sm:rounded-3xl"
      >
        {/* ── Gallery ──────────────────────────────────────────────────── */}
        {gallery.length > 0 && (
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-surface-2">
            <Image
              src={gallery[galleryIdx]}
              alt={`${project.title[lang]} — image ${galleryIdx + 1}`}
              fill
              className="object-cover"
              priority
            />
            {/* bottom fade */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
              style={{ background: "linear-gradient(to top, var(--surface), transparent)" }}
            />
            {/* dot strip — only when multiple images */}
            {gallery.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === galleryIdx
                        ? "w-5 bg-accent"
                        : "w-1.5 bg-white/35 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
            {/* accent gradient shown behind image (visible if image fails) */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(130% 120% at 20% 15%, ${project.accent[0]}, ${project.accent[1]} 65%, #080810)`,
              }}
              aria-hidden
            />
          </div>
        )}

        {/* ── Gradient header when no gallery ─────────────────────────── */}
        {gallery.length === 0 && (
          <div
            className="h-28 w-full shrink-0"
            style={{
              background: `radial-gradient(130% 120% at 20% 15%, ${project.accent[0]}, ${project.accent[1]} 65%, #080810)`,
            }}
            aria-hidden
          />
        )}

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {/* meta badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {categoryLabel}
            </span>
            {project.period && (
              <span className="font-mono text-xs text-faint">{project.period}</span>
            )}
            {project.private && (
              <span className="rounded-full border border-hairline px-2.5 py-1 font-mono text-xs text-faint">
                {t.work.privateBadge}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {project.title[lang]}
          </h2>
          <p className="mt-1 text-sm font-medium text-accent">
            {project.oneLiner[lang]}
          </p>

          <p className="mt-5 text-base leading-relaxed text-muted">
            {project.detail[lang]}
          </p>

          {/* tech tags */}
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 font-mono text-xs text-faint"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* action links */}
          {(project.github || project.demo) && (
            <div className="mt-6 flex flex-wrap gap-3 border-t border-hairline pt-5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
                >
                  {t.work.viewDemo}
                  <ArrowUpRight width={14} height={14} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Close button ─────────────────────────────────────────────── */}
        <button
          onClick={onClose}
          aria-label={t.work.close}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-hairline bg-background/70 text-muted backdrop-blur-sm transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Exported shell ────────────────────────────────────────────────────────────
export function ProjectModal({ project, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {project && (
        // key forces a fresh ModalContent mount for each project,
        // which resets galleryIdx to 0 without a setState-in-effect.
        <ModalContent
          key={project.title.en}
          project={project}
          onClose={onClose}
          onBackdropClick={handleBackdropClick}
          overlayRef={overlayRef}
        />
      )}
    </AnimatePresence>
  );
}

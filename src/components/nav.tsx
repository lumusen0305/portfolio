"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useApp } from "./providers";
import { MoonIcon, SunIcon } from "./icons";

// Nav links: services, work, about, contact + a quieter "Logic" link
const NAV_LINKS = ["services", "work", "about", "contact"] as const;
type NavSection = (typeof NAV_LINKS)[number];

export function Nav() {
  const { t, theme, toggleTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = NAV_LINKS.map((id) => ({
    id,
    label: t.nav[id as NavSection],
  }));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 [transition-timing-function:var(--ease-out-quint)] ${
        scrolled
          ? "border-b border-hairline bg-background/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        {/* wordmark */}
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-foreground transition-opacity hover:opacity-60"
          aria-label="Home"
        >
          <span className="text-accent">~/</span>chienhsien
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
          {/* logic circuit as a quieter link */}
          <li>
            <a
              href="#logic"
              className="font-mono text-xs text-faint transition-colors hover:text-muted"
            >
              Logic
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-foreground transition-colors hover:bg-surface"
            aria-label={theme === "dark" ? t.nav.themeLight : t.nav.themeDark}
          >
            {theme === "dark" ? (
              <SunIcon width={16} height={16} />
            ) : (
              <MoonIcon width={16} height={16} />
            )}
          </button>

          {/* mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-foreground transition-colors hover:bg-surface md:hidden"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
          >
            <div className="relative h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-4 bg-current transition-all duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-hairline bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-lg text-foreground transition-colors hover:bg-surface"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#logic"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 font-mono text-base text-muted transition-colors hover:bg-surface"
                >
                  Logic
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

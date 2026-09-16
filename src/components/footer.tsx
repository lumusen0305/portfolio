"use client";

import { useApp } from "./providers";
import { ArrowDown } from "./icons";

export function Footer() {
  const { t } = useApp();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="font-mono text-xs text-faint">
          © {year} {t.hero.name}. {t.footer.rights}
        </p>
        <a
          href="#top"
          aria-label={t.footer.backToTop}
          className="group inline-flex items-center gap-2 text-xs text-muted transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          {t.footer.backToTop}
          <ArrowDown
            width={14}
            height={14}
            className="rotate-180 transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] group-hover:-translate-y-1"
          />
        </a>
      </div>
    </footer>
  );
}

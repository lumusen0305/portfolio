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
          className="group inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-foreground"
        >
          {t.footer.backToTop}
          <ArrowDown
            width={14}
            height={14}
            className="rotate-180 transition-transform group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}

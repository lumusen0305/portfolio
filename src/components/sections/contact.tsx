"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import { useApp } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";
import { ArrowUpRight, CopyIcon, MailIcon, socialIcons } from "../icons";
import { email, socials } from "@/lib/data";

// Inline check icon — avoids adding to the shared icon set for a single use
function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Contact() {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-hairline px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader label={t.contact.sectionLabel} heading={t.contact.heading} />

        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-[1.35fr_1fr] md:gap-12">
          <div>
            <Reveal>
              <p className="min-h-[4.875rem] max-w-sm text-base leading-relaxed text-muted sm:min-h-[5.5rem] sm:max-w-md sm:text-lg">
                {t.contact.paragraph}
              </p>
            </Reveal>

            {/* Screen-reader announcement for copy state — separate from the button for correct aria-live semantics */}
            <span aria-live="polite" aria-atomic="true" className="sr-only">
              {copied ? t.contact.copied : ""}
            </span>

            <Reveal delay={0.08}>
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <MailIcon width={16} height={16} />
                  {t.contact.emailLabel}
                </a>
                <button
                  onClick={copyEmail}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    copied
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-hairline text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                  aria-label={copied ? t.contact.copied : `Copy email address`}
                >
                  {copied ? (
                    <CheckIcon width={15} height={15} />
                  ) : (
                    <CopyIcon width={15} height={15} />
                  )}
                  {copied ? t.contact.copied : email}
                </button>
              </div>
            </Reveal>
          </div>

          {/* social buttons */}
          <div className="flex flex-col gap-3 self-start sm:flex-row md:flex-col">
            {socials.map((s, i) => {
              const Icon = socialIcons[s.icon];
              return (
                <Reveal key={s.label} delay={i * 0.07}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface px-5 py-4 transition-all duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="flex items-center gap-3 text-foreground transition-colors duration-300 group-hover:text-accent">
                      <Icon width={20} height={20} />
                      <span className="text-sm font-medium">{s.label}</span>
                    </span>
                    <ArrowUpRight
                      width={16}
                      height={16}
                      className="text-faint transition-colors duration-300 group-hover:text-accent"
                    />
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useApp } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";
import { ArrowUpRight, CopyIcon, MailIcon, socialIcons } from "../icons";
import { email, socials } from "@/lib/data";

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

            <Reveal delay={0.08}>
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background transition-transform duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5"
                >
                  <MailIcon width={16} height={16} />
                  {t.contact.emailLabel}
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-3 font-mono text-sm text-muted transition-colors hover:text-foreground"
                  aria-live="polite"
                >
                  <CopyIcon width={15} height={15} />
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
                    className="group flex items-center justify-between rounded-2xl border border-hairline bg-surface px-5 py-4 transition-all duration-300 [transition-timing-function:var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-accent"
                  >
                    <span className="flex items-center gap-3 text-foreground">
                      <Icon width={20} height={20} />
                      <span className="text-sm font-medium">{s.label}</span>
                    </span>
                    <ArrowUpRight
                      width={16}
                      height={16}
                      className="text-faint transition-colors group-hover:text-accent"
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

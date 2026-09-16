"use client";

import Image from "next/image";
import { useApp } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";

export function About() {
  const { t } = useApp();

  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-hairline px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader label={t.about.sectionLabel} heading={t.about.heading} />

        <div className="mt-10 grid gap-10 sm:mt-14 sm:gap-16 lg:grid-cols-[1.6fr_1fr]">
          {/* bio column — max-w-[65ch] keeps line length readable at large screens */}
          <div className="max-w-[65ch] space-y-6 text-lg leading-relaxed text-muted">
            <Reveal>
              <p>{t.about.paragraph1}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <p>{t.about.paragraph2}</p>
            </Reveal>
            {/* motto as pull-quote */}
            <Reveal delay={0.12}>
              <p className="border-l-[3px] border-accent pl-5 font-medium italic text-foreground">
                {t.about.paragraph3}
              </p>
            </Reveal>

            {/* availability badge */}
            <Reveal delay={0.16}>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden />
                {t.about.availableBadge}
              </span>
            </Reveal>
          </div>

          {/* sidebar: avatar */}
          <div>
            <Reveal>
              <div className="relative aspect-square w-40 overflow-hidden rounded-2xl border border-hairline shadow-xl sm:w-52 lg:w-full lg:max-w-xs">
                <Image
                  src="/img/avatar.jpg"
                  alt="Portrait of ChienHsien Wu"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

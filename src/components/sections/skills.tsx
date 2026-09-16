"use client";

import { useApp, useReducedMotion } from "../providers";
import { Reveal } from "../reveal";
import { SectionHeader } from "../section-header";
import { skillGroups, experience } from "@/lib/data";

export function Skills() {
  const { t, lang } = useApp();
  const reduced = useReducedMotion();

  return (
    <section
      id="skills"
      className="scroll-mt-20 border-t border-hairline bg-surface/30 px-5 py-16 sm:px-8 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader label={t.skills.sectionLabel} heading={t.skills.heading} />

        <div className="mt-10 grid gap-12 sm:mt-16 sm:gap-16 lg:grid-cols-[1fr_1.15fr]">
          {/* tech stack */}
          <div>
            <Reveal>
              <p className="eyebrow mb-5 text-xs text-faint sm:mb-7">{t.skills.stackLabel}</p>
            </Reveal>
            <div className="space-y-6 sm:space-y-8">
              {skillGroups.map((group, gi) => (
                <Reveal key={group.label.en} delay={gi * 0.07}>
                  <div>
                    <h3 className="mb-3 text-sm font-medium text-muted">{group.label[lang]}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="cursor-default rounded-lg border border-hairline bg-surface px-3.5 py-2 font-mono text-sm text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* experience timeline */}
          <div>
            <Reveal>
              <p className="eyebrow mb-5 text-xs text-faint sm:mb-7">{t.skills.timelineLabel}</p>
            </Reveal>
            <ol className="relative border-l border-hairline pl-8">
              {experience.map((exp, i) => {
                const isCurrent = !exp.to;
                return (
                  <Reveal as="li" key={`${exp.from}-${exp.role.en}`} delay={i * 0.065}>
                    <div className="relative pb-10 last:pb-0">
                      {/* Pulse ring — only for current/present entry, respects reduced-motion */}
                      {isCurrent && !reduced && (
                        <span
                          className="absolute -left-[2.4375rem] top-1.5 h-3.5 w-3.5 animate-ping rounded-full border border-accent/60"
                          aria-hidden
                        />
                      )}
                      <span className="absolute -left-[2.4375rem] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-accent bg-background">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      </span>
                      <p className="font-mono text-xs text-accent">
                        {exp.from}
                        {exp.to && exp.to !== exp.from ? ` — ${exp.to}` : ""}
                        {isCurrent ? ` — ${t.skills.present}` : ""}
                      </p>
                      <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                        {exp.role[lang]}
                      </h3>
                      <p className="text-sm text-muted">{exp.org[lang]}</p>
                      <p className="mt-2 text-sm leading-relaxed text-faint">
                        {exp.detail[lang]}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

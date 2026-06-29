"use client";

import { Reveal } from "./reveal";

/** Shared section eyebrow + big heading. Heading supports "\n" line breaks. */
export function SectionHeader({
  label,
  heading,
  align = "left",
}: {
  label: string;
  heading: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <p className="eyebrow text-xs font-medium text-accent">{label}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="display mt-2 whitespace-pre-line text-[clamp(1.85rem,5.5vw,4.25rem)] font-extrabold text-foreground sm:mt-4">
          {heading}
        </h2>
      </Reveal>
    </div>
  );
}

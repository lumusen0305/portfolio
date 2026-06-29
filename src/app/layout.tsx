import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-term",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChienHsien Wu — AI & Frontend Engineer",
  description:
    "Freelance software engineer specializing in AI-agent integration and front-end development — LLM workflows, full-stack web apps, and real-time systems.",
  keywords: [
    "AI Agent",
    "LLM",
    "Frontend",
    "React",
    "Vue",
    "Full-Stack",
    "FastAPI",
    "Go",
    "Freelance",
    "Web Development",
  ],
  authors: [{ name: "ChienHsien Wu" }],
  openGraph: {
    title: "ChienHsien Wu — AI & Frontend Engineer",
    description: "AI-agent integration and front-end development — freelance.",
    type: "website",
  },
};

/**
 * Inline script: runs during HTML parsing (before first paint) to apply the
 * stored theme + lang, preventing any flash of the wrong state.
 */
const noFlashScript = `(function(){try{
  var t=localStorage.getItem("portfolio-theme");
  if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}
  document.documentElement.setAttribute("data-theme",t);
}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

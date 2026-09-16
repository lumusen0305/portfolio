/**
 * ============================================================================
 *  i18n.ts  —  ALL USER-FACING COPY LIVES HERE
 * ============================================================================
 *  - zh = 中文 (default)   en = English
 *  Both objects MUST share the exact same shape (same keys at every level).
 *  TypeScript enforces this at build time via the Dict interface below.
 *
 *  For structured data (projects, services, skills, experience, socials)
 *  → src/lib/data.ts
 * ============================================================================
 */

export type Lang = "zh" | "en";
export const LANGS: Lang[] = ["zh", "en"];
export const DEFAULT_LANG: Lang = "zh";

export type Localized = { zh: string; en: string };

export interface Dict {
  nav: {
    services: string;
    work: string;
    about: string;
    contact: string;
    langLabel: string;
    themeLight: string;
    themeDark: string;
    menu: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    taglineLine1: string;
    taglineLine2: string;
    bio: string;
    scrollCue: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    sectionLabel: string;
    heading: string;
    subheading: string;
  };
  work: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    viewCode: string;
    viewDemo: string;
    privateBadge: string;
    /** Segmented filter labels */
    filterAll: string;
    filterSw: string;
    filterHw: string;
    /** Group headings rendered above each category batch */
    swLabel: string;
    hwLabel: string;
    /** Modal close button */
    close: string;
    /** Subtle hint on cards */
    detailsHint: string;
    /** Category badge labels inside the modal */
    catSw: string;
    catHw: string;
  };
  about: {
    sectionLabel: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    availableBadge: string;
    awardsLabel: string;
    awards: string[];
  };
  skills: {
    sectionLabel: string;
    heading: string;
    stackLabel: string;
    timelineLabel: string;
    present: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    paragraph: string;
    emailLabel: string;
    copy: string;
    copied: string;
  };
  footer: {
    built: string;
    backToTop: string;
    rights: string;
  };
  logic: {
    sectionLabel: string;
    heading: string;
    explainer: string;
    schematicTitle: string;
    tapHint: string;
    idleHint: string;
    tryHint: string;
    legendTitle: string;
  };
}

export const dict: Record<Lang, Dict> = {
  zh: {
    // ---- Nav ----------------------------------------------------------------
    nav: {
      services: "專長",
      work: "作品",
      about: "關於",
      contact: "聯絡",
      langLabel: "EN",
      themeLight: "切換淺色",
      themeDark: "切換深色",
      menu: "選單",
    },

    // ---- Hero ---------------------------------------------------------------
    hero: {
      eyebrow: "ASIC 實體設計 · AI×EDA",
      name: "吳建賢",
      taglineLine1: "讓 AI 走進",
      taglineLine2: "晶片設計流程。",
      bio: "NVIDIA ASIC 實體設計工程師。白天收斂 GPU 時序，其餘時間打造讓 AI 參與晶片設計的工具鏈。",
      scrollCue: "向下捲動",
      ctaPrimary: "聯絡我",
      ctaSecondary: "看作品",
    },

    // ---- Services -----------------------------------------------------------
    services: {
      sectionLabel: "專長領域",
      heading: "我在做的事",
      subheading: "從軟體到矽片，兩邊都寫。",
    },

    // ---- Work ---------------------------------------------------------------
    work: {
      sectionLabel: "精選作品",
      heading: "精選作品。",
      subheading: "軟體與硬體的代表性作品——點開看細節。",
      viewCode: "原始碼",
      viewDemo: "線上展示",
      privateBadge: "私有專案",
      filterAll: "全部",
      filterSw: "軟體",
      filterHw: "硬體",
      swLabel: "軟體 / Software",
      hwLabel: "硬體 / Hardware",
      close: "關閉",
      detailsHint: "點擊查看細節",
      catSw: "軟體",
      catHw: "硬體",
    },

    // ---- About --------------------------------------------------------------
    about: {
      sectionLabel: "關於我",
      heading: "從軟體\n到矽片。",
      paragraph1:
        "我是吳建賢，NVIDIA 的 ASIC 實體設計工程師——做 GPU 時序收斂，也打造讓 AI 參與設計流程的內部工具。",
      paragraph2:
        "研究底子在 GPU 平行運算與硬體安全（GrAPL '26 一作）；工作裡把 LLM agent 與 MCP 工具鏈接進 EDA 流程。我相信下一代晶片，是工程師和 AI 一起設計出來的。",
      paragraph3: "Dream big and dare to fail.",
      availableBadge: "NVIDIA · 新竹",
      awardsLabel: "獲獎與發表",
      awards: [
        "2026 — 論文〈CHROMA: GPU 圖著色〉獲 GrAPL '26 接受",
        "2026 — 論文獲選 NVIDIA NTECH China 發表",
        "2025 — CIC 競賽決賽入圍",
        "2023 — 台灣大學菁英碩士獎學金",
        "2023 — 中興大學優秀畢業生",
        "2020 — 僑務委員會海外僑生獎學金首獎",
        "2018 — Robocode 機器人對戰第二名",
      ],
    },

    // ---- Skills & Experience ------------------------------------------------
    skills: {
      sectionLabel: "技能 · 經歷",
      heading: "工具與軌跡。",
      stackLabel: "技術堆疊",
      timelineLabel: "工作經歷",
      present: "至今",
    },

    // ---- Contact ------------------------------------------------------------
    contact: {
      sectionLabel: "聯絡",
      heading: "保持\n聯絡。",
      paragraph:
        "想聊晶片、AI×EDA、量化交易，或只是打個招呼——來信都歡迎。",
      emailLabel: "寄信給我",
      copy: "複製",
      copied: "已複製",
    },

    // ---- Footer -------------------------------------------------------------
    footer: {
      built: "以 Next.js 與 motion 打造",
      backToTop: "回到頂部",
      rights: "保留所有權利。",
    },

    // ---- Logic Circuit ------------------------------------------------------
    logic: {
      sectionLabel: "邏輯電路",
      heading: "撥動開關，讓輸出高電平。",
      explainer: "輸入端口 · 點擊切換 0 / 1",
      schematicTitle: "電路圖 · 3 輸入 → 4 輸出",
      tapHint: "每個輸出解鎖一段介紹",
      idleHint: "// 點選端口，讓輸出高電平",
      tryHint: "試著撥動 A",
      legendTitle: "輸出對應",
    },
  },

  en: {
    // ---- Nav ----------------------------------------------------------------
    nav: {
      services: "Focus",
      work: "Work",
      about: "About",
      contact: "Contact",
      langLabel: "中",
      themeLight: "Light mode",
      themeDark: "Dark mode",
      menu: "Menu",
    },

    // ---- Hero ---------------------------------------------------------------
    hero: {
      eyebrow: "ASIC Physical Design · AI×EDA",
      name: "ChienHsien Wu",
      taglineLine1: "Bringing AI into",
      taglineLine2: "the chip-design flow.",
      bio: "ASIC physical-design engineer at NVIDIA. I close GPU timing by day and build the tooling that lets AI take part in chip design.",
      scrollCue: "Scroll",
      ctaPrimary: "Get in touch",
      ctaSecondary: "See my work",
    },

    // ---- Services -----------------------------------------------------------
    services: {
      sectionLabel: "Focus",
      heading: "What I work on",
      subheading: "From software to silicon.",
    },

    // ---- Work ---------------------------------------------------------------
    work: {
      sectionLabel: "Selected Work",
      heading: "Selected work.",
      subheading: "Selected software & hardware work — click any card for details.",
      viewCode: "Source",
      viewDemo: "Live demo",
      privateBadge: "Private",
      filterAll: "All",
      filterSw: "Software",
      filterHw: "Hardware",
      swLabel: "Software",
      hwLabel: "Hardware",
      close: "Close",
      detailsHint: "Click for details",
      catSw: "Software",
      catHw: "Hardware",
    },

    // ---- About --------------------------------------------------------------
    about: {
      sectionLabel: "About",
      heading: "From software\nto silicon.",
      paragraph1:
        "I'm ChienHsien Wu, an ASIC physical-design engineer at NVIDIA — closing GPU timing, and building the internal tools that let AI join the design flow.",
      paragraph2:
        "My research roots are GPU parallel computing and hardware security (first author, GrAPL '26); at work I wire LLM agents and MCP toolchains into the EDA flow. I believe the next generation of chips gets designed by engineers and AI together.",
      paragraph3: "Dream big and dare to fail.",
      availableBadge: "NVIDIA · Hsinchu",
      awardsLabel: "Awards & Papers",
      awards: [
        "2026 — \"CHROMA: GPU Graph Coloring\" accepted at GrAPL '26",
        "2026 — Paper selected for NVIDIA NTECH China",
        "2025 — CIC Contest Finalist",
        "2023 — NTU Elite Master's Award",
        "2023 — NCHU Top Graduate",
        "2020 — Overseas Chinese Scholarship, 1st Prize",
        "2018 — Robocode Tournament, 2nd Place",
      ],
    },

    // ---- Skills & Experience ------------------------------------------------
    skills: {
      sectionLabel: "Skills · Experience",
      heading: "Tools & trajectory.",
      stackLabel: "Tech stack",
      timelineLabel: "Experience",
      present: "Present",
    },

    // ---- Contact ------------------------------------------------------------
    contact: {
      sectionLabel: "Contact",
      heading: "Get in\ntouch.",
      paragraph:
        "Chips, AI-for-EDA, quant trading, or just to say hi — my inbox is open.",
      emailLabel: "Email me",
      copy: "Copy",
      copied: "Copied",
    },

    // ---- Footer -------------------------------------------------------------
    footer: {
      built: "Built with Next.js & motion",
      backToTop: "Back to top",
      rights: "All rights reserved.",
    },

    // ---- Logic Circuit ------------------------------------------------------
    logic: {
      sectionLabel: "Logic Circuit",
      heading: "Drive the outputs high.",
      explainer: "INPUTS · click to toggle 0 / 1",
      schematicTitle: "Schematic · 3 in → 4 out",
      tapHint: "each output unlocks a chapter",
      idleHint: "// click the ports to drive an output high",
      tryHint: "Try flipping A",
      legendTitle: "Output map",
    },
  },
};

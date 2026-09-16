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
}

export const dict: Record<Lang, Dict> = {
  zh: {
    // ---- Nav ----------------------------------------------------------------
    nav: {
      services: "服務",
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
      eyebrow: "AI Agent 整合 · 全端開發",
      name: "吳建賢",
      taglineLine1: "打造 AI 產品，",
      taglineLine2: "從 Agent 到介面。",
      bio: "接案全端工程師，專注於 LLM／Agent 整合與全端產品開發。把想法，做成真正能上線的產品。",
      scrollCue: "向下捲動",
      ctaPrimary: "一起打造",
      ctaSecondary: "看作品",
    },

    // ---- Services -----------------------------------------------------------
    services: {
      sectionLabel: "服務項目",
      heading: "我能幫你做什麼",
      subheading: "從想法到上線，完整負責。",
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
      heading: "專注 AI 與\n全端開發。",
      paragraph1:
        "我是吳建賢，一名接案的全端工程師，專注於 AI Agent 整合與全端開發。",
      paragraph2:
        "我從頭到尾打造產品：把 LLM 與 Agent 工程化成穩定可靠的功能，再用 React／Vue 做出精緻好用的介面。我重視乾淨的架構與確實的測試——真正能上線。",
      paragraph3: "Dream big and dare to fail.",
      availableBadge: "目前開放接案",
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
      sectionLabel: "開始合作",
      heading: "開始\n一個專案。",
      paragraph:
        "正在接案中——有想做的產品、原型或 AI 整合，歡迎來信聊聊，我通常一天內回覆。",
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
  },

  en: {
    // ---- Nav ----------------------------------------------------------------
    nav: {
      services: "Services",
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
      eyebrow: "AI Agent Integration · Full-Stack Development",
      name: "ChienHsien Wu",
      taglineLine1: "I build AI products —",
      taglineLine2: "from agent to interface.",
      bio: "Freelance full-stack engineer focused on LLM/agent integration and end-to-end product development. I turn ideas into products that actually ship.",
      scrollCue: "Scroll",
      ctaPrimary: "Let's build something",
      ctaSecondary: "See my work",
    },

    // ---- Services -----------------------------------------------------------
    services: {
      sectionLabel: "Services",
      heading: "What I can build for you",
      subheading: "End-to-end ownership — from idea to production.",
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
      heading: "Focused on AI\n& full-stack.",
      paragraph1:
        "I'm ChienHsien Wu, a freelance full-stack engineer focused on AI-agent integration and full-stack development.",
      paragraph2:
        "I build products end to end: turning LLMs and agents into reliable features, then crafting polished interfaces in React/Vue. I value clean architecture and testing that ships.",
      paragraph3: "Dream big and dare to fail.",
      availableBadge: "Available for freelance",
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
      sectionLabel: "Work with me",
      heading: "Start a\nproject.",
      paragraph:
        "Available for freelance work. Got a product, prototype, or AI integration in mind? Drop me a line — I usually reply within a day.",
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
  },
};

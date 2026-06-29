/**
 * ============================================================================
 *  data.ts  —  EDITABLE STRUCTURED DATA
 * ============================================================================
 *  Edit the arrays below. Bilingual fields use { zh, en } pairs.
 *  Plain strings (URLs, tags, dates) are language-neutral.
 *
 *  Images: drop screenshots into public/img/projects/ and set
 *  image: "/img/projects/my-file.png". Leave "" for a gradient card.
 *
 *  For prose / headings / button labels → src/lib/i18n.ts
 * ============================================================================
 */

import type { Localized } from "./i18n";

// ---------------------------------------------------------------------------
//  SERVICES  →  cards in the Services section
// ---------------------------------------------------------------------------
export type Service = {
  icon: "web" | "ai" | "realtime" | "quant" | "chip";
  title: Localized;
  description: Localized;
};

export const services: Service[] = [
  {
    icon: "ai",
    title: { zh: "AI ／ Agent 整合", en: "AI & Agent Integration" },
    description: {
      zh: "把 LLM 變成可靠的產品功能：Agent 工作流、RAG、工具呼叫與自動化——工程化到能穩定上線，而不只是 demo。",
      en: "Turn LLMs into reliable product features — agent workflows, RAG, tool-calling, automation. Engineered to ship, not to demo.",
    },
  },
  {
    icon: "chip",
    title: { zh: "IC ／ 硬體設計", en: "IC & Hardware Design" },
    description: {
      zh: "從 RTL 到 GDSII 的數位 IC 設計：Verilog／SystemVerilog、合成、STA 時序收斂、FPGA 原型與驗證。NVIDIA／TSMC 等級的嚴謹。",
      en: "Digital IC design, RTL to GDSII: Verilog/SystemVerilog, synthesis, STA timing closure, FPGA prototyping — NVIDIA/TSMC-grade rigor.",
    },
  },
  {
    icon: "realtime",
    title: { zh: "即時與資料系統", en: "Real-Time & Data Systems" },
    description: {
      zh: "WebSocket 即時應用、即時儀表板、IoT／MQTT 資料管線，以及高負載下依然穩定的後端。",
      en: "WebSocket apps, live dashboards, IoT/MQTT pipelines, and backends that stay fast under load.",
    },
  },
  {
    icon: "quant",
    title: { zh: "全端與資料後端", en: "Full-Stack & Data Backends" },
    description: {
      zh: "從資料庫、API 到部署，一條龍負責。Python／Go／Java 後端，外加回測引擎、資料管線與量化工具。",
      en: "Database to API to deploy — one owner for the whole chain. Python/Go/Java back ends, plus backtesting, pipelines, and quant tooling.",
    },
  },
];

// ---------------------------------------------------------------------------
//  PROJECTS  →  Work grid
//
//  category: "sw" = software, "hw" = hardware.
//  Software projects render first; hardware projects follow under a separate
//  group heading. The flagship full-width layout applies only to the first SW
//  card (QuantClash).
//
//  detail: longer bilingual text shown in the detail modal.
//  images?: gallery list; falls back to [image] if omitted.
// ---------------------------------------------------------------------------
export type Project = {
  category: "sw" | "hw";
  title: Localized;
  oneLiner: Localized;
  description: Localized;
  detail: Localized;
  tags: string[];
  github?: string;
  demo?: string;
  /** Path under /public, e.g. "/img/projects/quantclash.svg". "" = gradient. */
  image?: string;
  /** Optional gallery; falls back to [image] when absent. */
  images?: string[];
  accent: [string, string];
  period?: string;
  /** If true, show a small "private" badge instead of a source link. */
  private?: boolean;
};

// ── SOFTWARE projects ───────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    category: "sw",
    title: { zh: "QuantClash — AI 量化交易平台", en: "QuantClash — AI Quant-Trading Platform" },
    oneLiner: {
      zh: "讓用戶組裝自己 AI 分析師團隊的量化平台",
      en: "A trading platform where users assemble their own AI analyst team",
    },
    description: {
      zh: "AI Agent 版的 TradingView：使用者用視覺化 DAG 組裝自己的分析師團隊、回測策略、直接在 K 線圖上看到買賣訊號。前端、後端到金流我一手打造。",
      en: "The AI-agent TradingView: users assemble their own analyst team as a visual DAG, backtest strategies, and see buy/sell signals right on the candlestick chart. I built the whole thing — front end, back end, and billing.",
    },
    detail: {
      zh: "從零打造的全端 AI 量化平台。前端用 React 19 + XyFlow 讓使用者拖拉組裝 Agent 分析流程（DAG）；後端用 FastAPI + Celery + Redis 跑非同步回測與 LangGraph agent 工作流；K 線圖即時標示買賣訊號；並整合 Stripe 金流與 Flutter 行動 App。",
      en: "A full-stack AI quant platform built from scratch. The React 19 + XyFlow front end lets users drag-and-assemble agent analysis flows (DAGs); a FastAPI + Celery + Redis back end runs async backtests and LangGraph agent workflows; candlestick charts mark buy/sell signals live; with Stripe billing and a Flutter mobile app.",
    },
    tags: ["FastAPI", "Celery", "Redis", "LangGraph", "React 19", "XyFlow", "Flutter", "Stripe"],
    image: "/img/projects/quantclash-shot1.png",
    images: [
      "/img/projects/quantclash-shot1.png",
      "/img/projects/quantclash-shot2.png",
      "/img/projects/quantclash-shot3.png",
    ],
    accent: ["#0a84ff", "#5e5ce6"],
    period: "2024–2025",
    private: true,
  },
  {
    category: "sw",
    title: { zh: "AI Meeting — 智慧會議室系統", en: "AI Meeting — Smart Meeting-Room System" },
    oneLiner: {
      zh: "物件偵測 + 語音指令 + 人臉門禁的智慧空間",
      en: "Presence detection, voice control, and face-recognition access in one system",
    },
    description: {
      zh: "端到端的智慧空間系統：物件偵測在有人時自動啟動設備、NLP 語音指令控制設備、人臉辨識依預約管理門禁。整合 AI 模型與即時前後端。",
      en: "An end-to-end smart-space system: object detection auto-activates devices on presence, NLP voice commands control equipment, and facial recognition manages appointment-based access — AI models wired into a real-time full stack.",
    },
    detail: {
      zh: "端到端智慧空間系統。整合物件偵測（有人即自動啟動設備）、NLP 語音指令控制、人臉辨識門禁（依預約驗證）。以 Python 跑 AI 模型，Vue 前端、Golang + WebSocket 即時通訊串起整個系統。",
      en: "An end-to-end smart-space system. It combines object detection (auto-activating devices on presence), NLP voice-command control, and face-recognition access (verified against appointments). Python runs the AI models, with a Vue front end and Golang + WebSocket real-time messaging tying it together.",
    },
    tags: ["Python", "Vue", "Golang", "WebSocket", "Computer Vision", "NLP"],
    image: "/img/projects/ai-meeting.svg",
    accent: ["#30d158", "#0a84ff"],
    period: "2022–2023",
    private: true,
  },
  {
    category: "sw",
    title: { zh: "QTNet — 深度強化學習交易系統", en: "QTNet — Deep-RL Trading System" },
    oneLiner: {
      zh: "GRU actor-critic 代理 + walk-forward 回測",
      en: "GRU actor-critic agent with behavioral cloning and walk-forward backtesting",
    },
    description: {
      zh: "研究級的強化學習交易系統：GRU actor-critic（RDPG）代理結合行為克隆，並以真實市場資料做 walk-forward 回測驗證。",
      en: "A research-grade RL trading system: a GRU actor-critic (RDPG) agent with behavioral cloning, evaluated with walk-forward backtesting on real market data.",
    },
    detail: {
      zh: "研究級深度強化學習交易系統。以 GRU actor-critic（RDPG）為核心，結合行為克隆加速收斂，並以真實市場資料做 walk-forward 回測驗證策略穩健性；含 DQN 對照組與批次測試框架。",
      en: "A research-grade deep-RL trading system. Built around a GRU actor-critic (RDPG) core with behavioral cloning to speed convergence, validated with walk-forward backtesting on real market data; includes a DQN baseline and a batch-testing framework.",
    },
    tags: ["Python", "PyTorch", "GRU", "Reinforcement Learning"],
    image: "/img/projects/qtnet.svg",
    accent: ["#ff9f0a", "#ff375f"],
    period: "2025",
    private: true,
  },
  {
    category: "sw",
    title: { zh: "Realtime Chat Backend", en: "Realtime Chat Backend" },
    oneLiner: {
      zh: "Go + WebSocket 高並發即時聊天後端",
      en: "High-concurrency real-time chat in Go/Gin over WebSockets",
    },
    description: {
      zh: "即時聊天後端：JWT 驗證、房間管理、加密憑證——以 Go／Gin 在 WebSocket 上乾淨地處理高並發連線。",
      en: "A real-time chat backend with JWT auth, room management, and encrypted credentials — concurrency handled cleanly in Go/Gin over WebSockets.",
    },
    detail: {
      zh: "以 Go／Gin 打造的即時聊天後端。WebSocket 處理高並發連線，JWT 驗證、房間管理、bcrypt 加密憑證，PostgreSQL 持久化。著重乾淨的並發模型與 API 設計。",
      en: "A real-time chat backend in Go/Gin. WebSocket handles high-concurrency connections, with JWT auth, room management, bcrypt-encrypted credentials, and PostgreSQL persistence. Focused on a clean concurrency model and API design.",
    },
    tags: ["Go", "Gin", "WebSocket", "JWT", "PostgreSQL"],
    github: "https://github.com/lumusen0305/GolangWebsocketChat",
    image: "/img/projects/realtime-chat.svg",
    accent: ["#64d2ff", "#5e5ce6"],
    period: "2022",
  },
  {
    category: "sw",
    title: { zh: "Pet-Shop 電商後端", en: "Pet-Shop E-Commerce Backend" },
    oneLiner: {
      zh: "Elasticsearch 搜尋 + JPA 資料層的完整電商後台",
      en: "Complete e-commerce backend with Elasticsearch search and JPA data layer",
    },
    description: {
      zh: "全端電商後端：商品搜尋（Elasticsearch）、圖片上傳、Email 通知、訂單與 JPA 資料層——完整的線上商店後台。",
      en: "A full-stack e-commerce backend: product search (Elasticsearch), image upload, email notifications, orders, and a JPA data layer — a complete online-store back end.",
    },
    detail: {
      zh: "完整電商後端。Spring Boot + JPA 資料層、Elasticsearch 商品搜尋、圖片上傳、Email 通知與訂單流程——涵蓋電商常見的後端模式。",
      en: "A complete e-commerce backend. Spring Boot + JPA data layer, Elasticsearch product search, image upload, email notifications, and an order flow — covering the backend patterns a real store needs.",
    },
    tags: ["Spring Boot", "JPA", "Elasticsearch", "MySQL"],
    image: "/img/projects/ecommerce.svg",
    accent: ["#bf5af2", "#ff9f0a"],
    period: "2023",
    private: true,
  },

  // ── HARDWARE projects ──────────────────────────────────────────────────────
  {
    category: "hw",
    title: { zh: "SoC 視覺加速器（FPGA）", en: "SoC Vision Accelerator (FPGA)" },
    oneLiner: {
      zh: "ZYNQ FPGA 上的即時 Sobel 邊緣與物件偵測",
      en: "Real-time Sobel edge & object detection on a ZYNQ FPGA",
    },
    description: {
      zh: "在 ZYNQ SoC 上的即時影像管線：相機輸入經 AXI-Stream 做 Sobel 邊緣偵測與物件偵測，結果即時輸出 VGA。",
      en: "A real-time image pipeline on a ZYNQ SoC: camera input flows over AXI-Stream through Sobel edge detection and object detection, streamed live to VGA.",
    },
    detail: {
      zh: "整合 ARM Processing System 與 FPGA PL：以 AXI-Stream 串接相機、DMA、Sobel 與物件偵測 IP，再經 Video Timing Controller 輸出 VGA。涵蓋 Vivado block design、IP 整合、AXI 介面與時序收斂。",
      en: "Integrated the ARM processing system with the FPGA fabric: camera, DMA, Sobel, and object-detection IP chained over AXI-Stream, then driven to VGA via a Video Timing Controller. Covered Vivado block design, IP integration, AXI interfaces, and timing closure.",
    },
    tags: ["Verilog", "Vivado", "ZYNQ", "AXI-Stream", "Computer Vision", "FPGA"],
    image: "/img/projects/hw-vision.png",
    images: ["/img/projects/hw-vision.png", "/img/projects/hw-vision-diagram.png"],
    accent: ["#0a84ff", "#30d158"],
    period: "2023",
  },
  {
    category: "hw",
    title: { zh: "Connect6 遊戲加速器（FPGA）", en: "Connect6 Game Accelerator (FPGA)" },
    oneLiner: {
      zh: "ZYNQ 上的六子棋硬體，含滑鼠輸入與 VGA",
      en: "Connect6 in hardware on ZYNQ, with mouse input + VGA",
    },
    description: {
      zh: "在 ZYNQ SoC 上實作六子棋：自訂 connect6 IP 處理棋局邏輯，整合滑鼠、按鍵與 VGA 顯示。",
      en: "Connect6 on a ZYNQ SoC: a custom connect6 IP handles game logic, integrated with mouse input, buttons, and VGA display.",
    },
    detail: {
      zh: "完整 SoC 整合：自訂 RTL 遊戲邏輯 IP、AXI GPIO 接實體按鍵、zyMouse IP 處理滑鼠座標、AXI4-Stream to Video Out 驅動 VGA。展現硬體狀態機與週邊整合。",
      en: "Full SoC integration: a custom RTL game-logic IP, AXI GPIO to physical buttons, a zyMouse IP for cursor coordinates, and AXI4-Stream-to-Video-Out driving VGA — hardware state machines and peripheral integration.",
    },
    tags: ["Verilog", "Vivado", "ZYNQ", "AXI GPIO", "VGA", "FPGA"],
    image: "/img/projects/hw-connect6.png",
    accent: ["#5e5ce6", "#0a84ff"],
    period: "2023",
  },
  {
    category: "hw",
    title: { zh: "DNN 加速器（FPGA）", en: "DNN Accelerator (FPGA)" },
    oneLiner: {
      zh: "ZYNQ 上的神經網路推論硬體（zyNet）",
      en: "Neural-network inference hardware (zyNet) on ZYNQ",
    },
    description: {
      zh: "在 ZYNQ SoC 整合 zyNet 神經網路 IP，透過 AXI-DMA 串流做硬體推論，展示 CPU+FPGA 協同的 DNN 加速。",
      en: "Integrated a zyNet neural-network IP on a ZYNQ SoC, streaming data via AXI-DMA for hardware inference — CPU+FPGA co-acceleration of a DNN.",
    },
    detail: {
      zh: "以 AXI Interconnect／DMA／SmartConnect 將 zyNet 推論 IP 接上 ARM 系統，資料經 DDR 進出。延伸自以 Verilog 實作的 LeNet CNN 加速器，著重資料流、量化與吞吐最佳化。",
      en: "Wired the zyNet inference IP to the ARM system via AXI Interconnect/DMA/SmartConnect, moving data through DDR. Extends my Verilog LeNet CNN accelerator — dataflow, quantization, throughput.",
    },
    tags: ["Verilog", "ZYNQ", "AXI-DMA", "CNN", "FPGA"],
    image: "/img/projects/hw-dnn.png",
    accent: ["#ff9f0a", "#0a84ff"],
    period: "2024",
  },
  {
    category: "hw",
    title: { zh: "Sphere Decoder（ASIC）", en: "Sphere Decoder (ASIC)" },
    oneLiner: {
      zh: "MIMO 偵測硬體：0.71 ns 週期、42,337 µm²",
      en: "MIMO detection ASIC: 0.71 ns cycle, 42,337 µm²",
    },
    description: {
      zh: "為 MIMO 訊號偵測設計的硬體最佳化 Sphere Decoder：4-best 候選搜尋 + 8 級管線，0.71 ns 週期、核心面積 42,337 µm²。",
      en: "A hardware-optimized Sphere Decoder for MIMO detection: 4-best candidate search + 8-stage pipeline, 0.71 ns cycle at 42,337 µm² core area.",
    },
    detail: {
      zh: "完整前後端 ASIC 流程：Verilog RTL、VCS 模擬、Design Compiler 合成與時序／功耗最佳化、Innovus APR。4-best 策略在複雜度與準確度間取得平衡。",
      en: "Full front-to-back ASIC flow: Verilog RTL, VCS simulation, Design Compiler synthesis with timing/power optimization, and Innovus place-and-route. The 4-best strategy balances complexity vs. accuracy.",
    },
    tags: ["Verilog", "Design Compiler", "Innovus", "VCS", "ASIC"],
    image: "/img/projects/hw-sphere-decode.svg",
    accent: ["#0a84ff", "#64d2ff"],
    period: "2024",
  },
  {
    category: "hw",
    title: { zh: "RTL 側通道攻擊評估", en: "RTL Side-Channel Attack Evaluation" },
    oneLiner: {
      zh: "在 RTL 階段量化加解密電路的資訊洩漏",
      en: "Quantifying crypto-circuit leakage at the RTL stage",
    },
    description: {
      zh: "在 RTL 階段評估側通道洩漏：設計加解密電路，以 KL 散度量化功耗軌跡中的資訊洩漏。",
      en: "Side-channel evaluation at the RTL stage: designed encryption/decryption circuits and quantified power-trace leakage using KL-divergence.",
    },
    detail: {
      zh: "研究主題：分析 RTL 階段是否已存在側通道風險。設計加密與解密電路，以 Verilog／VCS 取得功耗相關軌跡，並用 KL-divergence 比較分佈、量化洩漏程度。",
      en: "Research topic: whether side-channel risk exists already at the RTL stage. Designed encryption and decryption circuits, captured power-correlated traces with Verilog/VCS, and used KL-divergence to compare distributions and quantify leakage.",
    },
    tags: ["Verilog", "VCS", "Python", "Security", "KL-divergence"],
    image: "/img/projects/hw-sca.svg",
    accent: ["#ff375f", "#ff9f0a"],
    period: "2023–2024",
  },
];

// ---------------------------------------------------------------------------
//  SKILLS  →  pill badges grouped by area
// ---------------------------------------------------------------------------
export type SkillGroup = {
  label: Localized;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    label: { zh: "前端", en: "Frontend" },
    items: ["Vue", "React", "Vite", "TypeScript", "Flutter"],
  },
  {
    label: { zh: "後端", en: "Backend" },
    items: ["FastAPI", "Flask", "Gin (Go)", "Spring Boot", "Node.js"],
  },
  {
    label: { zh: "資料 & 基礎設施", en: "Data & Infra" },
    items: ["PostgreSQL", "MySQL", "Redis", "Celery", "MQTT", "Elasticsearch", "Docker", "NGINX"],
  },
  {
    label: { zh: "AI & 量化", en: "AI & Quant" },
    items: ["Python", "PyTorch", "LangGraph", "LangChain", "Reinforcement Learning", "CUDA / HPC"],
  },
  {
    label: { zh: "HDL & 驗證", en: "HDL & Verification" },
    items: ["Verilog", "SystemVerilog", "VCS", "Verdi", "JasperGold", "VC Formal", "Spyglass", "VC_Static"],
  },
  {
    label: { zh: "合成 & 實體設計", en: "Synthesis & Physical Design" },
    items: ["Design Compiler", "Innovus", "Vivado", "Catapult HLS", "RTL Synthesis", "STA", "Timing Closure", "Floorplanning", "CDC", "DFT", "Low-Power Design"],
  },
  {
    label: { zh: "語言", en: "Languages" },
    items: ["Python", "Go", "Java", "C/C++", "TypeScript", "Kotlin"],
  },
];

// ---------------------------------------------------------------------------
//  EXPERIENCE  →  vertical timeline, newest first
// ---------------------------------------------------------------------------
export type Experience = {
  from: string;
  /** Leave "" to render the i18n "present" label. */
  to: string;
  role: Localized;
  org: Localized;
  detail: Localized;
};

export const experience: Experience[] = [
  {
    from: "2026",
    to: "2026",
    role: { zh: "論文發表 — CHROMA", en: "Publication — CHROMA: Robust GPU Graph Coloring" },
    org: { zh: "GrAPL '26 · IPDPS Workshop", en: "GrAPL '26 · IPDPS Workshop" },
    detail: {
      zh: "具容錯能力的多 GPU 圖著色框架，較現有最佳方法最高 14× 加速。經同儕審查，獲 GrAPL '26 接受。",
      en: "A resilient multi-GPU graph-coloring framework — up to 14× speedup over state of the art. Peer-reviewed, accepted at GrAPL '26.",
    },
  },
  {
    from: "2025",
    to: "",
    role: { zh: "ASIC 實體設計工程師", en: "ASIC Physical Design Engineer" },
    org: { zh: "NVIDIA · 新竹", en: "NVIDIA · Hsinchu" },
    detail: {
      zh: "完整實體設計流程：STA、時序約束、時序收斂、RTL 合成、Floorplan 與 netlist 品質檢查。",
      en: "Full physical-design flow: STA, constraints, timing closure, RTL synthesis, floorplanning, and netlist quality checks.",
    },
  },
  {
    from: "2024",
    to: "2024",
    role: { zh: "數位設計工程師（實習）", en: "Digital Designer (Intern)" },
    org: { zh: "TSMC · 新竹", en: "TSMC · Hsinchu" },
    detail: {
      zh: "最佳化 N7 ADPLL（可移植至 N3）：功耗降低 16%、面積縮減 21%。工具：Verilog、VC_Static、Verdi、JasperGold、Design Compiler。",
      en: "Optimized the N7 ADPLL (portable to N3): power −16%, area −21%. Tools: Verilog, VC_Static, Verdi, JasperGold, Design Compiler.",
    },
  },
  {
    from: "2023",
    to: "2025",
    role: { zh: "碩士，先進科技研究所", en: "M.S., Graduate School of Advanced Technology" },
    org: { zh: "國立台灣大學 · 台北", en: "National Taiwan University · Taipei" },
    detail: {
      zh: "碩士研究：高效能運算與多 GPU 圖論演算法，即 CHROMA 框架的研究基礎。",
      en: "M.S. research in high-performance computing — the multi-GPU graph algorithms behind CHROMA.",
    },
  },
  {
    from: "2021",
    to: "2023",
    role: { zh: "學士，電機工程學系", en: "B.S., Electrical Engineering" },
    org: { zh: "國立中興大學 · 台中", en: "National Chung Hsing University · Taichung" },
    detail: {
      zh: "系統與訊號的基礎。",
      en: "Foundations in systems and signals.",
    },
  },
  {
    from: "2018",
    to: "2020",
    role: { zh: "學士，軟體工程學系", en: "B.S., Software Engineering" },
    org: { zh: "中南大學 · 中國", en: "Central South University · China" },
    detail: {
      zh: "網頁開發與無人機控制。軟體工程的扎實起點。",
      en: "Web development and drone control — where the software roots started.",
    },
  },
];

// ---------------------------------------------------------------------------
//  CONTACT / SOCIAL
// ---------------------------------------------------------------------------
/** NOTE: Verify this address before publishing. */
export const email = "lumusen8903052@gmail.com";

export type Social = {
  icon: "github" | "linkedin" | "x" | "instagram";
  label: string;
  href: string;
};

export const socials: Social[] = [
  {
    icon: "github",
    label: "GitHub",
    href: "https://github.com/lumusen0305",
  },
  {
    icon: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chienhsien-wu-9a1086268",
  },
];

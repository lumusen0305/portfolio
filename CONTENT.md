# Editing your content

This site keeps **all editable content in two files** so you never have to touch
component code. Everything is bilingual (中文 / English).

| What you want to change | File | What to edit |
| --- | --- | --- |
| Name, taglines, bios, headings, button labels, terminal responses | `src/lib/i18n.ts` | The `zh` (中文) and `en` (English) objects |
| Projects, skills, experience timeline, email, social links | `src/lib/data.ts` | The exported arrays |
| Your photo | `public/img/` | Replace `avatar.svg` or point a project at a new image |
| Site `<title>` / SEO description | `src/app/layout.tsx` | The `metadata` object |

After editing, run `npm run build` (or `npm run dev`) to see changes.

---

## 1. Text & copy — `src/lib/i18n.ts`

Open `src/lib/i18n.ts`. It exports one big `dict` object with two keys:

```ts
export const dict = {
  zh: { /* 所有中文文案 */ },
  en: { /* all English copy */ },
};
```

**Rule:** whatever key exists under `zh` must also exist under `en` (and vice
versa). If you add a key to one and forget the other, the build will fail with a
TypeScript error — that's a feature, it keeps the two languages in sync.

Highlights you'll likely change first:

- `hero.name` — your name (currently `你的名字` / `Your Name`).
- `hero.taglineLine1` / `hero.taglineLine2` — the big two-line tagline. The
  second line is rendered in the accent color.
- `hero.bio`, `about.paragraph1/2/3` — your story.
- `about.traits` — personality tags (an array of strings).
- `terminal.*` — the easter-egg terminal's responses. `help`, `whoami`,
  `about`, `skills`, `contact`, `projects` all read from here.
  - `terminal.contactList` is shown by the `contact` command — keep it in sync
    with `email` / `socials` in `data.ts`.

Newlines: some headings (e.g. `about.heading`, `contact.heading`) use `\n` to
force a line break. Keep or move the `\n` to control where lines wrap.

The default language is **中文**. Change it in `src/lib/i18n.ts`:

```ts
export const DEFAULT_LANG: Lang = "zh"; // change to "en" for English-first
```

The visitor's choice is saved to their browser (`localStorage`) and a 中 / EN
button in the top-right nav toggles it live.

---

## 2. Structured data — `src/lib/data.ts`

This file holds the lists. Bilingual fields use a `{ zh, en }` pair, e.g.:

```ts
title: { zh: "中文標題", en: "English title" },
```

### Projects (the "Work" grid)

Edit the `projects` array. Each project:

```ts
{
  title:       { zh: "...", en: "..." },
  description: { zh: "...", en: "..." },
  tags:        ["Verilog", "Python"],        // small mono pills
  github:      "https://github.com/...",     // optional — omit/"" hides the button
  demo:        "https://...",                // optional — omit/"" hides the button
  image:       "",                            // "" = auto gradient; or "/img/foo.jpg"
  accent:      ["#0a84ff", "#5e5ce6"],        // gradient colors used when no image
}
```

To use a real screenshot: drop the file in `public/img/` and set
`image: "/img/your-file.jpg"`.

### Skills (badge groups)

Edit `skillGroups` — each group has a bilingual `label` and an `items` string
array.

### Experience (timeline)

Edit `experience` (newest first). Set `to: ""` to show the "至今 / Present" label.

### Email & socials

```ts
export const email = "you@example.com";

export const socials = [
  { icon: "github",    label: "GitHub",    href: "https://github.com/yourname" },
  { icon: "linkedin",  label: "LinkedIn",  href: "https://linkedin.com/in/yourname" },
  { icon: "x",         label: "X",         href: "https://x.com/yourname" },
  { icon: "instagram", label: "Instagram", href: "https://instagram.com/yourname" },
];
```

`icon` must be one of: `"github" | "linkedin" | "x" | "instagram"`.
Add/remove items freely. Remember to also update `terminal.contactList` in
`i18n.ts` if you want the terminal's `contact` command to match.

---

## 3. Your photo — `public/img/avatar.svg`

The hero shows `public/img/avatar.svg` (a generated gradient + silhouette
placeholder). Replace it with your own image:

- Easiest: save your photo as `public/img/avatar.svg` (or `.jpg`/`.png`) — if
  you use a different extension, update the `src` in
  `src/components/sections/hero.tsx` (`/img/avatar.svg`).

---

## 4. Theme & accent color

- Light/dark is automatic (respects the OS) **and** toggleable via the nav.
- To change the single accent color, edit the CSS variables in
  `src/app/globals.css` under `[data-theme="dark"]` and `[data-theme="light"]`:

```css
--accent: #0a84ff; /* the one accent color */
```

---

## Run it

```bash
npm run dev     # local dev server at http://localhost:3000
npm run build   # production build (also catches any i18n key mismatches)
npm start       # serve the production build
```

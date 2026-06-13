# EGU Design System — Handoff to Claude Code

This folder hands the **Extended Gumption Universe design system** off to Claude
Code instances working in the two product repos. Read this file first, then the
per-repo brief for the repo you're in.

## The model

The design system lives as its own project and is **also an installable Agent
Skill** (it has `SKILL.md` at its root). It is the **source of truth** for
brand, tokens, components, and the look/behavior of every screen.

**Step 1 — install the skill in each repo.** Copy the entire design-system
project into the repo at:

```
<repo>/.claude/skills/egu-design/
```

(So `egu-design/SKILL.md`, `egu-design/styles.css`, `egu-design/readme.md`,
`egu-design/assets/…`, `egu-design/ui_kits/…`, etc. all land there.) Claude Code
auto-discovers skills under `.claude/skills/`. The skill's `readme.md` is the
full design guide — CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, the
token reference, and the component/UI-kit manifest.

**Step 2 — run the per-repo brief.** Open the matching brief below and follow it.
It references files inside the skill by path (e.g.
`.claude/skills/egu-design/assets/grit-glyph.svg`) rather than restating values,
so the skill stays the single source of truth.

- **`gumption-hub.md`** — the *themed* hub (the 2B2F gold skin + new IA + motion).
- **`gumptionchain.md`** — the *vanilla* base node (stays stock Bootstrap; minimal).

## About the design files (important)

The files under `ui_kits/` in the skill are **design references built in HTML +
React (Babel-in-browser)** — prototypes showing the intended look and behavior.
They are **not** production code to paste in. Both target repos are
**Flask + Jinja + Bootstrap 5**; recreate the designs in that environment using
the repo's existing patterns (Jinja templates, `static/css`, vanilla JS /
existing `.mjs` modules). The React kits exist only to show pixel-level intent
and interaction flow.

## Fidelity

**High-fidelity.** Colors, type, spacing, radii, motion, and copy are final.
Match them exactly — pull values from `.claude/skills/egu-design/tokens/*.css`
and the brand CSS, and mirror the interactions shown in the UI kits.

## Why two repos

`gumption-hub` embeds the `gumptionchain` Python package and runs a non-milling
node. It customizes the base browser UI **through a template-override + CSS
seam**. So:

- The **hub** carries the gold 2B2F skin and the EGU front door. When the hub
  serves the chain explorer, its `base.html` applies the skin (the design
  system's `.theme-2b2f` scope) over the base templates.
- The **vanilla `gumptionchain`** node stays stock Bootstrap — it must **not**
  adopt the gold skin. It only needs the node favicon and to keep its copy in
  the EGU voice. Visually it is the plain explorer (the toggle = OFF state in
  `ui_kits/gumptionchain-explorer/`).

## Verifying

Each brief ends with a checklist. The fastest visual check is to open the
relevant UI kit from the skill (`ui_kits/gumption-hub/index.html` or
`ui_kits/gumptionchain-explorer/index.html` — flip its skin toggle) in a browser
and compare screen-by-screen.

## Source repos (for deeper context)

- https://github.com/gumptionthomas/gumption-hub
- https://github.com/gumptionthomas/gumptionchain

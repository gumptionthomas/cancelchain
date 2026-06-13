---
name: egu-design
description: Use this skill to generate well-branded interfaces and assets for The Extended Gumption Universe (EGU) — the gold-leaf "2B2F" ledger aesthetic of GumptionChain and the gumption-hub — for production or for throwaway prototypes/mocks/slides. Contains the essential design guidelines, colors, type, fonts, brand assets, and reusable UI kit components.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out (`assets/`) and create static HTML files for the user to view — link `styles.css` and either use the brand classes (`.egu-card`, `.gc-card`, `.btn-gold`, `.ledger-*`, `.stakes-ticker`, `.kind-*`) or mount the React components from `_ds_bundle.js` (`window.ExtendedGumptionUniverseDesignSystem_a80556`: `Grit`, `Button`, `Card`, `Seal`, `KindLabel`, `LedgerBoard`, `Ticker`, `StatCard`, `NetStance`, `OutflowBadge`). The `<Grit>` mark (or `assets/grit-glyph.svg`) goes wherever an amount of GRIT is shown.

If working on production code, copy assets and read the rules here to become an expert in designing with this brand — the patterns map 1:1 to the live `gumption-hub/static/css/hub.css` classes; lift token values straight from `tokens/`.

Key things to honor: there are **two visual modes sharing one voice** — **vanilla** base gumptionchain is stock Bootstrap 5 (no theme class), while **hub-themed** gumption-hub adds `class="theme-2b2f"` to paint the gold 2B2F foundations on top (everything gold is gated under that scope; `explorer.css` reskins base's Bootstrap markup only inside it). Shared by both: the content fundamentals and **green = support, red = opposition (reserved meanings, never decoration)**. In the hub theme: gold is the brand spine; warm paper is the ground; Righteous is always UPPERCASE + tracked; Inter for body; no emoji; motion is purposeful and respects `prefers-reduced-motion`.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

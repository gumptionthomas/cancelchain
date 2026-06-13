# The Extended Gumption Universe — Design System

> Branded interfaces and assets for **The Extended Gumption Universe (EGU)** — the
> personal hub linking Thomas's games and tools under one banner, all wired to
> **GumptionChain: the Great Ledger of Grievances & Commendations**.

This is the **2B2F** design language (named for the first member game, *Too Big
To Fail*) — a gold-leaf ledger on warm parchment. It originated in the
`acquire-llm` project and is ported faithfully here from the live
`gumption-hub` stylesheet, then extended with a **motion layer** so the UI gains
the "flare and movement" the static site was missing.

---

## What the EGU is

A family of games and tools tied together two ways: a shared front door
(this hub) **and** a shared economy. Every EGU app rewards/dispenses **GRIT** —
the unit of value on **GumptionChain**, a proof-of-work "blockchain of
accountability." Users spend GRIT to put a **subject** on the ledger as either
**support** (a commendation) or **opposition** (a grievance). Anyone can verify
a stake; anyone can run a node. Independent developers are invited to join the
universe and distribute/use GRIT in their own apps.

- **Gumption** is measured in **grains** — 100 grains to a **grit**.
- A **stake** = grit committed as support or opposition for a subject.
- A **proof** = a portable, signed receipt of a stake, verifiable by anyone.
- Identity = a **signing key** that lives on your device (no accounts), optionally
  **bound** to a GitHub handle.

### The products (EGU "members")

| Member | What it is | Status |
|---|---|---|
| **GumptionChain** | The proof-of-work chain + explorer, wallet, verify card | Live |
| **Too Big To Fail (2b2f)** | The board game *Acquire*, reimagined online (toobigtofail.net) | In production |
| More games | Coming to the universe | Teased |

### The two codebases (both ours to modify)

- **`gumptionchain`** — the base Flask app + Python package: the node, consensus,
  chain explorer (Bootstrap 5, stock markup). https://github.com/gumptionthomas/gumptionchain
- **`gumption-hub`** — embeds the `gumptionchain` package and runs a non-milling
  node, serving the EGU front door + the "Verified on GumptionChain" card. It
  **themes the base browser UI through a template-override seam** (app templates
  shadow base's) — so the hub is the *customized* skin and the base explorer is
  the *vanilla* one. https://github.com/gumptionthomas/gumption-hub

> **Sources used to build this system** (explore them for deeper fidelity):
> - `gumption-hub/src/gumption_hub/static/css/hub.css` — the canonical 2B2F skin (every token & pattern here is ported from it)
> - `gumption-hub/.../templates/` — `index.html` (landing), `base.html` (nav/footer shell), `proof.html` (verify card), `about.html`, `bind.html`, `me.html`, `_ticker.html`
> - `gumption-hub/.../static/img/gumption-g.png`, `templates/_tbtf-logo.svg` — the brand marks
> - `gumption-hub/.../ledger.py`, `platforms.py` — ledger/ticker data shapes and copy
> - The implementation spec lives in `gumptionchain/docs/superpowers/` (not read here; available to the reader with repo access).

---

## CONTENT FUNDAMENTALS

The voice is **plain, civic, and a little ceremonial** — it treats a hobby
blockchain with the gravity of a town ledger, without irony tipping into a joke.

- **Person.** Second person to the visitor ("**Your** signing key", "**You** earn
  it in EGU games"), first-person plural for the project ("the EGU runs on a
  small fleet of millers — and it **grows** one node at a time"). Never corporate
  "we are excited to."
- **Tone.** Warm, earnest, archival. Metaphors are physical and old-world: a key
  "marks your stakes as yours — the way a **seal** marks a letter"; the chain
  "keeps the **receipts**"; "the ledger **awaits its first grievance**."
- **Casing.** Sentence case in body copy. **Righteous display type is always
  UPPERCASE** (brand, headings, kickers, table headers, seal labels). Member
  kickers read like datelines: `EGU member · the chain`.
- **The vocabulary is load-bearing — use these exact words:**
  *gumption · grains · grit · GRIT (uppercase on proofs/sharing) · stake ·
  support · opposition · subject · ledger · proof · sign / signing key · bind ·
  mill / miller · node · the Great Ledger of Grievances & Commendations.*
  Support is a **commendation**; opposition is a **grievance**.
- **Numbers.** Grit shown to 2 decimals with tabular figures (`4.20`); grains
  divided by 100 for display. Chain stats run together in a quiet "pulse" line:
  `height 184,213 · 27.9 grit staked · 5 subjects · full chain →`.
- **CTAs** are lowercase, action-first, often with a trailing arrow:
  `play → earn GRIT →`, `Get your key →`, `join the EGU →`, `full chain →`,
  `add your name`.
- **Punctuation flourishes.** Mid-sentence em-dashes; `·` as a separator in meta
  lines; `&` (ampersand) in titles ("Grievances & Commendations").
- **No emoji.** The site uses none in prose.
- **Honesty about state.** Teasers say "Coming to the universe"; unfinished
  things say so plainly ("a step-by-step member onboarding guide is on its way").
- **Status glyphs** are unicode marks (`✓` pass · `✗` fail · `⏳` pending · `◀ ▶` · `•`) and Bootstrap Icons — never emoji.

**Specimen lines (real, from the site):**
> "Your signing key marks your stakes as yours — the way a seal marks a letter."
> "100 grains to a grit. You earn it in EGU games, stake it on the subjects you care about, and the chain keeps the receipts."
> "The ledger awaits its first grievance."
> "Put a name on your gumption."

---

## TWO VISUAL MODES, ONE VOICE

The two products look different on purpose — and this system holds both:

| | **Vanilla** (base gumptionchain) | **Hub-themed** (gumption-hub) |
|---|---|---|
| **Visuals** | Stock **Bootstrap 5** (default blue/grey) | The full **2B2F** gold/paper foundations |
| **How** | Link `styles.css`, add **no** theme class | Add `class="theme-2b2f"` to `<body>`/wrapper |
| **Fonts** | Bootstrap defaults (system stack) | Righteous + Inter |
| **Shared** | — the **content fundamentals** (voice, vocabulary, grains/grit) and the **support=green / oppose=red** semantics apply to BOTH — | |

**Everything gold is gated under `.theme-2b2f`.** `base/elements.css` only paints
the document (paper ground, Righteous headings, gold links) inside that scope;
`base/explorer.css` only reskins Bootstrap's `.card`/`.table`/`.btn-*`/badges
inside that scope. So a plain node renders its **native Bootstrap** look, and the
hub's reskin of the *same markup* is opt-in through the seam — exactly the
relationship in the real code, where the gold overrides live in the hub, not in
base. The **GumptionChain Explorer** UI kit has a live **Vanilla ⇄ 2B2F** toggle
to show this on identical markup.

> The component primitives (`.egu-card`, `.gc-card`, `<Button>`, `<LedgerBoard>`,
> `<StatCard>`, …) are inherently hub-flavored — they're opt-in, so using one
> means you want the hub look. Vanilla pages simply don't reach for them.

---

## VISUAL FOUNDATIONS  *(the hub `theme-2b2f` skin)*

> This section describes the **hub** theme. Vanilla base = stock Bootstrap 5,
> styled only by the content fundamentals above + the shared green/red semantics.

**The feeling:** a **gold-leaf ledger on warm paper** — civic, weighty,
archival, trustworthy. Think wax seals, engraved rules, and tabular columns,
not neon or glass. Green and red appear **only** as the ledger's two verdicts.

- **Color.** A four-stop **gold** spine (`--gold-deep #6b5608` → `--gold-dark
  #b8960c` → `--gold #d4a520` → `--gold-light #e8c547`) on **warm paper**
  (`--paper #fbf8f0`) with dark **ink** (`--ink #2a2620`). Headings and kickers
  are `gold-deep`; links are `gold-dark`. **Support = green `#3f8f4f`**,
  **opposition = red `#9c4b3b`** — reserved meanings, never decoration. Bars use
  softened tints (`#7fae77` / `#c98080`). The **ticker inverts** to a dark band
  (`#212529`) with bright green/red for "live wire" contrast.
- **Type.** Two faces. **Righteous** (geometric retro display) for *all* headings,
  brand, kickers, table headers, seal labels — always uppercase, tracked
  `.04–.12em`. **Inter** (400/600/700) for body and UI. **Mono** (system stack)
  for addresses, txids, hashes. Hero ~2.6rem; card titles 1.25rem; kickers
  ~0.78rem.
- **Backgrounds.** Flat warm paper — **no photography, no full-bleed imagery, no
  textures**. Depth comes entirely from **gold radial washes**: a `radial-gradient`
  bloom from the top edge of cards (`--glow-card`), and a 135° gold band on card
  heads (`--band-head`). No purple/blue gradients anywhere.
- **Cards.** 10px radius, a **1px gold-dark border**, white-or-paper fill with the
  top-edge gold bloom. Teaser cards are **dashed + 65% opacity**. The
  ledger/verify card (`gc-card`) has a gold head band and engraved rows
  (label column in tracked Righteous, value right).
- **Borders & rules.** Hairline (1px) gold at low alpha — `rgba(184,150,12,.16/.35/.40)`
  — gives the "engraved" look. Opaque hairline `#e3dac3` on white chips.
- **Corner radii.** `4px` chips · `6px` bars/small buttons · `10px` cards ·
  `pill` for seals & badges.
- **Shadows / elevation.** Soft and **warm**, not grey: a lift shadow
  `0 6px 20px rgba(107,86,8,.14)` on hover; a gold focus ring
  `0 0 0 .25rem rgba(212,165,32,.25)`; an inset white ring on the wax seal.
  Default state is flat — elevation is an *interaction* reward.
- **Motion (the new layer — this is the "flare").** Purposeful, gold, never
  noisy. Easing is mostly `cubic-bezier(0.16,1,0.3,1)` (settle); the seal uses an
  overshoot "thunk" (`0.34,1.56,0.64,1`).
  - **Ledger bars grow** from the center outward on mount (`egu-bar-grow`).
  - The **wax seal stamps down** in gold when a proof verifies, then **breathes**
    a slow gold pulse (`egu-stamp` + `egu-seal-pulse`).
  - **Cards rise-in** (fade + 14px up) on load, staggered.
  - **Gold sheen** sweeps across primary buttons on hover (`egu-sheen`).
  - The **stakes ticker** scrolls continuously and **pauses on hover**.
  - The hero **G floats** gently with a pulsing gold glow behind it.
  - All effects honor `prefers-reduced-motion: reduce`.
- **Hover / press.** Links lighten gold-dark → gold. Primary buttons lighten the
  gradient + lift 1px + sheen; outline buttons fill with a gold wash; cards lift
  2–3px. Press settles back to `translateY(0)`.
- **Transparency & blur.** Used sparingly — only the low-alpha gold washes and
  rule borders. **No frosted glass / backdrop-blur.**
- **Layout.** Centered, single-column, generous. Containers: prose `46rem`,
  landing `64rem`, ledger board `860px`. Bootstrap's `.25rem` spacing rhythm.
- **Imagery vibe.** The only raster asset is the **green Gumption "G"** (a glossy
  3-D ring mark). The **TBTF wordmark** is a gold pyramid of tumbling blocks
  (Acquire tiles). Everything else is type + gold + paper.

> **⚠ Palette note to flag:** the hero logo (`gumption-g.png`) is **green**, while
> the entire brand system is **gold**. On the live site green reads as a legacy
> mark and also carries the "support" meaning — so the green G sits a little
> apart from the gold identity. Kept as-is here for fidelity; see CAVEATS.

---

## ICONOGRAPHY

The hub leans on a **CDN icon font**, not custom SVGs.

- **Primary set: [Bootstrap Icons](https://icons.getbootstrap.com/) v1.11.3**,
  loaded from jsDelivr in `base.html` (the app is Bootstrap 5). Stroke/fill style
  is Bootstrap's standard. Use `<i class="bi bi-..."></i>`. *This system links it
  from CDN rather than vendoring the font — flagged in CAVEATS.*
- **Unicode glyphs as iconography** (preferred over an icon for small status):
  `✓` verify pass · `✗` fail · `⏳` pending · `◀ ▶` ledger direction ·
  `•` separators · `→` in CTAs. These are *the* status vocabulary — match it.
- **The wax seal** (`.seal-dot` / `<Seal>`) is the one bespoke "icon": a CSS
  radial-gradient disc holding a `✓`. Neutral stone until verified, gold after.
- **No emoji**, anywhere.
- **Brand marks (in `assets/`):**
  - `gumption-g.png` — the Gumption "G" ring mark (raster, green, ~256px).
  - `tbtf-logo.svg` — *Too Big To Fail* wordmark (inline SVG, gold gradients,
    Righteous text). Scalable; recolor via its gradient stops if needed.
  - `grit-glyph.svg` / `grit-glyph-mono.svg` — the **GRIT** currency mark: a struck
    flat-top gold hex token whose geometric "G" (a chunked torus + a horizontal
    tube) echoes the Gumption logo. Use `<Grit>` wherever an amount of GRIT shows
    (balances, ticker, "earn GRIT" CTAs); mono for stamps / favicons. Green "G" =
    the universe/identity; gold hex "G" = the currency.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link (`@import`s only).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter wrapper (download & use in Claude Code).

**`tokens/`** — `fonts.css` (Google Fonts: Righteous + Inter), `colors.css`,
`typography.css`, `spacing.css` (spacing/radii/elevation), `motion.css`
(durations, easings, keyframes + utility classes).

**`base/`** — `elements.css` (document defaults, `.egu-brand`, `.egu-kicker`),
`patterns.css` (the hub brand composites: `.egu-card`, `.gc-card`, `.seal-dot`,
`.ledger-*`, `.stakes-ticker`, `.kind-*`, `.chain-pulse`), and **`explorer.css`**
(the vanilla-node skin — additive overrides for base gumptionchain's stock
Bootstrap `.card` / `.table` / `.pagination` / `.btn-*` / badges, plus `.gc-stat`
and the `.gc-navbar` / `.gc-footer` shell).

**`components/`** (React, `window.ExtendedGumptionUniverseDesignSystem_a80556`)
- `brand/` — **Grit** (the GRIT currency mark), **GritMint** (the celebratory "GRIT minted!" earn animation), **HeroLogo** (the EGU constellation hero — green Gumption core + orbiting gold satellites), **WordmarkLockup** (mark + “The Extended Gumption Universe” wordmark).
- `core/` — **Button** (gold / outline-gold / stone), **Card** (gold-wash bloom).
- `ledger/` — **Seal**, **KindLabel**, **LedgerBoard**, **Ticker**.
- `explorer/` — **StatCard**, **NetStance**, **OutflowBadge** (vanilla-explorer primitives).

**`ui_kits/gumption-hub/`** — interactive recreation of the **customized** hub:
landing page, the "Get your key" onboarding flow (create key · back up · bind),
verify/proof card, about, contact, the "Your Gumption" (You) page, and the
three-step bind (identity) flow (`index.html` + `screens.jsx`).

**`ui_kits/gumptionchain-explorer/`** — the **vanilla** base node browser
(home, blocks, subjects, subject detail, verify) in stock Bootstrap, with a live
**Vanilla ⇄ 2B2F** toggle — proof the two projects are the same markup wearing
different skins.

**`templates/`** — consumer starting points (shown in the Templates picker):
- `gumption-hub/` — **Gumption Hub Page**: a themed (`theme-2b2f`) EGU page —
  hero, the Great Ledger board, stakes ticker, member cards.
- `chain-explorer/` — **Chain Explorer Page**: a vanilla Bootstrap explorer
  (stat tiles, recent blocks, subjects) carried only by content + green/red
  semantics; add `theme-2b2f` to paint the gold skin.

**`guidelines/`** — foundation specimen cards (Colors, Type, Spacing, Brand,
Motion) shown in the Design System tab.

**`assets/`** — `gumption-g.png`, `tbtf-logo.svg`; the **GRIT** mark `grit-glyph.svg`
+ `grit-glyph-mono.svg`; the **EGU hero** `egu-hero.svg` (static; `<HeroLogo>` is the
animated version); and favicons `favicon-node.svg` (chain) + `favicon-hub.svg` (the EGU).

---

## Using this system

- **Production code (Flask/Bootstrap):** for the **hub**, the patterns map 1:1 to
  the live `hub.css` classes (`.egu-card`, `.gc-card`, `.btn-gold`, `.ledger-*`,
  `.stakes-ticker`) — and base's explorer reskin lives under `.theme-2b2f`. For
  **vanilla base**, write stock Bootstrap and let the content fundamentals +
  green/red semantics carry the brand; add `theme-2b2f` only where the hub
  themes base. Lift token values straight from `tokens/`.
- **Prototypes / mocks / slides:** link `styles.css`, then either use the brand
  classes directly or mount the React components from the bundle. Copy assets out
  of `assets/`.
- **Keep green & red sacred** — they mean support and opposition. Gold is the
  brand; paper is the ground; motion is purposeful.

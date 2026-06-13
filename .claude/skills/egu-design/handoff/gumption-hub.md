# Brief — `gumption-hub` (the themed 2B2F hub)

You are working in **gumption-hub** (Flask + Jinja + Bootstrap 5). Apply the
refreshed **2B2F gold skin**, the new brand marks, the new information
architecture, and the motion layer. The design system is installed at
`.claude/skills/egu-design/` — treat its `readme.md`, `tokens/`, `base/`, and
`assets/` as ground truth, and `ui_kits/gumption-hub/` as the pixel/behavior
reference.

> Recreate the React UI-kit designs as **Jinja templates + Bootstrap + vanilla
> JS**. Do not ship the kit's JSX. Keep the existing signing-key / transact /
> bind `.mjs` logic — you are changing presentation and flow, not crypto.

---

## 1 · Brand assets

Copy these from the skill into the hub's static tree
(`src/gumption_hub/static/img/brand/` is a good home):

| From the skill | Use |
|---|---|
| `assets/grit-glyph.svg` | the **GRIT** currency mark (struck gold hex "G") — anywhere an amount of GRIT appears |
| `assets/grit-glyph-mono.svg` | 1-color knockout (stamps / small) |
| `assets/egu-hero.svg` | the **constellation hero** (static; for the animated version see §5) |
| `assets/favicon-hub.svg` | the hub favicon (gold constellation on ink) |

`gumption-g.png` already exists in the repo — keep it as the **legacy** mark; it
is no longer the hero (the constellation replaces it).

`<link rel="icon" type="image/svg+xml" href="…/brand/favicon-hub.svg">` in
`templates/base.html`.

## 2 · CSS — adopt the design-system tokens, patterns & motion

The hub's skin lives in `src/gumption_hub/static/css/hub.css`. Bring it into
parity with the design system. Recommended: **vendor the skill's compiled CSS
closure** and let `hub.css` thin down to hub-specific overrides.

- Copy (or `@import`) the skill's global CSS: `styles.css` →
  `tokens/{fonts,colors,typography,spacing,motion}.css` + `base/{elements,
  patterns,explorer}.css`. Lift exact values from there — do **not** eyeball.
- The hub is the themed surface: apply the **`theme-2b2f`** scope on the hub's
  `<body>` (or root wrapper) in `base.html`. `base/explorer.css` is written so
  that scope repaints the base explorer's stock Bootstrap (`.card`, `.table`,
  `.pagination`, `.btn-*`, badges) in gold when the hub serves chain pages.
- Confirm the brand patterns match `base/patterns.css`: `.egu-card`, `.gc-card`
  / `.gc-card-head` / `.gc-row`, `.seal-dot(.verified)`, `.ledger-*`,
  `.stakes-ticker`, `.kind-support` / `.kind-opposition`, `.chain-pulse`,
  `.egu-kicker`, `.egu-brand`.
- Tokens are the contract: gold spine (`--gold-deep/-dark/(base)/-light`), warm
  `--paper`, `--ink`, support `#3f8f4f` / oppose `#9c4b3b` (reserved meanings),
  Righteous display + Inter body, 10px card radius, gold-wash card glow. All in
  `tokens/`.

## 3 · The GRIT mark, inline

Add a reusable Jinja partial `templates/_grit.svg` containing the contents of
`assets/grit-glyph.svg`, and `{% include %}` it wherever a GRIT amount renders:

- the landing **chain-pulse** line (`… 27.9 ⬡ staked …`),
- "earn GRIT" / "Get your key" style CTAs,
- the **/me** GRIT balance,
- stake lines and the ticker where amounts show.

Size it with `width`/`height` on the `<svg>` (it scales cleanly 16px → hero).

## 4 · Information architecture (see `ui_kits/gumption-hub/`)

- **Header** is lean: brand lockup (left) · **Chain ▾** · **@handle** (right).
  **Move About and Contact OUT of the header.**
- **Footer is global** (every page): the stacked **wordmark lockup**
  (constellation + "The Extended Gumption Universe") above
  `about · contact · gumption.com · Too Big To Fail`. About/Contact live here now.
- **`@handle` → `/me`** ("Your Gumption"): single "Your Gumption" heading,
  identity line (`@handle · github ✓ · gc1…`) with a **"manage your name →"**
  link to `/bind`, the GRIT balance (with the mark), and the stakes list.
- **`/bind`** is reached **from `/me`**, not the nav. Its back-link and the
  post-bind CTA both return to **`/me`** ("← back to your gumption",
  "Go to your gumption →") — at *every* step, not only after binding.
- **Onboarding** = `/onboarding` ("Get your key"), the landing's primary CTA.
  Three progressive steps, last two optional:
  1. **Create your signing key** (passphrase) — the essential step; on success
     the wax seal stamps and the address shows.
  2. **Back it up** *(encouraged)* — "Download encrypted backup" / "Save to
     password manager", with honest "no reset / lose it and it's gone" framing
     and an "I'll do this later" skip.
  3. **Put a name on it** *(optional, pitched for sharing)* — bind to GitHub so
     shared stakes carry `@you`; "Bind to GitHub →" (into `/bind`) or "Skip".
  Ends on a gold **"You're in"** seal card with next steps.
  Reuse the existing `_key_import.html` three-state key panel for step 1.

## 5 · Motion (the "flare") — `tokens/motion.css`

All purposeful, all `prefers-reduced-motion`-aware (rest on the visible end
state). Keyframes already defined in `tokens/motion.css`:

- **Hero constellation** — green Gumption "G" core holds; gold satellites orbit.
  In HTML drive the orbit with **SMIL `<animateTransform>`** (see
  `ui_kits/gumption-hub/` / the `HeroLogo` component) so it survives reduced-
  motion gating cleanly; gate the CSS version on
  `@media (prefers-reduced-motion: no-preference)`.
- **Ledger bars** grow from the center on load (`egu-bar-grow`).
- **Wax seal** stamps gold + breathes when a proof verifies (`egu-stamp` +
  `egu-seal-pulse`).
- **Gold sheen** sweeps gold buttons on hover (`egu-sheen`).
- **Stakes ticker** scrolls, pauses on hover.
- **GRIT mint** *(optional, nice on a stake-confirmed / reward moment)* —
  strike + sheen + ring + count-up; see the `GritMint` component and
  `guidelines/motion-mint.html`.

## 6 · Templates touched (map)

`base.html` (favicon, nav, global footer, `theme-2b2f` scope) · `index.html`
(hero → constellation, GRIT marks, CTA → `/onboarding`) · `me.html` (single
heading, GRIT balance, "manage your name →") · `bind.html` (always return to
`/me`) · `proof.html` (seal stamp on verify) · new `onboarding.html` (+ route) ·
`_grit.svg` (new partial) · the `member_*.html` / `_ticker.html` partials
(verify against `base/patterns.css`).

## Checklist

- [ ] favicon-hub.svg wired; brand SVGs copied
- [ ] hub.css values match `tokens/` + `base/patterns.css`; `theme-2b2f` applied
- [ ] explorer pages served by the hub render in the gold skin
- [ ] GRIT mark inline in chain-pulse, CTAs, /me balance, ticker, stake lines
- [ ] header = brand · Chain · @handle; About/Contact in the global footer
- [ ] @handle → /me; /bind reached from /me and always returns there
- [ ] /onboarding flow (create · back up · bind · you're in) on the "Get your key" CTA
- [ ] motion present and reduced-motion-safe (hero orbit, ledger fill, seal, ticker)
- [ ] compare screen-by-screen against `ui_kits/gumption-hub/index.html`

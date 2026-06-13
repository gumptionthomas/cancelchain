# Gumption Hub — UI Kit

An interactive recreation of the **gumption-hub** front door, built from this
system's component bundle with the **2B2F motion layer** switched on. It mirrors
the live `templates/index.html`, `proof.html`, and `about.html`.

Open `index.html`. Three click-through views:

- **Landing** — the hero (floating Gumption "G" with a pulsing gold glow), the
  **Great Ledger** board (bars grow from center on load), the **stakes ticker**
  (scrolls, pauses on hover), member cards (rise-in staggered, lift on hover),
  and the chain-pulse line. CTAs: *How it works* → About, *Get your key →* → the
  proof card.
- **Proof / verify** — the "Verified on GumptionChain" `gc-card`: the **wax seal
  stamps gold** after a beat, then the three live checks (Signature / On-chain /
  Consistent) light up in sequence.
- **About** — prose page using the kind labels and brand type.

## Composition

`screens.jsx` defines `NavBar`, `Hero`, `Landing`, `ProofCard`, `About`,
`Footer` and exposes them on `window`. `index.html` loads React + Babel + the
`_ds_bundle.js`, then `screens.jsx`, then mounts a tiny view router.

All visual primitives come from the bundle
(`window.ExtendedGumptionUniverseDesignSystem_a80556`): `Button`, `Card`,
`LedgerBoard`, `Ticker`, `Seal`, `KindLabel`. Brand composites that aren't
components (`.gc-card`, `.gc-row`, `.chain-pulse`, `.egu-kicker`) come from
`base/patterns.css` via `styles.css`.

> Recreation only — wallet unlock, signing, real verification, and chain reads
> are faked for the mock. The fidelity target is **visual + interaction**, not
> the crypto.

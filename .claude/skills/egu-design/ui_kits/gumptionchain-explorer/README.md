# GumptionChain Explorer — UI Kit

The **vanilla** base-`gumptionchain` node browser, recreated under the 2B2F
skin. This is the *uncustomized* explorer (stock Bootstrap 5 markup) that every
node — including the hub — runs; the design system themes it through additive
overrides in `base/explorer.css`, so it reads as part of the same universe as
the hub front door.

Open `index.html`. Click through:

- **Home** — five chain stat tiles (`StatCard`), the Chain Tip table, and a
  Recent Blocks table. Rows are clickable.
- **Blocks** — full blocks table with the themed Bootstrap pagination.
- **Subjects** — the leaderboard with `NetStance` (n supported / n opposed /
  even). Rows open the subject detail.
- **Subject detail** — opposition vs support, each with its flow table.
- **Verify** — paste-a-proof box; clicking *Verify* stamps the gold `Seal` and
  lights the three checks.

## How it's built

Loads **Bootstrap 5.3 + Bootstrap Icons** (exactly as base `gumptionchain`
does) so `.card`, `.table`, `.pagination`, `.btn`, `.badge`, and the grid behave
natively — then `styles.css` repaints them in 2B2F. Brand primitives
(`StatCard`, `NetStance`, `OutflowBadge`, `Seal`) come from `_ds_bundle.js`
(`window.ExtendedGumptionUniverseDesignSystem_a80556`).

`screens.jsx` defines the shell + screens and exposes `ExplorerApp` on `window`.

> Recreation only — data is faked; no live node, signing, or real verification.
> The point is to show the vanilla explorer wearing the brand.

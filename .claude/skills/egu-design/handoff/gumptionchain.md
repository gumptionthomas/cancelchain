# Brief — `gumptionchain` (the vanilla base node)

You are working in **gumptionchain** (Flask + Jinja + Bootstrap 5) — the base
node and chain explorer that every node runs. The design system is installed at
`.claude/skills/egu-design/`.

## The one rule: stay vanilla

**Do NOT apply the gold 2B2F skin here.** The base node is intentionally **stock
Bootstrap 5**. The gold look you see on the live site is added by *gumption-hub*
through its template-override + CSS seam — it is the hub's job, not base's. In
the design system this is the difference between the explorer kit's toggle
**OFF** (vanilla — this repo) and **ON** (themed — the hub). Base must keep
working and looking correct as plain Bootstrap with no design-system CSS loaded.

So this repo's changes are deliberately small.

## 1 · Node favicon

Copy `.claude/skills/egu-design/assets/favicon-node.svg` into the base static
tree (e.g. `src/gumptionchain/static/img/favicon-node.svg`) and link it in
`templates/base.html`:

```html
<link rel="icon" type="image/svg+xml"
      href="{{ url_for('browser.static', filename='img/favicon-node.svg') }}">
```

This is the **green "G" node** mark (Gumption green, plain) — distinct from the
hub's gold constellation favicon. It signals "the canonical chain node."

> If the hub overrides `base.html` (or the favicon block) through its seam, it
> will swap in `favicon-hub.svg` for hub pages — so set the node favicon as the
> base default and let the hub override. Confirm the seam still wins for hub pages.

## 2 · Content voice (CONTENT FUNDAMENTALS)

Keep base copy in the EGU voice — see the CONTENT FUNDAMENTALS section of
`.claude/skills/egu-design/readme.md`. Plain, civic, archival; second person to
the visitor. Use the load-bearing vocabulary exactly: *grains · grit · GRIT ·
stake · support (commendation) · opposition (grievance) · subject · ledger ·
proof · sign / signing key · mill / miller · node*. Amounts: grit to 2 decimals,
tabular figures; grains ÷100 for grit display. No emoji. This is a copy/casing
pass — **not** a restyle.

## 3 · Visual parity (sanity check, not a restyle)

The explorer's vanilla structure is captured in
`.claude/skills/egu-design/ui_kits/gumptionchain-explorer/` with the skin toggle
**OFF**. Use it only to confirm the base screens' layout/markup are intact —
Home (stat tiles, chain tip, recent blocks), Blocks, Block detail, Chains,
Subjects, Subject detail, Addresses, Address detail, Mempool, Transaction,
Transact, Signing key, Advanced, Verify. Do **not** import design-system CSS to
achieve the gold look; that is the hub's layer.

Note: the explorer **primitives** in the kit (`StatCard`, `NetStance`,
`OutflowBadge`) are recreations of base's *existing* macros/markup (the
`net_stance` / `outflow_kind` macros, the stat row). No change needed unless you
spot a drift from the kit's vanilla state.

## Checklist

- [ ] `favicon-node.svg` added and linked in base `base.html` (hub seam can override)
- [ ] base still renders as **plain Bootstrap** — no design-system CSS loaded here
- [ ] copy follows the EGU voice + vocabulary (readme CONTENT FUNDAMENTALS)
- [ ] explorer screens match the kit's **toggle-OFF** (vanilla) state
- [ ] nothing gold leaked into the base node

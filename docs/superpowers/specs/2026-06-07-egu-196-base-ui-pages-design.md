# EGU #196 — base default UI pages (explorer/home, blocks list, subject tallies)

**Date:** 2026-06-07
**Issue:** #196 (follow-up to #189; on the EGU launch checklist #190)
**Status:** design approved

## Goal

Flesh out the vanilla `gumptionchain` node's default browser UI on the
already-established base↔extension seam (`docs/ui-extension-seam.md`), bringing
the bare default pages up to "good enough to run a standalone node." This pass
covers three page groups: an **explorer/home**, a **paginated blocks list**, and
**per-subject opposition/support tallies** (a ranked subjects index plus a
per-subject detail page).

Out of scope (deferred to follow-up issues): wallet/address holdings views,
mempool/pending views, and any hub theming (tracked under EGU #5 /
gumption-hub#8). The seam itself is done (#189).

## Constraints (inherited from the seam)

- Every page `{% extends "base.html" %}` and uses ONLY the documented block
  contract (`title`/`head`/`nav`/`content`/`footer`/`scripts`), so a consumer
  skin re-skins it for free.
- Semantic Bootstrap classes; expose `*/extra.html`-style optional include hooks
  where an extension would plausibly inject.
- All reads stay unauthed/public, consistent with existing browser views.
- New data-shaping is exposed through the `Chain` domain dataclass; SQL query
  construction lives on `ChainDAO` alongside its siblings (`wallet_leaderboard`,
  `_stake_balance`, `opposition_balance`) — the established pattern where the
  domain method delegates to the DAO and shapes the result. No validation is
  added to the DAO layer.

## Pages & routes

All registered on the existing `browser` blueprint (`src/gumptionchain/browser.py`).

| Route | View fn | Template | Purpose |
|---|---|---|---|
| `/blocks` | `blocks_view` | `blocks.html` | Paginated canonical-chain block list, newest first |
| `/subjects` | `subjects_view` | `subjects.html` | Subjects leaderboard ranked by total live stake |
| `/subject/<subject:subject>` | `subject_view` | `subject.html` | One subject: opposition vs support totals + staking-outflow list |
| `/` (rewrite) | `index_view` | `index.html` | Explorer/home: stats card + recent blocks |

Existing `/chains`, `/block`, `/block/<hash>`, `/transaction/<txid>`,
`/transaction/<txid>/provenance.json`, `/verify` are unchanged. The navbar in
`base.html` gains **Blocks** and **Subjects** links.

Route notes:
- The `subject` URL converter (`application.py:162`) validates the **encoded**
  subject form via `validate_subject`. So `/subject/<subject:subject>` receives
  the stored (encoded) subject; templates render it human-readable via the
  existing `human_subject` filter. Leaderboard rows link with the encoded value.
- An unknown/empty subject (valid-encoded but no stakes on chain) renders the
  detail page with zero totals and an empty list, not a 404 — a subject is a
  free-form string, not a created entity.

## Data-layer additions

### New on `ChainDAO` (`src/gumptionchain/models.py`)

`subject_leaderboard(limit: int | None = None) -> Select[Any]` — mirrors
`wallet_leaderboard`. Because a subject's stake lives in two columns
(`OutflowDAO.opposition`, `OutflowDAO.support`), the query is a UNION ALL of two
unspent-outflow selects:

- **opposition leg:** `select(opposition AS subject, amount, literal('opposition') AS kind)`
  from `self.outflows` where `opposition is not null`, left-joined to consuming
  inflows (`self.inflows`) with `inflows_alias.id is null` (the unspent
  anti-join, identical to `_stake_balance`/`wallet_leaderboard`).
- **support leg:** same with the `support` column and `literal('support')`.

The UNION is wrapped in an outer aggregate:
`select(subject, sum(case((kind=='opposition', amount), else_=0)) AS opposition,
sum(case((kind=='support', amount), else_=0)) AS support, sum(amount) AS total)`
grouped by `subject`, ordered by `total desc, subject`. Returns a `Select`
paginatable via `db.paginate` (same shape as `ChainDAO.chains()`); when `limit`
is given it follows `wallet_leaderboard`'s `select(aliased(stmt.subquery()))`
wrapping so an outer `.limit` composes.

Rows expose `.subject` (encoded), `.opposition`, `.support`, `.total` (grains).
The "unspent" anti-join means rescinded stake is already excluded (a rescind
spends the staked outflow via an inflow), so totals are the live standings.

### New on `Chain` (`src/gumptionchain/chain.py`)

- `subject_leaderboard(limit=None) -> Select[Any]` — thin delegate to
  `self.to_dao().subject_leaderboard(limit)` (mirrors how `opposition_balance`
  delegates today). Returned by the view to `db.paginate`.
- `recent_blocks(count: int = 10) -> list[Block]` — first `count` of
  `BlockDAO.longest_chain_blocks_q()` (position desc = newest first),
  materialized as domain `Block`s via `Block.from_dao`.
- `transaction_count -> int` — `count` over
  `BlockDAO.longest_chain_transactions_q()`.
- `subject_count -> int` — `count` over the leaderboard subquery (distinct
  subjects with live stake).
- `total_staked -> int` — `sum` of the leaderboard `total` column (all live
  opposition + support grains).

`Chain.length` (existing) supplies block height; `Chain.last_block` (existing)
the tip. Per-subject detail reuses existing `Chain.opposition_balance(subject)`,
`Chain.support_balance(subject)`, and `ChainDAO.unrescinded_outflows(subject,
kind)` (already a paginatable `Select`).

## Templates & seam conformance

- New templates `blocks.html`, `subjects.html`, `subject.html` and the rewritten
  `index.html` each `{% extends "base.html" %}` and fill only
  `title`/`content`/`scripts`. Bootstrap 5 cards/tables matching the existing
  look (`chains.html`/`block.html`).
- **New shared `_pagination.html`** with a Jinja macro
  `render_pagination(page, endpoint, **kwargs)` that renders Bootstrap
  pagination linking to the correct `endpoint`. `blocks.html` and `subjects.html`
  use it. (The current `chains.html` has a latent bug — its pagination links to
  `index_view` instead of `chains_view`; this is NOT fixed here to avoid scope
  creep and is filed as a separate tiny issue. The new macro does it correctly.)
- Optional extension include hooks (base ships none; consumer may add):
  - `{% include "index/extra.html" ignore missing %}` on home,
  - `{% include "subjects/extra.html" ignore missing %}` on the subjects index.

### Home (`index.html`) layout

A stats strip (Bootstrap cards/row) showing: **height** (`lc.length`),
**transactions** (`lc.transaction_count`), **total staked** (grit/grains via
existing units display), **distinct subjects** (`lc.subject_count`); the chain
tip (last block idx + hash linking to `/block/<hash>` + timestamp); and a
**recent blocks** table (`lc.recent_blocks(10)`) with idx, hash (link),
timestamp, txn count, linking through to `/blocks`. The empty-chain case keeps
today's "No chain" message.

### Subjects index (`subjects.html`)

Paginated leaderboard table: rank, subject (human-readable, linking to
`/subject/<encoded>`), opposition total, support total, combined total. Uses
`render_pagination(subjects_page, 'browser.subjects_view')`. Empty case: "No
subjects staked yet."

### Subject detail (`subject.html`)

Header with the human-readable subject; two totals (opposition vs support, with
a simple visual split); a table of the unspent staking outflows for each kind
(amount, staking txn link). Reuses `opposition_balance`/`support_balance` and
`unrescinded_outflows`.

### Blocks list (`blocks.html`)

Paginated table of canonical blocks (newest first): idx, hash (link to
`/block/<hash>`), timestamp, transaction count. Uses
`render_pagination(blocks_page, 'browser.blocks_view')`. Empty case: "No
blocks."

## Data flow

```
browser view  ->  Node(...).longest_chain : Chain
              ->  Chain.<helper> / Chain.to_dao().<query>  (domain shaping)
              ->  ChainDAO.<query> : Select   (SQL; unspent anti-join)
              ->  db.paginate(select) | db.session.scalar(count/sum)
              ->  render_template(... domain objects ...)
template      ->  url_for('browser.*'), | human_subject, | utc_datetime, gc_version
```

Views follow the existing error contract: catch `HTTPException` → return it;
catch `Exception` → `current_app.logger.exception(e); abort(500)` (audit WEB2).

## Testing

Per page group:
- **View tests** (extend `tests/`): 200 + key markup present; `/subject/<x>`
  with stakes shows both totals; empty-chain / no-subjects / unknown-subject
  paths; pagination present when over one page.
- **Seam test** (extend `tests/test_ui_seam.py`): an app-level template override
  (consumer `base.html`) re-skins each new page, proving app-overrides-blueprint.
- **Data-layer unit tests** (chain/models tests): `subject_leaderboard` ordering
  (by total desc), opposition/support split correctness, exclusion of rescinded
  stake, `recent_blocks` count/order, `transaction_count`/`subject_count`/
  `total_staked` correctness on a small mined chain.

Hard CI gates as always: `ruff check`, `ruff format --check`, `mypy --strict`,
`pytest`.

## PR sequence (sequential separate PRs, each off fresh main)

Dependency-ordered (home reuses the subject aggregation for its stats):

0. **docs** — this spec + the implementation plan (matches the #186 precedent of
   a dedicated spec+plan docs PR).
1. **PR 1 — Blocks list.** `/blocks` + `blocks.html` + shared `_pagination.html`
   macro + nav link. Pure consumption of existing `longest_chain_blocks_q()`; no
   data-layer change.
2. **PR 2 — Subjects.** `ChainDAO.subject_leaderboard` + `Chain` delegates,
   `/subjects` + `/subject/<subject>` + templates + nav link. The new
   aggregation lands here.
3. **PR 3 — Explorer/home.** `Chain.recent_blocks` + stats helpers, rewritten
   `index.html` consuming PR 2's aggregation for total-staked/distinct-subjects
   and linking into `/blocks` and `/subjects`.

## Follow-ups filed separately

- `chains.html` pagination links to `index_view` instead of `chains_view` (latent
  bug, not touched here).
- Deferred base pages: address/wallet holdings, mempool/pending (the "other
  basic chain views" bullet of #196).

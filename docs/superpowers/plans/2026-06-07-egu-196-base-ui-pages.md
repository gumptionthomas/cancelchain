# EGU #196 base UI pages — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flesh out the vanilla node's default browser UI — a blocks list, a subjects opposition/support leaderboard + per-subject detail, and an explorer/home with stats + recent blocks — on the existing base↔extension seam.

**Architecture:** New routes on the existing `browser` blueprint render new `{% extends "base.html" %}` templates. SQL query construction lives on `ChainDAO` (mirroring `wallet_leaderboard`); the `Chain` domain dataclass exposes delegating/ shaping helpers. All reads unauthed/public. A shared `_pagination.html` macro renders correct pagination.

**Tech Stack:** Flask + Jinja2 + Bootstrap 5, SQLAlchemy 2.0 `Select`/`db.paginate`, pytest.

**Spec:** `docs/superpowers/specs/2026-06-07-egu-196-base-ui-pages-design.md`

**Reference patterns (read before starting):**
- `src/gumptionchain/browser.py` — view error contract (catch `HTTPException` → return; catch `Exception` → `current_app.logger.exception(e); abort(500)`), `longest_chain()` helper.
- `src/gumptionchain/models.py:779` `ChainDAO.wallet_leaderboard` — the aggregation+unspent-anti-join pattern to mirror; `:759` `_stake_balance`; `:517` `BlockDAO.longest_chain_blocks_q`; `:534` `longest_chain_transactions_q`; `:1060` `ChainDAO.chains`.
- `src/gumptionchain/chain.py` — `Chain.length`, `Chain.last_block`, `Chain.opposition_balance`/`support_balance` (delegation pattern), `Chain.to_dao`.
- `src/gumptionchain/templates/chains.html` — existing paginated card/table look; `block.html` — single-block render.
- Jinja: `| utc_datetime`, `| human_subject`, `gc_version`; converters `mill_hash`, `subject` (`application.py:155-166`).
- `tests/test_ui_seam.py` — app-overrides-blueprint seam test; `tests/test_verify_page.py` — view test shape; `tests/conftest.py` — fixtures.

---

## PR 1 — Blocks list

Branch: `feat/egu-196-blocks-list` off fresh `main`.

### Task 1: Shared pagination macro

**Files:**
- Create: `src/gumptionchain/templates/_pagination.html`

- [ ] **Step 1: Write the macro**

```jinja
{% macro render_pagination(page, endpoint) -%}
{%- if page.pages > 1 %}
<ul class="pagination">
  <li class="page-item {{ '' if page.has_prev else 'disabled' }}">
    <a class="page-link" href="{{ url_for(endpoint, page=page.prev_num) }}">Previous</a>
  </li>
  {%- for p in page.iter_pages() %}
  {%- if p %}
  <li class="page-item {{ 'active' if p == page.page else '' }}">
    <a class="page-link" href="{{ url_for(endpoint, page=p) }}">{{ p }}</a>
  </li>
  {%- else %}
  <li class="page-item disabled"><span class="page-link">…</span></li>
  {%- endif %}
  {%- endfor %}
  <li class="page-item {{ '' if page.has_next else 'disabled' }}">
    <a class="page-link" href="{{ url_for(endpoint, page=page.next_num) }}">Next</a>
  </li>
</ul>
{%- endif %}
{%- endmacro %}
```

- [ ] **Step 2: Commit** — `git commit -m "feat(browser): shared pagination macro"`

### Task 2: Blocks list view + template (TDD)

**Files:**
- Modify: `src/gumptionchain/browser.py`
- Modify: `src/gumptionchain/templates/base.html` (nav link)
- Create: `src/gumptionchain/templates/blocks.html`
- Test: `tests/test_blocks_page.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_blocks_page.py
def test_blocks_list_empty(test_client):
    resp = test_client.get('/blocks')
    assert resp.status_code == 200
    assert b'No blocks' in resp.data


def test_blocks_list_shows_mined_blocks(test_client, mined_chain):
    # mined_chain: helper/fixture mining a few canonical blocks (see conftest /
    # existing mining test helpers; reuse the same pattern other view tests use).
    resp = test_client.get('/blocks')
    assert resp.status_code == 200
    # newest-first: tip block hash present and links to its block page
    tip_hash = mined_chain.last_block.block_hash
    assert tip_hash.encode() in resp.data
    assert b'/block/' in resp.data
```

> If no `mined_chain` fixture exists, build the chain inline in the test using the same approach the existing block/transaction view tests use (look at how `tests/` mines canonical blocks — the Miller flow or the `easy_mill_chain` fixture). Do NOT use `chain.add_block` (forks the tip).

- [ ] **Step 2: Run to verify it fails** — `uv run pytest tests/test_blocks_page.py -v` → FAIL (404, no route).

- [ ] **Step 3: Add the view** in `src/gumptionchain/browser.py` (after `chains_view`):

```python
@blueprint.route('/blocks')
def blocks_view() -> Any:
    try:
        blocks_page = db.paginate(BlockDAO.longest_chain_blocks_q())
    except HTTPException as e:
        return e
    except Exception as e:
        current_app.logger.exception(e)
        abort(500)
    return render_template(
        'blocks.html', title='Blocks', blocks_page=blocks_page
    )
```

Ensure `BlockDAO` is imported (it already is in `browser.py`).

- [ ] **Step 4: Create `blocks.html`**

```jinja
{% extends "base.html" %}
{% from "_pagination.html" import render_pagination %}

{% block content -%}
<div class="container-fluid">
  <div class="row my-3"><div class="col">
    <div class="card bg-light"><div class="card-body">
      <div class="card-title h5">Blocks</div>
      {%- if blocks_page.total %}
      <table class="table table-hover blocks">
        <thead><tr><th>#</th><th>Hash</th><th>Timestamp</th><th>Txns</th></tr></thead>
        <tbody class="font-monospace">
        {%- for block in blocks_page.items %}
          <tr>
            <td>{{ block.idx }}</td>
            <td><a class="text-dark" href="{{ url_for('browser.block_view', block_hash=block.block_hash) }}">{{ block.block_hash }}</a></td>
            <td>{{ block.timestamp | utc_datetime }}</td>
            <td>{{ block.transactions | length }}</td>
          </tr>
        {%- endfor %}
        </tbody>
      </table>
      {{ render_pagination(blocks_page, 'browser.blocks_view') }}
      {%- else %}
      <p>No blocks.</p>
      {%- endif %}
    </div></div>
  </div></div>
</div>
{%- endblock %}
```

- [ ] **Step 5: Add nav link** in `base.html` after the Chains link:

```jinja
    <a class="navbar-nav" href="{{ url_for('browser.blocks_view') }}">Blocks</a>
```

- [ ] **Step 6: Run tests** — `uv run pytest tests/test_blocks_page.py -v` → PASS.

- [ ] **Step 7: Commit** — `git commit -m "feat(browser): paginated blocks list page"`

### Task 3: Seam test for blocks page

**Files:**
- Modify: `tests/test_ui_seam.py`

- [ ] **Step 1: Add a test** mirroring the existing seam test — register the browser blueprint into an app whose own `templates/base.html` injects a marker, GET `/blocks`, assert the marker AND blocks content both appear (proves app `base.html` overrides blueprint `base.html` while the blueprint page renders). Follow the exact construction already in `test_ui_seam.py`.

- [ ] **Step 2: Run** — `uv run pytest tests/test_ui_seam.py -v` → PASS.

- [ ] **Step 3: Full gates** — `uv run ruff format src tests && uv run ruff check src tests && uv run mypy && uv run pytest` → all green.

- [ ] **Step 4: Commit + open PR** — `git commit -m "test(browser): seam coverage for blocks page"`, push, `gh pr create`.

---

## PR 2 — Subjects leaderboard + per-subject detail

Branch: `feat/egu-196-subjects` off fresh `main` (after PR 1 merges).

### Task 4: `ChainDAO.subject_leaderboard` (TDD)

**Files:**
- Modify: `src/gumptionchain/models.py` (add after `wallet_leaderboard`, ~line 804)
- Test: `tests/test_subject_leaderboard.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_subject_leaderboard.py
# Build a canonical chain (same mining approach as other model/view tests),
# stake opposition+support on two subjects, then assert leaderboard contents.
def test_subject_leaderboard_orders_by_total_and_splits_kinds(app, staked_chain):
    with app.app_context():
        chain_dao = staked_chain.to_dao()
        rows = db.session.execute(chain_dao.subject_leaderboard()).all()
        by_subject = {r.subject: r for r in rows}
        # subject A: 300 opposition + 150 support = 450 total
        a = by_subject[encode_subject('alpha')]
        assert a.opposition == 300
        assert a.support == 150
        assert a.total == 450
        # ordered by total desc
        totals = [r.total for r in rows]
        assert totals == sorted(totals, reverse=True)


def test_subject_leaderboard_excludes_rescinded(app, staked_chain_with_rescind):
    # after rescinding a stake, that grain count is gone from the totals
    ...
```

> Reuse the project's mining + staking helpers. Opposition/support creation:
> `chain.create_opposition(wallet, amount, encode_subject(s))` /
> `create_support(...)`; confirm via the Miller flow. Mirror how
> `scripts/populate_dev_chain.py` and existing balance tests stake.

- [ ] **Step 2: Run to verify it fails** — `uv run pytest tests/test_subject_leaderboard.py -v` → FAIL (no method).

- [ ] **Step 3: Implement** in `models.py`, mirroring `wallet_leaderboard` + `_stake_balance`:

```python
def subject_leaderboard(
    self,
    limit: int | None = None,
) -> Select[Any]:
    inflows_alias = db.aliased(InflowDAO, self.inflows.subquery())

    def _leg(column: Any, kind: str) -> Select[Any]:
        stmt = db.select(
            column.label('subject'),
            OutflowDAO.amount.label('amount'),
            db.literal(kind).label('kind'),
        )
        stmt = stmt.where(column.is_not(None))
        stmt = stmt.select_from(OutflowDAO)
        stmt = stmt.join(inflows_alias, OutflowDAO.inflows, isouter=True)
        stmt = stmt.where(inflows_alias.id.is_(None))
        return stmt

    # restrict legs to this chain's outflows via the same source as .outflows
    opp = _leg(OutflowDAO.opposition, 'opposition')
    sup = _leg(OutflowDAO.support, 'support')
    union = opp.union_all(sup).subquery()
    stmt = db.select(
        union.c.subject,
        db.func.sum(
            db.case((union.c.kind == 'opposition', union.c.amount), else_=0)
        ).label('opposition'),
        db.func.sum(
            db.case((union.c.kind == 'support', union.c.amount), else_=0)
        ).label('support'),
        db.func.sum(union.c.amount).label('total'),
    )
    stmt = stmt.group_by(union.c.subject)
    stmt = stmt.order_by(db.desc('total'), union.c.subject)
    if limit is not None:
        stmt = stmt.limit(limit)
        return db.select(db.aliased(stmt.subquery()))
    return stmt
```

> IMPORTANT: the unspent legs must be scoped to THIS chain's outflows exactly
> like `_stake_balance` does (it builds on `self.outflows`). Construct each leg
> from `self.outflows` (the chain-scoped `Select`) rather than a bare
> `OutflowDAO`, so a fork's stakes don't leak in. Verify by basing `_leg` on
> `self.outflows` the way `_stake_balance` / `wallet_leaderboard` base theirs on
> `self.outflows` + the `inflows_alias` anti-join. Adjust the snippet to thread
> `self.outflows` through (e.g. start each leg from a `db.aliased(OutflowDAO,
> self.outflows.subquery())`), matching the sibling methods. Confirm with the
> "excludes rescinded" and a fork-isolation assertion in the test.

- [ ] **Step 4: Run** → PASS. Then `uv run mypy` (fix any `Any`/type-ignore to match sibling style).

- [ ] **Step 5: Commit** — `git commit -m "feat(chain): subject_leaderboard aggregation on ChainDAO"`

### Task 5: `Chain` delegates + stats helpers (TDD)

**Files:**
- Modify: `src/gumptionchain/chain.py`
- Test: `tests/test_chain.py` (or the leaderboard test file)

- [ ] **Step 1: Write failing tests** for `Chain.subject_leaderboard` (delegates, same rows), `Chain.subject_count`, `Chain.total_staked`, `Chain.transaction_count`, `Chain.recent_blocks(n)` (returns ≤ n domain `Block`s, newest-first).

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implement** on `Chain`, mirroring the `opposition_balance` delegation:

```python
def subject_leaderboard(self, limit: int | None = None) -> Select[Any]:
    return self.to_dao().subject_leaderboard(limit)

def recent_blocks(self, count: int = 10) -> list[Block]:
    page = BlockDAO.longest_chain_blocks_q().limit(count)
    return [Block.from_dao(b) for b in db.session.scalars(page)]

@property
def transaction_count(self) -> int:
    q = BlockDAO.longest_chain_transactions_q().subquery()
    return db.session.scalar(db.select(db.func.count()).select_from(q)) or 0

@property
def subject_count(self) -> int:
    q = self.subject_leaderboard().subquery()
    return db.session.scalar(db.select(db.func.count()).select_from(q)) or 0

@property
def total_staked(self) -> int:
    q = self.subject_leaderboard().subquery()
    return db.session.scalar(db.select(db.func.sum(q.c.total))) or 0
```

> Add imports as needed (`Select`, `db`, `BlockDAO`, `Block` are likely already imported in `chain.py`; verify). `recent_blocks` uses position-desc ordering already baked into `longest_chain_blocks_q`.

- [ ] **Step 4: Run** → PASS. `uv run mypy`.

- [ ] **Step 5: Commit** — `git commit -m "feat(chain): recent_blocks + leaderboard/stats helpers"`

### Task 6: Subjects index view + template (TDD)

**Files:**
- Modify: `src/gumptionchain/browser.py`, `base.html` (nav)
- Create: `src/gumptionchain/templates/subjects.html`
- Test: `tests/test_subjects_page.py`

- [ ] **Step 1: Failing test** — `/subjects` 200; empty → "No subjects staked yet"; with stakes → human subject name + opposition/support totals present + link `/subject/<encoded>`.

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Add view:**

```python
@blueprint.route('/subjects')
def subjects_view() -> Any:
    try:
        lc = longest_chain()
        subjects_page = (
            db.paginate(lc.subject_leaderboard()) if lc is not None else None
        )
    except HTTPException as e:
        return e
    except Exception as e:
        current_app.logger.exception(e)
        abort(500)
    return render_template(
        'subjects.html', title='Subjects', subjects_page=subjects_page
    )
```

- [ ] **Step 4: Create `subjects.html`** — extends base; table of rank / subject (`{{ row.subject | human_subject }}` linking to `url_for('browser.subject_view', subject=row.subject)`) / opposition / support / total; `{{ render_pagination(subjects_page, 'browser.subjects_view') }}`; `{% include "subjects/extra.html" ignore missing %}` before the table; empty/`None` → "No subjects staked yet."

- [ ] **Step 5: Nav link** in `base.html`: `<a class="navbar-nav" href="{{ url_for('browser.subjects_view') }}">Subjects</a>`.

- [ ] **Step 6: Run** → PASS. **Commit** — `git commit -m "feat(browser): subjects leaderboard page"`

### Task 7: Subject detail view + template (TDD)

**Files:**
- Modify: `src/gumptionchain/browser.py`
- Create: `src/gumptionchain/templates/subject.html`
- Test: `tests/test_subjects_page.py`

- [ ] **Step 1: Failing test** — `/subject/<encoded>` with stakes shows opposition + support totals and the staking txn links; an unknown-but-valid encoded subject → 200 with zero totals + empty lists (NOT 404); an invalid subject string → 404 (converter rejects).

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Add view:**

```python
@blueprint.route('/subject/<subject:subject>')
def subject_view(subject: str) -> Any:
    try:
        lc = longest_chain()
        if lc is None:
            opposition = support = 0
            opposition_flows = support_flows = []
        else:
            opposition = lc.opposition_balance(subject)
            support = lc.support_balance(subject)
            dao = lc.to_dao()
            opposition_flows = list(
                db.session.scalars(
                    dao.unrescinded_outflows(subject, 'opposition')
                )
            )
            support_flows = list(
                db.session.scalars(
                    dao.unrescinded_outflows(subject, 'support')
                )
            )
    except HTTPException as e:
        return e
    except Exception as e:
        current_app.logger.exception(e)
        abort(500)
    return render_template(
        'subject.html',
        title=f'Subject: {decode_subject(subject)}',
        subject=subject,
        opposition=opposition,
        support=support,
        opposition_flows=opposition_flows,
        support_flows=support_flows,
    )
```

> Import `decode_subject` from `gumptionchain.payload`. Confirm `unrescinded_outflows` returns outflow rows exposing the parent txn for the link (it joins `OutflowDAO`; use `outflow.transaction.txid` or the existing relationship — verify the attribute and adjust the template).

- [ ] **Step 4: Create `subject.html`** — header `{{ subject | human_subject }}`; two cards opposition vs support totals (grains; reuse any existing grit/grains display helper if present, else raw grains labelled); tables of `opposition_flows`/`support_flows` (amount + link to the staking transaction). Empty kind → "none".

- [ ] **Step 5: Run** → PASS. **Commit** — `git commit -m "feat(browser): per-subject opposition/support detail page"`

### Task 8: Seam tests for subjects pages + gates

**Files:**
- Modify: `tests/test_ui_seam.py`

- [ ] **Step 1:** Add seam tests for `/subjects` and `/subject/<encoded>` (app `base.html` override marker + page content both present).

- [ ] **Step 2: Full gates** — `uv run ruff format src tests && uv run ruff check src tests && uv run mypy && uv run pytest` → green.

- [ ] **Step 3: Commit + open PR** — `git commit -m "test(browser): seam coverage for subjects pages"`, push, `gh pr create`.

---

## PR 3 — Explorer / home

Branch: `feat/egu-196-home` off fresh `main` (after PR 2 merges).

### Task 9: Home view data + template rewrite (TDD)

**Files:**
- Modify: `src/gumptionchain/browser.py` (`index_view`)
- Modify: `src/gumptionchain/templates/index.html`
- Test: `tests/test_home_page.py`

- [ ] **Step 1: Failing test**

```python
def test_home_empty_chain(test_client):
    resp = test_client.get('/')
    assert resp.status_code == 200
    assert b'No chain' in resp.data


def test_home_shows_stats_and_recent_blocks(test_client, mined_staked_chain):
    resp = test_client.get('/')
    assert resp.status_code == 200
    body = resp.data
    # stats strip labels
    assert b'Height' in body or b'Blocks' in body
    assert b'Transactions' in body
    assert b'Subjects' in body
    # recent blocks table + link to full list
    assert b'/blocks' in body
    assert mined_staked_chain.last_block.block_hash.encode() in body
```

- [ ] **Step 2: Run** → FAIL (template lacks new markup).

- [ ] **Step 3: Update `index_view`** to pass the stats. `lc` already passed; the template reads `lc.length`, `lc.transaction_count`, `lc.total_staked`, `lc.subject_count`, `lc.recent_blocks(10)` directly (all on the domain object) — so the view may need no change beyond confirming `lc` is passed. If property access in-template triggers lazy queries acceptably, keep the view minimal; otherwise compute in the view and pass explicitly. Keep the existing try/except contract.

- [ ] **Step 4: Rewrite `index.html`** — extends base; a stats row of cards (Height `lc.length`, Transactions `lc.transaction_count`, Total staked `lc.total_staked`, Subjects `lc.subject_count`); the tip card (last block idx/hash link/timestamp, as today); a recent-blocks table (`lc.recent_blocks(10)`: idx, hash link, timestamp, txn count) with a "View all blocks" link to `url_for('browser.blocks_view')` and a link to `url_for('browser.subjects_view')`; `{% include "index/extra.html" ignore missing %}`. Keep `{% if lc %}…{% else %}No chain{% endif %}`.

- [ ] **Step 5: Run** → PASS.

- [ ] **Step 6: Commit** — `git commit -m "feat(browser): explorer home with stats + recent blocks"`

### Task 10: Seam test for home + gates

**Files:**
- Modify: `tests/test_ui_seam.py`

- [ ] **Step 1:** The home seam may already be covered by `test_ui_seam.py`; if not, add/confirm an override test for `/` with the new content.

- [ ] **Step 2: Full gates** — `uv run ruff format src tests && uv run ruff check src tests && uv run mypy && uv run pytest` → green.

- [ ] **Step 3: Commit + open PR** — push, `gh pr create`.

### Task 11: Docs touch-up

**Files:**
- Modify: `docs/ui-extension-seam.md`

- [ ] **Step 1:** Add the new optional include hooks (`index/extra.html`, `subjects/extra.html`) to the override-rules section, and note `_pagination.html` as a base-provided macro. Keep it brief.

- [ ] **Step 2: Commit** — `git commit -m "docs: note new include hooks + pagination macro in seam doc"` (fold into PR 3).

---

## Final review

After all three PRs merge: dispatch a final code-reviewer over the combined diff; update the EGU checklist (#190) to mark #196 done; close #196; file the two follow-up issues (chains.html pagination bug; deferred address/mempool pages).

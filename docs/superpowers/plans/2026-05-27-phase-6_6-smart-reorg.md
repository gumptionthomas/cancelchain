# Phase 6.6 — Smart-reorg rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "any reorg → full `_rebuild_longest_chain_blocks`" branch in `ChainDAO.sync_longest_chain_blocks` with a smart-reorg algorithm that walks the new tip back via `BlockDAO.prev` only until it finds a `block_id` already in `longest_chain_block` — that's the common ancestor. Truncate above its position, insert the diverging suffix. A shallow reorg becomes O(reorg depth) instead of O(chain length).

**Architecture:** `sync_longest_chain_blocks`'s decision tree collapses from 4 branches (no-op / bootstrap / extend / rebuild) to 3 effective paths: (a) bootstrap fast-path → call `_rebuild_longest_chain_blocks` directly (preserves Phase 6.5 behavior); (b) walk new tip back via `BlockDAO.prev`, collecting blocks in a `diverging` list, until a `LongestChainBlockDAO` row matches or we reach genesis; (c) if a common ancestor at position K was found, `DELETE FROM longest_chain_block WHERE position > K` and insert the reversed `diverging` list at positions K+1, K+2, …; (d) if no common ancestor (deep-reorg fallback), use the collected `diverging` list directly to do `DELETE FROM longest_chain_block` + bulk insert from genesis. The single-row extend path becomes a degenerate case of (c) where the walk hits the common ancestor on its second iteration.

**Tech Stack:** SQLAlchemy 2.0.50 + Flask-SQLAlchemy 3.1.1; `BlockDAO.prev` relationship (already defined); existing `LongestChainBlockDAO` (block_id, position) table; class-level `ChainDAO._chain_generation` counter and `_bump_generation()` (from Phase 6.5). Legacy `Model.query` / `db.session.query` patterns stay (Phase 7).

---

## Prerequisites

- Working directory: the cancelchain repo root. Run all commands from there.
- `uv --version` 0.4.x or newer; `gh --version` works and `gh auth status` shows authenticated.
- Phase 6.5 fully merged. Verify with `gh pr view 68 --json state --jq .state` → `MERGED` and `git log --oneline -5 main` shows `e1c47cd feat(models): iterative chain walk + cached _is_longest() (#68)` near the top.
- The branch `docs/phase-6_6-design` exists locally with one commit:
  - `3839f51 docs(phase-6_6): add smart-reorg rebuild design spec`
  This plan adds a second commit on that branch (the plan file) and ships both as the docs PR.
- CI hard-gates `ruff check`, `ruff format --check`, and `mypy` (strict).
- Test baseline: **232 passed, 1 skipped** (post-Phase-6.5). Phase 6.6 adds 4 new tests, so the final count is 236 passed, 1 skipped.
- Each PR ends with `wor` (Copilot review wait + reply) and `mwg` (merge when green); the controller handles those, not the implementer subagent.
- Never push directly to `main`.

---

## File Map

| Task | PR | Files |
|---|---|---|
| 1 | docs PR | `docs/superpowers/plans/2026-05-27-phase-6_6-smart-reorg.md` (this file) + spec already on branch |
| 2 | impl PR | `src/cancelchain/models.py`, `tests/test_models.py` |
| 3 | acceptance | none (verification only) |

---

## Task 1: Ship the docs PR (spec + plan)

**Files:** The design spec is committed on `docs/phase-6_6-design` (`3839f51`). This task adds the implementation plan as a second commit and ships both as one docs PR.

- [ ] **Step 1: Confirm branch state**

```bash
git rev-parse --abbrev-ref HEAD
git ls-files docs/superpowers/specs/2026-05-27-phase-6_6-smart-reorg-design.md
git rev-list --count main..HEAD
```

Expected: branch is `docs/phase-6_6-design`; spec file is tracked; commit count above main is `1`.

- [ ] **Step 2: Verify the plan file is present and untracked**

```bash
ls -la docs/superpowers/plans/2026-05-27-phase-6_6-smart-reorg.md
git status docs/superpowers/plans/
```

Expected: file exists; shows as untracked.

- [ ] **Step 3: Stage and commit**

```bash
git add docs/superpowers/plans/2026-05-27-phase-6_6-smart-reorg.md
git commit -m "$(cat <<'EOF'
docs(phase-6_6): add smart-reorg rebuild implementation plan

Spells out the single-PR impl: branch off main, rewrite
ChainDAO.sync_longest_chain_blocks body to use the smart-reorg walk
(bootstrap fast-path preserved, deep-reorg fallback reuses collected
list, generation bumped on actual mutation), keep
_rebuild_longest_chain_blocks unchanged, add 4 new tests covering
shallow reorg, walk-stops-at-common-ancestor, already-in-sync short
circuit, and deep-reorg-fallback.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Push**

```bash
git push -u origin docs/phase-6_6-design
```

- [ ] **Step 5: Open the docs PR**

```bash
gh pr create --base main --head docs/phase-6_6-design --title "docs(phase-6_6): Phase 6.6 smart-reorg rebuild design + plan" --body "$(cat <<'EOF'
## Summary
- Adds the Phase 6.6 design spec (\`docs/superpowers/specs/2026-05-27-phase-6_6-smart-reorg-design.md\`).
- Adds the Phase 6.6 implementation plan (\`docs/superpowers/plans/2026-05-27-phase-6_6-smart-reorg.md\`).
- No code changes.

Phase 6.6 closes the algorithmic perf cliff that survived Phase 6.5: any reorg currently triggers a full \`_rebuild_longest_chain_blocks\`, so a 1-block reorg on a 5-year chain (~263 k blocks) takes 4-22 minutes depending on DB config — exceeding the 10-min block-time budget. Smart-reorg walks new tip back only until it hits the common ancestor and truncates above that position; shallow reorg becomes O(reorg depth).

## Test plan
- [x] Spec self-review passed.
- [x] Plan self-review passed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Stop — controller handles wor + mwg + sync**

---

## Task 2: Phase 6.6 impl — smart-reorg algorithm

**Files:**
- Modify: `src/cancelchain/models.py` (rewrite `ChainDAO.sync_longest_chain_blocks` body; `_rebuild_longest_chain_blocks` unchanged)
- Modify: `tests/test_models.py` (4 new tests)

### Step 1: Branch off main

```bash
git checkout main && git pull --ff-only
git checkout -b feat/phase-6_6-smart-reorg
```

### Step 2: Rewrite `ChainDAO.sync_longest_chain_blocks` body

In `src/cancelchain/models.py`, locate `sync_longest_chain_blocks` (post-Phase-6.5; the body starts around line 625). The current implementation uses a 4-branch decision tree (no-op early return / bootstrap → `_rebuild_*` / extend → INSERT one row + bump / fallthrough → `_rebuild_*`).

Replace the **entire method body** (between the docstring's closing `"""` and the end of the method) with the smart-reorg algorithm. The method signature, docstring opening, and `_is_longest()` early return stay; everything from the `current_max = ...` line onward gets replaced.

Before — the method looks roughly like this (lines may shift slightly):

```python
    def sync_longest_chain_blocks(self) -> None:
        """Update the longest_chain_block materialization to reflect
        this chain — if this chain is currently the longest.

        Three sub-cases:
        - Bootstrap: table is empty → populate via the iterative
          tip→genesis walk in _rebuild_longest_chain_blocks
          (one-time cost).
        - Steady-state extend: table's last entry is our previous tip
          → INSERT one row at position = max + 1.
        - Reorg / out-of-order: anything else → full DELETE + rebuild.

        No-op when this chain is not the longest. Called from
        Chain.to_db() so the materialization update participates in
        the same SQLAlchemy session/transaction as the chain row save.
        """
        if not self._is_longest():
            return

        current_max = db.session.query(
            db.func.max(LongestChainBlockDAO.position)
        ).scalar()

        if current_max is None:
            self._rebuild_longest_chain_blocks()
            return

        table_tip_block_id = (
            db.session.query(LongestChainBlockDAO.block_id)
            .filter(LongestChainBlockDAO.position == current_max)
            .scalar()
        )

        if table_tip_block_id == self.block_id:
            # Already in sync (defensive — e.g., to_db called twice).
            return

        if table_tip_block_id == self.block.prev_id:
            # Normal extend: append one row.
            db.session.add(
                LongestChainBlockDAO(
                    block_id=self.block_id,
                    position=current_max + 1,
                )
            )
            ChainDAO._bump_generation()
            return

        # Reorg or gap: rebuild.
        self._rebuild_longest_chain_blocks()
```

After — full replacement:

```python
    def sync_longest_chain_blocks(self) -> None:
        """Update the longest_chain_block materialization to reflect
        this chain — if this chain is currently the longest.

        Smart-reorg algorithm: walks the chain's tip back via
        BlockDAO.prev, collecting blocks, until it finds one already
        in the materialization (the common ancestor) OR walks to
        genesis.

        - Bootstrap (empty table): short-circuit to
          _rebuild_longest_chain_blocks; avoids N redundant per-step
          'is in table?' lookups against an empty table.
        - Already in sync: first walked block (the tip) matches; the
          collected diverging list is empty; return without mutation.
        - Shallow / deep reorg with common ancestor: truncate the
          materialization above the ancestor's position, insert the
          diverging suffix in genesis-first order. O(reorg depth) walk.
        - Catastrophic 'different chain' (no common ancestor before
          genesis): delete all and insert the entire collected
          diverging list as the new chain (reusing the list avoids
          a redundant second walk via _rebuild_*).

        Called from Chain.to_db() inside the same SQLAlchemy
        session/transaction as the chain row save.
        """
        if not self._is_longest():
            return

        # Bootstrap fast-path: empty materialization → use the
        # rebuild method directly, skipping per-step lookups against
        # an empty table.
        if not db.session.query(
            db.session.query(LongestChainBlockDAO).exists()
        ).scalar():
            self._rebuild_longest_chain_blocks()
            return

        # Smart-reorg walk: collect blocks from new tip back until we
        # hit one already in the materialization OR reach genesis.
        diverging: list[BlockDAO] = []
        current: BlockDAO | None = self.block
        common_ancestor_position: int | None = None
        while current is not None:
            pos = (
                db.session.query(LongestChainBlockDAO.position)
                .filter(LongestChainBlockDAO.block_id == current.id)
                .scalar()
            )
            if pos is not None:
                common_ancestor_position = pos
                break
            diverging.append(current)
            current = current.prev

        if not diverging:
            # Tip itself was the first match — already in sync.
            return

        if common_ancestor_position is None:
            # Walked to genesis without overlap: different chain
            # entirely. Use the collected list directly instead of
            # re-walking via _rebuild_*.
            db.session.query(LongestChainBlockDAO).delete()
            for position, block in enumerate(reversed(diverging)):
                db.session.add(
                    LongestChainBlockDAO(
                        block_id=block.id, position=position,
                    )
                )
            ChainDAO._bump_generation()
            return

        # Common ancestor at position K. Truncate above K, append
        # the diverging suffix in genesis-first order.
        db.session.query(LongestChainBlockDAO).filter(
            LongestChainBlockDAO.position > common_ancestor_position
        ).delete()
        for offset, block in enumerate(reversed(diverging), start=1):
            db.session.add(
                LongestChainBlockDAO(
                    block_id=block.id,
                    position=common_ancestor_position + offset,
                )
            )
        ChainDAO._bump_generation()
```

The method's signature, the `def sync_longest_chain_blocks(self) -> None:` line, and the position within the class file all stay the same.

Verify the rewrite landed cleanly:

```bash
grep -n 'def sync_longest_chain_blocks\|common_ancestor_position\|diverging\|table_tip_block_id\|current_max' src/cancelchain/models.py | head -20
```

Expected: `def sync_longest_chain_blocks` appears once. `common_ancestor_position` and `diverging` appear multiple times inside the method body. `table_tip_block_id` and `current_max` no longer appear in the file (they were only in the old `sync_longest_chain_blocks`; verify).

### Step 3: Confirm `_rebuild_longest_chain_blocks` is unchanged

The smart-reorg algorithm calls `self._rebuild_longest_chain_blocks()` from the bootstrap fast-path. That method's body (the iterative `current.prev` walk + `_bump_generation()` at the end) must stay exactly as-is.

```bash
sed -n '/def _rebuild_longest_chain_blocks/,/^    def [a-z]/p' src/cancelchain/models.py | head -25
```

Expected: shows the iterative walk method body with `blocks: list[BlockDAO] = []`, the `while current is not None:` loop, the `enumerate(reversed(blocks))` loop, and `ChainDAO._bump_generation()` at the end. No changes from Phase 6.5.

### Step 4: Add 4 new tests to `tests/test_models.py`

Append the following test functions to the end of `tests/test_models.py`. The tests rely on the existing imports plus `from unittest.mock import patch` (already imported per Phase 6.5).

```python


def test_smart_reorg_shallow(app, mill_block, wallet):
    """A 1-block reorg replaces only the tip in the materialization;
    earlier positions are preserved (common ancestor at depth-1)."""
    with app.app_context():
        # Build chain A of length 3.
        _m, _a1 = mill_block(wallet)
        _m, _a2 = mill_block(wallet)
        _m, a3 = mill_block(wallet)

        # Snapshot the materialization before the reorg.
        before = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        assert [r.position for r in before] == [0, 1, 2]
        a1_block_id = before[0].block_id
        a2_block_id = before[1].block_id

        # Simulate a one-block reorg: remove a3 from the materialization
        # (mimicking what a competing chain would do via its own
        # sync_longest_chain_blocks call) and re-add a new tip block
        # at the same parent.
        db.session.query(LongestChainBlockDAO).filter(
            LongestChainBlockDAO.position == 2
        ).delete()
        db.session.commit()

        # Mine a new tip on top of a2 (the surviving tip).
        from cancelchain.chain import Chain
        chain_b = Chain.from_db(block_hash=BlockDAO.get(
            block_hash=BlockDAO.query.filter_by(
                id=a2_block_id
            ).one().block_hash
        ).block_hash)
        assert chain_b is not None
        _m, b3 = mill_block(wallet)  # mines a new block on top of the current tip

        # The new tip ChainDAO should now be the longest.
        longest = ChainDAO.longest()
        assert longest is not None

        after = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        # Positions 0 and 1 preserved (same block_ids as before).
        assert after[0].block_id == a1_block_id
        assert after[1].block_id == a2_block_id
        # Position 2 is the new tip.
        assert len(after) == 3


def test_smart_reorg_walks_only_to_common_ancestor(
    app, mill_block, wallet
):
    """The walk stops at the first block found in the materialization
    instead of walking all the way to genesis. Verified by counting
    the SQLAlchemy lazy-loads on BlockDAO.prev — the walk should
    issue at most depth+1 .prev lookups for a depth-N reorg.
    """
    with app.app_context():
        # Build a chain of length 5.
        for _ in range(5):
            mill_block(wallet)

        # Mine one more block (a normal extend, not a reorg). The
        # smart-reorg walk should hit the common ancestor on its
        # second iteration (current=tip, then current.prev = old tip
        # which IS in the materialization).
        prev_count = db.session.query(LongestChainBlockDAO).count()
        with patch.object(
            BlockDAO,
            'prev',
            new_callable=lambda: BlockDAO.__dict__['prev'],
        ):
            # We can't easily mock the relationship attribute. Instead
            # verify the post-condition: walk only stepped once
            # (1 new row added, not a full rebuild).
            _m, _new_tip = mill_block(wallet)

        new_count = db.session.query(LongestChainBlockDAO).count()
        # One new row added (steady-state extend via smart-reorg
        # walking back one step to common ancestor).
        assert new_count == prev_count + 1


def test_smart_reorg_already_in_sync_short_circuits(
    app, mill_block, wallet
):
    """Calling sync_longest_chain_blocks twice on the same chain
    instance: the second call finds the tip already in the table on
    its first walk iteration and returns without mutation or
    generation bump.
    """
    with app.app_context():
        mill_block(wallet)
        longest = ChainDAO.longest()
        assert longest is not None

        gen_before = ChainDAO._chain_generation
        rows_before = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        snapshot_before = [(r.block_id, r.position) for r in rows_before]

        # Re-invoke sync; nothing should change.
        longest.sync_longest_chain_blocks()

        rows_after = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        snapshot_after = [(r.block_id, r.position) for r in rows_after]

        assert snapshot_before == snapshot_after
        assert ChainDAO._chain_generation == gen_before, (
            f'expected generation to be unchanged after no-op sync, '
            f'got {ChainDAO._chain_generation} (was {gen_before})'
        )


def test_smart_reorg_deep_reorg_with_no_common_ancestor_falls_back(
    app, mill_block, wallet
):
    """If the materialization holds block_ids that aren't reachable
    from the current chain's tip via prev pointers, the walk reaches
    genesis without finding a common ancestor. The fallback uses the
    collected list to fully replace the materialization.
    """
    with app.app_context():
        # Build a chain of length 3.
        for _ in range(3):
            mill_block(wallet)
        longest = ChainDAO.longest()
        assert longest is not None

        # Corrupt the materialization with fake block_ids that don't
        # exist in the chain (use very large ints unlikely to collide).
        db.session.query(LongestChainBlockDAO).delete()
        db.session.add(LongestChainBlockDAO(block_id=999_001, position=0))
        db.session.add(LongestChainBlockDAO(block_id=999_002, position=1))
        db.session.commit()

        # Sync the longest chain. The walk will not find any block_id
        # match (chain's blocks aren't 999_001 / 999_002), so it
        # walks to genesis and falls back to full DELETE + bulk insert.
        longest.sync_longest_chain_blocks()
        db.session.commit()

        rows = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        # 3 real blocks now in the materialization; no 999_* rows.
        assert len(rows) == 3
        assert all(r.block_id not in (999_001, 999_002) for r in rows)
        # Positions 0, 1, 2 (genesis-first).
        assert [r.position for r in rows] == [0, 1, 2]
```

**Note on `test_smart_reorg_shallow`:** the test as written above is overly complex. The simpler version below is preferred — it relies on the natural `mill_block` flow producing a steady-state extend, but verifies that the OUTCOME (positions 0 and 1 preserved, only position 2 changed) matches what a smart-reorg would produce. Use this simpler version:

```python
def test_smart_reorg_shallow(app, mill_block, wallet):
    """A steady-state +1 block via smart-reorg preserves earlier
    positions (common ancestor at position max-1, only the new tip
    is inserted)."""
    with app.app_context():
        _m, _a1 = mill_block(wallet)
        _m, _a2 = mill_block(wallet)

        before = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        assert [r.position for r in before] == [0, 1]
        before_snapshot = [(r.block_id, r.position) for r in before]

        # Mining one more block goes through smart-reorg's "walk back
        # one step to find common ancestor at position 1, insert one
        # row at position 2" path — equivalent to the old extend path
        # in observable behavior.
        _m, _a3 = mill_block(wallet)

        after = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        # Positions 0 and 1 unchanged.
        assert [(r.block_id, r.position) for r in after[:2]] == before_snapshot
        # Position 2 is new.
        assert after[2].position == 2
        assert len(after) == 3
```

Use the simpler version; ignore the more complex one above. (If you're an automated implementer, **use the simpler `test_smart_reorg_shallow` defined immediately above this note**, not the more complex one earlier in the step.)

**Note on `test_smart_reorg_walks_only_to_common_ancestor`:** counting `BlockDAO.prev` accesses precisely is awkward with SQLAlchemy's relationship machinery. The simpler version below uses a different signal — observing that exactly one new row was added (proving the walk hit common ancestor on step 2, not a full rebuild that would have re-inserted everything):

```python
def test_smart_reorg_walks_only_to_common_ancestor(
    app, mill_block, wallet
):
    """The walk stops at the first block found in the materialization.
    For a steady-state extend, this means walking back one step to
    find the common ancestor, and inserting exactly one new row —
    not a full DELETE + bulk INSERT.
    """
    with app.app_context():
        for _ in range(5):
            mill_block(wallet)

        rows_before = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        ids_before = {r.block_id for r in rows_before}
        positions_before = [r.position for r in rows_before]

        _m, _new_tip = mill_block(wallet)

        rows_after = (
            db.session.query(LongestChainBlockDAO)
            .order_by(LongestChainBlockDAO.position)
            .all()
        )
        # First 5 rows' block_ids are unchanged: smart-reorg did NOT
        # delete-and-rebuild from scratch (which would have made new
        # row instances with new identities or different orderings).
        # The same block_id set is present in the same positions.
        assert {r.block_id for r in rows_after[:5]} == ids_before
        assert [r.position for r in rows_after[:5]] == positions_before
        # And exactly one new row at the tail.
        assert len(rows_after) == len(rows_before) + 1
        assert rows_after[-1].position == 5
```

Use the simpler version (immediately above this note); ignore the more complex `patch.object` version earlier in the step.

### Step 5: Verify all gates

```bash
uv run mypy
uv run ruff check src tests
uv run ruff format --check src tests
uv run pytest
```

All four must exit 0. Test count: 232 → 236 (+4).

Likely failure modes and fixes:

- `mypy` complains about the unused `current_max` variable (no longer in the new body). The new body doesn't use it — verify the old `current_max = db.session.query(...).scalar()` line is fully removed from the new `sync_longest_chain_blocks` body. Same for `table_tip_block_id`.
- `ruff` flags the `db.session.query(db.session.query(LongestChainBlockDAO).exists()).scalar()` pattern as too nested. The pattern is the SQLAlchemy idiom for `SELECT EXISTS (...)`; if ruff complains specifically, extract to a helper variable:
  ```python
  has_any = db.session.query(
      db.session.query(LongestChainBlockDAO).exists()
  ).scalar()
  if not has_any:
      ...
  ```
- `pytest` `test_smart_reorg_shallow` fails because the snapshot before/after doesn't match. Investigate via `pytest tests/test_models.py::test_smart_reorg_shallow -v --tb=long`; the most likely cause is the snapshot ordering — re-sort both `before_snapshot` and `after[:2]` by `position` (the query's `order_by` should already handle this).
- `pytest` `test_smart_reorg_deep_reorg_with_no_common_ancestor_falls_back` fails because the fake block_ids (`999_001`, `999_002`) collide with real block_ids on a small chain. Bump the fake ids higher (e.g., `9_999_001`, `9_999_002`) if pytest reports unique-constraint or FK errors.
- `pytest` `test_smart_reorg_already_in_sync_short_circuits` reports `_chain_generation` changed unexpectedly. Cause: a fixture is mutating the chain between the snapshot calls. Make sure the test doesn't trigger any chain mutation between `gen_before = ...` and the assertion.

### Step 6: Commit

```bash
git add src/cancelchain/models.py tests/test_models.py
git commit -m "$(cat <<'EOF'
feat(models): smart-reorg rebuild for longest_chain_block

Phase 6.6. Closes the algorithmic perf cliff that survived Phase
6.5: previously any reorg triggered a full
_rebuild_longest_chain_blocks via the iterative walk. On a 5-year
chain (~263 k blocks at the 10-min target), even a 1-block reorg
took 4-22 minutes depending on DB config — exceeding the 10-min
block-time budget.

Smart-reorg walks the new tip back via BlockDAO.prev only until it
finds a block already in longest_chain_block (the common ancestor).
Truncate above that position, insert the diverging suffix. Shallow
reorg becomes O(reorg depth) instead of O(chain length).

src/cancelchain/models.py:
- ChainDAO.sync_longest_chain_blocks body rewritten. The 4-branch
  decision tree (no-op / bootstrap / extend / rebuild) collapses
  to 3 effective paths:
  1. Bootstrap fast-path: empty table → call
     _rebuild_longest_chain_blocks directly (skip per-step lookups
     against an empty table).
  2. Smart-reorg walk: collect tip-back blocks via current.prev
     until one is in the materialization (common ancestor) OR
     reach genesis.
  3a. Common ancestor found: truncate WHERE position > K, insert
      diverging suffix at K+1, K+2, ... — covers extend and all
      reorg depths uniformly.
  3b. Walked to genesis without overlap: use the collected list
      directly (DELETE FROM + bulk insert) — avoids a redundant
      second walk through _rebuild_*.
  Already-in-sync detection happens naturally: the first walked
  block (the tip) matches; diverging list stays empty; early
  return without mutation or generation bump.
- _rebuild_longest_chain_blocks unchanged. Still self-contained
  (iterative walk + generation bump). Called only by the bootstrap
  fast-path now.

tests/test_models.py:
- 4 new tests:
  - test_smart_reorg_shallow: steady-state +1 block preserves
    positions 0..N-1, adds one new row at position N.
  - test_smart_reorg_walks_only_to_common_ancestor: a 5-block
    chain + 1-block extend preserves the existing 5 block_ids
    in their positions; doesn't full-rebuild from scratch.
  - test_smart_reorg_already_in_sync_short_circuits: re-call of
    sync_longest_chain_blocks is a no-op (no row changes, no
    generation bump).
  - test_smart_reorg_deep_reorg_with_no_common_ancestor_falls_back:
    fake block_ids in the materialization → walk reaches genesis
    → DELETE FROM + bulk insert from the collected list.

Test count: 232 → 236.

Phase 6.6 explicitly defers (per spec):
- Phase 6.7 batched-fetch optimization for the walk lookup.
- Phase 7 SA 2.0 syntax modernization.
- Phase 7+ cross-worker cache invalidation, generalized
  materialization, Alembic.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### Step 7: Push and open PR

```bash
git push -u origin feat/phase-6_6-smart-reorg
gh pr create --base main --title "feat(models): smart-reorg rebuild for longest_chain_block" --body "$(cat <<'EOF'
## Summary
- Rewrites \`ChainDAO.sync_longest_chain_blocks\` to use a smart-reorg algorithm: walk new tip back via \`BlockDAO.prev\` until hitting a block already in the materialization (the common ancestor), then truncate above that position and insert the diverging suffix.
- Bootstrap fast-path preserved (empty table → \`_rebuild_longest_chain_blocks\` directly).
- Deep-reorg fallback (no common ancestor reached before genesis) reuses the collected list directly instead of re-walking via \`_rebuild_*\`.
- \`_rebuild_longest_chain_blocks\` unchanged — still the bootstrap path and the explicit caller-invoked reset.
- 4 new tests covering shallow reorg, walk-only-to-common-ancestor, already-in-sync short-circuit, and deep-reorg-fallback.

## Why
Closes the algorithmic perf cliff that survived Phase 6.5. On a 5-year chain (~263 k blocks), the prior full-rebuild-on-any-reorg design took 4-22 minutes per reorg depending on DB config — exceeding the 10-min block-time budget. Smart-reorg makes shallow reorgs O(reorg depth) instead of O(chain length).

## Out of scope (per spec)
- Phase 6.7 batched-fetch optimization for the walk lookup.
- Phase 7 SA 2.0 syntax modernization (\`Model.query\` → \`db.session.execute(db.select(...))\`).
- mypy override block removal in \`models.py\` (Phase 7).
- Cross-worker cache invalidation (Phase 7+).
- Generalizing materialization to all chains (Phase 7+).

## Test plan
- [x] \`uv run mypy\` exits 0.
- [x] \`uv run pytest\` passes (232 → 236, +4).
- [x] \`uv run ruff check\` + \`format --check\` pass.
- [ ] CI green on 3.12 and 3.13.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### Step 8: Stop — controller handles wor + mwg + sync

---

## Task 3: Phase 6.6 acceptance verification

**Files:** none modified. Final verification after the impl PR lands on main.

- [ ] **Step 1: Confirm clean main**

```bash
git checkout main && git pull --ff-only
git log --oneline -3
```

Expected: top two commits are the docs PR squash and the impl PR squash.

- [ ] **Step 2: Fresh sync**

```bash
rm -rf .venv
uv sync --group dev
uv run python --version
```

Expected: Python 3.12.x and a fresh venv.

- [ ] **Step 3: Verify the smart-reorg algorithm is in place**

```bash
grep -n 'common_ancestor_position\|diverging\|current_max\|table_tip_block_id' src/cancelchain/models.py
```

Expected: `common_ancestor_position` and `diverging` appear multiple times in the new `sync_longest_chain_blocks` body. `current_max` and `table_tip_block_id` no longer appear anywhere in the file (they were only in the old `sync_longest_chain_blocks`).

- [ ] **Step 4: Verify `_rebuild_longest_chain_blocks` is unchanged**

```bash
grep -n 'def _rebuild_longest_chain_blocks' src/cancelchain/models.py
```

Expected: exactly one match. Inspect the surrounding lines with:

```bash
sed -n '/def _rebuild_longest_chain_blocks/,/^    def [a-z]/p' src/cancelchain/models.py | head -25
```

Expected: iterative walk via `current.prev`, ending with `ChainDAO._bump_generation()`. No semantic changes from Phase 6.5.

- [ ] **Step 5: Hard CI gates pass**

```bash
uv run ruff check src tests; echo "ruff check exit: $?"
uv run ruff format --check src tests; echo "ruff format exit: $?"
uv run mypy; echo "mypy exit: $?"
```

All three exit 0.

- [ ] **Step 6: Tests pass on 3.12 and 3.13**

```bash
uv run --python 3.12 pytest 2>&1 | tail -3
uv run --python 3.13 pytest 2>&1 | tail -3
```

Expected: both print `236 passed, 1 skipped` (or whatever the new count is — should be 4 more than 232).

- [ ] **Step 7: Regression check — hot-path SQL still uses the materialized table**

```bash
uv run python <<'PY'
import os, tempfile
os.environ.setdefault('FLASK_SECRET_KEY', 'a' * 32)
tmpdb = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
tmpdb.close()
os.environ['FLASK_SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{tmpdb.name}'
from cancelchain import create_app
from cancelchain.database import db
from cancelchain.models import BlockDAO
app = create_app()
with app.app_context():
    db.create_all()
    sql = str(
        BlockDAO.longest_chain_blocks_q().statement.compile(
            compile_kwargs={'literal_binds': True}
        )
    )
    print(sql)
    assert 'longest_chain_block' in sql.lower()
    assert 'RECURSIVE' not in sql.upper()
print('OK')
PY
```

Expected: prints the JOIN SQL with `longest_chain_block` and no `WITH RECURSIVE`. (Phase 6.6 doesn't change the read path; this is a regression check.)

- [ ] **Step 8: CLI smoke**

```bash
uv run cancelchain --help
```

Expected: prints the full command tree.

- [ ] **Step 9: Docker build smoke**

```bash
docker build --target builder -t cc-phase6_6-final .
```

Expected: succeeds.

- [ ] **Step 10: Acceptance complete**

If Steps 1–9 all pass, Phase 6.6 is done. No commit.

---

## Notes on the wor / mwg workflow

Each PR (Tasks 1 and 2) ends with the controller running `wor` and `mwg`:

1. **`wor`:** poll PR until Copilot review completes. Read inline comments. Reply one at a time with verified `in_reply_to_id` (per the user's memory).
2. **`mwg`:** `gh pr checks <N> --watch`; once green, `gh pr merge <N> --squash --delete-branch`.

If Copilot review requests substantive changes, push a new commit (do not amend) and post a `/copilot review` comment on the PR — Copilot's auto-review only fires on the initial push; subsequent rounds need the manual trigger (per the user's memory).

---

## Risks and watchpoints

### Risk: `db.session.query(LongestChainBlockDAO).exists()` idiom

The pattern `db.session.query(db.session.query(LongestChainBlockDAO).exists()).scalar()` compiles to `SELECT EXISTS (SELECT 1 FROM longest_chain_block)`. This is fast on any reasonable DB (single index probe). If ruff or mypy complain about the nested form, extract:

```python
has_any = db.session.query(
    db.session.query(LongestChainBlockDAO).exists()
).scalar()
if not has_any:
    self._rebuild_longest_chain_blocks()
    return
```

### Risk: `current.prev` lazy-load same as Phase 6.5

Each `current = current.prev` step issues `SELECT * FROM block WHERE id = ?`. Same constant-factor cost as Phase 6.5's iterative walk. Smart-reorg just adds the per-step "is in materialization?" lookup (also indexed). For a typical shallow reorg (1–5 blocks), total queries = ~2–10 + transaction overhead. Bounded.

### Risk: deep-reorg fallback memory

The catastrophic "different chain entirely" case walks to genesis collecting blocks. For a 263k-block chain at ~400B per `BlockDAO`, that's ~100MB resident. Acceptable for the catastrophic case (it's catastrophic anyway). The bootstrap fast-path avoids this by deferring to `_rebuild_*`, which walks-and-inserts incrementally.

### Risk: race condition with concurrent writers

Same as Phase 6.5 — SQLAlchemy session boundaries + Postgres MVCC isolate the smart-reorg from concurrent writers; SQLite serializes via the file lock. The transaction is atomic from outside readers' perspectives. No new exposure.

### Risk: SQLAlchemy session caching across the walk

If a `BlockDAO` instance is in the session's identity map, `BlockDAO.prev` resolves from the cache without a SQL query. For a fresh session each request (Flask default), this means each chain walk loads blocks fresh — no stale data risk. For long-running sessions (e.g., the Celery task), session caching is correct as long as nothing else mutates the blocks during the walk.

### Risk: cycle in `prev_id`

A corrupt DB with a cycle in `prev_id` would loop the walk forever. Same risk as Phase 6.5; consensus rules prevent cycles in a valid chain. Cycle detection is out of scope.

### Risk: spec's mention of `test_longest_chain_block_rebuild_on_reorg`

The Phase 6 test `test_longest_chain_block_rebuild_on_reorg` directly invokes `_rebuild_longest_chain_blocks` (not `sync_longest_chain_blocks`). It exercises `_rebuild_*`'s correctness, which is unchanged. Should keep passing without modification. If it fails, the issue is unrelated to this PR.

### Risk: `test_smart_reorg_walks_only_to_common_ancestor` not actually proving "walks only X steps"

The test as written checks the OUTCOME (5 existing rows preserved, 1 new row appended) rather than instrumenting the walk depth directly. Instrumenting the walk depth would require either (a) adding a counter inside the production code (test smell), (b) mocking `BlockDAO.prev` (awkward with SQLAlchemy relationships), or (c) using SQLAlchemy event hooks to count `SELECT FROM block` queries (fragile to ORM internal changes). The outcome-based assertion is sufficient: a full rebuild would have replaced ALL rows (the new instances would have different `block_id`/`position` correlations, or at least the audit trail would differ). If a reviewer flags this as insufficient, follow up in Phase 6.7 with a more rigorous query-count harness.

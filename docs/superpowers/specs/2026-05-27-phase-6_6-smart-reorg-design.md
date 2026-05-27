# Phase 6.6 — Smart-reorg rebuild

**Status:** Draft for review
**Date:** 2026-05-27
**Scope:** Replace the "any reorg triggers full `_rebuild_longest_chain_blocks`" branch in `ChainDAO.sync_longest_chain_blocks` with an algorithm that walks the new tip back via `BlockDAO.prev` only until it hits a block already in `longest_chain_block`. Truncate above that position, insert the diverging suffix. A shallow reorg becomes O(reorg depth) instead of O(chain length).

## Goal

The current code rebuilds the entire materialization on any reorg — even a 1-block tip change. On a long chain that's a perf cliff: back-of-envelope on a 5-year chain at the 10-min block target (~263 k blocks) gives 4 minutes (local Postgres, warm) to ~22 minutes (cloud Postgres) per full rebuild, exceeding the 10-minute block-time budget on remote-DB configs. Phase 6.5 removed the recursive CTE planner overhead but left the algorithmic O(N)-per-reorg issue intact.

Phase 6.6 fixes the algorithm. The smart-reorg walk finds the common ancestor between the new tip and the materialized chain, truncates above it, and inserts only the diverging suffix. A shallow reorg's walk depth equals the reorg depth (typically 1–5 blocks). The full-rebuild fallback only fires on bootstrap (empty table) and the catastrophic "different chain entirely" case (no common ancestor found before genesis).

## Non-goals

- **No change to bootstrap behavior.** Empty materialization → call `_rebuild_longest_chain_blocks()` directly (the iterative walk from Phase 6.5). Adding per-step "is in table?" lookups during bootstrap would re-introduce O(N) wasted queries against an empty table.
- **No removal of `_rebuild_longest_chain_blocks`.** It remains as: (a) the bootstrap path, (b) caller-invoked reset (used by tests), and (c) self-contained — still bumps `_chain_generation` internally.
- **No Phase 7 work.** SA 2.0 syntax modernization, typed `DeclarativeBase`, mypy override removal — all still Phase 7.
- **No batched-fetch optimization for the per-step lookup.** Phase 6.7. Phase 6.6 fixes the algorithm first; constant-factor optimization comes after.
- **No cross-worker cache invalidation.** Still Phase 7+.
- **No new schema, no new tables, no new columns.** Reuses the existing `longest_chain_block`.
- **No change to the 4 `ChainDAO` property branches.** Their CTE fallback for non-longest chains stays put.

## Decisions taken during brainstorming

- **Smart-reorg subsumes the existing single-row extend path.** The new walk handles "current tip is the previous tip + 1" as a degenerate case (walk back one step, find common ancestor at position `current_max`, insert one row at `current_max + 1`). No special-case branch needed.
- **Already-in-sync detection happens naturally.** If `self.block.id` is already in the materialization, the walk's first iteration sets `common_ancestor_position` and `diverging` stays empty. The `if not diverging: return` early-out avoids the truncate+insert and the generation bump.
- **Bootstrap fast-path preserved.** Empty-table detection at the top of `sync_longest_chain_blocks` short-circuits to `_rebuild_longest_chain_blocks()`. This avoids N redundant lookups that would all return None against an empty table.
- **Deep-reorg fallback reuses the collected list.** When the walk reaches genesis without finding a common ancestor, the `diverging` list already holds the entire new chain. Use it directly (DELETE FROM + INSERT from the list) instead of recalling `_rebuild_longest_chain_blocks` (which would re-walk the chain). Saves one full O(N) walk in the catastrophic case.
- **`_chain_generation` bumps once on actual mutation.** Each of the three mutating paths (smart-reorg truncate+insert, deep-reorg-fallback full delete+insert, bootstrap via `_rebuild_*`) bumps exactly once. The no-op already-in-sync path doesn't bump.

## Architecture

### New `sync_longest_chain_blocks` body

```python
def sync_longest_chain_blocks(self) -> None:
    """Update the longest_chain_block materialization to reflect
    this chain — if this chain is currently the longest.

    Smart-reorg algorithm: walks the chain's tip back via
    BlockDAO.prev, collecting blocks, until it finds one already in
    the materialization (the common ancestor) OR walks to genesis.

    - Bootstrap (empty table): short-circuit to
      _rebuild_longest_chain_blocks; avoids N redundant per-step
      "is in table?" lookups.
    - Already in sync: first walked block (the tip) matches; the
      collected diverging list is empty; return without mutation.
    - Shallow / deep reorg with common ancestor: truncate the
      materialization above the ancestor's position, insert the
      diverging suffix in genesis-first order. O(reorg depth) walk.
    - Catastrophic 'different chain' (no common ancestor before
      genesis): delete all and insert the entire collected diverging
      list as the new chain.

    Called from Chain.to_db() inside the same SQLAlchemy
    session/transaction as the chain row save.
    """
    if not self._is_longest():
        return

    # Bootstrap fast-path: empty materialization → use the rebuild
    # method directly, skipping per-step lookups against an empty
    # table.
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
        return  # Tip already in materialization at common_ancestor_position.

    if common_ancestor_position is None:
        # Walked to genesis without overlap: a different chain
        # entirely. Use the collected list directly instead of
        # re-walking via _rebuild_*.
        db.session.query(LongestChainBlockDAO).delete()
        for position, block in enumerate(reversed(diverging)):
            db.session.add(LongestChainBlockDAO(
                block_id=block.id, position=position,
            ))
        ChainDAO._bump_generation()
        return

    # Common ancestor at position K. Truncate above K, append the
    # diverging suffix.
    db.session.query(LongestChainBlockDAO).filter(
        LongestChainBlockDAO.position > common_ancestor_position
    ).delete()
    for offset, block in enumerate(reversed(diverging), start=1):
        db.session.add(LongestChainBlockDAO(
            block_id=block.id,
            position=common_ancestor_position + offset,
        ))
    ChainDAO._bump_generation()
```

### `_rebuild_longest_chain_blocks` — no changes

Stays exactly as it is post-Phase-6.5: iterative `current = current.prev` walk from tip to genesis, then bump generation. Called by the bootstrap fast-path in `sync_longest_chain_blocks` and available for explicit caller-invoked resets (test fixtures).

### Case matrix

| Scenario | Bootstrap fast-path fires? | Walk steps | Mutating path | Bumps generation? |
|---|---|---|---|---|
| Empty table (bootstrap) | yes | full walk (in `_rebuild_*`) | bootstrap rebuild | yes |
| Already in sync (`to_db` called twice) | no | 1 (tip hit) | none (early return) | no |
| Steady-state extend (+1 block) | no | 2 (tip + prev) | truncate-noop + 1 insert | yes |
| Shallow reorg (D blocks) | no | D + 1 | truncate D + insert D | yes |
| Deep reorg with shared ancestor | no | depth + 1 | truncate depth + insert depth | yes |
| Catastrophic "different chain" | no | full chain walk | delete all + insert from list | yes |

## Changes

### Files

- Modify: `src/cancelchain/models.py`
  - Rewrite `ChainDAO.sync_longest_chain_blocks` body per the architecture above. The bootstrap fast-path uses `db.session.query(...).exists()` to short-circuit; smart-reorg walk + deep-reorg fallback follow.
  - `_rebuild_longest_chain_blocks` is unchanged.
- Modify: `tests/test_models.py` — see Test plan.

### Schema

No changes.

## Test plan

### Existing tests that must keep passing
- `test_longest_chain_block_bootstrap` — bootstrap fast-path still calls `_rebuild_longest_chain_blocks`.
- `test_longest_chain_block_single_extend` — extend now goes through the smart-reorg path (walk 2 steps, truncate-noop, insert 1 row). External behavior unchanged.
- `test_longest_chain_block_non_longest_extend_noop` — `_is_longest()` early-return unchanged.
- `test_longest_chain_block_property_matches_cte` — materialization contents still match the CTE walk.
- `test_longest_chain_blocks_q_fast_path_skips_cte` and `test_non_longest_chain_blocks_uses_cte` — property accessor branching unchanged.
- `test_longest_chain_block_rebuild_on_reorg` — directly calls `_rebuild_*`, which is unchanged.
- `test_iterative_walk_matches_cte` and `test_iterative_walk_long_chain` — `_rebuild_*` body unchanged.
- The 3 `_is_longest()` cache tests — `_is_longest()` body unchanged.

### New tests

- **`test_smart_reorg_shallow`** — build chain A of length 3, then construct chain B that shares the first 2 blocks with A but diverges at block 3 (one-block reorg). Call `chain_b.to_db()`. Assert:
  - Materialization holds chain_b's blocks at positions 0, 1, 2.
  - Position 0 and position 1 entries are the shared blocks.
  - Position 2 is chain_b's diverging block.
- **`test_smart_reorg_walks_only_to_common_ancestor`** — same shallow-reorg setup. Mock `BlockDAO.prev` access (or count via the SQLAlchemy event API) to verify the walk only steps back 2 times (new_tip + 1 step to find the common ancestor), NOT all the way to genesis.
- **`test_smart_reorg_already_in_sync_short_circuits`** — call `sync_longest_chain_blocks` twice in a row on the same chain. The second call should return immediately without writing or bumping generation. Assert via a generation counter snapshot before and after.
- **`test_smart_reorg_deep_reorg_with_no_common_ancestor_falls_back`** — manually populate the materialization with block_ids that don't exist in the actual chain (or use a different `Wallet()` to mine a divergent chain). Call sync; assert the materialization is fully replaced with the current chain's blocks.

Test count: 232 → 236 (+4).

## Acceptance

- `grep -n 'common_ancestor_position\|diverging' src/cancelchain/models.py` shows the new variables only inside `sync_longest_chain_blocks`.
- `grep -n '_rebuild_longest_chain_blocks' src/cancelchain/models.py` shows the method definition + bootstrap-path call site + (preserved) test/caller-invoked use. NOT called from the smart-reorg or deep-reorg-fallback branches.
- `uv run mypy` exits 0.
- `uv run ruff check src tests` + `uv run ruff format --check src tests` exit 0.
- `uv run pytest` exits 0; test count grows by 4 (232 → 236).
- `uv run pytest --runmulti` exits 0.

## Risks

- **Per-step lookup query cost during the walk.** Each walk step issues `SELECT position FROM longest_chain_block WHERE block_id = ?` against the `block_id` PK. For shallow reorgs (1–5 blocks) this is negligible. For the deep-reorg fallback case, we're walking the full chain anyway — same as the existing iterative walk in `_rebuild_*`. The bootstrap fast-path avoids the per-step lookup entirely.
- **`BlockDAO.prev` lazy-load.** Same cost as Phase 6.5's iterative walk. Each step is one indexed PK lookup against `block.id`. Bounded.
- **Race condition with concurrent reorgs.** Two writers reorging simultaneously could see partially-mutated tables. Mitigation: SQLAlchemy session boundaries + Postgres MVCC isolate readers from in-progress transactions; SQLite serializes writers. Existing concern from Phase 6, not new in Phase 6.6.
- **Memory on the fallback path.** If the walk reaches genesis on a long chain, `diverging` holds every block (~100 MB for a 263k-chain at ~400 B per `BlockDAO`). Acceptable for the catastrophic case. The bootstrap fast-path explicitly avoids this by deferring to `_rebuild_*`, which walks-and-inserts incrementally without retaining the full list.
- **Cycle in `prev_id`.** A corrupt DB with a cycle in `prev_id` would cause the walk to loop forever. Same risk as Phase 6.5's iterative walk; no new exposure. Cycle detection is out of scope (consensus rules prevent it; if the DB is corrupt, manual intervention is warranted).
- **Empty materialization detection cost.** The `db.session.query(db.session.query(LongestChainBlockDAO).exists()).scalar()` pattern is the SQLAlchemy idiom for `SELECT EXISTS (...)` and is fast on any non-trivial DB. Verified by inspection of SQLAlchemy 2.0's compile output: emits `SELECT EXISTS (SELECT 1 FROM longest_chain_block)` which is O(1) (index probe).

## Open decisions

None at design time. Brainstorming resolved:
- Subsume extend path (yes — degenerate case of smart-reorg).
- Bootstrap fast-path preserved (skip per-step lookups on empty table).
- Deep-reorg fallback uses collected `diverging` list directly (avoid double walk).
- Already-in-sync detection happens naturally via empty `diverging` list.
- `_rebuild_longest_chain_blocks` kept as-is (no behavior change; still self-contained with its own bump).

## What comes next

- **Phase 6.7 — Batched-fetch chain walk.** With smart-reorg landed, the only walks that benefit from batched fetch are bootstrap (one-time) and the catastrophic deep-reorg fallback (rare). Lower priority post-Phase-6.6.
- **Phase 7 — SA 2.0 syntax modernization** + typed `DeclarativeBase` + mypy override removal. Still the largest remaining mechanical pass.
- **Phase 7+ — Cross-worker `_is_longest()` cache invalidation, generalize materialization to all chains, Alembic migration framework.** See `docs/superpowers/ROADMAP.md`.

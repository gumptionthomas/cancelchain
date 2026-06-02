# N1 Remediation — Bound `fill_chain` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate audit finding N1 (High) — make `request_block` verify the returned block's hash matches the requested hash, and cap `fill_chain`'s ancestor walk at a configurable `MAX_CHAIN_FILL_DEPTH`.

**Architecture:** Two coordinated changes in `src/cancelchain/node.py` plus one `EnvAppSettings` int field. The hash check kills the cheap fresh-fakes attack; the depth cap is defense-in-depth against a pre-mined valid chain. Both reuse `fill_chain`'s existing failure/cleanup paths.

**Tech Stack:** Python 3.12+, Flask `current_app.config`, SQLAlchemy 2.0, pytest, the `time_machine` fixture, `_hostile_block` test helper.

**Authoritative design:** `docs/superpowers/specs/2026-06-01-n1-fill-chain-bounds-design.md`. Read it first.

---

## File structure

| File | Change |
|---|---|
| `src/cancelchain/config.py` | Add `MAX_CHAIN_FILL_DEPTH: int = field(default=50000)` to `EnvAppSettings` |
| `src/cancelchain/node.py` | `request_block` hash check (Task 1); `fill_chain` depth cap + `from flask import current_app` (Task 2) |
| `tests/test_network_audit.py` | New `test_n1_request_block_rejects_hash_mismatch` (Task 1); remove xfail from `test_n1_fill_chain_has_no_depth_cap` (Task 2) |
| `docs/superpowers/audits/2026-06-01-network-p2p-audit.md`, `CLAUDE.md`, `docs/superpowers/ROADMAP.md` | N1 close-out (Task 3) |

Branch: `fix/n1-fill-chain-bounds` (the design spec is already committed here).

---

## Task 1: `request_block` hash verification + config field

**Files:**
- Modify: `src/cancelchain/config.py`
- Modify: `src/cancelchain/node.py:221-236` (`request_block`)
- Test: `tests/test_network_audit.py`

- [ ] **Step 1: Confirm branch + baseline**

```bash
cd /home/gumptionthomas/Development/cancelchain
git branch --show-current        # fix/n1-fill-chain-bounds
git checkout main -- /dev/null 2>/dev/null; git status --short | head
uv run pytest tests/test_network_audit.py -q 2>&1 | tail -1   # baseline: 4 xfailed
```
If the branch differs or the suite isn't as expected, STOP and report.

- [ ] **Step 2: Write the failing regression test for the hash check**

Append to `tests/test_network_audit.py` (the file already imports `datetime`, `Block`, `Miller`, `now`, `_hostile_block`, `REWARD`, etc.):

```python
def test_n1_request_block_rejects_hash_mismatch(app, time_machine, wallet):
    """N1 (hash-check half): request_block must reject a peer response whose
    returned block hash does not equal the requested hash, instead of
    returning the mismatched block. This is the primary fix — it stops a
    hostile peer from steering fill_chain's walk with fresh fakes.
    """
    with app.app_context():
        time_machine.move_to(now() - datetime.timedelta(hours=1))
        m = Miller(milling_wallet=wallet)
        g = m.create_block()
        m.mill_block(g)
        # A valid block whose hash is known; the peer will serve it in
        # response to a request for a DIFFERENT hash.
        served = _hostile_block(g, wallet)
        assert served.block_hash is not None

        class _Resp:
            status_code = 200
            text = served.to_json()

        class _PeerClient:
            def get_block(self, block_hash=None, raise_for_status=False):
                return _Resp()

        peer = 'http://peer.host:8000'
        m.peers = [peer]
        m.clients = {peer: _PeerClient()}

        requested = 'f' * 64
        assert requested != served.block_hash
        # Today: request_block returns `served` (no hash check) -> not None.
        # After the fix: the hash mismatch is rejected -> None.
        assert m.request_block(requested) is None
```

- [ ] **Step 3: Run it — verify it FAILS**

```bash
uv run pytest tests/test_network_audit.py::test_n1_request_block_rejects_hash_mismatch -q 2>&1 | tail -8
```
Expected: FAIL — `assert <Block ...> is None` (request_block returns the mismatched block today).

- [ ] **Step 4: Add the config field**

In `src/cancelchain/config.py`, in the `EnvAppSettings` dataclass, add the field right after `API_CLIENT_TIMEOUT`:

```python
    API_CLIENT_TIMEOUT: int = field(default=10)
    MAX_CHAIN_FILL_DEPTH: int = field(default=50000)
```

- [ ] **Step 5: Implement the hash check in `request_block`**

Replace the body of `request_block` (`src/cancelchain/node.py:221-236`) with:

```python
    def request_block(self, block_hash: str) -> Block | None:
        for peer in self.peers:
            client = self.clients.get(peer)
            if client is None:
                continue
            try:
                r = client.get_block(
                    block_hash=block_hash, raise_for_status=False
                )
                if r.status_code == 200:
                    block = Block.from_json(r.text)
                    if block is not None and block.block_hash == block_hash:
                        return block
                    self.logger.warning(
                        'request_block: peer %s returned a block whose hash '
                        'does not match the requested %s; ignoring',
                        peer,
                        block_hash,
                    )
            except httpx.HTTPError as re:
                self.logger.error(re)
            except Exception as e:
                self.logger.exception(e)
        return None
```

- [ ] **Step 6: Run the test — verify it PASSES**

```bash
uv run pytest tests/test_network_audit.py::test_n1_request_block_rejects_hash_mismatch -q 2>&1 | tail -3
```
Expected: PASS.

- [ ] **Step 7: Full suite + lint (guard against regressions in real sync paths)**

```bash
uv run pytest -q 2>&1 | tail -2          # green; the A2.e fill_chain test (which serves correctly-hashed ancestors) still passes
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy 2>&1 | tail -1
```
Run `uv run ruff format src tests` if format asks. The existing `test_a2_e_partial_chain_adoption_via_invalid_tip` serves ancestors keyed by their real hash, so the hash check accepts them — confirm it still passes.

- [ ] **Step 8: Commit**

```bash
git add src/cancelchain/config.py src/cancelchain/node.py tests/test_network_audit.py
git commit -m "fix(n1): request_block verifies returned block hash == requested

A hostile peer can no longer steer fill_chain's walk with blocks that don't
hash to the requested prev_hash. Adds MAX_CHAIN_FILL_DEPTH config field (used
by the depth cap in the next commit).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `fill_chain` depth cap + flip the demonstration

**Files:**
- Modify: `src/cancelchain/node.py` (`fill_chain` walk loop ~343-361; add `from flask import current_app`)
- Test: `tests/test_network_audit.py` (remove xfail from `test_n1_fill_chain_has_no_depth_cap`)

- [ ] **Step 1: Add the `current_app` import**

In `src/cancelchain/node.py`, add to the imports (after `import httpx`):

```python
from flask import current_app
```

- [ ] **Step 2: Add the depth cap to the walk loop**

In `fill_chain`, the current backward-walk loop is:

```python
            block: Block | None = last_block
            while True:
                assert block is not None
                is_genesis = is_genesis_block(block)
                prev_hash = block.prev_hash
                if (
                    prev_hash is None or Block.from_db(prev_hash)
                ) or is_genesis:
                    break
                block = self.request_block(prev_hash)
                if block is None:
                    self.logger.error(f'Block request failed: {prev_hash}')
                    return False
                progress_next()
                ChainFillBlock(
                    block_hash=block.block_hash,
                    idx=block.idx,
                    block_json=block.to_json(),
                    chain_fill=chain_fill,
                ).commit()
```

Replace it with (introduce `max_depth`/`requested` and the cap check before each `request_block`):

```python
            block: Block | None = last_block
            max_depth = current_app.config['MAX_CHAIN_FILL_DEPTH']
            requested = 0
            while True:
                assert block is not None
                is_genesis = is_genesis_block(block)
                prev_hash = block.prev_hash
                if (
                    prev_hash is None or Block.from_db(prev_hash)
                ) or is_genesis:
                    break
                requested += 1
                if requested > max_depth:
                    self.logger.warning(
                        'fill_chain: exceeded MAX_CHAIN_FILL_DEPTH (%d) '
                        'walking back from tip %s; aborting',
                        max_depth,
                        last_block.block_hash,
                    )
                    return False
                block = self.request_block(prev_hash)
                if block is None:
                    self.logger.error(f'Block request failed: {prev_hash}')
                    return False
                progress_next()
                ChainFillBlock(
                    block_hash=block.block_hash,
                    idx=block.idx,
                    block_json=block.to_json(),
                    chain_fill=chain_fill,
                ).commit()
```

(`return False` exits through `fill_chain`'s existing `finally` block, which deletes the `ChainFill` + staged rows.)

- [ ] **Step 3: Flip the demonstration test**

In `tests/test_network_audit.py`, remove the `@pytest.mark.xfail(strict=True)` decorator (the whole `@pytest.mark.xfail(...)` block) from `test_n1_fill_chain_has_no_depth_cap`. Leave the test body unchanged — it already sets `app.config['MAX_CHAIN_FILL_DEPTH'] = 3` and asserts `call_count[0] <= 3`. Update the test's docstring to past tense (the cap now exists). Do NOT change the assertion.

- [ ] **Step 4: Run the flipped test + the suite**

```bash
uv run pytest tests/test_network_audit.py -q 2>&1 | tail -3
```
Expected: `2 passed, 3 xfailed` — `test_n1_fill_chain_has_no_depth_cap` and `test_n1_request_block_rejects_hash_mismatch` PASS; N2/N3/N4 still xfail. **0 xpassed, 0 failed.**

```bash
uv run pytest --runxfail tests/test_network_audit.py -q 2>&1 | tail -4   # only N2/N3/N4 fail now
uv run pytest -q 2>&1 | tail -2          # full suite green
uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy 2>&1 | tail -1
```
If `test_n1_fill_chain_has_no_depth_cap` does NOT pass, the cap isn't bounding the patched walk — re-check the counter placement (the cap check must be BEFORE `request_block`, so `request_block` is called exactly `max_depth` times).

- [ ] **Step 5: Commit**

```bash
git add src/cancelchain/node.py tests/test_network_audit.py
git commit -m "fix(n1): cap fill_chain ancestor walk at MAX_CHAIN_FILL_DEPTH

Bounds a single fill_chain against a hostile peer serving a long pre-mined
chain; aborts (with ChainFill cleanup) once max_depth ancestors are requested.
Flips test_n1_fill_chain_has_no_depth_cap to a passing regression.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: N1 close-out (docs) + open PR

**Files:**
- Modify: `docs/superpowers/audits/2026-06-01-network-p2p-audit.md`
- Modify: `CLAUDE.md`
- Modify: `docs/superpowers/ROADMAP.md`

- [ ] **Step 1: Audit report**

In `docs/superpowers/audits/2026-06-01-network-p2p-audit.md`:
- Executive-summary headline: change `0 Critical / 0 High → 1 High / 2 Medium / 1 Low` to **`0 Critical / 0 High / 2 Medium / 1 Low`** and adjust the surrounding sentence (N1 is now remediated, not open).
- Findings table, N1 row: change Status `⏳ open (xfail)` to **`✅ remediated`**.
- The N1 trace (under "Resource-exhaustion peer" / category 1): prepend `✅ Remediated. ` and append a note: `(As implemented: request_block verifies the returned block's hash equals the requested hash, and fill_chain caps its ancestor walk at MAX_CHAIN_FILL_DEPTH (default 50000), aborting with ChainFill cleanup when exceeded.)`
- Recommendations item 1: prepend `✅ (done) `.

- [ ] **Step 2: CLAUDE.md**

In the `Node`/networking architecture section, add a sentence: `fill_chain` bounds its backward ancestor walk at `MAX_CHAIN_FILL_DEPTH` (aborting + cleaning up the `ChainFill` when exceeded), and `request_block` verifies the returned block's hash equals the requested hash before staging it. In the `CC_*` config settings list (the "Key `CC_*` settings" paragraph), add `MAX_CHAIN_FILL_DEPTH` (env `CC_MAX_CHAIN_FILL_DEPTH`, default 50000 — caps a single `fill_chain` ancestor walk).

- [ ] **Step 3: Roadmap**

In `docs/superpowers/ROADMAP.md`, in the "Audit remediation — P2P/networking findings" section, change the N1 bullet from `⏳` to `✅ **N1 (High) — fill_chain unbounded ancestor walk** — closed by PR #<N>.` (fill the PR number after Step 5 opens the PR). Update the headline sentence if it states open-count.

- [ ] **Step 4: Commit + push + final gate**

```bash
uv run pytest -q 2>&1 | tail -2
uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy 2>&1 | tail -1
git add docs/superpowers/audits/2026-06-01-network-p2p-audit.md CLAUDE.md docs/superpowers/ROADMAP.md
git commit -m "docs(n1): close out N1 — audit 0/0/2/1, CLAUDE.md, roadmap

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin fix/n1-fill-chain-bounds
```

- [ ] **Step 5: Open the PR + fill the roadmap PR number**

```bash
gh pr create --base main --title "fix(n1): bound fill_chain against a hostile sync peer (audit N1, High)" --body "<summary: the two changes, the config field + default, the flipped demonstration + new hash-check regression, headline 0/1/2/1 -> 0/0/2/1, link to design spec>"
```
Then edit the roadmap N1 bullet to reference the actual PR number, commit, push.

- [ ] **Step 6: Internal review, then the single Copilot backstop**

Run the internal cross-model review (a different-model reviewer checking: the hash check is correct and doesn't break legit sync; the cap counter is placed so `request_block` is called exactly `max_depth` times before abort; the flipped test asserts the right thing; `current_app.config` access is safe given the field's default) to convergence BEFORE the PR's Copilot pass. Then address Copilot's single backstop. `mwg` once green.

---

## Self-review checklist (controller, before execution)

- **Spec coverage:** request_block hash check → Task 1 Step 5; config field → Task 1 Step 4; depth cap → Task 2 Step 2; `current_app` import → Task 2 Step 1; flip demonstration → Task 2 Step 3; new hash-check regression → Task 1 Step 2; audit/CLAUDE.md/roadmap → Task 3. ✓
- **Type consistency:** config key `MAX_CHAIN_FILL_DEPTH` (stripped, no `CC_`) used identically in config.py field name, `current_app.config['MAX_CHAIN_FILL_DEPTH']`, and the test's `app.config['MAX_CHAIN_FILL_DEPTH'] = 3`. ✓
- **No placeholders:** every code step has complete code; the only `<...>` are the PR body/number filled at PR-open time. ✓
- **Ordering:** config field lands in Task 1 (with the hash check) so the cap in Task 2 can read it. ✓

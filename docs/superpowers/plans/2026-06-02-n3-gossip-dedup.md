# N3 Remediation — Gate Transaction Re-Gossip — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate audit finding N3 (Medium) — `receive_transaction` gossips a txn only on the receipt that newly admits it to the pool (`if process and added`), so an already-pending txn is not re-gossiped.

**Architecture:** A one-condition change in `Node.receive_transaction` (gate the existing `send_transaction` on the `added` flag), mirroring the block path's gossip-only-newly-persisted. Plus the flipped N3 demonstration and a positive guard test.

**Tech Stack:** Python 3.12+, pytest, the `time_machine` fixture, a `SpyClient` test double.

**Authoritative design:** `docs/superpowers/specs/2026-06-02-n3-gossip-dedup-design.md`. Read it first.

---

## File structure

| File | Change |
|---|---|
| `src/cancelchain/node.py` | `receive_transaction`: `if process:` → `if process and added:` |
| `tests/test_network_audit.py` | Flip `test_n3_pending_txn_regossiped_on_every_receipt`; add `test_n3_new_txn_gossips_once` |
| `docs/superpowers/audits/2026-06-01-network-p2p-audit.md`, `CLAUDE.md`, `docs/superpowers/ROADMAP.md` | N3 close-out (Task 2) |

Branch: `fix/n3-gossip-dedup` (design spec already committed here).

---

## Task 1: Gate the gossip + tests

**Files:**
- Modify: `src/cancelchain/node.py` (`receive_transaction`)
- Test: `tests/test_network_audit.py`

- [ ] **Step 1: Branch + baseline**

```bash
cd /home/gumptionthomas/Development/cancelchain
git branch --show-current        # fix/n3-gossip-dedup
uv run pytest tests/test_network_audit.py -q 2>&1 | tail -1   # baseline: 5 passed, 2 xfailed
```
If branch/baseline differ, STOP and report.

- [ ] **Step 2: Add the positive guard test (new behavior — passes today AND after the fix)**

Append to `tests/test_network_audit.py` (the file imports `Miller`, `Transaction`, `Inflow`, `Outflow`, `encode_subject`, `now`, `datetime`):

```python
def test_n3_new_txn_gossips_once(app, time_machine, wallet) -> None:
    """N3 (positive guard): a genuinely-new txn still gossips exactly once on
    its first receipt — the re-gossip gate must not kill legitimate first
    propagation.
    """
    with app.app_context():
        time_machine.move_to(now() - datetime.timedelta(hours=1))
        m = Miller(milling_wallet=wallet)

        t = Transaction()
        t.add_inflow(Inflow(outflow_txid='0' * 64, outflow_idx=0))
        t.add_outflow(Outflow(amount=1, subject=encode_subject('subj-n3-pos')))
        t.set_wallet(wallet)
        t.seal()
        t.sign()

        # Spy wired BEFORE the first receipt, so it captures first-propagation.
        calls: list[str] = []
        peer = 'http://peer.host:8000'

        class SpyClient:
            host = peer

            def post_transaction(self, txn, visited_hosts=None):
                calls.append(txn.txid)

        m.peers = [peer]
        m.clients = {peer: SpyClient()}

        # First receipt of a NEW txn: admitted (added=True) -> gossips once.
        m.receive_transaction(t.txid, t.to_json())
        assert t in m.pending_txns
        assert calls == [t.txid]
```
(This test passes both before and after the fix — a new txn always gossips once. It is a guard against the Step 4 change over-gating.)

- [ ] **Step 3: Run the new positive test — verify it PASSES now**

```bash
uv run pytest tests/test_network_audit.py::test_n3_new_txn_gossips_once -q 2>&1 | tail -3
```
Expected: PASS (first receipt of a new txn gossips once, both before and after the fix).

- [ ] **Step 4: Flip the demonstration test**

In `tests/test_network_audit.py`, remove the `@pytest.mark.xfail(strict=True, reason=(...))` decorator block from `test_n3_pending_txn_regossiped_on_every_receipt` (keep the function and body unchanged — it already asserts `calls == []` for the second receipt). Past-tense the docstring (the gate now exists; an already-pending txn is not re-gossiped).

- [ ] **Step 5: Run the flipped test — verify it FAILS (gate not implemented yet)**

```bash
uv run pytest tests/test_network_audit.py::test_n3_pending_txn_regossiped_on_every_receipt -q 2>&1 | tail -6
```
Expected: FAIL — `assert ['<txid>'] == []` (the second receipt still gossips unconditionally today). Removing the xfail makes it fail loudly — the TDD red for this task.

- [ ] **Step 6: Implement the gate**

In `src/cancelchain/node.py`, in `receive_transaction`, change:

```python
        if process:
            self.send_transaction(txn, visited_hosts=visited_hosts)
```

to:

```python
        if process and added:
            self.send_transaction(txn, visited_hosts=visited_hosts)
```

(The `added` flag is set True only inside the `if txn not in self.pending_txns:` admission block. No other change.)

- [ ] **Step 7: Run both N3 tests — verify they PASS**

```bash
uv run pytest tests/test_network_audit.py -k test_n3 -q 2>&1 | tail -3
```
Expected: 2 passed (the flipped demonstration + the positive guard).

- [ ] **Step 8: Full suite + lint**

```bash
uv run pytest tests/test_network_audit.py -q 2>&1 | tail -3   # 7 passed, 1 xfailed (only N4)
uv run pytest --runxfail tests/test_network_audit.py -q 2>&1 | tail -3   # only N4 fails
uv run pytest -q 2>&1 | tail -2          # full suite green
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy 2>&1 | tail -1
```
Run `uv run ruff format src tests` if format asks. Investigate any failure — in particular, confirm no test relied on a re-receipt re-gossiping (the gossip behavior for genuinely-new txns is unchanged; only re-receipts stop gossiping). Existing peer-gossip tests in `test_miller.py`/`test_api.py` exercise first-propagation, which is unaffected.

- [ ] **Step 9: Commit**

```bash
git add src/cancelchain/node.py tests/test_network_audit.py
git commit -m "$(cat <<'EOF'
fix(n3): gossip a txn only on the receipt that newly admits it

receive_transaction now gates send_transaction on `added` (if process and
added), mirroring the block path's gossip-only-newly-persisted. An
already-pending txn re-POSTed is no longer fanned out to all peers (1->N
amplification closed). A genuinely-new txn still gossips exactly once.
Flips test_n3_pending_txn_regossiped_on_every_receipt + adds a positive guard.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: N3 close-out (docs) + open PR

**Files:**
- Modify: `docs/superpowers/audits/2026-06-01-network-p2p-audit.md`, `CLAUDE.md`, `docs/superpowers/ROADMAP.md`

- [ ] **Step 1: Audit report**

In `docs/superpowers/audits/2026-06-01-network-p2p-audit.md` (read each section first):
- Executive-summary headline: change `0 Critical / 0 High / 1 Medium / 1 Low` to **`0 Critical / 0 High / 0 Medium / 1 Low`** and adjust the surrounding sentence (N3 now remediated; only N4 Low remains).
- Findings table, N3 row: Status `⏳ open (xfail)` → **`✅ remediated`**.
- The N3 trace (under "### 3. Gossip-loop / amplification abuser", the `**N3 (Medium) — ...**` bullet): prepend `✅ Remediated. ` and append: `(As implemented: receive_transaction gates send_transaction on the newly-added flag — if process and added — so an already-pending txn is no longer re-gossiped, mirroring the block path's gossip-only-newly-persisted. A genuinely-new txn still gossips once on first receipt.)`
- Recommendations item 3 (the gossip-dedup recommendation): prepend `✅ (done) `.
- Cross-cutting observation 4 (block-path vs txn-path asymmetry): append a sentence noting the txn path now matches the block path's dedup-before-gossip (N3 closed); the fill_chain/fill_peer note in that observation is already addressed by N1.

- [ ] **Step 2: CLAUDE.md**

In the `### Network coordination: `Node` and `Miller`` section, in the `receive_transaction`/`send_transaction` gossip description (the bullet listing `receive_transaction` / `receive_block`), note that `receive_transaction` gossips a txn only on the receipt that newly admits it to the pool (mirroring `process_block`/`send_block`), so an already-pending txn is not re-gossiped. Read the section first and integrate naturally.

- [ ] **Step 3: Roadmap**

In `docs/superpowers/ROADMAP.md`, "## Audit remediation — P2P/networking findings": change the N3 bullet's `⏳` to `✅` and append ` Closed by PR #PRNUM.` (literal placeholder; filled after the PR opens). Update the section intro (currently "N1 and N2 are closed; N3–N4 remain open.") to "N1–N3 are closed; only N4 (Low) remains open."

- [ ] **Step 4: Gates + commit + push + PR**

```bash
uv run pytest -q 2>&1 | tail -2
uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy 2>&1 | tail -1
git add docs/superpowers/audits/2026-06-01-network-p2p-audit.md CLAUDE.md docs/superpowers/ROADMAP.md
git commit -m "docs(n3): close out N3 — audit 0/0/0/1, CLAUDE.md, roadmap

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push -u origin fix/n3-gossip-dedup
gh pr create --base main --title "fix(n3): gossip a txn only on the receipt that newly admits it (audit N3, Medium)" --body "<summary: if process and added gate, mirrors block path, closes 1->N re-gossip amplification, flipped demonstration + positive guard, headline 0/0/1/1 -> 0/0/0/1, link to design spec>"
```
Then edit the roadmap N3 bullet to the real PR number, commit, push.

- [ ] **Step 5: Internal review, then the single Copilot backstop**

Run the internal cross-model review (a different-model reviewer checking: the gate is on `added` and placed correctly; no legitimate first-propagation path is broken; the async path was already gated; the flipped test passes only with the gate and the positive guard passes both before/after; no other caller relied on re-receipt re-gossip) to convergence BEFORE the PR's Copilot pass. Then address Copilot's single backstop. `mwg` once green.

---

## Self-review checklist (controller, before execution)

- **Spec coverage:** the gate → T1S6; flip demonstration → T1S4; positive guard → T1S2; audit/CLAUDE.md/roadmap → T2. ✓
- **TDD ordering:** positive guard (passes today, guards the change) added first; then flip the demonstration to red; then implement; both green. ✓
- **No placeholders:** complete code in every step; only the PR body/number filled at PR time. ✓
- **Consistency:** the change is `if process:` → `if process and added:`; `added` is the existing flag in `receive_transaction`; no new symbols. ✓

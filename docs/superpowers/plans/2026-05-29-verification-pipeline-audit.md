# Verification pipeline threat-modeled audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the threat-modeled audit specified in `docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md` — produce a findings report at `docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md` and a `tests/test_verification_audit.py` test module with one `@pytest.mark.xfail(strict=True)` test per confirmed gap, across all 7 adversary categories.

**Architecture:** Single impl PR. The audit is fundamentally an exploratory exercise — per-adversary tasks trace attacks through the existing validation code, document the trace (positive or negative), and write demonstration tests for any gaps found. Per-adversary tasks are independent and can run in any order. The synthesis tasks (Executive summary, Findings table, Cross-cutting observations, Recommendations) come last, after all per-adversary findings exist.

**Tech Stack:** Python 3.12 + pytest (existing). `@pytest.mark.xfail(strict=True)` is the load-bearing test marker — when remediation lands and the test starts passing, strict mode triggers a CI failure forcing the marker's removal. The companion design spec is `docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md`.

---

## Prerequisites

- Working directory: the cancelchain repo root. Run all commands from there.
- `uv --version` 0.4.x or newer; `gh --version` works and `gh auth status` shows authenticated.
- Phase 8 merged. Verify with `git log --oneline -3 main` showing `32b6b7d feat(migrations): Flask-Migrate (Alembic) schema migration framework (#81)` near the top.
- The branch `docs/verification-audit-design` exists locally with one commit:
  - `200fde9 docs(audit): add verification pipeline threat-modeled audit design spec`
  This plan adds a second commit on that branch (the plan file itself) and ships both as the docs PR.
- CI hard-gates (per `.github/workflows/tests.yml`): `ruff check`, `ruff format --check`, `pytest`, `mypy`, and `cancelchain db upgrade` + `cancelchain db check`.
- Test baseline: **236 passed, 1 skipped**. After the audit, expect `236 passed, N xfailed, 1 skipped` where N is the number of confirmed gaps (estimated 5-20 based on the spec).
- Each PR ends with `wor` (Copilot review wait + reply) and `mwg` (merge when green); the controller handles those, not the implementer subagent. Copilot auto-review is enabled in this repo (per `project_copilot_auto_rereview`) — no manual "Re-request review" click needed.
- Never push directly to `main`.

---

## File Map

| Task | PR | Files |
|---|---|---|
| 1 | docs PR | `docs/superpowers/plans/2026-05-29-verification-pipeline-audit.md` (this file) + spec already on branch |
| 2 | impl PR | NEW `docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md`, NEW `tests/test_verification_audit.py` |
| 3 | acceptance | none (verification only) |

The impl PR creates exactly two new files. No existing files are modified. The `docs/superpowers/audits/` directory does not exist yet; creating the audit doc inside it also creates the directory.

---

## Task 1: Ship the docs PR (spec + plan)

**Files:** The design spec is committed on `docs/verification-audit-design` (`200fde9`). This task adds the implementation plan as a second commit and ships both as one docs PR.

- [ ] **Step 1: Confirm branch state**

```bash
git rev-parse --abbrev-ref HEAD
git ls-files docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md
git rev-list --count main..HEAD
```

Expected: branch is `docs/verification-audit-design`; spec file is tracked; commit count above main is `1`.

- [ ] **Step 2: Verify the plan file is present and untracked**

```bash
ls -la docs/superpowers/plans/2026-05-29-verification-pipeline-audit.md
git status docs/superpowers/plans/
```

Expected: file exists; shows as untracked.

- [ ] **Step 3: Stage and commit**

```bash
git add docs/superpowers/plans/2026-05-29-verification-pipeline-audit.md
git commit -m "$(cat <<'EOF'
docs(audit): add verification pipeline audit implementation plan

Plan executes the threat-modeled audit specified in
2026-05-29-verification-pipeline-audit-design.md. Single impl PR
with per-adversary deep-dive tasks (7 adversaries × 3-7 attacks
each), an audit infrastructure bootstrap task, a synthesis task
(cross-cutting observations + recommendations + executive
summary), and PR-open + acceptance tasks. Tests use
@pytest.mark.xfail(strict=True) so unexpectedly-passing tests
force engagement during remediation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 4: Push**

```bash
git push -u origin docs/verification-audit-design
```

- [ ] **Step 5: Open the docs PR**

```bash
gh pr create --base main --head docs/verification-audit-design --title "docs(audit): verification pipeline audit design + plan" --body "$(cat <<'EOF'
## Summary
- Adds the verification pipeline audit design spec (\`docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md\`).
- Adds the verification pipeline audit implementation plan (\`docs/superpowers/plans/2026-05-29-verification-pipeline-audit.md\`).
- No code changes.

A threat-modeled security audit of the cancelchain block/chain/transaction verification pipeline. Defines 7 adversary categories (external transactor, hostile peer, malicious miller, replay attacker, reorg attacker, race/concurrency attacker, genesis/edge-case attacker), enumerates ~30-40 attack attempts, traces each through the existing 16 \`validate_*\` methods + their callers, and produces a findings report at \`docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md\` plus a \`tests/test_verification_audit.py\` module containing one \`@pytest.mark.xfail(strict=True)\` test per confirmed gap. Remediation of individual findings is out of scope — each finding becomes a downstream PR.

## Test plan
- [x] Spec self-review passed.
- [x] Plan self-review passed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Stop — controller handles wor + mwg + sync**

---

## Task 2: Audit infrastructure bootstrap (impl PR)

**Files:**
- Create: `docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md` (skeleton with all section headers + placeholders)
- Create: `tests/test_verification_audit.py` (imports + module docstring)

This task creates the structure that the per-adversary tasks will populate. After this task, the audit doc has the right sections (some empty), and the test module exists and runs (zero tests, so no impact on pytest output yet).

### Step 1: Branch off main + baseline gates

```bash
git checkout main && git pull --ff-only
git checkout -b feat/verification-audit
git log --oneline -1
```

Expected: top commit is `8c95a5a docs(phase-8): Phase 8 Flask-Migrate (Alembic) integration design + plan (#80)` or later (whatever's on main after the audit docs PR merges).

Confirm baseline gates are green BEFORE any edit:

```bash
uv run mypy
uv run ruff check src tests
uv run pytest 2>&1 | tail -3
```

Expected: mypy clean; ruff clean; pytest `236 passed, 1 skipped`.

### Step 2: Create the audit doc skeleton

Create `docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md` with this content (the directory `docs/superpowers/audits/` does not yet exist; creating the file also creates the directory):

````markdown
# Cancelchain verification pipeline threat-modeled audit

**Date:** 2026-05-29
**Methodology spec:** `docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md`
**Demonstration tests:** `tests/test_verification_audit.py`

## Executive summary

[Placeholder — filled in by Task 10 after all per-adversary tasks complete.]

## Threat model

The audit considers 7 adversary categories. Each is defined by capabilities (what the adversary can do, including authentication state) and goals (what they would attempt). Capabilities are stated; the audit assumes authentication is correctly implemented (auth-layer flaws are out of scope per the spec's Non-goals — they get their own audit pass).

[The 7 adversary descriptions are restated below in Section 5 alongside their traces.]

## Methodology

For each attack attempt:

1. **Pre-state:** what's true about the chain when the attack begins.
2. **Attack:** the exact API call or gossip message the attacker sends.
3. **Trace:** which validation methods get called, in what order, what they check.
4. **Outcome:** REJECTED at step N (no finding) or ACCEPTED (gap — finding produced).
5. **Finding (if gap):** severity (Critical/High/Medium/Low) + one-line remediation sketch.
6. **Demonstration test (if gap):** a `@pytest.mark.xfail(strict=True)` test in `tests/test_verification_audit.py`.

Findings are ID'd as `A<N>.<letter>` where `N` is the adversary number (1-7) and `letter` is the attack within that adversary's enumeration. E.g., `A3.b` = adversary 3 (malicious miller), attack b.

## Findings table

[Placeholder — built by Task 10 as a cross-cutting summary of every finding produced by per-adversary tasks.]

| ID | Severity | Description | Remediation sketch | Test |
|---|---|---|---|---|

## Per-adversary traces

### Adversary 1: External attacker with valid TRANSACTOR role

[Placeholder — filled in by Task 3.]

### Adversary 2: Hostile peer over gossip

[Placeholder — filled in by Task 4.]

### Adversary 3: Malicious miller (MILLER role)

[Placeholder — filled in by Task 5.]

### Adversary 4: Replay attacker

[Placeholder — filled in by Task 6.]

### Adversary 5: Reorg attacker

[Placeholder — filled in by Task 7.]

### Adversary 6: Race / concurrency attacker

[Placeholder — filled in by Task 8.]

### Adversary 7: Genesis / edge-case attacker

[Placeholder — filled in by Task 9.]

## Cross-cutting observations

[Placeholder — filled in by Task 10. Patterns that span multiple adversaries: validation order inconsistencies between API entry and gossip receive; recurring near-misses that suggest a structural issue; etc.]

## Recommendations

[Placeholder — filled in by Task 10. Prioritized remediation ordering, dependencies between findings, suggestion of severity grouping into remediation PRs.]
````

Verify:

```bash
ls -la docs/superpowers/audits/
grep -c '^## ' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
grep -c '^### Adversary' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
```

Expected: directory exists with one file; `^## ` matches 8 (Executive summary, Threat model, Methodology, Findings table, Per-adversary traces, Cross-cutting observations, Recommendations + the title); `^### Adversary` matches 7.

### Step 3: Create the test module skeleton

Create `tests/test_verification_audit.py`:

```python
"""Demonstration tests for the verification pipeline threat-modeled audit.

Each test in this module corresponds to one finding in
docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
and is marked @pytest.mark.xfail(strict=True). The xfail demonstrates that
the documented gap exists today; strict=True means that if the test starts
unexpectedly passing (because remediation has been applied), CI fails,
forcing the remediation PR to remove the marker.

To verify each xfail genuinely demonstrates a gap (rather than failing for
an unrelated reason), run:

    uv run pytest --runxfail tests/test_verification_audit.py

That runs the xfail tests as if they were unmarked, surfacing the actual
failure mode.

Finding IDs are referenced in each test's docstring and xfail reason string
in the form A<N>.<letter> matching the audit document's per-adversary
sections.
"""
```

The module starts empty (just the docstring). Per-adversary tasks will append tests.

Verify:

```bash
ls tests/test_verification_audit.py
uv run pytest tests/test_verification_audit.py 2>&1 | tail -3
```

Expected: file exists; pytest reports `no tests ran` (empty module).

### Step 4: Verify the existing test suite still passes

```bash
uv run pytest 2>&1 | tail -3
```

Expected: `236 passed, 1 skipped` (unchanged — the empty new module adds zero tests).

### Step 5: Verify other gates

```bash
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy
```

All three exit 0. The new test module has only a docstring; ruff and mypy have nothing to complain about.

### Step 6: Commit

```bash
git add docs/superpowers/audits/ tests/test_verification_audit.py
git commit -m "$(cat <<'EOF'
audit(infra): bootstrap audit doc + test module skeletons

Creates docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
with all section headers + placeholders for per-adversary content,
and tests/test_verification_audit.py with imports + module docstring
explaining the xfail(strict=True) pattern.

Subsequent tasks populate per-adversary sections (Tasks 3-9) and
synthesize the Executive summary + Findings table + Cross-cutting
observations + Recommendations (Task 10).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Per-adversary tasks (Tasks 3-9) — shared structure

All 7 per-adversary tasks follow the same shape. Each task:

1. Reads the relevant source files for that adversary's attacks (file paths are listed in each task's Files section).
2. For each attack attempt enumerated in the spec for that adversary:
   - Construct the trace (read each validation method in the call path; document what it checks).
   - Determine: does the attack succeed (gap) or get correctly rejected?
   - If rejected: document the trace in the audit doc under that adversary's section, citing the validation method that rejects.
   - If gap: write a finding entry (ID, severity, remediation sketch) AND a demonstration test in `tests/test_verification_audit.py`.
3. Run the test suite to verify the new tests behave correctly (xfail tests show as XFAIL, others continue to pass).
4. Commit.

**Severity rubric** (from spec):

| Severity | Definition |
|---|---|
| Critical | Chain-correctness existential. An invalid block/txn can be persisted, OR value-conservation invariant is violated. |
| High | Significant invariant violation with bounded blast radius. |
| Medium | Edge case that misbehaves but recovers, OR requires adversary capabilities at the upper bound of plausibility. |
| Low | Cosmetic / documentation / theoretical. Technically incorrect but practically harmless. |

**Audit doc per-adversary section template** (paste this structure for each adversary; fill in per-attack details):

````markdown
### Adversary N: <Name>

**Capabilities:** <verbatim from spec>

#### Attack a: <one-line description>

**Pre-state:** <chain/wallet state needed for the attack to be meaningful>

**Attack:** <concrete attack steps — API call, gossip message, exact bytes if relevant>

**Trace:**
1. `<file.py:line>` — `<method_name>` checks `<what>`. <outcome: continues / raises>
2. `<file.py:line>` — `<method_name>` checks `<what>`. <outcome>
3. ...

**Outcome:** REJECTED at step `<N>` via `<exception_class>` — OR — ACCEPTED (no rejection occurred; gap exists).

[If REJECTED:]
**Result:** Validation correctly rejects. No finding.

[If ACCEPTED — gap:]
**Finding A<N>.a — Severity <S>:** <one-line description of the gap>.
**Remediation sketch:** <one sentence pointing at where the fix would go — file, method, what to add>.
**Demonstration test:** `test_a<N>_<letter>_<short_name>` in `tests/test_verification_audit.py`.

#### Attack b: ...

[repeat for each attack]
````

**Test module entry template** (each finding appends one of these to `tests/test_verification_audit.py`):

```python
@pytest.mark.xfail(
    reason=(
        'Audit finding A<N>.<letter> — severity <S> — <description>. '
        'See docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md'
    ),
    strict=True,
)
def test_a<N>_<letter>_<short_name>(<fixtures>) -> None:
    """A<N>.<letter>: <one-line description>.

    Pre-state: <setup summary>.
    Attack: <action summary>.
    Expected after remediation: validation raises <ExpectedException>.
    Observed today: validation does not raise; <state-after-attack>.
    """
    with app.app_context():
        # Set up the pre-state.
        ...
        # Attempt the attack.
        # When the finding is fixed, this will raise. Today it does not,
        # which is what the xfail marker expresses.
        with pytest.raises(<ExpectedException>, match=r'<expected_message>'):
            <attack_action>
```

**Imports** (add to `tests/test_verification_audit.py` as each test needs them — let ruff sort them; the test module's import block grows organically):

```python
import pytest

from cancelchain.block import Block
from cancelchain.chain import Chain
from cancelchain.exceptions import (
    InvalidBlockError,
    InvalidTransactionError,
    # ...add specific exception classes as tests reference them
)
from cancelchain.transaction import Transaction
# ...add specific fixtures from tests/conftest.py as the test signature needs them
```

**Available test fixtures** (from `tests/conftest.py`, already set up):

- `app` — Flask app with temporary SQLite DB, wallets pre-loaded into `app.wallets`.
- `READER_WALLET`, `TRANSACTOR_WALLET`, `MILLER_WALLET`, `MILLER_2_WALLET` — pre-created `Wallet` instances with matching `*_ADDRESSES` config.
- `wallet` — alias for `TRANSACTOR_WALLET` in many tests.
- `time_stepper(start=...)` — generator returning incrementing datetimes for chain-of-blocks construction.
- `add_chain_block(chain=None, txns=None, wallet=...)` — fixture that adds a milled block to a chain.
- `mill_block(wallet)` — adds a block via the miller to the current longest chain.

Use these fixtures rather than reimplementing setup. Each attack test should fit in 20-50 lines including pre-state setup.

**When in doubt, write the trace pessimistically.** If the trace doesn't show clear rejection but you're unsure whether real-world behavior catches the attack, write the demonstration test and let it tell you. `pytest --runxfail tests/test_verification_audit.py::test_a<N>_<letter>` runs the test in non-xfail mode — if it passes, the validation actually catches the attack and the finding is a false positive (remove the finding from the audit doc, move the trace to "correctly rejected", delete the test). If it fails, the gap is real.

---

## Task 3: Adversary 1 — External attacker with valid TRANSACTOR role

**Adversary description (verbatim from spec):**

> **Capabilities:** Has a wallet address that matches a `CC_TRANSACTOR_ADDRESSES` regex. Can authenticate. Can submit transactions via the `/api/transaction` POST endpoint. Knows their own wallet's private key. Does NOT have MILLER privileges (can't submit blocks directly), can submit txns that millers may include.

**Attacks to trace (7):**

- **a.** Double-spend their own outflow (consume the same UTXO in two separate transactions in the pending pool, hoping both get into different blocks).
- **b.** Inflate value (submit a transaction where total inflow value > total outflow value, or outflow > inflow).
- **c.** Smuggle malformed payload past schema validation (oversized subject string, non-base64 signature, etc.).
- **d.** Exploit forgive/support asymmetry — `forgive` is supposed to rescind opposition (`subject`), but only the original opposer can rescind. Test: can a different address forgive someone else's opposition?
- **e.** Submit a transaction with `inflow` referencing an outflow that doesn't exist, doesn't belong to them, or was already spent.
- **f.** Replay a previously-mined transaction (same txid) into the pending pool.
- **g.** Submit a transaction with a future or past timestamp outside the acceptable window.

**Files to read:**
- `src/cancelchain/api.py` — POST `/api/transaction` handler (look for the `Role.TRANSACTOR` decorated route)
- `src/cancelchain/schema.py` — Pydantic schemas for Transaction
- `src/cancelchain/transaction.py` — `Transaction.validate*` methods
- `src/cancelchain/payload.py` — Inflow/Outflow validation, subject/forgive/support rules
- `src/cancelchain/chain.py` — `Chain.validate_block_txn`, `Chain.validate_txn_inflow`
- `src/cancelchain/wallet.py` — `Wallet.validate_signature`

- [ ] **Step 1: Read the validation surface for each attack a-g**

Trace each attack through the validation pipeline (API entry → schema → domain object → chain context). Document the trace as you go.

- [ ] **Step 2: Populate Adversary 1's section in the audit doc**

Open `docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md`. Find the line `### Adversary 1: External attacker with valid TRANSACTOR role` (currently followed by a placeholder).

Replace the placeholder with the full per-attack content per the template above. For each attack a-g, document:
- Pre-state
- Attack steps
- Trace (validation methods in call order, with file:line citations from the code you just read)
- Outcome (REJECTED at step N — or ACCEPTED with gap)
- For gaps: Finding entry + Demonstration test name

- [ ] **Step 3: For each gap found, add a demonstration test to `tests/test_verification_audit.py`**

Append (don't replace) test functions per the template above. Use `app`, `wallet`, `TRANSACTOR_WALLET` etc. fixtures from `tests/conftest.py`. Each test should:
- Set up the pre-state
- Attempt the attack via the appropriate domain object call (`Chain.validate_block_txn`, `Transaction.validate`, `Node.receive_transaction`, etc.)
- Use `with pytest.raises(<ExpectedException>)` for the assertion (the test "expects" the validation to raise; xfail says "today, the raise doesn't happen")

If no gaps were found for any of the 7 attacks for this adversary, the test module doesn't grow for this task (only the audit doc grows). That's acceptable — the audit doc's positive evidence ("correctly rejected at `transaction.py:218` via `InvalidSignatureError`") is still valuable.

- [ ] **Step 4: Run pytest, verify xfails show up correctly**

```bash
uv run pytest tests/test_verification_audit.py 2>&1 | tail -5
```

Expected: `N xfailed` where N = number of demonstration tests added in this task (0 if no gaps, otherwise 1+ per finding). NOT `N failed` — if you see `failed`, either (a) a test is missing the `@pytest.mark.xfail` decorator, or (b) the test raises an unexpected exception type (the `pytest.raises` predicate isn't matching what actually happens).

If `failed`: read the failure output, decide whether the test's `pytest.raises` clause matches reality. If the validation today raises a DIFFERENT exception than what you wrote, update the test's expected exception. The xfail says "we expect remediation to make this raise"; today it might raise something different (e.g., a generic `Exception` instead of `InvalidSignatureError`), and the test's `pytest.raises` needs to be broad enough to capture today's behavior while still expressing the desired final behavior.

- [ ] **Step 5: Verify the existing test suite still passes**

```bash
uv run pytest 2>&1 | tail -3
```

Expected: `236 passed, N xfailed, 1 skipped` where N is the audit module's test count.

- [ ] **Step 6: Verify gates**

```bash
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy
```

All three exit 0. If `ruff format --check` reports a diff in `tests/test_verification_audit.py`, run `uv run ruff format tests/test_verification_audit.py` to apply the formatting.

- [ ] **Step 7: Commit**

```bash
git add docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md tests/test_verification_audit.py
git commit -m "$(cat <<'EOF'
audit(A1): external transactor — traces + findings for attacks a-g

7 attacks traced through the verification pipeline:
- a: double-spend their own outflow
- b: value inflation
- c: malformed payload past schema
- d: forgive/support asymmetry bypass
- e: invalid inflow reference
- f: txid replay into pending pool
- g: out-of-window timestamp

[Summarize per-attack outcomes: rejected at validator X, or
finding A1.<letter> at severity <S>. Adjust per actual results.]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

The commit message body should summarize what each attack did — list "rejected" vs "finding produced" for each. The implementer fills this in based on actual findings.

---

## Task 4: Adversary 2 — Hostile peer over gossip

**Adversary description:**

> **Capabilities:** Configured in our `CC_PEERS` list (presumed trusted-ish) but adversarial. Can send arbitrary HTTP requests to our `/api/block` and `/api/transaction` endpoints with valid peer credentials. Can craft blocks/txns with malformed content. Sees our public chain state.

**Attacks to trace (6):**
- **a.** Submit a block that fails one of `Block.validate*` but `Chain.validate_block` doesn't catch (cross-layer gap).
- **b.** Force expensive reorgs by submitting alternate-chain blocks with adjusted timestamps to pass the difficulty target.
- **c.** Inject malformed-but-deserializable JSON that breaks downstream code (negative `idx`, `prev_hash` collision attempt, MAX_TARGET edge case).
- **d.** Manipulate the ChainFill staging table (block arrives via `Node.fill_chain`, persists in `chain_fill`, but is never validated before apply).
- **e.** Send a chain whose tip is genuinely longer but whose intermediate blocks fail validation (partial chain accepted gap).
- **f.** Probe the validation order: send blocks that fail validation at a deep check to see if earlier persistence side-effects leak.

**Files to read:**
- `src/cancelchain/node.py` — `Node.receive_block`, `Node.fill_chain`, `Node.fill_peer`
- `src/cancelchain/api.py` — POST `/api/block` handler (`Role.MILLER` route — peers submit blocks here too)
- `src/cancelchain/block.py` — `Block.validate*` methods
- `src/cancelchain/chain.py` — `Chain.validate_block`, `Chain.add_block`, the `ChainFill` interactions
- `src/cancelchain/models.py` — `ChainFill`, `ChainFillBlock` DAOs

Steps 1-7 follow the same shape as Task 3 (read code, populate audit doc section, add xfail tests for gaps, verify pytest + gates, commit). Commit message:

```bash
git commit -m "$(cat <<'EOF'
audit(A2): hostile peer — traces + findings for attacks a-f

6 attacks traced through the gossip validation pipeline:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Adversary 3 — Malicious miller (MILLER role)

**Adversary description:**

> **Capabilities:** Solves and submits blocks. Authenticated as MILLER. Controls the coinbase address. Can choose which pending transactions to include. Can manipulate block timestamps and `proof_of_work`.

**Attacks to trace (7):**
- **a.** Include an invalid transaction in their block.
- **b.** Claim excess coinbase reward (output > REWARD).
- **c.** Censor specific subjects (refuse to include txns matching a pattern). NOTE: chain doesn't enforce inclusion fairness; confirm there's no enforcement to bypass.
- **d.** Embed contradictory inflows/outflows (two inflows consuming the same outflow within the same block).
- **e.** Manipulate timestamps to push the difficulty target up or down beyond the ±4× clamp.
- **f.** Submit a block with a valid proof_of_work but an invalid merkle root (header doesn't actually commit to the included transactions).
- **g.** Submit a block at the wrong difficulty for the current chain height.

**Files to read:**
- `src/cancelchain/miller.py` — what miller does when constructing blocks
- `src/cancelchain/block.py` — `Block.validate_difficulty`, `Block.validate_proof_of_work`, `Block.validate_merkle_root`, `Block.validate_coinbase`
- `src/cancelchain/chain.py` — `Chain.block_target` (difficulty retargeting), `Chain.validate_block_coinbase`
- `src/cancelchain/payload.py` — coinbase reward constant (`REWARD`)

Steps 1-7 same shape as Task 3. Commit:

```bash
git commit -m "$(cat <<'EOF'
audit(A3): malicious miller — traces + findings for attacks a-g

7 attacks traced through block-construction validation:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Adversary 4 — Replay attacker

**Adversary description:**

> **Capabilities:** Has seen previously-broadcast transactions (they're public). Has not necessarily solved any block. Has whatever roles are useful for resubmission (often TRANSACTOR is enough).

**Attacks to trace (4):**
- **a.** Resubmit a confirmed transaction (already in some block) into the pending pool — does anything in `Node.receive_transaction` reject duplicates?
- **b.** Resubmit the same transaction into a competing chain fork.
- **c.** Replay a coinbase transaction specifically.
- **d.** Submit the same outflow consumption (inflow) in two transactions across two different chains — the gold-standard reorg double-spend.

**Files to read:**
- `src/cancelchain/node.py` — `Node.receive_transaction`
- `src/cancelchain/api.py` — POST `/api/transaction` handler
- `src/cancelchain/chain.py` — txid uniqueness checks (look in `Chain.validate_block_txn`, `Chain.get_transaction`)
- `src/cancelchain/models.py` — `TransactionDAO` (look for unique constraint on `txid`)

Steps 1-7 same shape. Commit:

```bash
git commit -m "$(cat <<'EOF'
audit(A4): replay attacker — traces + findings for attacks a-d

4 attacks traced through txid/inflow uniqueness checks:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Adversary 5 — Reorg attacker

**Adversary description:**

> **Capabilities:** Causes chain reorganizations either via hash power or via timing manipulation.

**Attacks to trace (4):**
- **a.** Invalidate previously-confirmed transactions by displacing them into a stale branch. Can the stale-side transaction be re-spent on the new branch?
- **b.** Double-spend across the reorg boundary.
- **c.** Exploit the gap between `ChainFill` staging and apply.
- **d.** Manipulate `_is_longest` cache (correctness aspect only — the cache-design follow-up is a known Phase 6.5 risk, but the audit should still ask "if the cache returns stale True, does anything bad happen at the validation layer?").

**Files to read:**
- `src/cancelchain/chain.py` — `_is_longest`, the chain-walk methods
- `src/cancelchain/node.py` — `fill_chain`, `fill_peer`, the smart-reorg logic
- `src/cancelchain/models.py` — `LongestChainBlockDAO`, `ChainFill`, `ChainFillBlock` interactions
- The Phase 6.5/6.6 specs (for context on what was already analyzed)

Steps 1-7 same shape. Commit:

```bash
git commit -m "$(cat <<'EOF'
audit(A5): reorg attacker — traces + findings for attacks a-d

4 attacks traced through reorg + chain-fill paths:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Adversary 6 — Race / concurrency attacker

**Adversary description:**

> **Capabilities:** Coordinates the timing of multiple submissions to exploit windows between validation and persistence.

**Attacks to trace (4):**
- **a.** TOCTOU: submit two conflicting transactions within the validation-to-commit window of the first.
- **b.** Pending pool race: two miller processes both pull the same pending txn.
- **c.** Block-submission race: two valid blocks at the same height arrive simultaneously.
- **d.** ChainFill race: simultaneous `fill_chain` calls for overlapping ancestry ranges.

**Files to read:**
- `src/cancelchain/chain.py` — `Chain.validate_block_txn`, the validate-then-add flow in `Chain.add_block`
- `src/cancelchain/node.py` — `Node.receive_block`, `Node.receive_transaction`, `Node.fill_chain`
- `src/cancelchain/miller.py` — `Miller.create_block` (pulls from pending pool)
- `src/cancelchain/models.py` — `PendingTxnDAO`, transaction-level concurrency primitives

Concurrency attacks may be harder to demonstrate as deterministic xfail tests. If a finding requires actual concurrency (threading/multiprocessing) to demonstrate, document it as a finding in the audit doc but skip the demonstration test (or write a test that uses `multiprocessing` to construct the race — acceptable but slower). Mark such tests with both `@pytest.mark.xfail` AND `@pytest.mark.multi` (per the existing `--runmulti` gate pattern) so they're skipped by default and explicitly opted into.

Steps 1-7 same shape. Commit:

```bash
git commit -m "$(cat <<'EOF'
audit(A6): race/concurrency attacker — traces + findings for attacks a-d

4 attacks traced through TOCTOU + concurrent-modification windows:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Adversary 7 — Genesis / edge-case attacker

**Adversary description:**

> **Capabilities:** Anything legitimate. Targets the special-case code paths that are likely under-tested.

**Attacks to trace (10):**
- **a.** Empty block (no transactions, just coinbase).
- **b.** First block of the chain (no `prev_hash`).
- **c.** Block with exactly `MAX_TRANSACTIONS` (= 100) transactions.
- **d.** Transaction with exactly the boundary subject length (1 char, 79 chars).
- **e.** Just-expired transaction (timestamp exactly `TXN_TIMEOUT` ago).
- **f.** Transaction with empty inflow list (legal? must be a coinbase?).
- **g.** Block with proof_of_work = 0 or just under the target threshold by 1 hash.
- **h.** Subject string with non-printable UTF-8 (1-79 chars but garbage).
- **i.** Chain with one block (no parent to validate).
- **j.** Reorg with zero common ancestor (genuinely disjoint chains).

**Files to read:**
- `src/cancelchain/block.py` — all `Block.validate*` (these handle boundary conditions)
- `src/cancelchain/chain.py` — first-block / single-block code paths
- `src/cancelchain/payload.py` — `validate_subject` (length + content rules), `validate_raw_subject`
- `src/cancelchain/transaction.py` — coinbase vs normal txn distinction (empty inflow case)
- `src/cancelchain/schema.py` — `validate_address_format`, `validate_timestamp` (boundary)

This is the largest adversary by attack count. Pace yourself — each attack is small but there are 10 of them.

Steps 1-7 same shape. Commit:

```bash
git commit -m "$(cat <<'EOF'
audit(A7): genesis/edge-case attacker — traces + findings for attacks a-j

10 attacks traced through boundary / special-case validation paths:
[per-attack summary]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Synthesis (Executive summary + Findings table + Cross-cutting + Recommendations)

After all 7 per-adversary tasks complete, the per-adversary sections of the audit doc are populated and the test module has N xfail tests (one per finding). This task synthesizes the cross-cutting content.

- [ ] **Step 1: Build the Findings table**

Read every finding produced by Tasks 3-9 (search the audit doc for `**Finding A`). For each, populate one row in the Findings table at the top of the audit doc:

```markdown
| ID | Severity | Description | Remediation sketch | Test |
|---|---|---|---|---|
| A1.a | High | Double-spend across pending pool reordering | `Chain.validate_block_txn` should re-check at commit time | `test_a1_a_pending_pool_double_spend` |
| A1.c | Medium | Schema accepts 80-char subject (rule says 1-79) | `validate_subject` upper bound is exclusive but should be inclusive | `test_a1_c_oversized_subject` |
| ... | ... | ... | ... | ... |
```

Sort rows by severity (Critical → Low) then by ID within each severity.

- [ ] **Step 2: Write Cross-cutting observations**

Replace the `Cross-cutting observations` section's placeholder with patterns you noticed across multiple adversaries. Examples of what to look for:

- **Validation order inconsistency** — does API entry validation differ from gossip-receive validation? E.g., does `Node.receive_block` skip a check that `POST /api/block` performs?
- **Cross-layer assumptions** — does layer N assume layer N-1 already checked X? Document if that assumption is sometimes violated.
- **Granularity of error messages** — are the 36 exception classes used consistently, or do some validation paths raise generic `Exception` when they should raise a specific subclass?
- **TOCTOU clusters** — multiple findings from Adversary 6 all root in the same validate-then-persist gap? Note that pattern.
- **Forgive/Support asymmetry surface area** — anything about these asymmetric token types that surfaced repeatedly?

Each observation should be 1-3 paragraphs. Cite specific findings by ID. If you noticed nothing cross-cutting (e.g., all findings are independent), write a one-paragraph acknowledgement of that — it's still useful negative evidence.

- [ ] **Step 3: Write Recommendations**

Replace the `Recommendations` section's placeholder with prioritized remediation guidance:

- **Critical findings first** — list each Critical finding with its remediation sketch.
- **High findings next, grouped by pattern** — if 3 High findings share a remediation pattern, suggest a single PR fixing all 3.
- **Dependencies between findings** — if fixing A2.c naturally also addresses A4.b, note that.
- **Medium / Low findings** — list briefly with a suggestion (defer / opportunistic / batch).
- **No-finding observations** — if Adversary X turned up zero findings, briefly note what was checked and why no issues were found (positive evidence).

Keep this section actionable. The reader of this section is a future PR author who needs to know which finding to fix first and which fixes go together.

- [ ] **Step 4: Write the Executive summary**

Replace the `Executive summary` placeholder with a short (200-400 word) summary covering:

- Total findings count, broken down by severity.
- Headline conclusions — does the verification pipeline pass the audit overall? Are there systemic issues, or just isolated gaps?
- The single most important finding (highest severity, or highest exploitability) — pull-quote it here so a reader who reads nothing else gets that one.
- Cross-cutting patterns (briefly — the full discussion is in the Cross-cutting observations section).
- Recommended next action (link to the Recommendations section).

This is the section a busy reader will read; the rest of the doc supports it.

- [ ] **Step 5: Verify the audit doc passes its acceptance checks**

```bash
grep -c '^## ' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
grep -c '^### Adversary' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
grep -c '^| A[1-7]\.' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
```

Expected: `^## ` matches 8 (title + 7 main sections); `^### Adversary` matches 7; `^| A[1-7]\.` matches N (the number of findings, equal to the number of tests in `tests/test_verification_audit.py`).

- [ ] **Step 6: Verify the test module + audit doc are in sync**

```bash
# Count findings in audit doc:
grep -c '^\*\*Finding A' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
# Count tests in test module:
grep -c '^def test_a' tests/test_verification_audit.py
```

Expected: same number. If they differ, the sync is broken — find the missing entry and fix it. The audit doc lists findings; each finding has a test; each test references its finding ID in the docstring + xfail reason.

- [ ] **Step 7: Verify gates one more time**

```bash
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy
uv run pytest 2>&1 | tail -3
```

Expected: all green; pytest reports `236 passed, N xfailed, 1 skipped`.

- [ ] **Step 8: Verify the demonstration tests genuinely fail without xfail**

```bash
uv run pytest --runxfail tests/test_verification_audit.py 2>&1 | tail -10
```

Expected: `N failed` where N matches the test count. If any test PASSES under `--runxfail`, it means the test isn't actually demonstrating a gap (validation does reject the attack today). Remove that test + its corresponding finding from the audit doc, and move the trace to "correctly rejected" in the per-adversary section.

- [ ] **Step 9: Commit**

```bash
git add docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
git commit -m "$(cat <<'EOF'
audit(synthesis): findings table + cross-cutting + recommendations + summary

Cross-references every finding from Tasks 3-9 into a single
Findings table, identifies patterns spanning multiple adversaries
in Cross-cutting observations, writes prioritized Recommendations
for remediation PR sequencing, and adds the Executive summary
distilling the audit's overall conclusions.

Total findings: <N> (<Critical>/<High>/<Medium>/<Low>).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Push + open PR

- [ ] **Step 1: Push the branch**

```bash
git push -u origin feat/verification-audit
```

- [ ] **Step 2: Open the PR**

```bash
gh pr create --base main --title "audit(verification): threat-modeled audit findings + demonstration tests" --body "$(cat <<'EOF'
## Summary
Executes the audit specified in commit \`200fde9\` (\`docs/superpowers/specs/2026-05-29-verification-pipeline-audit-design.md\`). Produces:

- A findings report at \`docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md\` (executive summary, threat model, methodology, findings table, per-adversary traces, cross-cutting observations, recommendations).
- A test module at \`tests/test_verification_audit.py\` with one \`@pytest.mark.xfail(strict=True)\` test per finding.

Total findings: <N> (<Critical>/<High>/<Medium>/<Low>). See the audit doc's Executive summary for headline conclusions and the Findings table for the full inventory.

## Why
First systematic pass over cancelchain's verification pipeline. Provides a written record of which adversaries were considered, which attacks were traced, and where the pipeline correctly rejects vs leaves gaps. The xfail tests serve as both proof-of-gap and regression prevention — when remediation PRs fix the gaps, \`strict=True\` will force xfail removal as part of the fix.

## Out of scope
- **Remediation.** Each finding becomes a downstream PR. Severity-ordered recommendations are in the audit doc.
- **Auth audit.** Deliberately deferred to a separate audit pass (same methodology, different threat model).
- **DOS / resource exhaustion, key management, side-channels, reliability.** Per the spec's Non-goals.

## Test plan
- [x] All 5 CI gates clean (ruff check + ruff format + pytest + mypy + db check).
- [x] \`uv run pytest 2>&1 | tail -3\` shows \`236 passed, N xfailed, 1 skipped\`.
- [x] \`uv run pytest --runxfail tests/test_verification_audit.py 2>&1 | tail -3\` shows \`N failed\` (xfail tests genuinely demonstrate gaps).
- [x] Audit doc structure verified (8 top-level sections, 7 adversary subsections, findings table rows = test count).
- [ ] CI green on 3.12 and 3.13.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Stop — controller handles wor + mwg + sync**

---

## Task 12: Phase verification (acceptance)

After the impl PR merges to main.

- [ ] **Step 1: Confirm clean main**

```bash
git checkout main && git pull --ff-only
git log --oneline -3
```

Expected: top commits include the audit impl PR squash and the audit docs PR squash.

- [ ] **Step 2: Audit deliverables present + tracked**

```bash
ls docs/superpowers/audits/
git ls-files docs/superpowers/audits/ tests/test_verification_audit.py
```

Expected: directory exists with the audit doc; the audit doc + test module are tracked in git.

- [ ] **Step 3: Audit doc structure**

```bash
grep -c '^## ' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
grep -c '^### Adversary' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
grep -c '^| A[1-7]\.' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md
```

Expected: 8 top-level sections; 7 adversary subsections; N findings table rows.

- [ ] **Step 4: Test module sync with audit doc**

```bash
audit_findings=$(grep -c '^\*\*Finding A' docs/superpowers/audits/2026-05-29-verification-pipeline-audit.md)
test_count=$(grep -c '^def test_a' tests/test_verification_audit.py)
echo "audit findings: $audit_findings; tests: $test_count"
```

Expected: same number.

- [ ] **Step 5: pytest reports xfails correctly**

```bash
uv run pytest 2>&1 | tail -3
```

Expected: `236 passed, N xfailed, 1 skipped` where N matches the finding count.

- [ ] **Step 6: xfail tests genuinely fail when forced to run**

```bash
uv run pytest --runxfail tests/test_verification_audit.py 2>&1 | tail -5
```

Expected: `N failed` (every xfail test demonstrates its gap).

- [ ] **Step 7: Hard CI gates pass**

```bash
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy
```

All three exit 0.

- [ ] **Step 8: Docker build smoke**

```bash
docker build --target builder -t cc-audit-final .
```

Expected: succeeds. (Audit doesn't touch any code that affects Docker, but worth confirming.)

- [ ] **Step 9: Acceptance complete**

If Steps 1-8 all pass, the audit is done. Remediation PRs follow at the user's discretion (per the audit doc's Recommendations section).

---

## Notes on the wor / mwg workflow

Each PR (Tasks 1 and 11) ends with the controller running `wor` and `mwg`:

1. **`wor`:** poll PR until Copilot review completes. Read inline comments. Reply one at a time with verified `in_reply_to_id`. Auto-rereview is on for cancelchain — no manual click needed.
2. **`mwg`:** `gh pr checks <N> --watch`; once green, `gh pr merge <N> --squash --delete-branch`.

If Copilot review requests substantive changes, push a new commit (do not amend). Copilot will re-review automatically per the repo's auto-review settings.

---

## Risks and watchpoints

### Risk: trace work takes much longer than the bite-size suggests

The per-attack trace can balloon if the validation code has deep call chains or unexpected branching. Mitigation: timebox per-adversary to half a day. If a task is running long, the implementer should surface partial findings rather than blocking on completeness — the audit doc accepts "this attack was partially traced; findings A<N>.<x> through <y> documented, additional attacks not yet traced" as a valid Task state.

### Risk: false-positive findings

A finding might be written that turns out NOT to be a real gap (the validation does catch the attack, but a different path than the trace suggested). Mitigation: Step 8 of Task 10 runs `pytest --runxfail` against the test module — if a test passes under that mode, the gap isn't real. Remove the test + finding from the audit doc and move the trace to "correctly rejected" in the per-adversary section.

### Risk: false-negative findings

The audit misses real gaps because the threat model didn't enumerate them or the implementer didn't think of the attack. Mitigation: this is acceptable for a first-pass audit. The spec's Non-goals acknowledges that future audits can extend the threat model. Document "what was NOT considered" explicitly in the audit's Cross-cutting observations section.

### Risk: xfail strict=True breaks under unrelated refactors

If someone refactors validation in a way that incidentally rejects a previously-undetected attack (without explicitly fixing the finding), the xfail unexpectedly passes and CI fails. This is **desired behavior** — it forces engagement with the audit's findings when surrounding code changes touch the same area. The CI failure should point the refactorer at the audit doc so they can intentionally remove the xfail (and update the audit doc to mark the finding closed by their PR).

### Risk: concurrency attacks (Adversary 6) are hard to demonstrate

Tests that require actual concurrency (threading/multiprocessing) are slower and flakier. Mitigation: mark such tests with `@pytest.mark.multi` (per the existing `--runmulti` gate pattern) so they're skipped by default. The audit doc still records the finding; the test just runs only when explicitly opted into.

### Risk: audit doc gets large (3000+ lines)

PR review of a single huge document is harder than reviewing 7 smaller documents. Mitigation: the doc is structured per-adversary so reviewers can review section by section. The spec PR (which is much smaller) is reviewed first, so Copilot already knows the structure when the bigger audit doc lands.

### Risk: an attack is found that has no current means of validation (a structural gap requiring a new check)

E.g., the audit might surface "there's no anywhere check that two coinbase txns can't appear in the same block." If the existing validation pipeline doesn't have any mechanism that COULD catch the attack, the remediation is bigger than a tweak. Document as a Critical or High finding regardless; the remediation PR can decide how to add the missing check (a new method, a new layer, etc.).

### Risk: forgive/support asymmetry rules are unclear and the audit makes them explicit

The Phase 1-era forgive/support semantics ("opposition is rescindable via forgive; support is permanent; only the original opposer can forgive their own opposition") might not be fully encoded in validation, and the audit might surface gaps that were never explicitly designed for. Mitigation: cite the original specs that defined these rules; if the rules are ambiguous, the finding includes a note that the remediation should also clarify the rules.

### Risk: the implementer reading this plan in isolation lacks domain context

This plan assumes familiarity with the cancelchain domain (UTXO model, proof-of-work, difficulty retargeting, forgive/support tokens). Mitigation: each per-adversary task includes file paths to read FIRST. The implementer should spend ~30 min reading the validation code before tracing any attacks. If the domain is opaque after reading, surface as BLOCKED rather than guessing — the controller can provide context.

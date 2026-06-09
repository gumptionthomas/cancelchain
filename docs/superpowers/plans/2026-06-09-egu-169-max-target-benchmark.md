# EGU #169 — MAX_TARGET Benchmark Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the benchmark harness that measures the effective `mill_hash` rate through the production milling loop and recommends the mainnet `MAX_TARGET` difficulty floor, so #169 closes with a run-paste-set workflow the moment Pi hardware arrives.

**Architecture:** Two pure math functions (`expected_attempts`, `recommended_z`) land in `src/gumptionchain/milling.py` (no runtime callers; normally importable, mypy-strict-checked). A self-contained script `scripts/benchmark_max_target.py` times the production `mill_work` function against a synthetic header with `target=0` (impossible — full range scans), reports single-core (floor baseline) and informational multi-core rates, and prints the paste-ready constant line. Spec: `docs/superpowers/specs/2026-06-09-egu-169-max-target-benchmark-design.md`.

**Tech Stack:** stdlib only (`argparse`, `multiprocessing`, `platform`, `time.perf_counter`) + existing `gumptionchain.milling` / `gumptionchain.chain` imports. pytest; ruff (80 col, single quotes, FBT/T201 rules); mypy strict on `src/`.

**Branch:** `feat/egu-169-max-target-benchmark` off `main` (after the docs PR with spec + this plan merges). Single PR.

**No runtime behavior change, no schema change.** Consensus values untouched in this PR.

**Verified-in-code facts:**
- `mill_work(w: tuple[int, int, str, int]) -> tuple[int | None, int]` is at `src/gumptionchain/milling.py:44-52`: scans `range(work_start, work_stop)`, per proof computes `mill_hash_str(f'{unproven_header}{proof}')` and tests `int(h, 16) < target`. With `target=0` no hash satisfies `< 0`, so the full range always scans — the measurement needs no patching.
- `mill_block_mp` (`milling.py:92-119`) is the `--multi` shape: `multiprocessing.Pool(cpu_count())` + `imap_unordered(mill_work, ...)` over `cpus` chunks.
- `Block.unproven_header` (`block.py:157-168`) = `','.join((idx, timestamp, prev_hash, target, merkle_root, version, ''))` — trailing comma, proof appended directly after.
- `TARGET_GOAL_SECONDS = 300` at `chain.py:61`.
- No `tests/test_milling.py` exists yet (milling is only exercised incidentally elsewhere) — Task 1 creates it.
- `scripts/populate_dev_chain.py` is the script-convention reference: module docstring with a run line, `main()` + `if __name__ == '__main__':`, `# noqa: T201` on prints. This script needs NO dotenv/app-context (pure CPU benchmark).
- mypy's `files = ["src/gumptionchain"]` — `scripts/` and `tests/` are not type-checked, but `milling.py` IS strict-checked.
- Float caution: boundary tests must use budgets that are exact in float (e.g. `goal_seconds=1` with integer `rate_hps`), never `16**3 / 300` round-trips.

---

### Task 1: Pure math — `expected_attempts` / `recommended_z` in `milling.py`

**Files:**
- Modify: `src/gumptionchain/milling.py` (append after `milling_generator`)
- Create: `tests/test_milling.py`

- [ ] **Step 1: Write the failing tests**

Create `tests/test_milling.py`:

```python
"""Unit tests for the proof-of-work target math (#169).

expected_attempts / recommended_z back the MAX_TARGET benchmark harness
(scripts/benchmark_max_target.py); they have no runtime callers.
"""

from gumptionchain.milling import expected_attempts, recommended_z


def test_expected_attempts_powers_of_16():
    # With target '0'*z + 'F'*(64-z), success probability per attempt is
    # ~16^-z, so the geometric expectation is exactly 16^z.
    assert expected_attempts(0) == 1
    assert expected_attempts(1) == 16
    assert expected_attempts(4) == 65536


def test_recommended_z_boundary_inclusive():
    # A budget of exactly 16^3 attempts affords z=3 (expected solve time
    # == goal counts as "within goal"). goal_seconds=1 keeps the
    # rate*goal product exact in float.
    assert recommended_z(rate_hps=16**3, goal_seconds=1) == 3


def test_recommended_z_floors_down():
    # One attempt short of 16^3 -> z=2: rounding down is the err-easier
    # rule (#169) - never recommend a floor the measured rate can't
    # clear within the goal.
    assert recommended_z(rate_hps=16**3 - 1, goal_seconds=1) == 2


def test_recommended_z_clamps_at_zero():
    # A rate too slow for even 16 attempts per block still yields the
    # easiest valid shape (z=0), never a negative.
    assert recommended_z(rate_hps=0.001, goal_seconds=300) == 0


def test_recommended_z_monotonic_in_rate():
    rates = (1.0, 100.0, 10_000.0, 1e6, 1e9)
    zs = [recommended_z(rate_hps=r, goal_seconds=300) for r in rates]
    assert zs == sorted(zs)
```

- [ ] **Step 2: Run to verify they fail**

Run: `uv run pytest tests/test_milling.py -v`
Expected: collection error / `ImportError: cannot import name 'expected_attempts'`.

- [ ] **Step 3: Implement the two functions**

Append to `src/gumptionchain/milling.py` (after `milling_generator`, at module end):

```python
def expected_attempts(z: int) -> int:
    # With target '0'*z + 'F'*(64-z), success probability per attempt is
    # ~16^-z, so the geometric expectation is exactly 16^z attempts.
    return 16**z


def recommended_z(rate_hps: float, goal_seconds: float) -> int:
    # Largest z whose expected solve time 16^z / rate_hps is within
    # goal_seconds. Flooring errs EASIER (numerically larger target) -
    # the non-fatal direction (#169): a too-easy floor self-corrects at
    # the first retarget; a too-hard floor stalls genesis. Clamps at 0.
    # Integer loop instead of floor(log(budget, 16)) to avoid float
    # edge cases exactly at a power-of-16 boundary (z <= 64 in practice).
    budget = rate_hps * goal_seconds  # attempts affordable per block
    z = 0
    while expected_attempts(z + 1) <= budget:
        z += 1
    return z
```

- [ ] **Step 4: Run to verify they pass**

Run: `uv run pytest tests/test_milling.py -v`
Expected: 5 passed.

- [ ] **Step 5: Gates**

Run: `uv run pytest && uv run ruff format src tests && uv run ruff check src tests && uv run mypy`
Expected: full suite green; ruff clean; mypy clean (the new functions are strict-checked).

- [ ] **Step 6: Commit**

```bash
git add src/gumptionchain/milling.py tests/test_milling.py
git commit -m "feat(milling): expected_attempts/recommended_z target math (#169)"
```

---

### Task 2: The benchmark script + smoke test

**Files:**
- Create: `scripts/benchmark_max_target.py`
- Modify: `tests/test_milling.py` (append smoke tests)

- [ ] **Step 1: Write the failing smoke test**

Append to `tests/test_milling.py`:

```python
import importlib.util
from pathlib import Path

_SCRIPT = (
    Path(__file__).resolve().parent.parent
    / 'scripts'
    / 'benchmark_max_target.py'
)


def _load_script():
    spec = importlib.util.spec_from_file_location(
        'benchmark_max_target', _SCRIPT
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_benchmark_script_measures_a_positive_rate():
    # Tiny budget (sub-second): proves the measurement path runs the
    # real mill_work loop and yields a sane rate. No magnitude
    # assertion - CI hardware varies.
    bench = _load_script()
    rate = bench.measure_single(seconds=0.05, calibration=2_000)
    assert rate > 0
    assert recommended_z(rate_hps=rate, goal_seconds=300) >= 0


def test_benchmark_script_header_mirrors_unproven_header_shape():
    # The synthetic header must match Block.unproven_header's shape:
    # 6 comma-joined fields plus the trailing comma (proof appends
    # directly after), with 64-hex prev_hash/target/merkle_root.
    bench = _load_script()
    fields = bench.HEADER.split(',')
    assert len(fields) == 7
    assert fields[-1] == ''  # trailing comma
    assert len(fields[2]) == 64  # prev_hash
    assert len(fields[3]) == 64  # target
    assert len(fields[4]) == 64  # merkle_root
```

Move the `import importlib.util` / `from pathlib import Path` lines into the file's top import block (ruff will demand it); shown here inline for task readability.

- [ ] **Step 2: Run to verify they fail**

Run: `uv run pytest tests/test_milling.py -v`
Expected: the two new tests FAIL (`FileNotFoundError` / spec is None — script doesn't exist); the five Task 1 tests still pass.

- [ ] **Step 3: Write the script**

Create `scripts/benchmark_max_target.py`:

```python
"""Benchmark the effective mill_hash rate through the production milling
loop and recommend the mainnet MAX_TARGET difficulty floor (#169).

Times milling.mill_work (the exact per-proof production code: header
concat + sha256(sha512) + int compare) with target=0, which no hash can
satisfy, so the full proof range always scans. The floor baseline is the
SINGLE-CORE rate (err-easier: a lone single-process Pi must keep the
chain live); the all-cores rate is reported for information only.

Run on the target Raspberry Pi from the gumptionchain repo root:

    uv run python scripts/benchmark_max_target.py

No DB, .env, or app context needed.
"""

from __future__ import annotations

import argparse
import multiprocessing
import platform
import time

from gumptionchain.chain import TARGET_GOAL_SECONDS
from gumptionchain.milling import (
    expected_attempts,
    mill_work,
    recommended_z,
)

# Mirrors Block.unproven_header: 'idx,timestamp,prev_hash,target,
# merkle_root,version,' (trailing comma; mill_work appends the proof
# integer directly). Only the byte length fed to sha512 per attempt
# matters to the rate, so realistic-length literals suffice.
HEADER = ','.join(
    (
        '1024',
        '2026-06-09T12:00:00.000000',
        'a3' * 32,
        '0' * 4 + 'F' * 60,
        'b4' * 32,
        '1',
        '',
    )
)

CALIBRATION_PROOFS = 20_000


def measure_single(
    seconds: float, calibration: int = CALIBRATION_PROOFS
) -> float:
    """Effective single-core H/s through the production mill_work loop."""
    # Calibrate: estimate the rate from a small fixed chunk (also warms
    # caches/JIT-less interpreter state).
    t0 = time.perf_counter()
    mill_work((0, calibration, HEADER, 0))
    cal_rate = calibration / (time.perf_counter() - t0)
    # Measure: one chunk sized to ~`seconds` at the calibrated rate.
    n = max(calibration, int(cal_rate * seconds))
    t0 = time.perf_counter()
    mill_work((n, 2 * n, HEADER, 0))
    return n / (time.perf_counter() - t0)


def measure_multi(seconds: float, single_rate: float) -> float:
    """Aggregate all-cores H/s, replicating mill_block_mp's shape
    (Pool(cpu_count()) + imap_unordered over per-cpu chunks)."""
    cpus = multiprocessing.cpu_count()
    n = max(CALIBRATION_PROOFS, int(single_rate * seconds))
    work = [(i * n, (i + 1) * n, HEADER, 0) for i in range(cpus)]
    t0 = time.perf_counter()
    with multiprocessing.Pool(cpus) as pool:
        for _proof, _count in pool.imap_unordered(mill_work, work):
            pass
    return (n * cpus) / (time.perf_counter() - t0)


def _fmt_seconds(s: float) -> str:
    return f'{s:.1f} s' if s < 120 else f'{s / 60:.1f} min'


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--seconds',
        type=float,
        default=10.0,
        help='measurement duration per mode (default: 10)',
    )
    parser.add_argument(
        '--skip-multi',
        action='store_true',
        help='skip the informational all-cores measurement',
    )
    parser.add_argument(
        '--goal',
        type=float,
        default=TARGET_GOAL_SECONDS,
        help=f'seconds per block (default: {TARGET_GOAL_SECONDS})',
    )
    args = parser.parse_args()

    cpus = multiprocessing.cpu_count()
    print('=== mill_hash benchmark (#169 MAX_TARGET floor) ===')  # noqa: T201
    print(f'platform : {platform.platform()} ({platform.machine()})')  # noqa: T201
    print(f'python   : {platform.python_version()}')  # noqa: T201
    print(f'cpus     : {cpus}')  # noqa: T201

    single = measure_single(args.seconds)
    print(f'single-core : {single:,.0f} H/s  (floor baseline)')  # noqa: T201
    if not args.skip_multi:
        multi = measure_multi(args.seconds, single)
        print(  # noqa: T201
            f'multi ({cpus}c)  : {multi:,.0f} H/s  (informational)'
        )

    z = recommended_z(rate_hps=single, goal_seconds=args.goal)
    print(f'goal        : {args.goal:.0f} s/block')  # noqa: T201
    print(f'recommended Z = {z}')  # noqa: T201
    for zz in (z, z + 1):
        solve = expected_attempts(zz) / single
        print(  # noqa: T201
            f'  expected single-core solve @ Z={zz}: {_fmt_seconds(solve)}'
        )
    print('paste into src/gumptionchain/chain.py:')  # noqa: T201
    print(f"MAX_TARGET = '0' * {z} + 'F' * {64 - z}")  # noqa: T201


if __name__ == '__main__':
    main()
```

- [ ] **Step 4: Run the smoke tests to verify they pass**

Run: `uv run pytest tests/test_milling.py -v`
Expected: 7 passed, total runtime well under 5 s.

- [ ] **Step 5: Validate the script end-to-end on this machine**

Run: `uv run python scripts/benchmark_max_target.py --seconds 3`
Expected: a report with a plausible x86 single-core rate (order 10^5 H/s), a multi rate several × higher, a recommended Z (likely 6-7 on desktop hardware), expected solve times where Z is ≤ goal and Z+1 is 16× longer (> goal), and the paste line. Sanity-check: `expected solve @ Z` must be ≤ the `--goal` value and `@ Z+1` above it.

Also run: `uv run python scripts/benchmark_max_target.py --seconds 1 --skip-multi --goal 60`
Expected: no multi line; smaller/equal recommended Z than the 300 s run (shorter budget).

- [ ] **Step 6: Gates**

Run: `uv run pytest && uv run ruff format src tests scripts && uv run ruff check src tests scripts && uv run mypy`
Expected: all green. (Note: ruff's pyproject config targets the repo; passing `scripts` explicitly ensures the new file is linted/formatted like `populate_dev_chain.py` is.)

- [ ] **Step 7: Commit**

```bash
git add scripts/benchmark_max_target.py tests/test_milling.py
git commit -m "feat(scripts): benchmark_max_target — Pi MAX_TARGET floor harness (#169)"
```

---

### Task 3: Final gates, PR, and the #169 run-instructions comment

**Files:** none (verification + PR only).

- [ ] **Step 1: Run every gate from a clean tree**

```bash
uv run ruff format --check src tests scripts
uv run ruff check src tests scripts
uv run mypy
uv run pytest
uv run gumptionchain db check
```

Expected: all green; `db check` trivially clean (no model change).

- [ ] **Step 2: Push and open the PR**

```bash
git push -u origin feat/egu-169-max-target-benchmark
gh pr create --title "feat: MAX_TARGET benchmark harness for the Pi difficulty floor (#169)" --body "$(cat <<'EOF'
## Summary
Prep work for launch gate #169 (no Pi hardware yet — this makes the gate a run-paste-set operation when it arrives):
- **`scripts/benchmark_max_target.py`** — times the production `mill_work` loop (target=0 full-range scan; zero duplicated milling logic) against a synthetic `unproven_header`-shaped string; reports single-core (floor baseline) + informational all-cores rates and the paste-ready `MAX_TARGET` line.
- **`milling.expected_attempts` / `milling.recommended_z`** — the pure target math (expected attempts = 16^Z exactly; floor-rounded Z = the err-easier rule). No runtime callers; mypy-strict-checked.
- Tests: math unit tests + sub-second script smoke tests (no CI dependence on hashrate).

**Consensus values untouched** — `MAX_TARGET` stays the easy placeholder until the Pi benchmark runs (separate one-line PR; if it lands at Z ≥ 6 the guard test's legacy-floor assertion gets replaced with a pin of the real value, per the spec).

Spec: `docs/superpowers/specs/2026-06-09-egu-169-max-target-benchmark-design.md` · Plan: `docs/superpowers/plans/2026-06-09-egu-169-max-target-benchmark.md`. Part of #169 (stays open as the launch gate).

## Test plan
- [x] `uv run pytest` (new `tests/test_milling.py`: 5 math + 2 smoke)
- [x] `uv run python scripts/benchmark_max_target.py --seconds 3` validated end-to-end on x86
- [x] ruff format/check (src tests scripts) + mypy clean

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Post the run instructions to #169** (right after the PR opens; reference the PR)

```bash
gh issue comment 169 --body "$(cat <<'EOF'
Benchmark harness ready (PR #<N> — script lands on main when it merges). Closing this gate once Pi hardware exists is:

1. On the Pi, from the repo root: `uv run python scripts/benchmark_max_target.py`
2. Paste the report here.
3. One-line PR: set `MAX_TARGET` in `src/gumptionchain/chain.py` to the recommended `'0' * Z + 'F' * (64 - Z)` line from the report. If Z ≥ 6, also replace the legacy-floor assertion in `tests/test_consensus_constants.py::test_max_target_is_an_easy_placeholder_floor` with a pin of the new value (it currently asserts strictly-easier-than-6-zeros).

The floor baseline is the **single-core** rate (err-easier: `--multi` miners get ~4× headroom, and the recommendation floor-rounds the 16×-granular Z). Err easier, never harder — a too-easy floor self-corrects at the first retarget (block 24); a too-hard floor stalls genesis.
EOF
)"
```

(Replace `#<N>` with the actual PR number.)

- [ ] **Step 4: Post the ready-for-review summary and STOP**

Per repo convention: green CI + review make the PR *ready*, not *merged*. Wait for the author's explicit merge signal.

# EGU 1a — open transacting — design

**Date:** 2026-06-04
**Status:** Approved design, pre-implementation
**Issue:** #151 (EGU #1, part 1a)
**Type:** Auth-config capability change — no schema, no migration

## Summary

Let **any authenticated wallet act as a `TRANSACTOR`** by permitting the `"*"`
match-all sentinel in `TRANSACTOR_ADDRESSES`, exactly as it already works for
`READER_ADDRESSES`. This unblocks the EGU model: arbitrary players (holding a
non-custodial wallet, EGU #2) can spend the grit they've earned — stake
support/opposition, rescind, transfer — without being hand-listed in config.
`MILLER`/`ADMIN` stay curated. Plus a documented, minimal anti-spam posture.

## Why this is safe (load, not theft)

Opening `TRANSACTOR` does **not** let anyone steal or mint grit. The chain
already enforces, on every transaction, that it is balanced, consumes only the
caller's *own* unspent outflows (`InflowOutflowAddressMismatchError`), and is not
a double-spend. So "any wallet can transact" means only "any wallet can spend
grit it already holds." The control point for the economy is **grit issuance**
(curated `MILLER` mining + per-app faucets), not the transactor allowlist. The
incremental exposure is **load** (unknown wallets reach validation + mempool
admission instead of a quick `403`), addressed by the anti-spam posture below.

Mining (`MILLER`) and admin (`ADMIN`) remain exact-allowlist only — the wildcard
is permitted for `READER` and `TRANSACTOR` *only*.

## The change

Two precise edits to `Role` in `src/gumptionchain/api.py`, mirroring the existing
READER wildcard (and its defense-in-depth split between match-time and startup):

1. **Match time** — `Role.address_roles` currently honors `"*"` for `READER`
   only:
   ```python
   and (address in addrs or (role is cls.READER and '*' in addrs))
   ```
   Extend to `READER` and `TRANSACTOR`:
   ```python
   and (
       address in addrs
       or (role in (cls.READER, cls.TRANSACTOR) and '*' in addrs)
   )
   ```

2. **Startup** — `Role.validate_config` currently rejects `"*"` outside
   `READER_ADDRESSES`:
   ```python
   if entry == '*':
       if role is not cls.READER:
           raise InvalidRoleConfigError(...)
   ```
   Permit it in `READER` and `TRANSACTOR`, still reject in `MILLER`/`ADMIN`:
   ```python
   if entry == '*':
       if role not in (cls.READER, cls.TRANSACTOR):
           raise InvalidRoleConfigError(...)
   ```
   (Update the error message to say match-all is permitted in READER or
   TRANSACTOR.)

Because authorization is hierarchical (`authorize` rejects on
`role.value < required_role.value`), a wallet that matches `TRANSACTOR` via `"*"`
also satisfies READER-gated endpoints. No view/route changes are needed — every
transactor endpoint already uses `authorize_transactor`.

This is **config-driven**: an operator opts in by setting
`GC_TRANSACTOR_ADDRESSES='["*"]'`. The default/permissioned posture (exact
allowlist) is unchanged when `"*"` is absent.

## Anti-spam posture (decided in the EGU brainstorm)

Minimal now; the heavy tool stays in reserve. For this PR:

- **Mempool cap — already present.** `MAX_PENDING_TXNS` bounds the blast radius:
  a full pool returns HTTP `503`, graceful degradation, no crash. No change.
- **Cheap-reject ordering — light review.** Confirm the transaction-submission
  path performs cheap structural/signature validation before the expensive
  inflow/chain-resolution work, so malformed or unsigned submissions are rejected
  cheaply. Reorder only if it currently does expensive work first; if it's
  already cheap-first, no change. (Low-risk hygiene; not required for safety.)
- **Edge rate-limit — deployment guidance (docs, not chain code).** Recommend a
  per-IP rate limit at the reverse proxy in front of the node. Documented in
  `CLAUDE.md`/README deployment notes; no application code or dependency added.
- **Submit-PoW — explicitly deferred (YAGNI).** A hashcash-style per-transaction
  proof, checked before sig-verify/validation and computed by the wallet module
  (EGU #2), is the *ready escalation* the moment real flooding appears. Specced
  in #151; **not built here.**

## Testing

In the role/auth test suite (`tests/test_auth_audit.py`, where `validate_config` / `address_role` are already exercised):
- `TRANSACTOR_ADDRESSES=["*"]` → an arbitrary authenticated wallet resolves to
  `Role.TRANSACTOR` and is authorized at a `authorize_transactor` endpoint (and,
  via hierarchy, a reader endpoint).
- `validate_config` **accepts** `"*"` in `TRANSACTOR_ADDRESSES` and in
  `READER_ADDRESSES`.
- `validate_config` still **rejects** `"*"` in `MILLER_ADDRESSES` and
  `ADMIN_ADDRESSES` (`InvalidRoleConfigError`).
- Existing exact-match behavior is unchanged when no `"*"` is present (a wallet
  not in the list still gets `403` at a transactor endpoint).
- The match-time defense-in-depth holds: `address_roles` honors `"*"` for
  TRANSACTOR but not for MILLER/ADMIN even if a config were mutated at runtime.

## Out of scope

- **EGU #1b** — the constant retune (block time, retarget interval, difficulty
  floor, base-reward magnitude, RSA→2048). Sibling spec.
- **Submit-PoW** — deferred escalation (above).
- **Faucet/issuance operations** — running millers, funding per-app faucets,
  awarding grit on game-finish (EGU #4). Operational, not a chain change.

## Decisions log

- Wildcard permitted for `READER` **and** `TRANSACTOR` only; `MILLER`/`ADMIN`
  stay exact-allowlist (mining + admin remain curated/governance-gated).
- Opt-in via config (`GC_TRANSACTOR_ADDRESSES='["*"]'`); permissioned default
  preserved.
- Anti-spam: cap (exists) + cheap-reject review + edge rate-limit (docs);
  submit-PoW deferred; no grit fee.
- No schema/migration (auth-config only).

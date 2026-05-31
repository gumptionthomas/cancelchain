# Cancelchain API authentication threat-modeled audit

**Date:** 2026-05-31
**Methodology spec:** `docs/superpowers/specs/2026-05-31-api-auth-audit-design.md`
**Demonstration tests:** `tests/test_auth_audit.py`

## Preconditions

- **TLS assumed.** HTTPS is an explicit deployment precondition. On-wire interception/replay of the bearer JWT or the decrypted challenge is out of scope as a transport concern.
- **Verification pipeline assumed sound** (audited separately, #84). This audit examines only the gate in front of it.
- **No browser auth exists** (`browser.py` has no sessions/login); nothing to audit there.

## Executive summary

[Placeholder — filled in by Task 10 after all per-category tasks complete.]

## Threat model

The audit considers 7 adversary categories. Each is defined by capabilities (what the adversary can do, including key-holding and role state) and goals (what they would attempt). The 7 descriptions are restated below alongside their traces.

## Methodology

For each attack attempt:

1. **Pre-state:** what's true (config, wallets, chain, token rows) when the attack begins.
2. **Attack:** the exact request / token / input the attacker sends.
3. **Trace:** which functions get called, in what order, what they check (cite `file.py:line`).
4. **Outcome:** REJECTED at step N (no finding) or ACCEPTED (gap — finding produced).
5. **Finding (if gap):** severity (Critical/High/Medium/Low) + one-line remediation sketch.
6. **Demonstration test (if gap):** a `@pytest.mark.xfail(strict=True)` test in `tests/test_auth_audit.py`.

Findings are ID'd as `A<N>.<letter>` where `N` is the adversary number (1-7) and `letter` is the attack within that adversary's enumeration. E.g., `A3.b` = adversary 3 (token forger), attack b.

## Findings table

[Placeholder — built by Task 10.]

| ID | Category | Severity | Description | Remediation sketch | Test |
|---|---|---|---|---|---|

## Per-adversary traces

### Adversary 1: Anonymous outsider

[Placeholder — filled in by Task 3.]

### Adversary 2: Challenge attacker

[Placeholder — filled in by Task 4.]

### Adversary 3: Token forger / cryptanalyst

[Placeholder — filled in by Task 5.]

### Adversary 4: Role-escalation attacker

[Placeholder — filled in by Task 6.]

### Adversary 5: Replay attacker

[Placeholder — filled in by Task 7.]

### Adversary 6: Authorized insider

[Placeholder — filled in by Task 8.]

### Adversary 7: Resource / DoS attacker

[Placeholder — filled in by Task 9.]

## Clean categories

[Placeholder — filled in by Task 10. Explicit "no findings" results per category, with the rationale (what was checked, why it's sound). Negative evidence is a deliverable.]

## Cross-cutting observations

[Placeholder — filled in by Task 10. Patterns spanning categories: SECRET_KEY coupling, argon2-on-high-entropy-secret, claim hygiene, etc.]

## Recommendations

[Placeholder — filled in by Task 10. Prioritized remediation ordering AND the targeted-fixes-vs-protocol-replacement analysis, with the two named candidate directions (signed-nonce via Wallet.sign; RFC 9421 / RS256 client-assertion) each with a trade-off paragraph.]

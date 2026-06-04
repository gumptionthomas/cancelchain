# PR 2 — Support rescindability, `rescind_kind`, symmetric-halves coinbase — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `rescind` transaction work for **both** opposition and support — single-kind and self-describing via a stored `rescind_kind` — and rebalance the coinbase sentiment metrics to symmetric halves so every stake pays the miller ½ at mint and ½ at rescind.

**Architecture:** Build on the PR-1 rename. Add a `rescind_kind` metadata field to `Outflow`; make support outflows consumable (only into a rescind); switch `support_balance` to unspent-only; and replace the single opposition accounting pool in `validate_block_txn` with **per-kind pools** (opposition + support) whose "all pools net to zero" check simultaneously enforces the burn invariant, the rescind-kind/inflow cross-check, and single-kind rescinds. Rebalance metrics: `mudita` full→½, add `regret` (rescind+support, ½), gate `grace` to rescind+opposition.

**Tech Stack:** Python 3.12, Flask, SQLAlchemy 2.0 (`Mapped[]`), Pydantic v2, Alembic/Flask-Migrate, pytest, uv, ruff, mypy.

**Spec:** `docs/superpowers/specs/2026-06-03-opposition-support-rescind-design.md` (on `main`).

**Greenfield migration policy:** Per the decision in PR #143, while pre-launch we **fold schema changes into the single baseline migration** (`src/gumptionchain/migrations/versions/63d32cd7621a_initial_schema.py`) instead of adding incremental migrations. PR 2 adds the `rescind_kind` column directly to that baseline.

---

## Consensus / hard-fork notes

This PR **is** a hard fork (greenfield, so acceptable):
- `Outflow.data_csv` gains a `rescind_kind` field → every block/txn hash changes. Tests compute hashes dynamically (wallets sign during the test), so only **hard-coded** expected hashes/txids would break — grep for any and update them (Task 1 includes this check).
- `mudita` weight full→½ changes the coinbase consensus rule.

The two facts the accounting relies on:
- A `rescind` outflow drains the per-kind pool named by its `rescind_kind`. An opposition/support outflow consumed as an inflow *fills* the matching pool. Every pool must net to zero. Therefore: you cannot send staked grains to an `address` (pool stays positive), cannot claim the wrong `rescind_kind` (one pool positive, the other negative), and cannot mix kinds in one rescind (the untouched pool stays positive). All three are enforced by the existing `ImbalancedTransactionError` check — no new guard code.

## `rescind_kind` values

Two literal strings, matching the existing outflow-kind names: `'opposition'` and `'support'`. Used on `Outflow.rescind_kind`, `OutflowDAO.rescind_kind`, the `OutflowModel` `Literal`, the CLI `--kind` choice, and the API `kind` param.

---

## File map (PR 2)

| File | Change |
|---|---|
| `src/gumptionchain/payload.py` | `Outflow.rescind_kind` field; `data_csv`; `OutflowModel` `rescind_kind` + validation; `grace`/`mudita` weights; new `regret` |
| `src/gumptionchain/models.py` | `OutflowDAO.rescind_kind` column + ctor; `unrescinded_outflows(kind=...)`; `support_balance`→unspent-only |
| `src/gumptionchain/migrations/versions/63d32cd7621a_initial_schema.py` | add `rescind_kind` column to baseline `outflow` table |
| `src/gumptionchain/transaction.py` | `to_dao`/`from_dao` carry `rescind_kind`; `regret` aggregation; `coinbase()` gains `regret` |
| `src/gumptionchain/block.py` | `regret` aggregation; `create_coinbase` passes `regret`; `validate_coinbase` includes `regret` |
| `src/gumptionchain/chain.py` | `validate_txn_inflow` allow support + report kind; `validate_block_txn` per-kind pools; `create_rescind(kind)`; `unrescinded_*` pass kind; `support_balance` wrapper unchanged |
| `src/gumptionchain/api.py` | `RescindTxnQueryModel` (+`kind`); `RescindTxnView` passes kind |
| `src/gumptionchain/api_client.py` | `get_rescind_transaction(..., kind)` |
| `src/gumptionchain/command.py` | `txn rescind --kind` option |
| `src/gumptionchain/templates/transaction.html` | (optional) show `rescind_kind` |
| `CLAUDE.md` | document support rescindable + four metrics + `rescind --kind` |
| `tests/*` | new behavior tests + updated metric-weight expectations |

Each task ends green (full suite + ruff + ruff-format + mypy + `db check`). Verify `db check` via:
```bash
set -a; source tests/.test.env; set +a
export FLASK_SQLALCHEMY_DATABASE_URI="sqlite:///$(pwd)/.dbcheck_tmp.db"; rm -f .dbcheck_tmp.db
uv run gumptionchain db upgrade && uv run gumptionchain db check; rm -f .dbcheck_tmp.db
```
Expected: `No new upgrade operations detected.`

---

## Task 1: Add the `rescind_kind` field (rescind stays opposition-only, now self-describing)

Introduce the field end-to-end and make the existing opposition-rescind carry `rescind_kind='opposition'`. No support-rescind, no metric-weight change yet.

**Files:** `payload.py`, `models.py`, baseline migration, `transaction.py`, `chain.py` (`create_rescind` body only), tests.

- [ ] **Step 1: Failing unit tests for the field + validation**

In `tests/test_payload.py` add:

```python
def test_outflow_rescind_carries_kind():
    o = Outflow(amount=10, rescind='Zm9v', rescind_kind='opposition')
    assert o.rescind == 'Zm9v'
    assert o.rescind_kind == 'opposition'


def test_outflow_model_rescind_requires_kind():
    import pytest
    from pydantic import ValidationError
    from gumptionchain.payload import OutflowModel
    with pytest.raises(ValidationError):
        OutflowModel(amount=10, rescind='Zm9v')  # missing rescind_kind


def test_outflow_model_rescind_kind_requires_rescind():
    import pytest
    from pydantic import ValidationError
    from gumptionchain.payload import OutflowModel
    with pytest.raises(ValidationError):
        OutflowModel(amount=10, opposition='Zm9v', rescind_kind='opposition')


def test_outflow_model_accepts_rescind_with_kind():
    from gumptionchain.payload import OutflowModel
    m = OutflowModel(amount=10, rescind='Zm9v', rescind_kind='support')
    assert m.rescind_kind == 'support'
```

(`'Zm9v'` is a valid base64url `Subject`; reuse an existing helper/fixture if the file has one — check the top of `test_payload.py` for how other tests build a subject, e.g. the `subject` fixture, and prefer that.)

- [ ] **Step 2: Run, expect FAIL**

Run: `uv run pytest tests/test_payload.py -k rescind -q`
Expected: FAIL (`Outflow` has no `rescind_kind`; `OutflowModel` accepts rescind without kind).

- [ ] **Step 3: Add the field + validation in `payload.py`**

Add a message constant near `INVALID_DESTINATION_MSG` (line 23):
```python
INVALID_RESCIND_KIND_MSG = 'rescind_kind must be set if and only if rescind is set'
```

`OutflowModel` (lines 75–96) — add the field and extend the validator:
```python
class OutflowModel(BaseModel):
    model_config = ConfigDict(extra='forbid')

    amount: int = Field(ge=1)
    address: AddressType | None = None
    opposition: Subject | None = None
    rescind: Subject | None = None
    support: Subject | None = None
    rescind_kind: Literal['opposition', 'support'] | None = None

    @model_validator(mode='after')
    def validate_destinations(self) -> Self:
        options = [
            v
            for v in (self.opposition, self.rescind, self.support)
            if v is not None
        ]
        if not (
            (self.address and not options)
            or (options and len(options) == 1 and not self.address)
        ):
            raise ValueError(INVALID_DESTINATION_MSG)
        if (self.rescind is not None) != (self.rescind_kind is not None):
            raise ValueError(INVALID_RESCIND_KIND_MSG)
        return self
```
Add `Literal` to the `typing` import at the top of the file if not already imported.

`Outflow` dataclass (lines 106–142) — add the field, extend `data_csv`:
```python
@dataclass
class Outflow:
    amount: int | None = None
    address: str | None = None
    opposition: str | None = None
    rescind: str | None = None
    support: str | None = None
    rescind_kind: str | None = None

    @property
    def data_csv(self) -> str:
        return ','.join(
            [
                str(self.amount),
                self.address if self.address is not None else '',
                self.opposition if self.opposition is not None else '',
                self.rescind if self.rescind is not None else '',
                self.support if self.support is not None else '',
                self.rescind_kind if self.rescind_kind is not None else '',
            ]
        )
```
(Leave `schadenfreude`/`grace`/`mudita` unchanged in this task.)

- [ ] **Step 4: Run, expect PASS**

Run: `uv run pytest tests/test_payload.py -k rescind -q`
Expected: PASS.

- [ ] **Step 5: Add the DAO column + baseline migration**

`models.py` `OutflowDAO` — add the column (after `rescind`, line 127) and ctor param/assignment (lines 150–161):
```python
    rescind_kind: Mapped[str | None] = mapped_column(String(16))
```
In `__init__`, add a keyword param `rescind_kind: str | None = None` (next to `rescind`) and `self.rescind_kind = rescind_kind` in the same conditional block where `self.rescind` is assigned.

Baseline migration `63d32cd7621a_initial_schema.py` — in the `op.create_table('outflow', ...)` block, add after the `rescind` column (the line `sa.Column('rescind', sa.String(length=500), nullable=True),`):
```python
    sa.Column('rescind_kind', sa.String(length=16), nullable=True),
```

- [ ] **Step 6: Carry `rescind_kind` across the domain↔DAO boundary in `transaction.py`**

`from_dao` (lines 333–342) — add to the `Outflow(...)` construction:
```python
                    rescind_kind=outflow_dao.rescind_kind,
```
`to_dao` (lines 279–288) — add to the `OutflowDAO(...)` construction:
```python
                    rescind_kind=outflow.rescind_kind,
```

- [ ] **Step 7: Make `create_rescind` self-describing (still opposition-only)**

`chain.py` `create_rescind` (lines 487–506) — set `rescind_kind` on the emitted rescind outflow (only the `add_outflow` line changes):
```python
        t.add_outflow(
            Outflow(amount=amount, rescind=subject, rescind_kind='opposition')
        )
```
(Signature and the rest of the body are unchanged in this task. The change-back outflow stays `Outflow(amount=balance - amount, opposition=subject)`.)

- [ ] **Step 8: Check for hard-coded hashes broken by the `data_csv` change**

Run: `grep -rn "block_hash\s*==\|txid\s*==\|'[0-9a-f]\{64\}'" tests | grep -iv "def \|get_header_hash\|!= " | head`
Inspect any hit that asserts a *literal* hex hash/txid against computed output and update it (recompute), or confirm the suite is fully dynamic. Then run the full suite (Step 9) — a broken hardcoded hash will surface there.

- [ ] **Step 9: Full suite + lint + types + db check**

Run:
```bash
uv run pytest -q
uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy
```
Expected: 303 passed (4 new on top of the 299 baseline), 1 skipped; lint/format/mypy clean.
Then run the `db check` block from the top of this plan → `No new upgrade operations detected.`

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(payload): add self-describing rescind_kind to outflows"
```

---

## Task 2: Rebalance the coinbase metrics — `mudita` full→½, add `regret`

The coinbase mints sentiment metrics to the miller and `Block.validate_coinbase` enforces the exact amounts. Make all four metrics half-weight: `schadenfreude`/`grace` (opposition side, already ½) and `mudita`/`regret` (support side). Gate `grace` to rescind-opposition; `regret` is rescind-support.

**Files:** `payload.py`, `transaction.py`, `block.py`, tests.

- [ ] **Step 1: Failing unit tests for the new weights + `regret`**

In `tests/test_payload.py` (alongside the existing `test_outflow_mudita`, which currently asserts full weight):

```python
def test_outflow_mudita_is_half_weight(subject):
    outflow = Outflow(amount=10, support=subject)
    assert outflow.mudita == 5


def test_outflow_grace_only_for_opposition_rescind(subject):
    o = Outflow(amount=10, rescind=subject, rescind_kind='opposition')
    assert o.grace == 5
    assert o.regret == 0


def test_outflow_regret_for_support_rescind(subject):
    o = Outflow(amount=10, rescind=subject, rescind_kind='support')
    assert o.regret == 5
    assert o.grace == 0
```
Also UPDATE the existing `test_outflow_mudita` (it asserts `mudita == 9` for `amount=9`): change the expectation to the half weight `int(9 / 2) == 4`. (Search `test_outflow_mudita` and any `test_txn_mudita` / block mudita assertions and update them to ½ — see Step 5.)

- [ ] **Step 2: Run, expect FAIL**

Run: `uv run pytest tests/test_payload.py -k "mudita or grace or regret" -q`
Expected: FAIL (`mudita` still full; `grace` not kind-gated; no `regret`).

- [ ] **Step 3: Update metric properties in `payload.py`**

Replace `grace`/`mudita` and add `regret` (lines 132–142):
```python
    @property
    def grace(self) -> int:
        if (
            self.rescind is not None
            and self.rescind_kind == 'opposition'
            and self.amount is not None
        ):
            return int(self.amount / 2)
        return 0

    @property
    def mudita(self) -> int:
        if self.support is not None and self.amount is not None:
            return int(self.amount / 2)
        return 0

    @property
    def regret(self) -> int:
        if (
            self.rescind is not None
            and self.rescind_kind == 'support'
            and self.amount is not None
        ):
            return int(self.amount / 2)
        return 0
```

- [ ] **Step 4: Run, expect PASS**

Run: `uv run pytest tests/test_payload.py -k "mudita or grace or regret" -q`
Expected: PASS.

- [ ] **Step 5: Aggregate `regret` and thread it through the coinbase**

`transaction.py` — add after `mudita` (lines 174–176):
```python
    @property
    def regret(self) -> int:
        return sum([o.regret for o in self.outflows])
```
`transaction.py` `coinbase` classmethod (lines 351–376) — add a `regret` parameter (after `mudita`) and append its outflow after the `mudita` one:
```python
    @classmethod
    def coinbase(
        cls,
        wallet: Wallet,
        reward: int,
        schadenfreude: int,
        grace: int,
        mudita: int,
        regret: int,
        prev_hash: str,
    ) -> Self:
        outflows: list[Outflow] = []
        if reward:
            outflows.append(Outflow(amount=reward, address=wallet.address))
        if schadenfreude:
            outflows.append(
                Outflow(amount=schadenfreude, address=wallet.address)
            )
        if grace:
            outflows.append(Outflow(amount=grace, address=wallet.address))
        if mudita:
            outflows.append(Outflow(amount=mudita, address=wallet.address))
        if regret:
            outflows.append(Outflow(amount=regret, address=wallet.address))
        cb = cls(outflows=outflows, prev_hash=prev_hash)
        cb.set_wallet(wallet)
        cb.seal()
        cb.sign()
        return cb
```

`block.py` — add after `mudita` (lines 154–156):
```python
    @property
    def regret(self) -> int:
        return sum([t.regret for t in self.txns])
```
`block.py` `create_coinbase` (lines 231–241) — pass `self.regret`:
```python
        return Transaction.coinbase(
            wallet,
            reward,
            self.schadenfreude,
            self.grace,
            self.mudita,
            self.regret,
            prev_hash=self.prev_hash,
        )
```
`block.py` `validate_coinbase` (lines 304–317) — append `regret` to `comps`:
```python
        comps = []
        if self.schadenfreude:
            comps.append(self.schadenfreude)
        if self.grace:
            comps.append(self.grace)
        if self.mudita:
            comps.append(self.mudita)
        if self.regret:
            comps.append(self.regret)
        if comps != [o.amount for o in cb.outflows[1:]]:
            raise InvalidCoinbaseError()
```

- [ ] **Step 6: Update integration tests that assert specific `mudita`/coinbase amounts**

Run: `grep -rn "mudita\|\.schadenfreude\|\.grace\b" tests`
Any test asserting a concrete `mudita` value (e.g. `test_txn_mudita` asserting `19`, block/miller coinbase-amount assertions) must change to the half weight (`int(amount/2)`). Tests that mine a block and let the coinbase flow through dynamically need no change. Update each concrete-number assertion.

- [ ] **Step 7: Full suite + lint + types + db check**

Run:
```bash
uv run pytest -q
uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy
```
Expected: all green (new tests pass; updated mudita expectations pass). db check unchanged → clean.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(coinbase): symmetric-halves metrics (mudita->1/2, add regret)"
```

---

## Task 3: Make support rescindable — per-kind validation, unspent support balance, `rescind --kind`

The behavioral heart of PR 2. Support outflows become consumable (only into a rescind); `validate_block_txn` uses per-kind pools; `support_balance` becomes unspent-only; `create_rescind` takes a `kind`; and the CLI/API/client expose `--kind`.

**Files:** `chain.py`, `models.py`, `api.py`, `api_client.py`, `command.py`, tests.

- [ ] **Step 1: Failing end-to-end test for rescinding support**

In `tests/test_chain.py` (follow the existing pattern there for building a chain and mining — find a test like `test_validate_opposition_ioflows` or a support-staking test and mirror its setup, fixtures, and helpers). Add a test that: stakes support on a subject, asserts `support_balance == amount`, then rescinds support and asserts `support_balance == 0` and that the rescinding txn validates in a mined block. Sketch (adapt names to the file's actual fixtures/helpers):

```python
def test_rescind_support_drops_support_balance(...):
    # ... build chain, fund a wallet, stake support of `amt` on `subject`
    assert lc.support_balance(subject) == amt
    rescind_txn = lc.create_rescind(wallet, amt, subject, 'support')
    # ... mine a block containing rescind_txn (mirror existing mining helper)
    assert lc.support_balance(subject) == 0
```

Also add a cross-check/burn test:
```python
def test_rescind_kind_must_match_consumed_outflows(...):
    # stake opposition of `amt`, then attempt create_rescind(..., 'support')
    import pytest
    from gumptionchain.errors import InsufficientFundsError  # match chain.py's import path
    with pytest.raises(InsufficientFundsError):
        lc.create_rescind(wallet, amt, subject, 'support')  # no support to rescind
```
(`create_rescind` gathers unspent outflows *of the requested kind*; with none, balance < amount → `InsufficientFundsError`. The deeper consensus cross-check — a hand-forged txn claiming the wrong kind — is covered by the pool-balance check; add a `validate_block_txn`-level test if the file has a helper to inject a raw txn, otherwise the `create_rescind` path test above plus the existing imbalance tests suffice.)

- [ ] **Step 2: Run, expect FAIL**

Run: `uv run pytest tests/test_chain.py -k "rescind_support or rescind_kind_must" -q`
Expected: FAIL (`create_rescind()` takes no `kind` arg / support not consumable).

- [ ] **Step 3: Allow support as an inflow and report kind in `validate_txn_inflow`**

`chain.py` `validate_txn_inflow` (lines 254–287). Change the guard (line 270–272) to reject only rescind, and change the return type/value to report both opposition and support of the consumed outflow:
```python
    ) -> tuple[int, str | None, str | None]:
```
Guard:
```python
        # a rescind outflow is terminal and can never be consumed
        if ioflow.rescind is not None:
            raise InvalidInflowOutflowError()
```
Return (line 287):
```python
        return ioflow.amount or 0, ioflow.opposition, ioflow.support
```

- [ ] **Step 4: Per-kind pools in `validate_block_txn`**

`chain.py` `validate_block_txn` (lines 209–252) — replace the body with per-kind accounting:
```python
    def validate_block_txn(
        self,
        block: Block,
        txn: Transaction,
        txn_in_block: bool = True,  # noqa: FBT001
    ) -> None:
        # add inflow amounts, routed by the kind of the consumed outflow
        opposition_amounts: dict[str, int] = {}
        support_amounts: dict[str, int] = {}
        other_amounts = 0
        for i in txn.inflows:
            amount, opposition, support = self.validate_txn_inflow(
                block, txn, i, txn_in_block=txn_in_block
            )
            if opposition:
                opposition_amounts[opposition] = (
                    opposition_amounts.get(opposition, 0) + amount
                )
            elif support:
                support_amounts[support] = (
                    support_amounts.get(support, 0) + amount
                )
            else:
                other_amounts += amount
        # subtract outflow amounts
        for o in txn.outflows:
            if o.rescind:
                if o.rescind_kind == 'support':
                    support_amounts[o.rescind] = (
                        support_amounts.get(o.rescind, 0) - (o.amount or 0)
                    )
                else:
                    opposition_amounts[o.rescind] = (
                        opposition_amounts.get(o.rescind, 0) - (o.amount or 0)
                    )
            elif o.opposition:
                opposition_amount = opposition_amounts.get(o.opposition)
                if opposition_amount and opposition_amount > 0:
                    if (o.amount or 0) > opposition_amount:
                        opposition_amounts[o.opposition] = 0
                        other_amounts -= (o.amount or 0) - opposition_amount
                    else:
                        opposition_amounts[o.opposition] = (
                            opposition_amount - (o.amount or 0)
                        )
                else:
                    other_amounts -= o.amount or 0
            elif o.support:
                support_amount = support_amounts.get(o.support)
                if support_amount and support_amount > 0:
                    if (o.amount or 0) > support_amount:
                        support_amounts[o.support] = 0
                        other_amounts -= (o.amount or 0) - support_amount
                    else:
                        support_amounts[o.support] = (
                            support_amount - (o.amount or 0)
                        )
                else:
                    other_amounts -= o.amount or 0
            else:
                other_amounts -= o.amount or 0
        if other_amounts != 0:
            raise ImbalancedTransactionError()
        for _, amount in opposition_amounts.items():
            if amount != 0:
                raise ImbalancedTransactionError()
        for _, amount in support_amounts.items():
            if amount != 0:
                raise ImbalancedTransactionError()
```

- [ ] **Step 5: `unrescinded_outflows` by kind (`models.py` + `chain.py`)**

`models.py` `unrescinded_outflows` (lines 569–585) — add a required `kind` param selecting the column:
```python
    def unrescinded_outflows(
        self,
        subject: str,
        kind: str,
        address: str | None = None,
        filter_pending: bool = False,  # noqa: FBT001
    ) -> Select[tuple[OutflowDAO]]:
        column = (
            OutflowDAO.support if kind == 'support' else OutflowDAO.opposition
        )
        inflows_alias = db.aliased(InflowDAO, self.inflows.subquery())
        stmt = self.outflows.where(column == subject)
        stmt = stmt.join(inflows_alias, OutflowDAO.inflows, isouter=True)
        stmt = stmt.where(inflows_alias.id.is_(None))
        if address is not None:
            txn_alias = db.aliased(TransactionDAO, self.transactions.subquery())
            stmt = stmt.join(txn_alias, OutflowDAO.transaction)
            stmt = stmt.where(txn_alias.address == address)
        if filter_pending:
            stmt = stmt.where(~OutflowDAO.pending.any())
        return stmt
```
`chain.py` `unrescinded_outflows` (lines 377–393) and `unrescinded_address_outflows` (lines 395–417) — thread a `kind` param through to the DAO call:
```python
    def unrescinded_outflows(
        self,
        subject: str,
        kind: str,
        filter_pending: bool = False,  # noqa: FBT001
    ) -> Iterator[tuple[str, int, Outflow]]:
        outflow_daos = db.session.execute(
            self.to_dao().unrescinded_outflows(
                subject, kind, filter_pending=filter_pending
            )
        ).scalars()
        ...  # body unchanged
```
```python
    def unrescinded_address_outflows(
        self,
        address: str,
        subject: str,
        kind: str,
        limit: int | None = None,
        filter_pending: bool = False,  # noqa: FBT001
    ) -> Iterator[tuple[str, int, Outflow]]:
        amount = 0
        outflow_daos = db.session.execute(
            self.to_dao().unrescinded_outflows(
                subject, kind, address=address, filter_pending=filter_pending
            )
        ).scalars()
        ...  # body unchanged
```

- [ ] **Step 6: `support_balance` → unspent-only (`models.py`)**

`models.py` `support_balance` (lines 598–604) — mirror `opposition_balance` (add the unspent join):
```python
    def support_balance(self, subject: str) -> int:
        inflows_alias = db.aliased(InflowDAO, self.inflows.subquery())
        stmt = self.outflows.where(OutflowDAO.support == subject)
        stmt = stmt.join(inflows_alias, OutflowDAO.inflows, isouter=True)
        stmt = stmt.where(inflows_alias.id.is_(None))
        outflows_alias = db.aliased(OutflowDAO, stmt.subquery())
        sum_stmt = db.select(db.func.sum(OutflowDAO.amount)).join(
            outflows_alias, OutflowDAO.id == outflows_alias.id
        )
        return db.session.scalar(sum_stmt) or 0
```

- [ ] **Step 7: `create_rescind(wallet, amount, subject, kind)` (`chain.py`)**

`chain.py` `create_rescind` (lines 487–506) — add `kind`, gather unspent outflows of that kind, emit the self-describing rescind, change back to the same-kind stake:
```python
    def create_rescind(
        self, wallet: Wallet, amount: int, subject: str, kind: str
    ) -> Transaction:
        address = wallet.address
        balance = 0
        t = Transaction()
        unrescinded = self.unrescinded_address_outflows(
            address, subject, kind, limit=amount, filter_pending=True
        )
        for txid, index, outflow in unrescinded:
            balance += outflow.amount or 0
            t.add_inflow(Inflow(outflow_txid=txid, outflow_idx=index))
        if balance < amount:
            raise InsufficientFundsError()
        t.add_outflow(
            Outflow(amount=amount, rescind=subject, rescind_kind=kind)
        )
        if balance - amount:
            change = balance - amount
            if kind == 'support':
                t.add_outflow(Outflow(amount=change, support=subject))
            else:
                t.add_outflow(Outflow(amount=change, opposition=subject))
        t.set_wallet(wallet)
        t.seal()
        return t
```

- [ ] **Step 8: Wire the `kind` through the surface (API, client, CLI)**

`api.py` — add a rescind-specific query model after `SubjectTxnQueryModel` (line 477) and use it in `RescindTxnView`:
```python
class RescindTxnQueryModel(SubjectTxnQueryModel):
    kind: Literal['opposition', 'support']
```
(Add `Literal` to the typing import if needed.) In `RescindTxnView.get` (lines 514–537), validate with `RescindTxnQueryModel`, pull `kind`, and pass it:
```python
            model = RescindTxnQueryModel.model_validate(
                request.args.to_dict(flat=True)
            )
            ...
            args = model.model_dump(exclude_none=True)
            ...
            kind = args['kind']
            ...
            return make_json_response(
                lc.create_rescind(wallet, amount, subject, kind).to_json()
            )
```

`api_client.py` `get_rescind_transaction` (lines 181–198) — add a required `kind` param and include it in `params`:
```python
    def get_rescind_transaction(
        self,
        public_key: str,
        amount: int,
        subject: str,
        kind: str,
        timeout: int | float | None = None,
        raise_for_status: bool = True,  # noqa: FBT001
    ) -> httpx.Response:
        return self.get(
            '/api/transaction/rescind',
            params={
                'public_key': public_key,
                'amount': str(amount),
                'subject': subject,
                'kind': kind,
            },
            timeout=timeout,
            raise_for_status=raise_for_status,
        )
```

`command.py` `create_rescind` (lines 789–844) — add a required `--kind` option and pass it to the client. Add after the `@click.argument('subject')` line (792):
```python
@click.option(
    '--kind',
    type=click.Choice(['opposition', 'support']),
    required=True,
    help='Which stake to rescind: opposition or support.',
)
```
Add `kind: str,` to the function signature (after `subject: str,`) and update the client call:
```python
        r = client.get_rescind_transaction(
            txn_wallet_obj.public_key_b64,
            grit_to_grains(amount),
            subject,
            kind,
        )
```

- [ ] **Step 9: Update existing callers/tests of `create_rescind` / `get_rescind_transaction`**

Run: `grep -rn "create_rescind\|get_rescind_transaction\|unrescinded_address_outflows\|unrescinded_outflows" src tests`
Update every call to pass the new `kind` argument. Existing opposition-rescind call sites pass `'opposition'`. The CLI test for `txn rescind` must add `--kind opposition` (and add a `--kind support` case). The API test for `/transaction/rescind` must add `kind=...`.

- [ ] **Step 10: Run the new + full suite**

Run: `uv run pytest tests/test_chain.py -k "rescind" -q` → expect PASS.
Run: `uv run pytest -q` → expect all green.
Run: `uv run ruff check src tests && uv run ruff format --check src tests && uv run mypy` → clean.
Run the `db check` block → `No new upgrade operations detected.`

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(rescind): support rescindable via rescind --kind; per-kind validation pools"
```

---

## Task 4: Docs + final verification

**Files:** `CLAUDE.md`, optionally `templates/transaction.html`, verification only otherwise.

- [ ] **Step 1: Update `CLAUDE.md` project description**

In the "What this project is" paragraph (line 7), it currently says support is `(\`support\`, permanent)`. Update to reflect support is now rescindable, e.g.:
> `... as **opposition** (\`opposition\`, rescindable via \`rescind --kind opposition\`) or **support** (\`support\`, rescindable via \`rescind --kind support\`).`
If there's a sentence on the sentiment metrics or units nearby, add a one-line note that the coinbase mints `schadenfreude`/`grace`/`mudita`/`regret`, each ½ of the staked amount (½ at mint, ½ at rescind). Keep edits tight; don't rewrite unrelated prose.

- [ ] **Step 2: (Optional) Surface `rescind_kind` in the transaction template**

If `templates/transaction.html` shows a `Rescind` column (it does — added in PR 1), optionally annotate it with the kind, e.g. `{{ o.rescind }}{% if o.rescind_kind %} ({{ o.rescind_kind }}){% endif %}`. Skip if it complicates the layout; not required for correctness.

- [ ] **Step 3: Final grep sweep**

Run: `grep -rn "create_rescind\|get_rescind_transaction\|unrescinded_outflows\|unrescinded_address_outflows" src tests`
Confirm every call passes a `kind`. No call should use the old 3-arg `create_rescind`.

Run: `grep -rn "\.mudita\b" src` and confirm `mudita` is half-weight at its definition.

- [ ] **Step 4: Full gate**

Run:
```bash
uv run pytest -q
uv run ruff check src tests
uv run ruff format --check src tests
uv run mypy
```
Then the `db check` block → `No new upgrade operations detected.`
Expected: all clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: document support rescindability and symmetric-halves metrics"
```

---

## Definition of done (PR 2)

- `Outflow` carries `rescind_kind` (`opposition`|`support`), validated present-iff-`rescind`; stored on the DAO and folded into the baseline migration (no incremental migration).
- Support outflows are consumable only into a rescind; `support_balance` is unspent-only.
- `validate_block_txn` uses per-kind pools; burn invariant, rescind-kind cross-check, and single-kind rescinds all enforced by the pool-balance check.
- `create_rescind(wallet, amount, subject, kind)`; CLI `txn rescind … --kind opposition|support`; API `/transaction/rescind` takes `kind`; client `get_rescind_transaction(..., kind)`.
- Coinbase metrics are symmetric halves: `schadenfreude`/`grace`/`mudita`/`regret` each `amount//2`; `validate_coinbase` enforces `[reward, schadenfreude, grace, mudita, regret]`.
- Full suite + ruff + ruff-format + mypy + `db check` all green.
- `CLAUDE.md` reflects support rescindability and the four metrics.

## Self-review notes (resolved)

- **data_csv order:** appended `rescind_kind` after `support` (rather than the spec's illustrative `…, support, rescind, rescind_kind`) to minimize churn — the order is arbitrary for a hard fork; only internal consistency matters.
- **Cross-check:** enforced implicitly by per-kind pool balance, not a separate guard (documented above).
- **Migration:** folded into baseline per the greenfield policy (PR #143), not a new migration.

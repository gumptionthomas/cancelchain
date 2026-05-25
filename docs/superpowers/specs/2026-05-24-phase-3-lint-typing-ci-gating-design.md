# Phase 3 — Lint Cleanup, Strict Typing, and CI Hard-Gating

**Status:** Draft for review
**Date:** 2026-05-24
**Scope:** Clear pre-existing lint and typing debt across `src/cancelchain/` and `tests/`. Add strict type hints to the entire source tree. Convert SQLAlchemy entities in `models.py` to use `Mapped[]` annotations. Flip ruff and mypy from `continue-on-error: true` to hard CI gates. Pick up Phase 2's small carry-overs (test-fixture key length, ruff config-mismatch warning).

## Goal

Complete the foundation laid by Phase 1 and Phase 2 so the development feedback loop produces signal instead of noise: lint findings are real regressions, mypy errors block merges, and SA 2.0's preferred typing style is in use. After Phase 3, the next round of refactors (Phase 4+ library swaps) lands against a fully typed, lint-clean codebase.

Concretely: `uv run ruff check src tests` and `uv run mypy src` both exit 0 with `[tool.mypy] strict = true`. CI's `tests.yml` no longer has any `continue-on-error: true` lines.

## Non-goals (deferred to Phase 4+)

- Marshmallow → Pydantic v2 swap (Phase 4). Phase 3 leaves `marshmallow.Schema` subclasses in `schema.py`, `block.py`, `transaction.py`, `payload.py`, `api.py` alone; it adds type hints to the *methods* on those classes but does not change the schema framework.
- `.query.X()` → `db.session.execute(db.select(X))` query-style modernization. Phase 6 handles this; the SA 2.0 deprecation warnings stay suppressed by the `pyproject.toml` / `tests/.test.env` settings landed in Phase 2's PR-3.
- `requests` → `httpx` swap (Phase 5).
- `pycryptodome` → `cryptography` swap (Phase 5).
- Alembic migration framework (Phase 7).
- millify and base58check fork/vendor decision. Both are unmaintained but functional; revisit when one of them breaks.
- Test-suite typing. Phase 3 lint-cleans `tests/` but does not annotate test fixtures or test functions. The `[tool.mypy] files = ["src/cancelchain"]` setting from Phase 1 remains.

## Decisions taken during brainstorming

- **Scope decomposition:** Phase 1's "Phase 3" bucket listed seven discrete refactors (typing, Mapped[], query modernization, Pydantic, httpx, cryptography, Alembic). That bucket is now decomposed across Phase 3, 4, 5, 6, 7. Phase 3 = one focused theme.
- **Phase 3 theme:** "Lint + typing + CI gating cleanup." Foundational; makes every subsequent refactor PR safer.
- **SA scope:** `Mapped[]` annotations on `models.py` travel with the typing pass (they ARE typing for SA entities). Query-style modernization does **not** — it's an API refactor for a later phase.
- **Typing depth:** Full strict. `[tool.mypy] strict = true` with `disallow_untyped_defs`, `disallow_any_generics`, `no_implicit_optional`, `warn_return_any`, etc. Every function in `src/cancelchain/` gets argument and return annotations. Variable annotations only where needed to satisfy mypy. Mapped[] on all SA entities.
- **tests/ scope:** Lint cleanup yes; typing no. The mypy `files = ["src/cancelchain"]` filter is preserved.
- **PR strategy:** Sequential train, layer-by-layer (utilities → domain → models → infra → CI gate). Nine PRs, each squash-mergeable and individually reviewable. Matches the project's "no scope creep" rule and `wor`-before-merge habit.

## Changes — the PR train

Phase 3 ships as nine sequential PRs. Order matters because typing PRs reference each other's types (utility types are imported by domain types; domain types by infra types).

### PR-1. Ruff config alignment

**Files touched:** `pyproject.toml` (`[tool.ruff]`, `[tool.ruff.lint]`).

**Why:** Ruff 0.15 (landed in Phase 2 PR-7) emits a warning every run:
```
warning: The `flake8-quotes.inline-quotes="double"` option is incompatible with the formatter's `format.quote-style="single"`. We recommend disabling `Q000` and `Q003` when using the formatter.
```
The `Q000` ignore in `[tool.ruff.lint] ignore` already exists; the warning still fires because `flake8-quotes` rules are implicitly active for the `Q` category. Fix is either to explicitly disable `flake8-quotes` settings or set `[tool.ruff.lint.flake8-quotes] inline-quotes = "single"` to match the formatter.

**Changes:**
- Set `[tool.ruff.lint.flake8-quotes] inline-quotes = "single"` (or, alternatively, add `Q003` to the `[tool.ruff.lint] ignore` list to suppress that rule directly — the ruff config selects the whole `Q` category via `select = [..., "Q", ...]`, so disabling a single rule means adding it to `ignore`).
- Drop the now-redundant `Q000` from the `[tool.ruff.lint] ignore` list (after confirming `ruff check` still passes — `Q000` only fires when the quote-style mismatch is the source).

**Source code:** none.

**Acceptance:** `uv run ruff check src tests` no longer emits the quote-style warning.

### PR-2. Clear src/ lint debt

**Files touched:** `src/cancelchain/*.py` — specific lines determined by running `uv run ruff check src` against the post-PR-1 config.

**Approach:**
1. Run `uv run ruff check src --fix --unsafe-fixes` and stage what's auto-applied.
2. Read the remaining findings; apply manual fixes case-by-case.
3. Verify with `uv run ruff check src` (exit 0) and `uv run pytest`.

**Expected findings to address** (from the Phase 2 acceptance survey, ~16 src/ findings):
- `RUF015` — `list(x)[0]` → `next(iter(x))`.
- `RUF059` — unused unpacked variables → prefix with `_`.
- `UP017` — `datetime.timezone.utc` → `datetime.UTC` (any leftover from Phase 2's auto-fix).
- Other minor `B` / `SIM` / `PLW` findings.

**No semantic changes.** Every fix should be a refactor-equivalent rewrite.

**Acceptance:** `uv run ruff check src` exits 0. Test suite green.

### PR-3. Clear tests/ lint debt

**Files touched:** `tests/*.py`.

**Approach:** same as PR-2, but on `tests/`. The implementer of Phase 2 PR-5 surfaced ~20 RUF059 findings; they may have grown under ruff 0.15.

**Acceptance:** `uv run ruff check tests` exits 0. Test suite green.

### PR-4. Type the utility + schema layer

**Files touched:** `src/cancelchain/util.py`, `schema.py`, `milling.py`, `signals.py`, `exceptions.py`, `console.py`, `database.py`, `cache.py`, `config.py`.

**Pattern setup:**
- Add `from __future__ import annotations` to every typed module. This lets `int | None` syntax work on Python 3.12+ even when forward references hit during class body evaluation.
- Use `collections.abc` for `Iterable`, `Iterator`, `Mapping`, `Sequence` (not `typing`).
- Prefer `X | None` over `Optional[X]`.
- Type return values explicitly even when `-> None`.
- For Marshmallow schemas (`schema.py:SansNoneSchema`, `MillHash`, `Address`, etc.): leave the schema field definitions as-is; type any utility functions in that module (e.g., `asdict_sans_none`, `validate_address`, etc.). Type the one `@post_dump`-decorated method on `SansNoneSchema` (`remove_none_values`) with `dict[str, Any]` for the data dict.

**Marshmallow + mypy interaction (introduced here because schema.py is the first typed file touching Marshmallow; reused by PR-5):** the marshmallow stubs (marshmallow-stubs package) aren't installed by default. Either:
- Add `marshmallow-stubs` to `[dependency-groups].dev` (recommended).
- Or set `[[tool.mypy.overrides]] module = "marshmallow.*"` `ignore_missing_imports = true`.

The recommended path is the stubs package; mypy strict's `disallow_any_generics` makes the `ignore_missing_imports` shortcut leak `Any` types through Marshmallow boundaries. The chosen approach is single-PR-owned by PR-4 so PR-5 inherits cleanly without further dev-dep edits.

**Files chosen first because:**
- They have few or no inter-module dependencies (leaves of the dependency graph).
- They're small (most under 200 lines).
- They set the project's typing patterns that subsequent PRs follow.

**Acceptance:** `uv run mypy src` produces fewer errors than before (target: 0 errors in any module from this PR's file list). Test suite green.

### PR-5. Type the domain layer

**Files touched:** `src/cancelchain/wallet.py`, `payload.py`, `transaction.py`, `block.py`, `chain.py`.

**Approach:**
- Annotate the dataclass methods (`to_dict`, `to_json`, `from_json`, `to_dao`, `from_dao`, `to_db`, `from_db`).
- Annotate validators (`validate_address`, `validate_coinbase`, etc.) and helpers (`mill_hash_str`, `validate_hash_diff`).
- Mark Marshmallow `Schema` subclasses' typed methods (e.g., `@post_dump`, `@post_load`, `@validates_schema` decorated methods) with proper signatures: `def make_block(self, data: dict[str, Any], **kwargs: Any) -> Block:` etc. Uses the marshmallow stubs added by PR-4 — no dev-dep changes in this PR.
- Wallet RSA/AES surface in `wallet.py` produces `bytes` and `str` — annotate carefully. Internal `pycryptodome` types stay as-is (Phase 5 swaps the library).

**Acceptance:** `uv run mypy src` errors in these files reach 0. Test suite green.

### PR-6. SQLAlchemy `Mapped[]` for `models.py`

**Files touched:** `src/cancelchain/models.py`.

**The conversion:**

Before (Phase 2 state):
```python
class TransactionDAO(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    txid = db.Column(db.String(100), unique=True, nullable=False, index=True)
    version = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    address = db.Column(db.String(100), nullable=True)
    public_key = db.Column(db.String(500), nullable=True)
    signature = db.Column(db.String(500), nullable=True)
    blocks = db.relationship(
        'BlockDAO', secondary=block_transactions, back_populates='transactions'
    )
```

After:
```python
class TransactionDAO(db.Model):
    __tablename__ = 'transaction'

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True)
    txid: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    version: Mapped[str] = mapped_column(String(10))
    timestamp: Mapped[datetime.datetime] = mapped_column()
    address: Mapped[str | None] = mapped_column(String(100))
    public_key: Mapped[str | None] = mapped_column(String(500))
    signature: Mapped[str | None] = mapped_column(String(500))
    blocks: Mapped[list[BlockDAO]] = relationship(
        secondary=block_transactions, back_populates='transactions'
    )
```

Notes:
- `nullable=True` is conveyed by `Mapped[X | None]` (SA 2.0 infers nullability from the annotation).
- `Optional[X]` works equivalently; prefer `X | None` for consistency with PR-4/5.
- Foreign keys: `transaction_id: Mapped[int] = mapped_column(ForeignKey('transaction.id'))`.
- Many-to-many via `db.Table`: leave the association table definition alone; only the model-side `Mapped[list[X]] = relationship(...)` changes.
- Hybrid properties / computed columns: declare as `@hybrid_property` with explicit return type.
- Recursive CTE method `BlockDAO.block_chain` (`q.union_all(...)` pattern): annotate the return as the appropriate SA `Select` or `CTE` type.

**This is the trickiest typing PR.** Run the full test suite after every file/class group; the recursive CTE behavior is sensitive.

**Acceptance:** `uv run mypy src/cancelchain/models.py` exits 0 under strict mode. Every recursive-CTE test in `tests/test_chain.py` passes. No SA deprecation warnings introduced (legacy `Model.query` continues to work via Flask-SQLAlchemy 3.1's compat shim).

### PR-7. Type the infra layer

**Files touched:** `src/cancelchain/api.py`, `api_client.py`, `browser.py`, `command.py`, `node.py`, `miller.py`, `tasks.py`, `application.py`, `__init__.py`.

**Approach:**
- Flask views (`api.py:MethodView` subclasses, `browser.py` route functions): annotate handler return types as `flask.Response | tuple[flask.Response, int]` or use Flask 3's `Response` type as appropriate.
- CLI commands (`command.py`): `@click.command` decorated functions; annotate their argument types. Click introspects annotations for click 8.1+, so this also gets you free arg-type validation.
- Peer-network coordination (`node.py`, `miller.py`): annotate `Node.receive_transaction`, `Node.send_block`, `Miller.create_block` etc. with their domain types (`Transaction`, `Block`, `Chain`).
- Celery tasks (`tasks.py`): `@celery.task()` decorated functions — annotate the function inside the decorator.
- The Flask app factory (`__init__.py:create_app`): `def create_app(config: AppConfig | None = None) -> Flask:` with proper return type.

**Largest single PR by file count and probably by line count.** The infra layer is ~2400 source lines combined; a typical strict-typing pass adds 10–30% in net diff (so ~250–700 added lines, plus modifications). If the diff approaches 800 lines or review fatigue becomes a problem, split into 7a (Flask views: `api.py`, `browser.py`, `application.py`, `__init__.py`) and 7b (CLI + networking: `command.py`, `node.py`, `miller.py`, `tasks.py`, `api_client.py`). Decision deferred to PR-7 time.

**Acceptance:** `uv run mypy src` exits 0 under strict mode for all infra files. Test suite green.

### PR-8. Make ruff check and mypy hard CI gates

**Files touched:** `.github/workflows/tests.yml`, `pyproject.toml` (`[tool.mypy]`).

**Changes:**
- Remove `continue-on-error: true` from the `uv run ruff check src tests` step in `tests.yml`.
- Remove `continue-on-error: true` from the `uv run mypy src` step.
- Set `[tool.mypy] strict = true` (or expand the explicit setting list — `disallow_untyped_defs = true`, `disallow_any_generics = true`, etc. — if `strict = true` is too broad).
- Update the comments above the CI steps that referenced "non-blocking in Phase 1, Phase 3 tightens this" — replace with current-state comments.
- Update `CLAUDE.md`'s "Style" section paragraph about ruff `continue-on-error: true` — that line is no longer accurate after this PR.

**This PR fails CI if any of PR-2 through PR-7 left findings behind.** Treat it as the "definition of done" gate for the typing/lint work.

**Acceptance:** CI green on `main` after this PR merges. A deliberately-introduced lint or typing regression on a follow-up PR is now blocked at CI.

### PR-9. Test-fixture hardening

**Files touched:** `tests/.test.env`, possibly `tests/conftest.py` or `pyproject.toml` `[tool.pytest.ini_options] filterwarnings`.

**Why:** Phase 2's PR-7 surfaced a pyjwt 2.13 `InsecureKeyLengthWarning` because `tests/.test.env` sets `FLASK_SECRET_KEY=testkey` — 7 bytes, well under the recommended 32 bytes for HS256.

**Changes:**
- Replace `FLASK_SECRET_KEY=testkey` with a 32-byte value, e.g. `FLASK_SECRET_KEY=test-secret-key-must-be-32-bytes!`.
- If any test fixture or helper hardcodes the `testkey` literal, update it.
- If warnings persist (e.g., a downstream warning chain), add a targeted `filterwarnings` ignore to `pyproject.toml` with a comment explaining why.

**Acceptance:** `uv run pytest 2>&1 | grep -i 'insecurekeylength' | wc -l` returns 0.

## Out of scope (explicit reminders)

- No source edits to `models.py` beyond the `Mapped[]` conversion in PR-6. In particular, no `.query.filter_by()` → `db.session.execute(db.select())` modernization (that's a separate later phase).
- No new abstractions, no new modules, no API redesigns. Phase 3 is "type what's there" not "rebuild what's there."
- No changes to `[project.dependencies]`. The dev group may gain `marshmallow-stubs` in PR-4 if we choose the stubs path over the ignore_missing_imports shortcut.
- No removal of legacy DAO patterns (`backref`, `secondary` for many-to-many association tables). Those stay; Phase 6's query modernization will revisit.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| `Mapped[]` migration in PR-6 changes runtime semantics subtly (e.g., default values, nullability inference, FK discovery). | PR-6 is a single-file PR. After each class group's conversion, run `uv run pytest tests/test_chain.py tests/test_block.py tests/test_models.py -v` to catch breakage early. If a test fails, capture which class group caused it. |
| Strict mypy surfaces latent bugs in error-handling paths (e.g., a function that returns `None` on failure but was annotated `-> Block`). | Each typing PR runs the full test suite before merge. If mypy reveals a real bug, fix it as a separate commit on the same PR branch with a clear note in the commit message. If a bug requires architectural change, split it out as its own PR. |
| Ruff hard-gating in PR-8 catches a regression that wasn't in the cleanup pass (e.g., a new lint rule added by ruff 0.16). | PR-8 runs `uv run ruff check src tests` locally before pushing. If it produces findings, add them to PR-8's diff or split into a small fix-PR first. |
| Marshmallow's typing stubs (`marshmallow-stubs`) are incomplete or out of date with marshmallow 4.x. | If `marshmallow-stubs` causes more friction than it saves, fall back to per-module `ignore_missing_imports = true` with a comment explaining. Phase 4's Pydantic swap removes this concern entirely. |
| PR-7 (infra typing) is too large to review effectively. | Split into 7a (Flask views) and 7b (CLI + networking) at PR-7 time, decided based on diff size. |
| Phase 3 changes break the `wor` workflow's expectation that lint findings are absorbed by `continue-on-error`. | PR-8 is the explicit gate-flip; before that PR, the workflow is unchanged. Devs needing a lint-clean local pre-commit can already get it via `uv run pre-commit run --all-files`. |
| New ruff/mypy versions land via Dependabot during Phase 3 and surface new findings. | Hold Dependabot dev-tool bumps until Phase 3 is done. Resume Monday-cadence after PR-9. |

## Acceptance criteria for Phase 3 as a whole

- [ ] All nine PRs merged to `main` via squash-merge with branch deletion.
- [ ] `uv run ruff check src tests` exits 0 (no `--ignore` workarounds in `pyproject.toml` beyond the existing pre-Phase-3 list).
- [ ] `uv run mypy src` exits 0 under `[tool.mypy] strict = true`.
- [ ] `.github/workflows/tests.yml` contains zero `continue-on-error: true` directives.
- [ ] `src/cancelchain/models.py` uses `Mapped[X] = mapped_column(...)` for all column definitions on every DAO class.
- [ ] `tests/.test.env`'s `FLASK_SECRET_KEY` value is ≥ 32 chars; pyjwt's `InsecureKeyLengthWarning` no longer appears in pytest output.
- [ ] Existing test suite passes (162/163 green; the 1 skip is the `@pytest.mark.multi` test which is `--runmulti` gated).
- [ ] `docker build .` succeeds; the resulting image still runs `cancelchain --help`.

## Open decisions (resolve at PR time)

- PR-1: which exact ruff config change (drop `Q000` from ignore vs. set `[tool.ruff.lint.flake8-quotes]` config block). Decided after running ruff 0.15 against the current code.
- PR-4: `marshmallow-stubs` vs. `[[tool.mypy.overrides]] ignore_missing_imports = true` for the Marshmallow boundary (introduced in PR-4 because schema.py contains the first Marshmallow Schema subclass that gets typed; PR-5 inherits the choice). Decided after attempting the stubs and measuring friction.
- PR-7: monolithic vs. 7a/7b split. Decided based on diff size at draft time.
- PR-9: changing the test secret may break any test fixture that hardcodes `'testkey'` literally. Decided after grep at PR time.

## What comes next

- **Phase 4 — Marshmallow → Pydantic v2.** Self-contained library swap. Touches schema.py, block.py, transaction.py, payload.py, api.py.
- **Phase 5 — Supply-chain swaps.** `requests` → `httpx` and `pycryptodome` → `cryptography`. May ship as one combined phase given both are supply-chain hygiene.
- **Phase 6 — SA 2.0 query-style modernization.** `.query.filter_by(...)` → `db.session.execute(db.select(...))` across `models.py` and any call sites elsewhere. Removes the SA 2.0 legacy-API deprecation warning suppression.
- **Phase 7 — Alembic.** Introduce migration framework. Schema is stable so this is more about future-readiness than current need.
- **Future — Observability.** OpenTelemetry, Sentry, structured logging. Originally Phase 4 per the Phase 1 spec; now slotting in after the swap phases.
- **Future — millify / base58check fork-or-vendor.** Both upstreams are unmaintained. Action when one breaks or has a CVE.

Each subsequent phase will get its own design doc and implementation plan.

from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
WALLET_DIR = _ROOT / 'src/gumptionchain/static/wallet'
SOURCE_DIR = _ROOT / 'clients/wallet'
REQUIRED = [
    'gc-attestation.mjs',
    'gc-message.mjs',
    'gc-errors.mjs',
    'gc-wallet.mjs',
    'gc-crypto.mjs',
    'gc-sig.mjs',
    'index.mjs',
]


def test_runtime_wallet_modules_are_vendored():
    for name in REQUIRED:
        assert (WALLET_DIR / name).is_file(), f'missing vendored {name}'


def test_no_test_or_cli_modules_vendored():
    for p in WALLET_DIR.glob('*.mjs'):
        assert not p.name.endswith('.test.mjs')
        assert not p.name.endswith('-cli.mjs')


def _runtime_modules(directory: Path) -> list[Path]:
    return [
        p
        for p in directory.glob('*.mjs')
        if not p.name.endswith('.test.mjs') and not p.name.endswith('-cli.mjs')
    ]


def test_vendored_modules_match_source():
    # The served copies are vendored from clients/wallet via
    # scripts/sync_wallet.py. Guard against a source edit that wasn't re-synced:
    # a stale served copy of parity-critical crypto (gc-transaction.mjs) would
    # silently produce wrong txids. Mirrors sync_wallet's copy rule exactly.
    for src in _runtime_modules(SOURCE_DIR):
        vendored = WALLET_DIR / src.name
        assert vendored.is_file(), (
            f'{src.name} not vendored — run scripts/sync_wallet.py'
        )
        assert vendored.read_bytes() == src.read_bytes(), (
            f'{src.name} drifted from clients/wallet — run '
            f'scripts/sync_wallet.py'
        )

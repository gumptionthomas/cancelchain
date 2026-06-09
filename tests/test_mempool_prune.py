"""EGU #208: confirmed txns are pruned from the pending pool on live
block acceptance (Node.process_block), and a txn pruned on a
later-orphaned block stays out of the pool (accept + document)."""

from sqlalchemy.exc import OperationalError

from gumptionchain.api_client import ApiClient
from gumptionchain.database import db
from gumptionchain.models import PendingIOflowDAO, PendingTxnDAO
from gumptionchain.transaction import PendingTxnSet


def _post_pending(host, chain, wallet, amount, subject):
    txn = chain.create_opposition(wallet, amount, subject)
    txn.sign()
    ApiClient(host, wallet).post_transaction(txn)
    return txn


def _count_ioflows():
    return (
        db.session.scalar(
            db.select(db.func.count()).select_from(PendingIOflowDAO)
        )
        or 0
    )


def test_process_block_prunes_confirmed_pending(
    app, host, mill_block, requests_proxy, subject, wallet
):
    with app.app_context():
        m, _b1 = mill_block(wallet)  # genesis funds the wallet
        txn = _post_pending(host, m.longest_chain, wallet, 300, subject)
        assert PendingTxnDAO.count() == 1
        assert _count_ioflows() == 1  # spends the mined coinbase

        m2, b2 = mill_block(wallet)  # b2 confirms txn

        # the confirmed txn is pruned from the pool (ioflow children
        # cascade with it)...
        assert PendingTxnDAO.get(txn.txid) is None
        assert _count_ioflows() == 0
        # ...and only it: the coinbase discard is a no-op, so the pool
        # count drops by exactly the number of regular txns
        assert len(b2.regular_txns) == 1
        assert PendingTxnDAO.count() == 0
        # the txn is canonical
        assert m2.longest_chain.get_transaction(txn.txid) is not None


def test_prune_failure_does_not_block_acceptance(
    app, host, mill_block, monkeypatch, requests_proxy, subject, wallet
):
    # Best-effort prune: a DB error while discarding must not abort
    # acceptance of the already-committed block (or its gossip).
    with app.app_context():
        m, _b1 = mill_block(wallet)
        txn = _post_pending(host, m.longest_chain, wallet, 300, subject)
        assert PendingTxnDAO.count() == 1

        def boom(self, txn):
            stmt = 'stmt'
            raise OperationalError(stmt, {}, Exception('db down'))

        monkeypatch.setattr(PendingTxnSet, 'discard', boom)
        m2, b2 = mill_block(wallet)  # must not raise

        # the block was accepted despite the failed prune...
        assert b2 is not None
        assert m2.longest_chain.get_transaction(txn.txid) is not None
        # ...and the pool row simply lingers (read filter handles display)
        assert PendingTxnDAO.count() == 1

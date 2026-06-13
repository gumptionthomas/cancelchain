/* gumptionchain explorer UI kit — the VANILLA node browser under the 2B2F skin.
   Recreates base gumptionchain's stock Bootstrap markup (templates/base.html,
   _explorer_home.html, blocks.html, subjects.html, subject.html, verify.html)
   themed by the design system's explorer.css. Components come from the bundle. */
const { StatCard, NetStance, OutflowBadge, Seal } =
  window.ExtendedGumptionUniverseDesignSystem_a80556;

const NAV = ['Home', 'Chains', 'Blocks', 'Subjects', 'Addresses', 'Mempool', 'Transact', 'Signing key', 'Advanced'];
const hash = (s) => s.padEnd(64, '0').slice(0, 64);

const BLOCKS = [
  { idx: 184213, hash: '00000a3f9c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b', ts: '2026-06-13 14:02:11', txns: 3 },
  { idx: 184212, hash: '00000c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7', ts: '2026-06-13 13:51:44', txns: 1 },
  { idx: 184211, hash: '00000f1a8c3e9b2d5074a6f8c1e3b5d7029a4c6e8b0d2f4a6c8e0b2d4f6a8c0e', ts: '2026-06-13 13:40:09', txns: 5 },
  { idx: 184210, hash: '000004b9d2f7a1c8e3650b9d7f1a3c5e7029b4d6f8a0c2e4b6d8f0a2c4e6b8d0', ts: '2026-06-13 13:28:55', txns: 2 },
  { idx: 184209, hash: '00000e6c1b9d3f7a205c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f', ts: '2026-06-13 13:17:30', txns: 4 },
];
const SUBJECTS = [
  { subject: 'Local Library', opposition: 160, support: 420 },
  { subject: 'City Budget', opposition: 620, support: 850 },
  { subject: 'Toll Road', opposition: 940, support: 120 },
  { subject: 'Night Market', opposition: 50, support: 1200 },
  { subject: 'Parking Fees', opposition: 390, support: 210 },
];
const ADDRESSES = [
  { address: 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4', ct: 1240 },
  { address: 'gc1qf7r3m9x1v5h8j2p4q6s8u0w2y4a6c8e0g2', ct: 860 },
  { address: 'gc1qd2f4h6k8m0p2r4t6v8x0z2b4d6f8h0j2l4', ct: 512 },
  { address: 'gc1qa3c5e7g9i1k3m5o7q9s1u3w5y7a9c1e3g5', ct: 305 },
  { address: 'gc1qb4d6f8h0j2l4n6p8r0t2v4x6z8b0d2f4h6', ct: 88 },
];
const MEMPOOL = [
  { txid: hash('e1a4f7c9e3b5d8a0c2'), ts: '2026-06-13 14:05:39', inflows: 2, outflows: 3, total_out: 740 },
  { txid: hash('b8d1a4f7c9e3b5d8a0'), ts: '2026-06-13 14:04:12', inflows: 1, outflows: 1, total_out: 120 },
];

// ── Shell ────────────────────────────────────────────────────────────────
function Nav({ view, onNav, theme, onToggleTheme }) {
  return (
    <div className={theme ? 'gc-navbar' : 'navbar border-bottom'} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap', padding: '0.5rem 1.5rem' }}>
      <a className={theme ? 'gc-nav-brand' : 'navbar-brand'} onClick={() => onNav('Home')} style={{ cursor: 'pointer', marginRight: '0.5rem' }}>{theme ? 'Gumption' : 'Home'}</a>
      {NAV.filter((n) => theme || n !== 'Home').map((n) => (
        <a key={n} onClick={() => onNav(n)} style={{ cursor: 'pointer', color: view === n ? (theme ? 'var(--gold-dark)' : '#0d6efd') : (theme ? 'var(--ink)' : '#212529'), fontWeight: view === n ? 600 : 400, padding: '0.4rem 0.6rem', textDecoration: 'none', fontSize: '0.9rem' }}>{n}</a>
      ))}
      <button className={'btn btn-sm ' + (theme ? 'btn-primary' : 'btn-outline-secondary')} onClick={onToggleTheme} style={{ marginLeft: 'auto' }}>
        {theme ? '2B2F skin · ON' : 'Vanilla Bootstrap'} — flip
      </button>
    </div>
  );
}
function Footer({ theme }) {
  return <div className={theme ? 'gc-footer' : 'footer text-center text-muted'} style={{ textAlign: 'center', padding: '1.5rem 0', fontSize: '0.85rem' }}>Version 0.9.2 · <a href="#" style={theme ? { color: 'var(--gold-dark)' } : undefined} onClick={(e) => e.preventDefault()}>gumption.com/chain</a></div>;
}

// ── Home ───────────────────────────────────────────────────────────────────
function Home({ onNav, onBlock }) {
  return (
    <div className="container-fluid">
      <div className="row my-3 g-3">
        {[['Height', '184,213'], ['Transactions', '9,604'], ['Total staked', '2,794', 'grains'], ['Subjects', '38'], ['Pending', '2']].map(([l, v, u]) => (
          <div className="col-6 col-md" key={l}><StatCard label={l} value={v} unit={u} /></div>
        ))}
      </div>

      <div className="row my-3"><div className="col">
        <div className="card bg-light"><div className="card-body">
          <div className="card-title h5">Chain Tip</div>
          <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <tbody className="font-monospace">
              <tr><th className="col-3"><i className="bi-info"></i>&nbsp;Last Block Index</th><td>184,213</td></tr>
              <tr><th className="col-3"><i className="bi-hash"></i>&nbsp;Last Block Hash</th><td style={{ wordBreak: 'break-all' }}><a href="#" onClick={(e) => { e.preventDefault(); onBlock(BLOCKS[0]); }}>{BLOCKS[0].hash}</a></td></tr>
              <tr><th className="col-3"><i className="bi-clock"></i>&nbsp;Timestamp</th><td>{BLOCKS[0].ts} UTC</td></tr>
            </tbody>
          </table>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card bg-light"><div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="card-title h5 mb-0">Recent Blocks</div>
            <div><a href="#" onClick={(e) => { e.preventDefault(); onNav('Blocks'); }}>View all blocks</a> &middot; <a href="#" onClick={(e) => { e.preventDefault(); onNav('Subjects'); }}>Subjects</a></div>
          </div>
          <table className="table table-hover mt-3">
            <thead><tr><th>#</th><th>Hash</th><th>Timestamp</th></tr></thead>
            <tbody className="font-monospace">
              {BLOCKS.map((b) => (
                <tr key={b.idx} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onBlock(b)}>
                  <td>{b.idx}</td>
                  <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => e.preventDefault()}>{b.hash}</a></td>
                  <td>{b.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      </div></div>
    </div>
  );
}

// ── Blocks ───────────────────────────────────────────────────────────────
function Blocks({ onBlock }) {
  const rows = [...BLOCKS, ...BLOCKS.map((b, i) => ({ ...b, idx: b.idx - 5 - i, txns: ((i * 3) % 5) + 1 }))];
  return (
    <div className="container-fluid"><div className="row my-3"><div className="col">
      <div className="card bg-light"><div className="card-body">
        <div className="card-title h5">Blocks</div>
        <table className="table table-hover">
          <thead><tr><th>#</th><th>Hash</th><th>Timestamp</th><th>Txns</th></tr></thead>
          <tbody className="font-monospace">
            {rows.map((b, i) => (
              <tr key={i} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onBlock(b)}>
                <td>{b.idx}</td>
                <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => e.preventDefault()}>{b.hash}</a></td>
                <td>{b.ts}</td><td>{b.txns}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination">
          <li className="page-item disabled"><span className="page-link">Previous</span></li>
          <li className="page-item active"><a className="page-link" href="#" onClick={(e) => e.preventDefault()}>1</a></li>
          <li className="page-item"><a className="page-link" href="#" onClick={(e) => e.preventDefault()}>2</a></li>
          <li className="page-item"><a className="page-link" href="#" onClick={(e) => e.preventDefault()}>3</a></li>
          <li className="page-item"><a className="page-link" href="#" onClick={(e) => e.preventDefault()}>Next</a></li>
        </ul>
      </div></div>
    </div></div></div>
  );
}

// ── Subjects ───────────────────────────────────────────────────────────────
function Subjects({ onSubject }) {
  return (
    <div className="container-fluid"><div className="row my-3"><div className="col">
      <div className="card bg-light"><div className="card-body">
        <div className="card-title h5">Subjects</div>
        <table className="table table-hover">
          <thead><tr><th>#</th><th>Subject</th><th>Opposition</th><th>Support</th><th>Net</th><th>Total</th></tr></thead>
          <tbody>
            {SUBJECTS.map((s, i) => (
              <tr key={s.subject} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onSubject(s)}>
                <td>{i + 1}</td>
                <td><a href="#" onClick={(e) => e.preventDefault()}>{s.subject}</a></td>
                <td>{s.opposition}</td>
                <td>{s.support}</td>
                <td><NetStance opposition={s.opposition} support={s.support} /></td>
                <td>{s.opposition + s.support}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div></div></div>
  );
}

// ── Subject detail ─────────────────────────────────────────────────────────
function SubjectDetail({ subject, onNav, onTx }) {
  const s = subject || SUBJECTS[0];
  const flows = (n, base) => Array.from({ length: n }, (_, i) => ({ amount: base - i * 17, txid: hash((base + i).toString(16) + 'a9c1e8b2d7') }));
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <p className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); onNav('Subjects'); }}>&larr; Subjects</a></p>
        <h3>{s.subject}</h3>
        <p className="h5">Net: <NetStance opposition={s.opposition} support={s.support} /></p>
      </div></div>
      <div className="row my-3">
        <div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">Opposition</div>
            <p className="h4">{s.opposition} <small className="text-muted">grains</small></p>
            <table className="table table-hover">
              <thead><tr><th>Amount</th><th>Transaction</th></tr></thead>
              <tbody className="font-monospace">
                {flows(3, s.opposition).map((f, i) => (
                  <tr key={i}><td>{f.amount}</td><td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => { e.preventDefault(); onTx && onTx(f.txid); }}>{f.txid}</a></td></tr>
                ))}
              </tbody>
            </table>
          </div></div>
        </div>
        <div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">Support</div>
            <p className="h4">{s.support} <small className="text-muted">grains</small></p>
            <table className="table table-hover">
              <thead><tr><th>Amount</th><th>Transaction</th></tr></thead>
              <tbody className="font-monospace">
                {flows(4, s.support).map((f, i) => (
                  <tr key={i}><td>{f.amount}</td><td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => { e.preventDefault(); onTx && onTx(f.txid); }}>{f.txid}</a></td></tr>
                ))}
              </tbody>
            </table>
          </div></div>
        </div>
      </div>
    </div>
  );
}

// ── Verify ───────────────────────────────────────────────────────────────
function Verify() {
  const [state, setState] = React.useState('idle'); // idle | verified
  return (
    <div className="container-fluid"><div className="row my-3"><div className="col">
      <div className="card bg-light"><div className="card-body">
        <div className="card-title h5">Verify a stake</div>
        <p>Paste a <code>gc-msg-v1</code> stake attestation to check it against the chain.</p>
        <textarea className="form-control" rows="6" defaultValue={'{"scheme":"gc-msg-v1","claim":{"kind":"support","subject":"Local Library","amount":420},"address":"gc1q9zk7m4x2v8h3jp0…","sig":"…"}'}></textarea>
        <button className="btn btn-primary mt-2" onClick={() => setState('verified')}>Verify</button>
        {state === 'verified' && (
          <div className="mt-3 d-flex align-items-start gap-3">
            <Seal verified />
            <ul className="list-unstyled mt-1 mb-0">
              {['Signature', 'On-chain', 'Consistent'].map((c) => (
                <li key={c} style={{ padding: '0.2rem 0' }}><span style={{ color: 'var(--support)', fontWeight: 700 }}>✓</span> {c}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="small text-muted mt-3 mb-0">Have a stake to prove? Create a signed attestation on the <a href="#" onClick={(e) => e.preventDefault()}>Transact page</a>.</p>
      </div></div>
    </div></div></div>
  );
}

// ── Transaction detail (faithful to base transaction.html) ──────────────
const TX_ELLIP = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 };
function Transaction({ txid, onNav, onTx }) {
  const id = txid || '4f2a9c1e8b7d3a5f0c2e6b8d1a4f7c9e3b5d8a0c2e4f6b8d0a2c4e6f8b1d3a5c';
  const blockHash = '00000a3f9c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b';
  const inflows = [
    { txid: 'c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7a9c1e', idx: 0, amount: 500 },
    { txid: 'f1a8c3e9b2d5074a6f8c1e3b5d7029a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6', idx: 1, amount: 320 },
  ];
  const outflows = [
    { kind: 'support', target: 'Local Library', addr: false, amount: 420 },
    { kind: 'opposition', target: 'Toll Road', addr: false, amount: 150 },
    { kind: 'transfer', target: 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4', addr: true, amount: 200 },
    { kind: 'rescind', target: 'Parking Fees', addr: false, amount: 50 },
  ];
  const inflowTotal = inflows.reduce((a, b) => a + b.amount, 0);
  const outflowTotal = outflows.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <p className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); onNav('Subjects'); }}>&larr; back</a></p>
        <div className="card bg-light"><div className="card-body">
          <div className="card-title h5">Transaction</div>
          <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <tbody className="font-monospace">
              <tr><th className="col-2"><i className="bi-hash"></i>&nbsp;&nbsp;ID</th><td style={TX_ELLIP}>{id}</td></tr>
              <tr><th className="col-2"><i className="bi-activity"></i>&nbsp;&nbsp;Status</th><td><span className="badge bg-success">Confirmed</span> 6 confirmations</td></tr>
              <tr><th className="col-2"><i className="bi-box"></i>&nbsp;&nbsp;Block</th><td style={TX_ELLIP}><a href="#" onClick={(e) => e.preventDefault()}>{blockHash}</a></td></tr>
              <tr><th className="col-2"><i className="bi-outlet"></i>&nbsp;&nbsp;Version</th><td>1</td></tr>
              <tr><th className="col-2"><i className="bi-clock"></i>&nbsp;&nbsp;Timestamp</th><td>2026-06-13 14:02:11 UTC</td></tr>
              <tr><th className="col-2"><i className="bi-person"></i>&nbsp;&nbsp;Address</th><td style={TX_ELLIP}>gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4</td></tr>
              <tr><th className="col-2"><i className="bi-key"></i>&nbsp;&nbsp;Public Key</th><td style={TX_ELLIP}>02a7c4e9b1d3f5a7c9e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2</td></tr>
              <tr><th className="col-2"><i className="bi-check"></i>&nbsp;&nbsp;Signature</th><td style={TX_ELLIP}>3045022100c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b…</td></tr>
            </tbody>
          </table>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card bg-light"><div className="card-body">
          <div className="card-title h5">UTXO Inflows</div>
          <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <thead><tr><th className="col-8">Outflow Transaction ID</th><th className="col-1">Index</th><th className="col-3">Amount</th></tr></thead>
            <tbody className="font-monospace">
              {inflows.map((i, n) => (
                <tr key={n} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onTx && onTx(i.txid)}>
                  <td style={TX_ELLIP}><a href="#" onClick={(e) => e.preventDefault()}>{i.txid}</a></td><td>{i.idx}</td><td>{i.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-monospace"><tr><td></td><td></td><td>{inflowTotal}</td></tr></tfoot>
          </table>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card bg-light"><div className="card-body">
          <div className="card-title h5">UTXO Outflows</div>
          <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <thead><tr><th className="col-1">Index</th><th className="col-2">Kind</th><th className="col-7">Target</th><th className="col-2">Amount</th></tr></thead>
            <tbody className="font-monospace">
              {outflows.map((o, n) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td><OutflowBadge kind={o.kind} /></td>
                  <td style={TX_ELLIP}>{o.addr ? o.target : <span>{o.target} <em className="text-muted">(subject)</em></span>}</td>
                  <td>{o.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-monospace"><tr><td></td><td></td><td></td><td>{outflowTotal}</td></tr></tfoot>
          </table>
        </div></div>
      </div></div>
    </div>
  );
}

// ── Chains (chains.html) ───────────────────────────────────────────────────
function Chains({ onBlock }) {
  const chains = [
    { id: 0, idx: 184213, hash: BLOCKS[0].hash, ts: BLOCKS[0].ts, main: true },
    { id: 1, idx: 184207, hash: '00000b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e', ts: '2026-06-13 12:54:02', main: false },
  ];
  return (
    <div className="container-fluid">
      {chains.map((c) => (
        <div className="row my-3" key={c.id}><div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">Chain {c.id} {c.main ? <span className="badge bg-success">main</span> : <span className="badge bg-secondary">fork</span>}</div>
            <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
              <tbody className="font-monospace">
                <tr><th className="col-2"><i className="bi-info"></i>&nbsp;Last Block Index</th><td>{c.idx.toLocaleString()}</td></tr>
                <tr><th className="col-2"><i className="bi-hash"></i>&nbsp;Last Block Hash</th><td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => { e.preventDefault(); onBlock(c); }}>{c.hash}</a></td></tr>
                <tr><th className="col-2"><i className="bi-clock"></i>&nbsp;Timestamp</th><td>{c.ts} UTC</td></tr>
              </tbody>
            </table>
          </div></div>
        </div></div>
      ))}
    </div>
  );
}

// ── Addresses (addresses.html) ─────────────────────────────────────────────
function Addresses({ onAddress }) {
  return (
    <div className="container-fluid"><div className="row my-3"><div className="col">
      <div className="card bg-light"><div className="card-body">
        <div className="card-title h5">Addresses</div>
        <table className="table table-hover">
          <thead><tr><th>#</th><th>Address</th><th>Balance</th></tr></thead>
          <tbody>
            {ADDRESSES.map((r, i) => (
              <tr key={r.address} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onAddress(r)}>
                <td>{i + 1}</td>
                <td className="font-monospace" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(e) => e.preventDefault()}>{r.address}</a></td>
                <td>{r.ct.toLocaleString()} <small className="text-muted">grains</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div></div></div>
  );
}

// ── Address detail (address.html) ──────────────────────────────────────────
function AddressDetail({ address, onNav, onTx }) {
  const a = address || ADDRESSES[0];
  const holdings = [
    { amount: 500, txid: hash('a1f4b8c6035d7e1a9b') },
    { amount: 420, txid: hash('c3e9b2d5074a6f8c1e') },
    { amount: 320, txid: hash('f7029a4c6e8b0d2f4a') },
  ];
  const txns = [
    { txid: hash('4f2a9c1e8b7d3a5f0c'), ts: '2026-06-13 14:02:11' },
    { txid: hash('9b3f5c2d8e4a06b1f7'), ts: '2026-06-12 21:18:44' },
  ];
  const ell = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 };
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <p className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); onNav('Addresses'); }}>&larr; Addresses</a></p>
        <h3 className="font-monospace" style={{ wordBreak: 'break-all' }}>{a.address}</h3>
        <p className="h4">{a.ct.toLocaleString()} <small className="text-muted">grains</small></p>
      </div></div>
      <div className="row my-3">
        <div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">Holdings</div>
            <table className="table table-hover">
              <thead><tr><th>Amount</th><th>Transaction</th></tr></thead>
              <tbody className="font-monospace">
                {holdings.map((f, i) => (
                  <tr key={i} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onTx(f.txid)}>
                    <td>{f.amount}</td><td style={ell}><a href="#" onClick={(e) => e.preventDefault()}>{f.txid}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div></div>
        </div>
        <div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">Transactions</div>
            <table className="table table-hover">
              <thead><tr><th>Transaction</th><th>Timestamp</th></tr></thead>
              <tbody className="font-monospace">
                {txns.map((t, i) => (
                  <tr key={i} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onTx(t.txid)}>
                    <td style={ell}><a href="#" onClick={(e) => e.preventDefault()}>{t.txid}</a></td><td>{t.ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div></div>
        </div>
      </div>
    </div>
  );
}

// ── Mempool (mempool.html) ─────────────────────────────────────────────────
function Mempool({ onTx }) {
  return (
    <div className="container-fluid"><div className="row my-3"><div className="col">
      <div className="card bg-light"><div className="card-body">
        <div className="card-title h5">Mempool <span className="small text-muted">({MEMPOOL.length} pending)</span></div>
        <table className="table table-hover">
          <thead><tr><th>Txid</th><th>Timestamp</th><th>Inflows</th><th>Outflows</th><th>Total out</th></tr></thead>
          <tbody className="font-monospace">
            {MEMPOOL.map((e, i) => (
              <tr key={i} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onTx(e.txid)}>
                <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 }}><a href="#" onClick={(ev) => ev.preventDefault()}>{e.txid}</a></td>
                <td>{e.ts}</td><td>{e.inflows}</td><td>{e.outflows}</td>
                <td>{e.total_out} <span className="small text-muted">grains</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div></div></div>
  );
}

// ── Key gate (_key_import.html) — the three-state signing-key panel ────────
function KeyGate({ initial = 'locked' }) {
  const [state, setState] = React.useState(initial); // none | locked | unlocked
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  return (
    <div>
      {state === 'none' && (
        <div>
          <div className="fw-semibold">Create your signing key</div>
          <p className="small text-muted mb-2">Your signing key marks your stakes as yours. It is created in your browser and saved encrypted on this device — it is never sent anywhere.</p>
          <label className="form-label">Passphrase</label>
          <input type="password" className="form-control" placeholder="choose a passphrase" />
          <div className="form-check mt-2">
            <input type="checkbox" className="form-check-input" id="kg-ack" />
            <label className="form-check-label small" htmlFor="kg-ack">Persist only on a node you trust: this saves your encrypted key in this browser, on this site.</label>
          </div>
          <button className="btn btn-primary btn-sm mt-2" onClick={() => setState('unlocked')}>Create your signing key</button>
        </div>
      )}
      {state === 'locked' && (
        <div>
          <div className="fw-semibold">Your signing key <span className="badge bg-secondary">locked</span></div>
          <p className="small text-muted mb-2">Saved on this device as <code>{addr}</code>. Unlock it to sign.</p>
          <label className="form-label">Passphrase</label>
          <input type="password" className="form-control" placeholder="your key passphrase" />
          <div className="mt-2"><button className="btn btn-primary btn-sm" onClick={() => setState('unlocked')}>Unlock</button></div>
        </div>
      )}
      {state === 'unlocked' && (
        <div>
          <span className="badge bg-success" style={{ marginRight: '0.5rem' }}>Unlocked · {addr.slice(0, 14)}…</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setState('locked')}>Lock</button>
        </div>
      )}
      <div className="mt-3">
        <a className="small text-decoration-none" href="#" onClick={(e) => e.preventDefault()}>▸ Advanced: use a one-session key instead</a>
      </div>
    </div>
  );
}

// ── Transact (transact.html) ───────────────────────────────────────────────
function Transact({ onNav }) {
  const [type, setType] = React.useState('transfer');
  const showAddress = type === 'transfer';
  const showSubject = type === 'opposition' || type === 'support' || type === 'rescind';
  const showKind = type === 'rescind';
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <div className="alert alert-warning" role="alert"><strong>Your private key never leaves your browser</strong> — signing happens here, and only signatures are sent.</div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body">
          <div className="card-title h5">Build &amp; sign a transaction</div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="transfer">transfer</option>
              <option value="opposition">opposition</option>
              <option value="support">support</option>
              <option value="rescind">rescind</option>
            </select>
          </div>
          <div className="mb-3"><label className="form-label">Amount (grains)</label><input type="number" min="1" step="1" className="form-control" placeholder="100" /></div>
          {showAddress && <div className="mb-3"><label className="form-label">Destination address</label><input type="text" className="form-control" placeholder="GC...GC" /></div>}
          {showSubject && <div className="mb-3"><label className="form-label">Subject</label><input type="text" className="form-control" placeholder="goblins" /></div>}
          {showKind && <div className="mb-3"><label className="form-label">Rescind kind</label><select className="form-select"><option value="opposition">opposition</option><option value="support">support</option></select></div>}
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body"><KeyGate /></div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body">
          <button className="btn btn-primary">Build &amp; review</button>
          <div className="mt-3"><pre className="small bg-light p-2" style={{ minHeight: '2.5rem', margin: 0 }}></pre></div>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <p className="small text-muted">Looking for the power tools? Broadcasting a pre-signed transaction and signing stake attestations live on <a href="#" onClick={(e) => { e.preventDefault(); onNav('Advanced'); }}>Advanced tools</a>.</p>
      </div></div>
    </div>
  );
}

// ── Advanced (advanced.html) ───────────────────────────────────────────────
function Advanced({ onNav }) {
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <div className="alert alert-warning" role="alert"><strong>Your private key never leaves your browser.</strong> This node does not store it, and reloading or closing this tab clears it. Only your signature and public key are ever sent.</div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body"><div className="card-title h5">Signing key</div><KeyGate /></div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body">
          <div className="card-title h5"><a className="text-decoration-none" href="#" onClick={(e) => e.preventDefault()}>Broadcast a pre-signed transaction</a></div>
          <p className="small text-muted">Paste an already-signed transaction JSON. The submit request itself is still authed, so the imported key signs the request envelope.</p>
          <textarea className="form-control" rows="5" placeholder={'{"txid":"...","signature":"...", ...}'}></textarea>
          <button className="btn btn-primary mt-2">Submit</button>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <section className="card"><div className="card-body">
          <div className="card-title h5">Sign a stake attestation</div>
          <p className="small text-muted">Produce a signed <code>gc-msg-v1</code> proof that you staked on a subject — the producer side of <a href="#" onClick={(e) => { e.preventDefault(); onNav('Verify'); }}>Verify</a>.</p>
          <div className="mb-3"><label className="form-label">Transaction id (txid)</label><input type="text" className="form-control" placeholder="64-char hex txid of your stake" /></div>
          <div className="mb-3"><label className="form-label">Kind</label><select className="form-select"><option>opposition</option><option>support</option></select></div>
          <div className="mb-3"><label className="form-label">Subject</label><input type="text" className="form-control" placeholder="goblins" /></div>
          <div className="mb-3"><label className="form-label">Amount (grains)</label><input type="number" min="1" step="1" className="form-control" placeholder="300" /></div>
          <button className="btn btn-primary">Sign attestation</button>
          <div className="mt-3"><pre className="small bg-light p-2" style={{ minHeight: '2.5rem', margin: 0 }}></pre><p className="small text-muted mb-0">Paste this into Verify.</p></div>
        </div></section>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body">
          <div className="card-title h5">Verify a stake attestation</div>
          <p className="small text-muted mb-0">Check a proof someone shared with you against the chain on <a href="#" onClick={(e) => { e.preventDefault(); onNav('Verify'); }}>Verify</a>.</p>
        </div></div>
      </div></div>
    </div>
  );
}

// ── Signing key page (signing_key.html — has-key state) ────────────────────
function SigningKey() {
  const [unlocked, setUnlocked] = React.useState(false);
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <div className="alert alert-warning" role="alert"><strong>Persist only on a node you trust — its page can use your key while unlocked.</strong> A saved signing key is stored <em>encrypted</em> in this browser, scoped to this origin. Your passphrase and private key never leave the browser.</div>
      </div></div>
      <div className="row my-3"><div className="col">
        <div className="card"><div className="card-body">
          <div className="card-title h5">Saved signing key on this node</div>
          <p className="mb-3 font-monospace">Address: <code>{addr}</code> {unlocked ? <span className="badge bg-success">unlocked</span> : <span className="badge bg-secondary">locked</span>}</p>

          {!unlocked ? (
            <div className="mb-4">
              <div className="h6">Unlock</div>
              <div className="mb-2"><label className="form-label">Passphrase</label><input type="password" className="form-control" placeholder="your passphrase" /></div>
              <button className="btn btn-primary" onClick={() => setUnlocked(true)}>Unlock</button>
            </div>
          ) : (
            <div className="mb-4"><button className="btn btn-outline-secondary" onClick={() => setUnlocked(false)}>Lock</button></div>
          )}
          <hr />
          <div className="mb-4">
            <div className="h6">Download an encrypted backup</div>
            <p className="small text-muted">Exports the encrypted backup blob (safe to store). This is your recovery path. Lose both the passphrase and the backup and the signing key is unrecoverable.</p>
            <div className="mb-2"><label className="form-label">Passphrase</label><input type="password" className="form-control" placeholder="your passphrase" /></div>
            <button className="btn btn-secondary" disabled={!unlocked}>Download backup</button>
          </div>
          <hr />
          <div className="mb-2">
            <div className="h6">Forget this signing key</div>
            <p className="small text-muted">Deletes the saved encrypted record from this node. Make sure you have a backup first.</p>
            <button className="btn btn-outline-danger">Forget signing key</button>
          </div>
        </div></div>
      </div></div>
    </div>
  );
}

// ── Block detail (block.html) ───────────────────────────────────
function BlockDetail({ block, onNav, onTx }) {
  const b = block || BLOCKS[0];
  const idxNum = typeof b.idx === 'number' ? b.idx : parseInt(String(b.idx).replace(/,/g, ''), 10);
  const prevHash = '00000c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7';
  const txns = [
    { txid: hash('4f2a9c1e8b7d3a5f0c'), ts: b.ts, coinbase: true },
    { txid: hash('9b3f5c2d8e4a06b1f7'), ts: b.ts, coinbase: false },
    { txid: hash('c1e8b2d7a4f06e5c9b'), ts: b.ts, coinbase: false },
  ];
  const ell = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 0 };
  return (
    <div className="container-fluid">
      <div className="row my-3"><div className="col">
        <p className="mb-1"><a href="#" onClick={(e) => { e.preventDefault(); onNav('Blocks'); }}>&larr; Blocks</a></p>
        <div className="card bg-light"><div className="card-body">
          <div className="card-title h5">Block</div>
          <table className="table table-hover" style={{ tableLayout: 'fixed' }}>
            <tbody className="font-monospace">
              <tr><th className="col-3"><i className="bi-info"></i>&nbsp;Index</th><td>{idxNum.toLocaleString()}</td></tr>
              <tr><th className="col-3"><i className="bi-hash"></i>&nbsp;Hash</th><td style={ell}>{b.hash}</td></tr>
              <tr><th className="col-3"><i className="bi-bullseye"></i>&nbsp;Target</th><td style={ell}>0000ffff00000000000000000000000000000000000000000000000000000000</td></tr>
              <tr><th className="col-3"><i className="bi-outlet"></i>&nbsp;Version</th><td>1</td></tr>
              <tr><th className="col-3"><i className="bi-clock"></i>&nbsp;Timestamp</th><td>{b.ts} UTC</td></tr>
              <tr><th className="col-3"><i className="bi-bookmark-check"></i>&nbsp;Proof Of Work</th><td>1,284,553</td></tr>
              <tr><th className="col-3"><i className="bi-diagram-2"></i>&nbsp;Merkle Root</th><td style={ell}>7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b00000a3f9c1e8b2d</td></tr>
              <tr><th className="col-3"><i className="bi-box-arrow-in-left"></i>&nbsp;Previous Block Hash</th><td style={ell}><a href="#" onClick={(e) => { e.preventDefault(); onNav('Blocks'); }}>{prevHash}</a></td></tr>
              <tr><th className="col-3"><i className="bi-box-arrow-in-right"></i>&nbsp;Next Block Hash</th><td className="text-muted">None</td></tr>
            </tbody>
          </table>
        </div></div>
      </div></div>

      <div className="row my-3"><div className="col">
        <div className="card bg-light"><div className="card-body">
          <div className="h5">Block Transactions</div>
          <table className="table table-hover table-sm" style={{ tableLayout: 'fixed' }}>
            <thead><tr><th className="col-9">Transaction ID</th><th>Timestamp</th></tr></thead>
            <tbody className="font-monospace">
              {txns.map((t, i) => (
                <tr key={i} className="clickable" style={{ cursor: 'pointer' }} onClick={() => onTx(t.txid)}>
                  <td style={ell}><i className={t.coinbase ? 'bi-award' : 'bi-shuffle'} title={t.coinbase ? 'COINBASE' : 'TRANSACTION'}></i>&nbsp;{t.txid}</td>
                  <td>{t.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      </div></div>
    </div>
  );
}

function ExplorerApp() {
  const [view, setView] = React.useState('Home');
  const [block, setBlock] = React.useState(null);
  const [subject, setSubject] = React.useState(null);
  const [txid, setTxid] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [theme, setTheme] = React.useState(false); // false = vanilla Bootstrap; true = 2B2F hub skin
  const onNav = (v) => { setView(v); window.scrollTo({ top: 0 }); };
  const openBlock = (b) => { setBlock(b); setView('BlockDetail'); window.scrollTo({ top: 0 }); };
  const openSubject = (s) => { setSubject(s); setView('SubjectDetail'); window.scrollTo({ top: 0 }); };
  const openTx = (t) => { setTxid(t); setView('Transaction'); window.scrollTo({ top: 0 }); };
  const openAddress = (a) => { setAddress(a); setView('AddressDetail'); window.scrollTo({ top: 0 }); };
  const KNOWN = ['Home', 'Chains', 'Blocks', 'BlockDetail', 'Subjects', 'SubjectDetail', 'Addresses', 'AddressDetail', 'Mempool', 'Transaction', 'Transact', 'Advanced', 'Signing key', 'Verify'];
  return (
    <div className={theme ? 'theme-2b2f' : ''} style={{ minHeight: '100vh', background: theme ? 'var(--bg-page)' : '#fff' }}>
      <Nav view={view} onNav={onNav} theme={theme} onToggleTheme={() => setTheme((t) => !t)} />
      {view === 'Home' && <Home onNav={onNav} onBlock={openBlock} />}
      {view === 'Chains' && <Chains onBlock={openBlock} />}
      {view === 'Blocks' && <Blocks onBlock={openBlock} />}
      {view === 'BlockDetail' && <BlockDetail block={block} onNav={onNav} onTx={openTx} />}
      {view === 'Subjects' && <Subjects onSubject={openSubject} />}
      {view === 'SubjectDetail' && <SubjectDetail subject={subject} onNav={onNav} onTx={openTx} />}
      {view === 'Addresses' && <Addresses onAddress={openAddress} />}
      {view === 'AddressDetail' && <AddressDetail address={address} onNav={onNav} onTx={openTx} />}
      {view === 'Mempool' && <Mempool onTx={openTx} />}
      {view === 'Transaction' && <Transaction txid={txid} onNav={onNav} onTx={openTx} />}
      {view === 'Transact' && <Transact onNav={onNav} />}
      {view === 'Advanced' && <Advanced onNav={onNav} />}
      {view === 'Signing key' && <SigningKey />}
      {view === 'Verify' && <Verify />}
      {!KNOWN.includes(view) && (
        <div className="container-fluid"><div className="row my-3"><div className="col">
          <div className="card bg-light"><div className="card-body">
            <div className="card-title h5">{view}</div>
            <p className="text-muted mb-0">This vanilla view isn't recreated in the kit.</p>
          </div></div>
        </div></div></div>
      )}
      <Footer theme={theme} />
    </div>
  );
}

Object.assign(window, { ExplorerApp });

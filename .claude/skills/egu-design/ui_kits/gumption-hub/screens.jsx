/* gumption-hub UI kit — shared screens, composed from the EGU component bundle.
   A faithful recreation of the live landing page (templates/index.html) plus
   the verify/proof card, with the design system's motion layer switched on. */
const { Button, Card, LedgerBoard, Ticker, Seal, KindLabel, Grit, HeroLogo, WordmarkLockup } =
  window.ExtendedGumptionUniverseDesignSystem_a80556;

// ── Nav ──────────────────────────────────────────────────────────────────
function NavBar({ onNav }) {
  const link = { color: 'var(--ink)', fontSize: 'var(--fs-body)', padding: '0.5rem 0.7rem', textDecoration: 'none', cursor: 'pointer' };
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1.5rem', gap: '0.25rem' }}>
      <WordmarkLockup size={30} wordmarkSize={16} wordmark="Gumption" animate={false} onClick={() => onNav('landing')} style={{ cursor: 'pointer', marginRight: '0.6rem' }} />
      <a style={link} onClick={() => onNav('landing')}>Chain ▾</a>
      <a style={{ ...link, marginLeft: 'auto', color: 'var(--gold-dark)', fontWeight: 600 }} onClick={() => onNav('you')}>@thomas</a>
    </nav>
  );
}

// ── Hero — the animated Gumption G ─────────────────────────────────────────
function Hero() {
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0 2rem' }}>
      <div className="egu-anim-rise" style={{ display: 'inline-block' }}>
        <HeroLogo size={150} />
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-dark)', letterSpacing: '0.04em', marginTop: '0.5rem', fontSize: 'var(--fs-hero)', textTransform: 'uppercase' }}>
        The Extended Gumption Universe
      </h1>
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────
function Landing({ onNav }) {
  const board = [
    { subject: 'Local Library', support: 4.2, opposition: 1.6, href: '#' },
    { subject: 'City Budget', support: 8.5, opposition: 6.2, href: '#' },
    { subject: 'Parking Fees', support: 2.1, opposition: 3.9, href: '#' },
    { subject: 'Night Market', support: 12.0, opposition: 0.5, href: '#' },
    { subject: 'Toll Road', support: 1.2, opposition: 9.4, href: '#' },
  ];
  const ticker = [
    { kind: 'support', subject: 'Local Library', amount: '4.20', signer: '@thomas', age: '2m' },
    { kind: 'opposition', subject: 'Toll Road', amount: '3.10', signer: '@dana', age: '9m' },
    { kind: 'support', subject: 'Night Market', amount: '12.00', signer: '@rey', age: '1h' },
    { kind: 'opposition', subject: 'Parking Fees', amount: '1.50', signer: '@kai', age: '3h' },
    { kind: 'support', subject: 'City Budget', amount: '8.50', signer: '@mara', age: '5h' },
  ];

  return (
    <div style={{ maxWidth: 'var(--w-landing)', margin: '0 auto', padding: '0 1rem' }}>
      <Hero />

      <div className="egu-anim-rise" style={{ animationDelay: '80ms' }}>
        <Card kicker="EGU member · the chain" title="GumptionChain"
              tagline="The Great Ledger of Grievances & Commendations">
          <LedgerBoard rows={board} />
          <div style={{ margin: '1rem 0' }}>
            <Ticker items={ticker} duration={42} />
          </div>
          <p className="chain-pulse" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            height 184,213 · 27.9 <Grit size={16} /> staked · 5 subjects ·
            {' '}<a onClick={() => onNav('about')} style={{ cursor: 'pointer' }}>full chain →</a>
          </p>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--wash-strong)', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <Button variant="outline-gold" onClick={() => onNav('about')}>How it works</Button>
            <Button variant="gold" onClick={() => onNav('onboarding')}>Get your key →</Button>
          </div>
        </Card>
      </div>

      <div className="egu-anim-rise" style={{ animationDelay: '160ms' }}>
        <Card interactive style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className="egu-kicker">EGU member · the game</p>
          <img src="../../assets/tbtf-logo.svg" alt="Too Big To Fail" style={{ width: '14rem', maxWidth: '70%', margin: '0.25rem auto 0', display: 'block' }} />
          <p className="egu-card-blurb">The classic board game Acquire — reimagined online. Free to play, right in your browser.</p>
          <a className="member-go" style={{ color: 'var(--gold-dark)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>play → earn <Grit size={17} /> GRIT →</a>
        </Card>
      </div>

      <div className="egu-anim-rise" style={{ animationDelay: '240ms' }}>
        <Card teaser title="More games" style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className="egu-card-blurb">Coming to the universe.</p>
          <a className="member-go" style={{ color: 'var(--gold-dark)', fontWeight: 600, cursor: 'pointer' }}>join the EGU →</a>
        </Card>
      </div>
    </div>
  );
}

// ── Proof / verify card ──────────────────────────────────────────────────
function ProofCard({ onNav }) {
  const [verified, setVerified] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setVerified(true), 700); return () => clearTimeout(t); }, []);
  const checks = [
    { k: 'Signature', label: 'Signed by the staker’s key' },
    { k: 'On-chain', label: 'Found in the longest chain' },
    { k: 'Consistent', label: 'Matches the recorded stake' },
  ];
  return (
    <div style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <p style={{ textAlign: 'center', fontSize: 'var(--fs-lead)', margin: '0 0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        “4.20 <Grit size={20} /> in <KindLabel kind="support" /> of the Local Library.”
      </p>
      <div className="gc-card egu-anim-rise">
        <div className="gc-card-head">
          <Seal verified={verified} />
          <h2>Verified on GumptionChain</h2>
        </div>
        <div className="gc-row"><div className="k">Claim</div><div className="v"><KindLabel kind="support" /> · <span className="tn">4.20 GRIT</span> on “Local Library”</div></div>
        <div className="gc-row"><div className="k">Signer</div><div className="v"><strong>@thomas</strong> <a href="#" style={{ fontSize: '.85rem' }}>github ✓</a><br /><span className="mono" style={{ fontSize: '.85rem', color: 'var(--gold-dark)' }}>gc1q9zk7m4x2v8h3jp0…</span></div></div>
        <div className="gc-row"><div className="k">Transaction</div><div className="v"><span className="mono" style={{ fontSize: '.85rem', color: 'var(--gold-dark)' }}>4f2a9c1e8b…</span> · <span className="tn">block 184,210</span></div></div>
      </div>

      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-card)', padding: '1rem', marginTop: '1rem', background: 'var(--paper-card)' }}>
        <strong>Verified live in your browser</strong>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0' }}>
          {checks.map((c, i) => (
            <li key={c.k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0', opacity: verified ? 1 : 0.4, transition: 'opacity var(--dur-base) var(--ease-out)', transitionDelay: `${i * 120}ms` }}>
              <span style={{ color: verified ? 'var(--support)' : 'var(--muted-gold)', fontWeight: 700 }}>{verified ? '✓' : '…'}</span>
              <span><strong>{c.k}</strong> — <span style={{ color: 'var(--muted)' }}>{c.label}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button variant="outline-gold" size="sm">Copy link</Button>
        <Button variant="outline-gold" size="sm">Copy post text</Button>
        <Button variant="outline-gold" size="sm">Share on Mastodon</Button>
      </div>
      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('landing')} style={{ cursor: 'pointer' }}>← back to the universe</a></p>
    </div>
  );
}

// ── About ──────────────────────────────────────────────────────────────────
function About({ onNav }) {
  return (
    <div className="member-page" style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <p className="egu-kicker">about</p>
      <h1 style={{ fontSize: 'var(--fs-h1)' }}>About the EGU</h1>
      <p>The <strong>Extended Gumption Universe</strong> is a family of games and tools tied together by <strong>GumptionChain</strong> — a proof-of-work chain where grains are staked as <KindLabel kind="opposition" /> or <KindLabel kind="support" /> for subjects.</p>
      <p>Gumption is measured in grains (100 grains to a grit). You earn it in EGU games, stake it on the subjects you care about, and the chain keeps the receipts: any stake can be turned into a portable proof and verified by anyone, anywhere.</p>
      <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1.5rem' }}>Members</h2>
      <ul style={{ lineHeight: 1.9 }}>
        <li><a style={{ cursor: 'pointer' }}>Too Big To Fail (2b2f)</a> — the classic board game Acquire, reimagined online.</li>
        <li><a style={{ cursor: 'pointer' }} onClick={() => onNav('proof')}>GumptionChain</a> — the chain itself: explorer, wallet, transacting, verification.</li>
        <li>More games coming.</li>
      </ul>
      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('landing')} style={{ cursor: 'pointer' }}>← back to the universe</a></p>
    </div>
  );
}

// ── Contact (contact.html) ──────────────────────────────────────────────────
function Contact({ onNav }) {
  return (
    <div className="member-page" style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <p className="egu-kicker">get in touch</p>
      <h1 style={{ fontSize: 'var(--fs-h1)' }}>Contact</h1>
      <p>Email <a href="mailto:thomas@gumption.com" style={{ cursor: 'pointer' }}>thomas@gumption.com</a>.</p>
      <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1.5rem' }}>On GitHub</h2>
      <ul style={{ lineHeight: 1.9 }}>
        <li><a style={{ cursor: 'pointer' }}>gumptionchain</a> — the chain. Bugs and questions → the <a style={{ cursor: 'pointer' }}>issue tracker</a>.</li>
        <li><a style={{ cursor: 'pointer' }}>gumption-hub</a> — this site. Bugs and questions → the <a style={{ cursor: 'pointer' }}>issue tracker</a>.</li>
      </ul>
      <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1.5rem' }}>Run a node</h2>
      <p>The EGU runs on a small fleet of millers — and it grows one node at a time. Want to mill blocks from your house? Start from the <a style={{ cursor: 'pointer' }}>gumptionchain README</a> and say hello by email; a step-by-step member onboarding guide is on its way.</p>
      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('landing')} style={{ cursor: 'pointer' }}>← back to the universe</a></p>
    </div>
  );
}

// ── Bind (bind.html) — the three-step identity flow ─────────────────────────
function Bind({ onNav }) {
  const [step, setStep] = React.useState(1); // 1 unlock · 2 sign · 3 bind · 4 bound
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const armored = '-----BEGIN GC MESSAGE-----\nplatform: github\nhandle: thomas\naddress: gc1q9zk7m4x2v8h3jp0…\nsig: 3045022100c1e8b2d7a4f06e5c9b81d3f2a7e0c4b…\n-----END GC MESSAGE-----';
  const h2 = { fontSize: 'var(--fs-h2)', marginTop: '1.6rem' };
  const sub = { color: step >= 2 ? 'var(--ink)' : 'var(--muted-gold)', transition: 'color var(--dur-base) var(--ease-out)' };
  return (
    <div className="member-page" style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <p className="egu-kicker">identity</p>
      <h1 style={{ fontSize: 'var(--fs-h1)' }}>Put a name on your gumption</h1>
      <p>Bind your signing key to your GitHub handle so your stakes carry your name. You sign a claim locally; the proof is posted publicly under your handle; the hub checks both directions.</p>

      <h2 style={h2}>1 · Unlock your signing key</h2>
      <p className="small" style={{ color: 'var(--muted)' }}>Uses the signing key saved on this device.</p>
      {step === 1 ? (
        <div>
          <input type="password" className="form-control" placeholder="passphrase" style={{ maxWidth: '22rem' }} />
          <p style={{ marginTop: '0.6rem' }}><Button variant="gold" size="sm" onClick={() => setStep(2)}>Unlock</Button></p>
        </div>
      ) : (
        <p className="mono" style={{ fontSize: 'var(--fs-sm)', color: 'var(--gold-dark)' }}>✓ unlocked · {addr}</p>
      )}

      <h2 style={{ ...h2, ...sub }}>2 · Sign your claim</h2>
      {step >= 2 && (
        <div>
          <input className="form-control" placeholder="github handle" defaultValue="thomas" style={{ maxWidth: '22rem' }} disabled={step > 2} />
          {step === 2 && <p style={{ marginTop: '0.6rem' }}><Button variant="gold" size="sm" onClick={() => setStep(3)}>Sign claim</Button></p>}
          {step >= 3 && (
            <div style={{ marginTop: '0.6rem' }}>
              <textarea className="form-control mono" rows="6" readOnly value={armored} style={{ fontSize: 'var(--fs-sm)' }}></textarea>
              <p className="small" style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>
                <Button variant="outline-gold" size="sm">Copy</Button> → create a new <strong>public gist</strong> containing exactly this block, then paste its URL below.
              </p>
            </div>
          )}
        </div>
      )}

      <h2 style={{ ...h2, color: step >= 3 ? 'var(--ink)' : 'var(--muted-gold)', transition: 'color var(--dur-base) var(--ease-out)' }}>3 · Verify &amp; bind</h2>
      {step >= 3 && (
        <div>
          <input className="form-control" placeholder="https://gist.github.com/you/..." style={{ maxWidth: '30rem' }} disabled={step > 3} />
          {step === 3 && <p style={{ marginTop: '0.6rem' }}><Button variant="gold" size="sm" onClick={() => setStep(4)}>Verify &amp; bind</Button></p>}
          {step === 4 && (
            <div className="gc-card egu-anim-rise" style={{ marginTop: '0.8rem' }}>
              <div className="gc-card-head"><Seal verified /><h2>Bound on GumptionChain</h2></div>
              <div className="gc-row"><div className="k">Handle</div><div className="v">✓ <strong>@thomas</strong> bound to this key</div></div>
              <div className="gc-row"><div className="k">Address</div><div className="v mono" style={{ fontSize: 'var(--fs-sm)', color: 'var(--gold-dark)' }}>{addr}</div></div>
              <div className="gc-row"><div className="k"></div><div className="v"><Button variant="gold" size="sm" onClick={() => onNav('you')}>Go to your gumption →</Button></div></div>
            </div>
          )}
        </div>
      )}

      <h2 style={h2}>Your bindings</h2>
      <div className="small" style={{ color: 'var(--muted)', whiteSpace: 'pre-line' }}>
        {step === 4 ? 'github: @thomas — verified (checked just now)' : 'Unlock to list bindings.'}
      </div>
      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('you')} style={{ cursor: 'pointer' }}>← back to your gumption</a></p>
    </div>
  );
}

// ── You (me.html — “Your Gumption”) ──────────────────────────────────────
function You({ onNav }) {
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const stakes = [
    { kind: 'support', subject: 'Local Library', grit: '4.20', status: 'confirmed' },
    { kind: 'opposition', subject: 'Toll Road', grit: '3.10', status: 'confirmed' },
    { kind: 'support', subject: 'Night Market', grit: '12.00', status: 'pending' },
  ];
  return (
    <div className="member-page" style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: 'var(--fs-h1)' }}>Your Gumption</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap', margin: '0.5rem 0 0.25rem' }}>
        <strong>@thomas</strong>
        <span className="small" style={{ color: 'var(--muted)' }}>github ✓ · <span className="mono" style={{ color: 'var(--gold-dark)' }}>{addr.slice(0, 16)}…</span></span>
      </div>
      <p className="small" style={{ color: 'var(--muted)', margin: '0 0 1rem' }}>
        <a onClick={() => onNav('bind')} style={{ cursor: 'pointer' }}>manage your name →</a> so your shares carry it.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0 1rem' }}>
        <Grit size={30} />
        <span style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-h2)', fontVariantNumeric: 'tabular-nums' }}>27.9</span>
        <span className="egu-kicker" style={{ margin: 0 }}>GRIT balance</span>
      </div>

      <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1rem' }}>Your stakes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
        {stakes.map((s, i) => (
          <div key={i} style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-card)', padding: '0.7rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ flex: 1, minWidth: '14rem' }}>
              You <KindLabel kind={s.kind}>{s.kind === 'opposition' ? 'oppose' : 'support'}</KindLabel> {s.subject} with {s.grit} <Grit size={15} /> grit
              <span className="small" style={{ color: s.status === 'confirmed' ? 'var(--support)' : 'var(--muted-gold)', marginLeft: '0.4rem' }}>· {s.status}</span>
            </span>
            <Button variant="gold" size="sm" disabled={s.status !== 'confirmed'} style={s.status !== 'confirmed' ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>Share</Button>
            <Button variant="outline-gold" size="sm" onClick={() => onNav('proof')}>View</Button>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('landing')} style={{ cursor: 'pointer' }}>← back to the universe</a></p>
    </div>
  );
}

// ── Onboarding (“Get your key”) — create key · back up · bind ──────────────
function Onboarding({ onNav }) {
  const [step, setStep] = React.useState(1); // 1 create · 2 back up · 3 name · 4 done
  const [backed, setBacked] = React.useState(false);
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const stepTitle = (n, txt) => (
    <h2 style={{ fontSize: 'var(--fs-h2)', marginTop: '1.6rem', color: step >= n ? 'var(--gold-deep)' : 'var(--muted-gold)', transition: 'color var(--dur-base) var(--ease-out)' }}>
      {step > n ? '✓' : n} · {txt}
    </h2>
  );
  return (
    <div className="member-page" style={{ maxWidth: 'var(--w-prose)', margin: '0 auto', padding: '1rem' }}>
      <p className="egu-kicker">welcome to the universe</p>
      <h1 style={{ fontSize: 'var(--fs-h1)' }}>Get your key</h1>
      <p>Your signing key is your identity in the EGU — it marks your stakes as yours, the way a seal marks a letter. It’s created right here in your browser and never sent anywhere. One key, and you’re a member.</p>

      {stepTitle(1, 'Create your signing key')}
      {step === 1 ? (
        <div>
          <p className="small" style={{ color: 'var(--muted)' }}>Choose a passphrase. It encrypts your key on this device — there’s no “reset”, so make it one you’ll remember.</p>
          <input type="password" className="form-control" placeholder="choose a passphrase" style={{ maxWidth: '22rem' }} />
          <p style={{ marginTop: '0.6rem' }}><Button variant="gold" onClick={() => setStep(2)}>Create my key</Button></p>
        </div>
      ) : (
        <p className="mono" style={{ fontSize: 'var(--fs-sm)', color: 'var(--gold-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Seal verified size="1.6rem" /> {addr}</p>
      )}

      {stepTitle(2, 'Back it up')}
      {step === 2 && (
        <div>
          <p className="small" style={{ color: 'var(--muted)' }}>This key is the only way to prove your stakes are yours — lose it and it’s gone for good. Save it where you keep your other secrets. (Optional, but strongly encouraged.)</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
            <Button variant="outline-gold" size="sm" onClick={() => setBacked(true)}>Download encrypted backup</Button>
            <Button variant="outline-gold" size="sm" onClick={() => setBacked(true)}>Save to password manager</Button>
          </div>
          {backed && <p className="small" style={{ color: 'var(--support)' }}>✓ Backed up. Keep it somewhere safe.</p>}
          <p style={{ marginTop: '0.6rem' }}>
            <Button variant="gold" size="sm" onClick={() => setStep(3)}>Continue</Button>
            {' '}<a onClick={() => setStep(3)} style={{ cursor: 'pointer', fontSize: 'var(--fs-sm)', marginLeft: '0.5rem' }}>I’ll do this later</a>
          </p>
        </div>
      )}

      {stepTitle(3, 'Put a name on it')}
      {step === 3 && (
        <div>
          <p className="small" style={{ color: 'var(--muted)' }}>Optional — but it makes sharing land. Bind your key to your GitHub handle and the stakes you share carry <strong>@you</strong> instead of a raw address. You can always do this later from your gumption page.</p>
          <p style={{ marginTop: '0.6rem' }}>
            <Button variant="gold" size="sm" onClick={() => onNav('bind')}>Bind to GitHub →</Button>
            {' '}<a onClick={() => setStep(4)} style={{ cursor: 'pointer', fontSize: 'var(--fs-sm)', marginLeft: '0.5rem' }}>Skip for now</a>
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="gc-card egu-anim-rise" style={{ marginTop: '1.6rem' }}>
          <div className="gc-card-head"><Seal verified /><h2>You’re in</h2></div>
          <div style={{ padding: 'var(--space-5)' }}>
            <p style={{ marginTop: 0 }}>Welcome to the Extended Gumption Universe. Your key lives on this device as <span className="mono" style={{ color: 'var(--gold-dark)' }}>{addr.slice(0, 16)}…</span></p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button variant="gold" size="sm" onClick={() => onNav('landing')}>Explore the ledger</Button>
              <Button variant="outline-gold" size="sm" onClick={() => onNav('you')}>Your gumption</Button>
              <Button variant="outline-gold" size="sm" onClick={() => onNav('bind')}>Put a name on it</Button>
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop: '1.5rem' }}><a onClick={() => onNav('landing')} style={{ cursor: 'pointer' }}>← back to the universe</a></p>
    </div>
  );
}

function Footer({ onNav }) {
  return (
    <footer style={{ textAlign: 'center', padding: '2.5rem 0 1.5rem', color: 'var(--muted)', fontSize: 'var(--fs-sm)' }}>
      <WordmarkLockup orientation="stacked" size={64} wordmarkSize={18} onClick={() => onNav('landing')} style={{ cursor: 'pointer', marginBottom: '1rem' }} />
      <div>
      <a onClick={() => onNav('about')} style={{ cursor: 'pointer' }}>about</a> &middot; <a onClick={() => onNav('contact')} style={{ cursor: 'pointer' }}>contact</a> &middot; <a style={{ cursor: 'pointer' }}>gumption.com</a> &middot; <a style={{ cursor: 'pointer' }}>Too Big To Fail</a>
      </div>
    </footer>
  );
}

Object.assign(window, { NavBar, Hero, Landing, ProofCard, About, Contact, Bind, You, Onboarding, Footer });

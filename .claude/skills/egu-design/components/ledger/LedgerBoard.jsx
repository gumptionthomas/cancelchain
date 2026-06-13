import React from 'react';

/**
 * LedgerBoard — the Great Ledger's tug-of-war board. Each row is a subject
 * with support pulling left (green) and opposition pulling right (red); bar
 * widths are each side's share of the subject's total stake. Bars grow from
 * the center outward on mount — the signature "movement" of the landing page.
 *
 * GRIT formatting: amounts are in grains (100 grains = 1 grit). Pass `grit`
 * values already converted, or raw grains with `inGrains` to auto-format.
 */
export function LedgerBoard({ rows = [], inGrains = false, style, ...rest }) {
  const fmt = (n) => (inGrains ? (n / 100) : n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ maxWidth: 'var(--w-ledger)', margin: '0 auto var(--space-4)', ...style }} {...rest}>
      {rows.map((row, i) => {
        const total = (row.support || 0) + (row.opposition || 0);
        const supShare = total ? (row.support / total) : 0;
        const oppShare = total ? (row.opposition / total) : 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted-gold)', minWidth: '3rem', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{fmt(row.support)}</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Bar share={supShare} kind="sup" delay={i * 90} />
            </div>
            <a
              href={row.href}
              className="ledger-subject"
              style={{ background: '#fff', border: '1px solid var(--rule-hair)', borderRadius: 'var(--radius-sm)', padding: '0.15rem 0.6rem', minWidth: '7rem', textAlign: 'center', fontWeight: 'var(--fw-semibold)', color: 'inherit', textDecoration: 'none' }}
            >
              {row.subject}
            </a>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Bar share={oppShare} kind="opp" delay={i * 90} />
            </div>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--muted-gold)', minWidth: '3rem', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{fmt(row.opposition)}</span>
          </div>
        );
      })}
      <p style={{ color: 'var(--muted-gold)', fontSize: 'var(--fs-sm)', textAlign: 'center', margin: '0.3rem 0 0' }}>
        {'\u25C0'} support · oppose {'\u25B6'}
      </p>
    </div>
  );
}

function Bar({ share, kind, delay }) {
  const sup = kind === 'sup';
  // Use the patterns.css .ledger-bar classes: they carry the egu-bar-grow
  // entrance AND the prefers-reduced-motion fallback (animation:none -> the
  // bar rests at its natural full width instead of collapsing to scaleX(0)).
  return (
    <div
      className={`ledger-bar ${sup ? 'ledger-bar-sup' : 'ledger-bar-opp'}`}
      style={{
        width: `${(share * 100).toFixed(1)}%`,
        transformOrigin: sup ? 'right center' : 'left center',
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

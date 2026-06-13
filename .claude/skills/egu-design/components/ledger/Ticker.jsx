import React from 'react';

/**
 * Ticker — the stakes marquee. A dark band that scrolls recent stakes
 * continuously (and pauses on hover), inverting the paper palette for
 * high-contrast "live wire" energy. Items duplicate 4× so the loop is seamless.
 */
export function Ticker({ items = [], duration = 60, style, ...rest }) {
  // Repeat the set 4× so a -25% translate loops seamlessly.
  const loop = [0, 1, 2, 3];
  return (
    <div
      className="stakes-ticker"
      style={{ overflow: 'hidden', background: 'var(--ticker-bg)', color: '#fff', padding: 'var(--space-2) 0', borderRadius: 'var(--radius-sm)', ...style }}
      {...rest}
    >
      <div
        className="stakes-ticker-track"
        style={{ '--dur-ticker': `${duration}s` }}
      >
        {loop.map((d) =>
          items.map((it, i) => (
            <React.Fragment key={`${d}-${i}`}>
              <span style={{ display: 'inline-block', padding: '0 1.1rem', fontSize: 'var(--fs-sm)' }}>
                <span style={{ color: 'var(--ticker-muted)', marginRight: '0.3rem' }}>
                  {it.kind === 'opposition' ? 'OPP' : 'SUP'}
                </span>
                <span style={{ fontWeight: 'var(--fw-semibold)', color: it.kind === 'opposition' ? 'var(--ticker-opp)' : 'var(--ticker-sup)' }}>
                  {it.subject} +{it.amount}
                </span>
                {(it.signer || it.age) && (
                  <span style={{ color: 'var(--ticker-muted)', marginLeft: '0.35rem' }}>
                    {it.signer}{it.signer && it.age ? ' · ' : ''}{it.age}
                  </span>
                )}
              </span>
              <span style={{ color: 'var(--ticker-sep)', padding: '0 0.5rem' }}>{'\u2022'}</span>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

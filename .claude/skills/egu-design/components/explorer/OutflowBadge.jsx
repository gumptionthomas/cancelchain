import React from 'react';

/**
 * OutflowBadge — a scannable badge for a transaction outflow's kind:
 * opposition (red), support (green), rescind (gold), or transfer (stone).
 * Ported from the base explorer's `outflow_kind` macro.
 */
export function OutflowBadge({ kind, style, ...rest }) {
  const map = {
    opposition: { bg: 'var(--oppose)', fg: '#fff', label: 'opposition' },
    support: { bg: 'var(--support)', fg: '#fff', label: 'support' },
    rescind: { bg: 'var(--gold)', fg: 'var(--ink)', label: 'rescind' },
    transfer: { bg: 'var(--stone)', fg: '#fff', label: 'transfer' },
  };
  const s = map[kind] || map.transfer;
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        color: s.fg,
        fontSize: '0.75em',
        fontWeight: 'var(--fw-semibold)',
        padding: '0.25em 0.55em',
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1.2,
        ...style,
      }}
      {...rest}
    >
      {s.label}
    </span>
  );
}

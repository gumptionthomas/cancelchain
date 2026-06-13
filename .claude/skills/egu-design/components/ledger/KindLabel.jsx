import React from 'react';

/**
 * KindLabel — renders a stake's verdict ("support" or "opposition") in
 * uppercase Righteous, colored with the semantic green/red. The canonical
 * way to name a stake's direction anywhere in the universe.
 */
export function KindLabel({ kind, children, style, ...rest }) {
  const color = kind === 'opposition' ? 'var(--oppose)' : 'var(--support)';
  return (
    <span
      style={{
        color,
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-heading)',
        ...style,
      }}
      {...rest}
    >
      {children || kind}
    </span>
  );
}

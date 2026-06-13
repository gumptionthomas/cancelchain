import React from 'react';

/**
 * NetStance — a subject's net verdict: which side leads and by how much.
 * Magnitude + word so the meaning is unambiguous (no implicit sign). Green
 * when net-supported, red when net-opposed, muted when even. Ported from the
 * base explorer's `net_stance` macro.
 */
export function NetStance({ opposition = 0, support = 0, style, ...rest }) {
  const net = support - opposition;
  let color = 'var(--muted)';
  let text = 'even';
  if (net > 0) { color = 'var(--support)'; text = `${net} supported`; }
  else if (net < 0) { color = 'var(--oppose)'; text = `${-net} opposed`; }
  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums', ...style }} {...rest}>
      {text}
    </span>
  );
}

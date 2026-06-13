import React from 'react';
import { HeroLogo } from './HeroLogo.jsx';

/**
 * WordmarkLockup — the EGU brand lockup: the HeroLogo mark beside (or above)
 * the “The Extended Gumption Universe” wordmark in Righteous gold. One call for
 * headers, footers, splash screens. Horizontal by default; stacked for hero use.
 */
export function WordmarkLockup({
  orientation = 'horizontal',
  size = 64,
  wordmarkSize,
  animate,
  wordmark = 'The Extended Gumption Universe',
  style,
  ...rest
}) {
  const horizontal = orientation === 'horizontal';
  const wmSize = wordmarkSize == null ? Math.round(size * 0.3) : wordmarkSize;
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        gap: horizontal ? '0.9rem' : '0.6rem',
        ...style,
      }}
      {...rest}
    >
      <HeroLogo size={size} animate={animate} />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--gold-dark)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.12,
          fontSize: `${wmSize}px`,
          textAlign: horizontal ? 'left' : 'center',
          maxWidth: horizontal ? '9ch' : 'none',
        }}
      >
        {wordmark}
      </span>
    </div>
  );
}

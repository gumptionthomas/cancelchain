import React from 'react';

/**
 * Seal — the wax verification seal. Neutral stone until a proof is verified,
 * then it stamps down in gold (overshoot "thunk") and breathes a slow gold
 * pulse. The core trust signal on proof cards.
 *
 * Styling + animation come from the `.seal-dot` classes in patterns.css, which
 * also carry the prefers-reduced-motion fallback — so the verified seal RESTS
 * visibly gold (and survives print / PDF / reduced-motion) instead of being
 * stuck at the animation's hidden start state. Only the size is set inline.
 */
export function Seal({ verified = false, pulsing = true, size = '2.4rem', style, ...rest }) {
  const cls = ['seal-dot'];
  if (verified) cls.push('verified');
  if (verified && pulsing) cls.push('pulsing');
  return (
    <div
      className={cls.join(' ')}
      style={{ width: size, height: size, fontSize: `calc(${size} * 0.54)`, ...style }}
      {...rest}
    >
      {verified ? '\u2713' : ''}
    </div>
  );
}

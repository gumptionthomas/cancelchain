import React from 'react';

/**
 * Grit — the GRIT currency mark. A struck, flat-top hexagonal gold token with
 * a geometric “G” (a chunked torus + a horizontal tube, matching the original
 * Gumption logo construction). GRIT is the unit of value on GumptionChain
 * (100 grains = 1 grit); use this mark wherever an amount of GRIT is shown —
 * balances, the ticker, “earn GRIT” CTAs, wallets.
 *
 * Inline SVG (no asset file needed), recolors via the `mono` variant, and stays
 * crisp from hero size down to a 16px favicon.
 */
export function Grit({ size = 24, mono = false, title = 'GRIT', style, ...rest }) {
  const uid = React.useId().replace(/:/g, '');
  const face = `gf-${uid}`;
  const edge = `ge-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      role="img"
      aria-label={title}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...rest}
    >
      {!mono && (
        <defs>
          <linearGradient id={face} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f5d76e" />
            <stop offset="1" stopColor="#d4a520" />
          </linearGradient>
          <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8c547" />
            <stop offset="1" stopColor="#8b6914" />
          </linearGradient>
        </defs>
      )}

      {mono ? (
        <g>
          <polygon points="101,16 132,70 101,124 39,124 8,70 39,16" fill="#b8960c" />
          <g fill="none" stroke="#fbf8f0" strokeWidth="13" strokeLinecap="round">
            <path d="M97 70 A27 27 0 1 1 89.09 50.91" />
            <path d="M97 70 L70 70" />
          </g>
        </g>
      ) : (
        <g>
          <polygon points="101,16 132,70 101,124 39,124 8,70 39,16" fill={`url(#${edge})`} />
          <polygon points="101,16 132,70 101,124 39,124 8,70 39,16" fill="none" stroke="#6b5608" strokeWidth="1.3" opacity="0.5" />
          <polygon points="39,16 101,16 93,30 47,30" fill="#f3dd8a" opacity="0.5" />
          <polygon points="93,30 116,70 93,110 47,110 24,70 47,30" fill={`url(#${face})`} />
          <g stroke="#6b5608" strokeWidth="1" opacity="0.2">
            <line x1="101" y1="16" x2="93" y2="30" /><line x1="132" y1="70" x2="116" y2="70" /><line x1="101" y1="124" x2="93" y2="110" /><line x1="39" y1="124" x2="47" y2="110" /><line x1="8" y1="70" x2="24" y2="70" /><line x1="39" y1="16" x2="47" y2="30" />
          </g>
          <g fill="none" stroke="#6b5608" strokeWidth="13" strokeLinecap="round">
            <path d="M97 70 A27 27 0 1 1 89.09 50.91" />
            <path d="M97 70 L70 70" />
          </g>
        </g>
      )}
    </svg>
  );
}

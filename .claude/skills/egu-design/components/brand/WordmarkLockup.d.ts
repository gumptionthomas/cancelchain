import * as React from 'react';

/**
 * WordmarkLockup — the EGU brand lockup: HeroLogo mark + the “The Extended
 * Gumption Universe” wordmark (Righteous, gold).
 */
export interface WordmarkLockupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mark beside the wordmark (horizontal) or above it (stacked). Default horizontal. */
  orientation?: 'horizontal' | 'stacked';
  /** HeroLogo size in px; the wordmark scales from it. Default 64. */
  size?: number;
  /** Wordmark font-size in px. Defaults to ~0.3 × size. */
  wordmarkSize?: number;
  /** Forwarded to HeroLogo — omit to auto-respect prefers-reduced-motion. */
  animate?: boolean;
  /** Override the wordmark text. */
  wordmark?: string;
}

export function WordmarkLockup(props: WordmarkLockupProps): JSX.Element;

import * as React from 'react';

/**
 * Seal — the wax verification seal (neutral stone → gold stamp + pulse).
 */
export interface SealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true: gold fill + stamp-in animation. When false: neutral stone. */
  verified?: boolean;
  /** Continue a slow gold pulse after the stamp (default true). */
  pulsing?: boolean;
  /** Diameter as a CSS length (default "2.4rem"). */
  size?: string;
}

export function Seal(props: SealProps): JSX.Element;

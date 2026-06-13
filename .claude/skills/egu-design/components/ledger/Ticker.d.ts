import * as React from 'react';

export interface TickerItem {
  /** Stake direction. */
  kind: 'support' | 'opposition';
  /** Subject name. */
  subject: string;
  /** Amount (already formatted, e.g. "4.20"). */
  amount: string | number;
  /** Optional signer handle (e.g. "@thomas"). */
  signer?: string;
  /** Optional relative age (e.g. "2m"). */
  age?: string;
}

/**
 * Ticker — the dark stakes marquee; scrolls continuously, pauses on hover.
 */
export interface TickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TickerItem[];
  /** Seconds for one full loop (default 60). */
  duration?: number;
}

export function Ticker(props: TickerProps): JSX.Element;

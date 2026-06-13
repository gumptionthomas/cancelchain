import * as React from 'react';

export interface LedgerRow {
  /** Subject name (display text). */
  subject: string;
  /** Support stake (grit, or grains if inGrains). */
  support: number;
  /** Opposition stake (grit, or grains if inGrains). */
  opposition: number;
  /** Optional link to the subject's chain page. */
  href?: string;
}

/**
 * LedgerBoard — the Great Ledger tug-of-war: support left, opposition right.
 */
export interface LedgerBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: LedgerRow[];
  /** Treat support/opposition as raw grains (÷100 to display grit). */
  inGrains?: boolean;
}

export function LedgerBoard(props: LedgerBoardProps): JSX.Element;

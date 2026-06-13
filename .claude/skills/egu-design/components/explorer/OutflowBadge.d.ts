import * as React from 'react';

/**
 * OutflowBadge — kind badge for a transaction outflow.
 */
export interface OutflowBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The outflow kind. */
  kind: 'opposition' | 'support' | 'rescind' | 'transfer';
}

export function OutflowBadge(props: OutflowBadgeProps): JSX.Element;

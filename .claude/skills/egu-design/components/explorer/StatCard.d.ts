import * as React from 'react';

/**
 * StatCard — the explorer headline metric tile (label + big value + unit).
 */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tracked uppercase label (e.g. "Total staked"). */
  label: React.ReactNode;
  /** The metric value (number or formatted string). */
  value: React.ReactNode;
  /** Optional small muted unit after the value (e.g. "grains"). */
  unit?: React.ReactNode;
}

export function StatCard(props: StatCardProps): JSX.Element;

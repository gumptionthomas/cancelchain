import * as React from 'react';

/**
 * KindLabel — a stake's verdict in uppercase Righteous, semantic color.
 */
export interface KindLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The stake direction. */
  kind: 'support' | 'opposition';
  /** Override the displayed text (defaults to the kind word). */
  children?: React.ReactNode;
}

export function KindLabel(props: KindLabelProps): JSX.Element;

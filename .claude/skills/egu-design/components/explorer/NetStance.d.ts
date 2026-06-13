import * as React from 'react';

/**
 * NetStance — a subject's net verdict (n supported / n opposed / even).
 */
export interface NetStanceProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Total opposition grains staked. */
  opposition?: number;
  /** Total support grains staked. */
  support?: number;
}

export function NetStance(props: NetStanceProps): JSX.Element;

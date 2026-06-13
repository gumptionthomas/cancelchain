import * as React from 'react';

/**
 * Grit — the GRIT currency mark (struck gold hex token with the geometric “G”).
 */
export interface GritProps extends React.SVGAttributes<SVGSVGElement> {
  /** Rendered width & height in px (square). Default 24. */
  size?: number;
  /** Single-tone knockout version for stamps / favicons / 1-color contexts. */
  mono?: boolean;
  /** Accessible label (default "GRIT"). */
  title?: string;
}

export function Grit(props: GritProps): JSX.Element;

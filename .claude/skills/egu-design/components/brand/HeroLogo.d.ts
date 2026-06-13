import * as React from 'react';

/**
 * HeroLogo — the EGU hero mark: the green Gumption “G” core with an orbiting
 * gold constellation (the universe of apps).
 */
export interface HeroLogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Rendered width & height in px (square). Default 160. */
  size?: number;
  /** Animate the orbiting satellites (SMIL). Omit to auto-respect prefers-reduced-motion; set explicitly to force on/off. */
  animate?: boolean;
  /** Accessible label. */
  title?: string;
}

export function HeroLogo(props: HeroLogoProps): JSX.Element;

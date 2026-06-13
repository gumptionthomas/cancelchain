import * as React from 'react';

/**
 * Button — the EGU action control (gold / outline-gold / stone).
 */
export interface ButtonProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style. Gold = primary, outline-gold = secondary, stone = tertiary. */
  variant?: 'gold' | 'outline-gold' | 'stone';
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  /** Render as a different element (e.g. 'a' for links). */
  as?: 'button' | 'a';
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;

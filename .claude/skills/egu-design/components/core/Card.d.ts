import * as React from 'react';

/**
 * Card — the EGU gold-wash bloom card (warm paper + top-edge gold glow).
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Small tracked uppercase label above the title (e.g. "EGU member · the chain"). */
  kicker?: React.ReactNode;
  /** Card title (rendered in Righteous, gold-deep). */
  title?: React.ReactNode;
  /** Righteous tagline under the title (gold-dark). */
  tagline?: React.ReactNode;
  /** Dashed, dimmed "coming soon" treatment. */
  teaser?: boolean;
  /** Lift on hover (use for clickable member cards). */
  interactive?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;

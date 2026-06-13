import * as React from 'react';

/**
 * GritMint — the celebratory "GRIT minted!" animation (struck hex + sheen +
 * ring pulse + count-up). For reward toasts / earn confirmations.
 */
export interface GritMintProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Amount minted; counts up from 0. Integers stay whole, decimals show 2dp. Default 12. */
  amount?: number;
  /** Mark size in px (the amount text scales from it). Default 96. */
  size?: number;
  /** Show the amount + label beside the mark. Default true. */
  showAmount?: boolean;
  /** Caption under the amount (Righteous). Default "GRIT minted". */
  label?: string;
  /** Click to replay the animation. Default true. */
  replayOnClick?: boolean;
  /** Force animation on/off. Omit to respect prefers-reduced-motion. */
  animate?: boolean;
}

export function GritMint(props: GritMintProps): JSX.Element;

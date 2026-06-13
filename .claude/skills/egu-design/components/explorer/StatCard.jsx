import React from 'react';

/**
 * StatCard — the explorer's headline metric tile (Height, Transactions,
 * Total staked, …). A gold-wash card with a tracked Righteous label and a
 * big tabular value. Optional unit sits small and muted after the number.
 */
export function StatCard({ label, value, unit, style, ...rest }) {
  return (
    <div className="gc-stat" style={style} {...rest}>
      <div className="gc-stat-label">{label}</div>
      <div className="gc-stat-value">
        {value}{unit && <span className="unit"> {unit}</span>}
      </div>
    </div>
  );
}

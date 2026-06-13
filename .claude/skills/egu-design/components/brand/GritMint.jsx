import React from 'react';
import { Grit } from './Grit.jsx';

/**
 * GritMint — the celebratory "minted!" moment when GRIT is earned. The hex
 * strikes in with an overshoot, a gold sheen sweeps across its face (clipped
 * to the hexagon), a gold ring pulses outward, sparks drift up, and the amount
 * counts up. Built on the design system's motion keyframes (egu-stamp,
 * egu-sheen, egu-mint-ring, egu-mint-spark). Respects prefers-reduced-motion
 * by resting on the final state (full coin + final amount, no motion).
 *
 * Use it on a reward toast / earn confirmation — e.g. after finishing a TBTF
 * game or staking. Click to replay (when replayOnClick).
 */
export function GritMint({
  amount = 12,
  size = 96,
  showAmount = true,
  label = 'GRIT minted',
  replayOnClick = true,
  animate,
  style,
  ...rest
}) {
  const [playKey, setPlayKey] = React.useState(0);
  const [reduce, setReduce] = React.useState(false);
  const [display, setDisplay] = React.useState(amount);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const on = (e) => setReduce(e.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on); };
  }, []);

  // animate: undefined = respect prefers-reduced-motion; true/false forces it.
  const doAnimate = animate === undefined ? !reduce : animate;

  // Count-up on each play (skip when not animating).
  React.useEffect(() => {
    if (!doAnimate || amount == null) { setDisplay(amount); return; }
    let raf;
    const dur = 850;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = amount * eased;
      setDisplay(Number.isInteger(amount) ? Math.round(v) : +v.toFixed(2));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amount, playKey, doAnimate]);

  // Flat-top hexagon clip matching the Grit mark geometry.
  const HEX = 'polygon(72% 11%, 94% 50%, 72% 89%, 28% 89%, 6% 50%, 28% 11%)';
  const fmt = (n) => (Number.isInteger(amount) ? n : Number(n).toFixed(2));

  return (
    <div
      onClick={replayOnClick ? () => setPlayKey((k) => k + 1) : undefined}
      title={replayOnClick ? 'Replay' : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', cursor: replayOnClick ? 'pointer' : 'default', userSelect: 'none', ...style }}
      {...rest}
    >
      <span style={{ position: 'relative', width: size, height: size, display: 'inline-block', flex: 'none' }}>
        {/* expanding ring */}
        {doAnimate && (
          <span key={`ring-${playKey}`} aria-hidden="true" style={{
            position: 'absolute', inset: '8%', borderRadius: '50%',
            border: '2px solid var(--gold)',
            animation: 'egu-mint-ring 720ms var(--ease-out) both',
            pointerEvents: 'none',
          }} />
        )}
        {/* the mark, struck in */}
        <span key={`mark-${playKey}`} style={{ display: 'block', animation: doAnimate ? 'egu-stamp var(--dur-slow) var(--ease-stamp) both' : 'none' }}>
          <Grit size={size} />
        </span>
        {/* gold sheen sweep, clipped to the hex face */}
        {doAnimate && (
          <span key={`sheen-${playKey}`} aria-hidden="true" style={{
            position: 'absolute', inset: 0, clipPath: HEX, overflow: 'hidden', pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute', top: 0, left: 0, width: '45%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
              transform: 'translateX(-150%) skewX(-18deg)',
              animation: 'egu-sheen 1100ms var(--ease-linear) 280ms 1 both',
            }} />
          </span>
        )}
        {/* sparks */}
        {doAnimate && [ -1, 0, 1 ].map((d, i) => (
          <span key={`spark-${playKey}-${i}`} aria-hidden="true" style={{
            position: 'absolute', left: `${50 + d * 22}%`, top: '14%',
            width: '5px', height: '5px', borderRadius: '50%',
            background: i === 1 ? 'var(--gold-light)' : 'var(--gold)',
            animation: `egu-mint-spark 900ms var(--ease-out) ${180 + i * 90}ms both`,
            pointerEvents: 'none',
          }} />
        ))}
      </span>

      {showAmount && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 'var(--fw-bold)', fontSize: `calc(${size}px * 0.34)`, color: 'currentColor', fontVariantNumeric: 'tabular-nums' }}>
            +{fmt(display)}
          </span>
          {label && (
            <span style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: 'var(--ls-heading)', fontSize: `calc(${size}px * 0.13)`, color: 'var(--gold)' }}>
              {label}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

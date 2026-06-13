import React from 'react';

/**
 * HeroLogo — the Extended Gumption Universe hero mark. The Gumption “G” core
 * (our geometric construction, in chain green) held steady while a constellation
 * of gold satellites slowly orbits it — the universe of EGU apps bound by GRIT.
 * Driven by SMIL so it animates inline without CSS plumbing; pass animate={false}
 * for a still mark (print, reduced-motion, favicon-style uses).
 */
export function HeroLogo({ size = 160, animate, title = 'The Extended Gumption Universe', style, ...rest }) {
  const uid = React.useId().replace(/:/g, '');
  const glow = `egu-glow-${uid}`;
  // Respect prefers-reduced-motion unless `animate` is explicitly set.
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = (e) => setReduce(e.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => { mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange); };
  }, []);
  const doAnimate = animate === undefined ? !reduce : animate;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...rest}
    >
      <defs>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d4a520" stopOpacity=".22" />
          <stop offset="60%" stopColor="#d4a520" stopOpacity=".05" />
          <stop offset="100%" stopColor="#d4a520" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill={`url(#${glow})`} />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#d4a520" strokeWidth="1.25" opacity=".3" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="#d4a520" strokeWidth="1" opacity=".18" />

      <g>
        {doAnimate && <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 100 100" to="360 100 100" dur="26s" repeatCount="indefinite" />}
        <circle cx="100" cy="26" r="8" fill="#e8c547" />
        <circle cx="164" cy="137" r="6.5" fill="#d4a520" />
        <circle cx="36" cy="137" r="5.5" fill="#b8960c" />
      </g>
      <g>
        {doAnimate && <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 100 100" to="0 100 100" dur="38s" repeatCount="indefinite" />}
        <circle cx="156" cy="100" r="3.5" fill="#d4a520" opacity=".8" />
        <circle cx="44" cy="100" r="3" fill="#e8c547" opacity=".7" />
      </g>

      <g fill="none" stroke="#2f7d32" strokeWidth="16" strokeLinecap="round">
        <path d="M134 100 A34 34 0 1 1 124.04 75.96" />
        <path d="M134 100 L100 100" />
      </g>
    </svg>
  );
}

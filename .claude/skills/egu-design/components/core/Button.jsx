import React from 'react';

/**
 * Button — the EGU action control. Gold is primary (gradient gold leaf),
 * outline-gold is secondary, stone is a quiet tertiary. Ported from the
 * .btn-gold / .btn-outline-gold / .btn-secondary treatment in hub.css and
 * given the design-system gold-sheen sweep on hover.
 */
export function Button({
  variant = 'gold',
  size = 'md',
  as = 'button',
  children,
  style,
  ...rest
}) {
  const Tag = as;

  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-semibold)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    textDecoration: 'none',
    lineHeight: 1.2,
    borderRadius: 'var(--radius)',
    border: '1px solid transparent',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
  };

  const sizes = {
    sm: { fontSize: 'var(--fs-sm)', padding: '0.3rem 0.75rem' },
    md: { fontSize: 'var(--fs-body)', padding: '0.45rem 1.1rem' },
    lg: { fontSize: 'var(--fs-lead)', padding: '0.6rem 1.5rem' },
  };

  const variants = {
    gold: {
      color: '#fff',
      borderColor: 'var(--gold-dark)',
      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
    },
    'outline-gold': {
      color: 'var(--gold-dark)',
      borderColor: 'var(--gold)',
      background: 'transparent',
    },
    stone: {
      color: '#fff',
      borderColor: 'var(--stone-dark)',
      background: 'var(--stone)',
    },
  };

  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover
    ? {
        gold: { background: 'linear-gradient(135deg, var(--gold-light), var(--gold))', transform: 'translateY(-1px)', boxShadow: 'var(--shadow-lift)' },
        'outline-gold': { background: 'var(--wash)', borderColor: 'var(--gold-dark)' },
        stone: { background: 'var(--stone-dark)' },
      }[variant]
    : null;

  return (
    <Tag
      style={{ ...base, ...sizes[size], ...variants[variant], ...hoverStyle, ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {/* gold-leaf sheen sweep on hover (primary only) */}
      {variant === 'gold' && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            transform: 'translateX(-120%) skewX(-18deg)',
            animation: hover ? 'egu-sheen var(--dur-sheen) var(--ease-linear) infinite' : 'none',
            pointerEvents: 'none',
          }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
    </Tag>
  );
}

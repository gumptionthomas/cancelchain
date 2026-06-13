import React from 'react';

/**
 * Card — the EGU gold-wash bloom card. A warm-paper surface with a gold
 * radial glow blooming from the top edge and a gold-dark hairline border.
 * The signature container of the landing page (each EGU member sits in one).
 * Set `teaser` for the dashed, dimmed "coming soon" treatment.
 */
export function Card({
  kicker,
  title,
  tagline,
  teaser = false,
  interactive = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  const cardStyle = {
    display: 'block',
    padding: 'var(--space-5)',
    border: `1px solid ${teaser ? 'var(--gold-dark)' : 'var(--gold-dark)'}`,
    borderStyle: teaser ? 'dashed' : 'solid',
    borderRadius: 'var(--radius-card)',
    background: 'var(--glow-card), var(--paper)',
    opacity: teaser ? 0.65 : 1,
    transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...(interactive && hover ? { transform: 'translateY(-3px)', boxShadow: 'var(--shadow-lift)' } : null),
    ...style,
  };

  return (
    <section
      style={cardStyle}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      {...rest}
    >
      {kicker && <p className="egu-kicker" style={{ margin: '0 0 var(--space-1)' }}>{kicker}</p>}
      {title && (
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-card-title)', color: 'var(--gold-deep)', letterSpacing: 'var(--ls-heading)', margin: '0 0 var(--space-1)' }}>
          {title}
        </h2>
      )}
      {tagline && (
        <p style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-dark)', letterSpacing: 'var(--ls-heading)', margin: '0 0 0.9rem' }}>
          {tagline}
        </p>
      )}
      {children}
    </section>
  );
}

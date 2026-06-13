/* @ds-bundle: {"format":3,"namespace":"ExtendedGumptionUniverseDesignSystem_a80556","components":[{"name":"Grit","sourcePath":"components/brand/Grit.jsx"},{"name":"GritMint","sourcePath":"components/brand/GritMint.jsx"},{"name":"HeroLogo","sourcePath":"components/brand/HeroLogo.jsx"},{"name":"WordmarkLockup","sourcePath":"components/brand/WordmarkLockup.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"NetStance","sourcePath":"components/explorer/NetStance.jsx"},{"name":"OutflowBadge","sourcePath":"components/explorer/OutflowBadge.jsx"},{"name":"StatCard","sourcePath":"components/explorer/StatCard.jsx"},{"name":"KindLabel","sourcePath":"components/ledger/KindLabel.jsx"},{"name":"LedgerBoard","sourcePath":"components/ledger/LedgerBoard.jsx"},{"name":"Seal","sourcePath":"components/ledger/Seal.jsx"},{"name":"Ticker","sourcePath":"components/ledger/Ticker.jsx"}],"sourceHashes":{"components/brand/Grit.jsx":"4a7dd13f58f7","components/brand/GritMint.jsx":"807be328d37e","components/brand/HeroLogo.jsx":"e203beaf8a93","components/brand/WordmarkLockup.jsx":"4a01dab34e40","components/core/Button.jsx":"d638a83952f1","components/core/Card.jsx":"89f6c7cdd985","components/explorer/NetStance.jsx":"2ce544aa9e74","components/explorer/OutflowBadge.jsx":"a60e466fda6b","components/explorer/StatCard.jsx":"fd5c7d2b5d34","components/ledger/KindLabel.jsx":"1be757502c54","components/ledger/LedgerBoard.jsx":"0990107a8f41","components/ledger/Seal.jsx":"a399ca1dbede","components/ledger/Ticker.jsx":"1ac4adde740b","ui_kits/gumption-hub/screens.jsx":"bd40205b5c92","ui_kits/gumptionchain-explorer/screens.jsx":"ccf2056a13c6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ExtendedGumptionUniverseDesignSystem_a80556 = window.ExtendedGumptionUniverseDesignSystem_a80556 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Grit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Grit — the GRIT currency mark. A struck, flat-top hexagonal gold token with
 * a geometric “G” (a chunked torus + a horizontal tube, matching the original
 * Gumption logo construction). GRIT is the unit of value on GumptionChain
 * (100 grains = 1 grit); use this mark wherever an amount of GRIT is shown —
 * balances, the ticker, “earn GRIT” CTAs, wallets.
 *
 * Inline SVG (no asset file needed), recolors via the `mono` variant, and stays
 * crisp from hero size down to a 16px favicon.
 */
function Grit({
  size = 24,
  mono = false,
  title = 'GRIT',
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, '');
  const face = `gf-${uid}`;
  const edge = `ge-${uid}`;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 140 140",
    role: "img",
    "aria-label": title,
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style
    }
  }, rest), !mono && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: face,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#f5d76e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#d4a520"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: edge,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#e8c547"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#8b6914"
  }))), mono ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polygon", {
    points: "101,16 132,70 101,124 39,124 8,70 39,16",
    fill: "#b8960c"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "#fbf8f0",
    strokeWidth: "13",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M97 70 A27 27 0 1 1 89.09 50.91"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M97 70 L70 70"
  }))) : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("polygon", {
    points: "101,16 132,70 101,124 39,124 8,70 39,16",
    fill: `url(#${edge})`
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "101,16 132,70 101,124 39,124 8,70 39,16",
    fill: "none",
    stroke: "#6b5608",
    strokeWidth: "1.3",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "39,16 101,16 93,30 47,30",
    fill: "#f3dd8a",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "93,30 116,70 93,110 47,110 24,70 47,30",
    fill: `url(#${face})`
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#6b5608",
    strokeWidth: "1",
    opacity: "0.2"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "101",
    y1: "16",
    x2: "93",
    y2: "30"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "132",
    y1: "70",
    x2: "116",
    y2: "70"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "101",
    y1: "124",
    x2: "93",
    y2: "110"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "39",
    y1: "124",
    x2: "47",
    y2: "110"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "70",
    x2: "24",
    y2: "70"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "39",
    y1: "16",
    x2: "47",
    y2: "30"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "#6b5608",
    strokeWidth: "13",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M97 70 A27 27 0 1 1 89.09 50.91"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M97 70 L70 70"
  }))));
}
Object.assign(__ds_scope, { Grit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Grit.jsx", error: String((e && e.message) || e) }); }

// components/brand/GritMint.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function GritMint({
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
    const on = e => setReduce(e.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on);
    };
  }, []);

  // animate: undefined = respect prefers-reduced-motion; true/false forces it.
  const doAnimate = animate === undefined ? !reduce : animate;

  // Count-up on each play (skip when not animating).
  React.useEffect(() => {
    if (!doAnimate || amount == null) {
      setDisplay(amount);
      return;
    }
    let raf;
    const dur = 850;
    const start = performance.now();
    const tick = t => {
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
  const fmt = n => Number.isInteger(amount) ? n : Number(n).toFixed(2);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: replayOnClick ? () => setPlayKey(k => k + 1) : undefined,
    title: replayOnClick ? 'Replay' : undefined,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.85rem',
      cursor: replayOnClick ? 'pointer' : 'default',
      userSelect: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-block',
      flex: 'none'
    }
  }, doAnimate && /*#__PURE__*/React.createElement("span", {
    key: `ring-${playKey}`,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: '8%',
      borderRadius: '50%',
      border: '2px solid var(--gold)',
      animation: 'egu-mint-ring 720ms var(--ease-out) both',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    key: `mark-${playKey}`,
    style: {
      display: 'block',
      animation: doAnimate ? 'egu-stamp var(--dur-slow) var(--ease-stamp) both' : 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Grit, {
    size: size
  })), doAnimate && /*#__PURE__*/React.createElement("span", {
    key: `sheen-${playKey}`,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      clipPath: HEX,
      overflow: 'hidden',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '45%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)',
      transform: 'translateX(-150%) skewX(-18deg)',
      animation: 'egu-sheen 1100ms var(--ease-linear) 280ms 1 both'
    }
  })), doAnimate && [-1, 0, 1].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: `spark-${playKey}-${i}`,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: `${50 + d * 22}%`,
      top: '14%',
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      background: i === 1 ? 'var(--gold-light)' : 'var(--gold)',
      animation: `egu-mint-spark 900ms var(--ease-out) ${180 + i * 90}ms both`,
      pointerEvents: 'none'
    }
  }))), showAmount && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--fw-bold)',
      fontSize: `calc(${size}px * 0.34)`,
      color: 'currentColor',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "+", fmt(display)), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-heading)',
      fontSize: `calc(${size}px * 0.13)`,
      color: 'var(--gold)'
    }
  }, label)));
}
Object.assign(__ds_scope, { GritMint });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/GritMint.jsx", error: String((e && e.message) || e) }); }

// components/brand/HeroLogo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HeroLogo — the Extended Gumption Universe hero mark. The Gumption “G” core
 * (our geometric construction, in chain green) held steady while a constellation
 * of gold satellites slowly orbits it — the universe of EGU apps bound by GRIT.
 * Driven by SMIL so it animates inline without CSS plumbing; pass animate={false}
 * for a still mark (print, reduced-motion, favicon-style uses).
 */
function HeroLogo({
  size = 160,
  animate,
  title = 'The Extended Gumption Universe',
  style,
  ...rest
}) {
  const uid = React.useId().replace(/:/g, '');
  const glow = `egu-glow-${uid}`;
  // Respect prefers-reduced-motion unless `animate` is explicitly set.
  const [reduce, setReduce] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = e => setReduce(e.matches);
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    };
  }, []);
  const doAnimate = animate === undefined ? !reduce : animate;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 200 200",
    role: "img",
    "aria-label": title,
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: glow,
    cx: "50%",
    cy: "50%",
    r: "50%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#d4a520",
    stopOpacity: ".22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "60%",
    stopColor: "#d4a520",
    stopOpacity: ".05"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#d4a520",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "70",
    fill: `url(#${glow})`
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "74",
    fill: "none",
    stroke: "#d4a520",
    strokeWidth: "1.25",
    opacity: ".3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "100",
    r: "56",
    fill: "none",
    stroke: "#d4a520",
    strokeWidth: "1",
    opacity: ".18"
  }), /*#__PURE__*/React.createElement("g", null, doAnimate && /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    type: "rotate",
    from: "0 100 100",
    to: "360 100 100",
    dur: "26s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "26",
    r: "8",
    fill: "#e8c547"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "164",
    cy: "137",
    r: "6.5",
    fill: "#d4a520"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "36",
    cy: "137",
    r: "5.5",
    fill: "#b8960c"
  })), /*#__PURE__*/React.createElement("g", null, doAnimate && /*#__PURE__*/React.createElement("animateTransform", {
    attributeName: "transform",
    attributeType: "XML",
    type: "rotate",
    from: "360 100 100",
    to: "0 100 100",
    dur: "38s",
    repeatCount: "indefinite"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "156",
    cy: "100",
    r: "3.5",
    fill: "#d4a520",
    opacity: ".8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "44",
    cy: "100",
    r: "3",
    fill: "#e8c547",
    opacity: ".7"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "#2f7d32",
    strokeWidth: "16",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M134 100 A34 34 0 1 1 124.04 75.96"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M134 100 L100 100"
  })));
}
Object.assign(__ds_scope, { HeroLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/HeroLogo.jsx", error: String((e && e.message) || e) }); }

// components/brand/WordmarkLockup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * WordmarkLockup — the EGU brand lockup: the HeroLogo mark beside (or above)
 * the “The Extended Gumption Universe” wordmark in Righteous gold. One call for
 * headers, footers, splash screens. Horizontal by default; stacked for hero use.
 */
function WordmarkLockup({
  orientation = 'horizontal',
  size = 64,
  wordmarkSize,
  animate,
  wordmark = 'The Extended Gumption Universe',
  style,
  ...rest
}) {
  const horizontal = orientation === 'horizontal';
  const wmSize = wordmarkSize == null ? Math.round(size * 0.3) : wordmarkSize;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      flexDirection: horizontal ? 'row' : 'column',
      alignItems: 'center',
      gap: horizontal ? '0.9rem' : '0.6rem',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.HeroLogo, {
    size: size,
    animate: animate
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--gold-dark)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      lineHeight: 1.12,
      fontSize: `${wmSize}px`,
      textAlign: horizontal ? 'left' : 'center',
      maxWidth: horizontal ? '9ch' : 'none'
    }
  }, wordmark));
}
Object.assign(__ds_scope, { WordmarkLockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/WordmarkLockup.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the EGU action control. Gold is primary (gradient gold leaf),
 * outline-gold is secondary, stone is a quiet tertiary. Ported from the
 * .btn-gold / .btn-outline-gold / .btn-secondary treatment in hub.css and
 * given the design-system gold-sheen sweep on hover.
 */
function Button({
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
    transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
  };
  const sizes = {
    sm: {
      fontSize: 'var(--fs-sm)',
      padding: '0.3rem 0.75rem'
    },
    md: {
      fontSize: 'var(--fs-body)',
      padding: '0.45rem 1.1rem'
    },
    lg: {
      fontSize: 'var(--fs-lead)',
      padding: '0.6rem 1.5rem'
    }
  };
  const variants = {
    gold: {
      color: '#fff',
      borderColor: 'var(--gold-dark)',
      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))'
    },
    'outline-gold': {
      color: 'var(--gold-dark)',
      borderColor: 'var(--gold)',
      background: 'transparent'
    },
    stone: {
      color: '#fff',
      borderColor: 'var(--stone-dark)',
      background: 'var(--stone)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover ? {
    gold: {
      background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-lift)'
    },
    'outline-gold': {
      background: 'var(--wash)',
      borderColor: 'var(--gold-dark)'
    },
    stone: {
      background: 'var(--stone-dark)'
    }
  }[variant] : null;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...hoverStyle,
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), variant === 'gold' && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '40%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
      transform: 'translateX(-120%) skewX(-18deg)',
      animation: hover ? 'egu-sheen var(--dur-sheen) var(--ease-linear) infinite' : 'none',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, children));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — the EGU gold-wash bloom card. A warm-paper surface with a gold
 * radial glow blooming from the top edge and a gold-dark hairline border.
 * The signature container of the landing page (each EGU member sits in one).
 * Set `teaser` for the dashed, dimmed "coming soon" treatment.
 */
function Card({
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
    ...(interactive && hover ? {
      transform: 'translateY(-3px)',
      boxShadow: 'var(--shadow-lift)'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("section", _extends({
    style: cardStyle,
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined
  }, rest), kicker && /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker",
    style: {
      margin: '0 0 var(--space-1)'
    }
  }, kicker), title && /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-card-title)',
      color: 'var(--gold-deep)',
      letterSpacing: 'var(--ls-heading)',
      margin: '0 0 var(--space-1)'
    }
  }, title), tagline && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--gold-dark)',
      letterSpacing: 'var(--ls-heading)',
      margin: '0 0 0.9rem'
    }
  }, tagline), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/explorer/NetStance.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * NetStance — a subject's net verdict: which side leads and by how much.
 * Magnitude + word so the meaning is unambiguous (no implicit sign). Green
 * when net-supported, red when net-opposed, muted when even. Ported from the
 * base explorer's `net_stance` macro.
 */
function NetStance({
  opposition = 0,
  support = 0,
  style,
  ...rest
}) {
  const net = support - opposition;
  let color = 'var(--muted)';
  let text = 'even';
  if (net > 0) {
    color = 'var(--support)';
    text = `${net} supported`;
  } else if (net < 0) {
    color = 'var(--oppose)';
    text = `${-net} opposed`;
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color,
      fontVariantNumeric: 'tabular-nums',
      ...style
    }
  }, rest), text);
}
Object.assign(__ds_scope, { NetStance });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/explorer/NetStance.jsx", error: String((e && e.message) || e) }); }

// components/explorer/OutflowBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * OutflowBadge — a scannable badge for a transaction outflow's kind:
 * opposition (red), support (green), rescind (gold), or transfer (stone).
 * Ported from the base explorer's `outflow_kind` macro.
 */
function OutflowBadge({
  kind,
  style,
  ...rest
}) {
  const map = {
    opposition: {
      bg: 'var(--oppose)',
      fg: '#fff',
      label: 'opposition'
    },
    support: {
      bg: 'var(--support)',
      fg: '#fff',
      label: 'support'
    },
    rescind: {
      bg: 'var(--gold)',
      fg: 'var(--ink)',
      label: 'rescind'
    },
    transfer: {
      bg: 'var(--stone)',
      fg: '#fff',
      label: 'transfer'
    }
  };
  const s = map[kind] || map.transfer;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      background: s.bg,
      color: s.fg,
      fontSize: '0.75em',
      fontWeight: 'var(--fw-semibold)',
      padding: '0.25em 0.55em',
      borderRadius: 'var(--radius-sm)',
      lineHeight: 1.2,
      ...style
    }
  }, rest), s.label);
}
Object.assign(__ds_scope, { OutflowBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/explorer/OutflowBadge.jsx", error: String((e && e.message) || e) }); }

// components/explorer/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * StatCard — the explorer's headline metric tile (Height, Transactions,
 * Total staked, …). A gold-wash card with a tracked Righteous label and a
 * big tabular value. Optional unit sits small and muted after the number.
 */
function StatCard({
  label,
  value,
  unit,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "gc-stat",
    style: style
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "gc-stat-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "gc-stat-value"
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, " ", unit)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/explorer/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/ledger/KindLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KindLabel — renders a stake's verdict ("support" or "opposition") in
 * uppercase Righteous, colored with the semantic green/red. The canonical
 * way to name a stake's direction anywhere in the universe.
 */
function KindLabel({
  kind,
  children,
  style,
  ...rest
}) {
  const color = kind === 'opposition' ? 'var(--oppose)' : 'var(--support)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      color,
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-heading)',
      ...style
    }
  }, rest), children || kind);
}
Object.assign(__ds_scope, { KindLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ledger/KindLabel.jsx", error: String((e && e.message) || e) }); }

// components/ledger/LedgerBoard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LedgerBoard — the Great Ledger's tug-of-war board. Each row is a subject
 * with support pulling left (green) and opposition pulling right (red); bar
 * widths are each side's share of the subject's total stake. Bars grow from
 * the center outward on mount — the signature "movement" of the landing page.
 *
 * GRIT formatting: amounts are in grains (100 grains = 1 grit). Pass `grit`
 * values already converted, or raw grains with `inGrains` to auto-format.
 */
function LedgerBoard({
  rows = [],
  inGrains = false,
  style,
  ...rest
}) {
  const fmt = n => (inGrains ? n / 100 : n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      maxWidth: 'var(--w-ledger)',
      margin: '0 auto var(--space-4)',
      ...style
    }
  }, rest), rows.map((row, i) => {
    const total = (row.support || 0) + (row.opposition || 0);
    const supShare = total ? row.support / total : 0;
    const oppShare = total ? row.opposition / total : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-xs)',
        color: 'var(--muted-gold)',
        minWidth: '3rem',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmt(row.support)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Bar, {
      share: supShare,
      kind: "sup",
      delay: i * 90
    })), /*#__PURE__*/React.createElement("a", {
      href: row.href,
      className: "ledger-subject",
      style: {
        background: '#fff',
        border: '1px solid var(--rule-hair)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.15rem 0.6rem',
        minWidth: '7rem',
        textAlign: 'center',
        fontWeight: 'var(--fw-semibold)',
        color: 'inherit',
        textDecoration: 'none'
      }
    }, row.subject), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Bar, {
      share: oppShare,
      kind: "opp",
      delay: i * 90
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--fs-xs)',
        color: 'var(--muted-gold)',
        minWidth: '3rem',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmt(row.opposition)));
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted-gold)',
      fontSize: 'var(--fs-sm)',
      textAlign: 'center',
      margin: '0.3rem 0 0'
    }
  }, '\u25C0', " support \xB7 oppose ", '\u25B6'));
}
function Bar({
  share,
  kind,
  delay
}) {
  const sup = kind === 'sup';
  // Use the patterns.css .ledger-bar classes: they carry the egu-bar-grow
  // entrance AND the prefers-reduced-motion fallback (animation:none -> the
  // bar rests at its natural full width instead of collapsing to scaleX(0)).
  return /*#__PURE__*/React.createElement("div", {
    className: `ledger-bar ${sup ? 'ledger-bar-sup' : 'ledger-bar-opp'}`,
    style: {
      width: `${(share * 100).toFixed(1)}%`,
      transformOrigin: sup ? 'right center' : 'left center',
      animationDelay: `${delay}ms`
    }
  });
}
Object.assign(__ds_scope, { LedgerBoard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ledger/LedgerBoard.jsx", error: String((e && e.message) || e) }); }

// components/ledger/Seal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Seal — the wax verification seal. Neutral stone until a proof is verified,
 * then it stamps down in gold (overshoot "thunk") and breathes a slow gold
 * pulse. The core trust signal on proof cards.
 *
 * Styling + animation come from the `.seal-dot` classes in patterns.css, which
 * also carry the prefers-reduced-motion fallback — so the verified seal RESTS
 * visibly gold (and survives print / PDF / reduced-motion) instead of being
 * stuck at the animation's hidden start state. Only the size is set inline.
 */
function Seal({
  verified = false,
  pulsing = true,
  size = '2.4rem',
  style,
  ...rest
}) {
  const cls = ['seal-dot'];
  if (verified) cls.push('verified');
  if (verified && pulsing) cls.push('pulsing');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls.join(' '),
    style: {
      width: size,
      height: size,
      fontSize: `calc(${size} * 0.54)`,
      ...style
    }
  }, rest), verified ? '\u2713' : '');
}
Object.assign(__ds_scope, { Seal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ledger/Seal.jsx", error: String((e && e.message) || e) }); }

// components/ledger/Ticker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ticker — the stakes marquee. A dark band that scrolls recent stakes
 * continuously (and pauses on hover), inverting the paper palette for
 * high-contrast "live wire" energy. Items duplicate 4× so the loop is seamless.
 */
function Ticker({
  items = [],
  duration = 60,
  style,
  ...rest
}) {
  // Repeat the set 4× so a -25% translate loops seamlessly.
  const loop = [0, 1, 2, 3];
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "stakes-ticker",
    style: {
      overflow: 'hidden',
      background: 'var(--ticker-bg)',
      color: '#fff',
      padding: 'var(--space-2) 0',
      borderRadius: 'var(--radius-sm)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "stakes-ticker-track",
    style: {
      '--dur-ticker': `${duration}s`
    }
  }, loop.map(d => items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: `${d}-${i}`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      padding: '0 1.1rem',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ticker-muted)',
      marginRight: '0.3rem'
    }
  }, it.kind === 'opposition' ? 'OPP' : 'SUP'), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--fw-semibold)',
      color: it.kind === 'opposition' ? 'var(--ticker-opp)' : 'var(--ticker-sup)'
    }
  }, it.subject, " +", it.amount), (it.signer || it.age) && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ticker-muted)',
      marginLeft: '0.35rem'
    }
  }, it.signer, it.signer && it.age ? ' · ' : '', it.age)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ticker-sep)',
      padding: '0 0.5rem'
    }
  }, '\u2022'))))));
}
Object.assign(__ds_scope, { Ticker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ledger/Ticker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gumption-hub/screens.jsx
try { (() => {
/* gumption-hub UI kit — shared screens, composed from the EGU component bundle.
   A faithful recreation of the live landing page (templates/index.html) plus
   the verify/proof card, with the design system's motion layer switched on. */
const {
  Button,
  Card,
  LedgerBoard,
  Ticker,
  Seal,
  KindLabel,
  Grit,
  HeroLogo,
  WordmarkLockup
} = window.ExtendedGumptionUniverseDesignSystem_a80556;

// ── Nav ──────────────────────────────────────────────────────────────────
function NavBar({
  onNav
}) {
  const link = {
    color: 'var(--ink)',
    fontSize: 'var(--fs-body)',
    padding: '0.5rem 0.7rem',
    textDecoration: 'none',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1.5rem',
      gap: '0.25rem'
    }
  }, /*#__PURE__*/React.createElement(WordmarkLockup, {
    size: 30,
    wordmarkSize: 16,
    wordmark: "Gumption",
    animate: false,
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer',
      marginRight: '0.6rem'
    }
  }), /*#__PURE__*/React.createElement("a", {
    style: link,
    onClick: () => onNav('landing')
  }, "Chain \u25BE"), /*#__PURE__*/React.createElement("a", {
    style: {
      ...link,
      marginLeft: 'auto',
      color: 'var(--gold-dark)',
      fontWeight: 600
    },
    onClick: () => onNav('you')
  }, "@thomas"));
}

// ── Hero — the animated Gumption G ─────────────────────────────────────────
function Hero() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '1.5rem 0 2rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "egu-anim-rise",
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(HeroLogo, {
    size: 150
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      color: 'var(--gold-dark)',
      letterSpacing: '0.04em',
      marginTop: '0.5rem',
      fontSize: 'var(--fs-hero)',
      textTransform: 'uppercase'
    }
  }, "The Extended Gumption Universe"));
}

// ── Landing ────────────────────────────────────────────────────────────────
function Landing({
  onNav
}) {
  const board = [{
    subject: 'Local Library',
    support: 4.2,
    opposition: 1.6,
    href: '#'
  }, {
    subject: 'City Budget',
    support: 8.5,
    opposition: 6.2,
    href: '#'
  }, {
    subject: 'Parking Fees',
    support: 2.1,
    opposition: 3.9,
    href: '#'
  }, {
    subject: 'Night Market',
    support: 12.0,
    opposition: 0.5,
    href: '#'
  }, {
    subject: 'Toll Road',
    support: 1.2,
    opposition: 9.4,
    href: '#'
  }];
  const ticker = [{
    kind: 'support',
    subject: 'Local Library',
    amount: '4.20',
    signer: '@thomas',
    age: '2m'
  }, {
    kind: 'opposition',
    subject: 'Toll Road',
    amount: '3.10',
    signer: '@dana',
    age: '9m'
  }, {
    kind: 'support',
    subject: 'Night Market',
    amount: '12.00',
    signer: '@rey',
    age: '1h'
  }, {
    kind: 'opposition',
    subject: 'Parking Fees',
    amount: '1.50',
    signer: '@kai',
    age: '3h'
  }, {
    kind: 'support',
    subject: 'City Budget',
    amount: '8.50',
    signer: '@mara',
    age: '5h'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--w-landing)',
      margin: '0 auto',
      padding: '0 1rem'
    }
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement("div", {
    className: "egu-anim-rise",
    style: {
      animationDelay: '80ms'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    kicker: "EGU member \xB7 the chain",
    title: "GumptionChain",
    tagline: "The Great Ledger of Grievances & Commendations"
  }, /*#__PURE__*/React.createElement(LedgerBoard, {
    rows: board
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '1rem 0'
    }
  }, /*#__PURE__*/React.createElement(Ticker, {
    items: ticker,
    duration: 42
  })), /*#__PURE__*/React.createElement("p", {
    className: "chain-pulse",
    style: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.35rem',
      flexWrap: 'wrap'
    }
  }, "height 184,213 \xB7 27.9 ", /*#__PURE__*/React.createElement(Grit, {
    size: 16
  }), " staked \xB7 5 subjects \xB7", ' ', /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('about'),
    style: {
      cursor: 'pointer'
    }
  }, "full chain \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid var(--wash-strong)',
      textAlign: 'center',
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    onClick: () => onNav('about')
  }, "How it works"), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    onClick: () => onNav('onboarding')
  }, "Get your key \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "egu-anim-rise",
    style: {
      animationDelay: '160ms'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    style: {
      textAlign: 'center',
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker"
  }, "EGU member \xB7 the game"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/tbtf-logo.svg",
    alt: "Too Big To Fail",
    style: {
      width: '14rem',
      maxWidth: '70%',
      margin: '0.25rem auto 0',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "egu-card-blurb"
  }, "The classic board game Acquire \u2014 reimagined online. Free to play, right in your browser."), /*#__PURE__*/React.createElement("a", {
    className: "member-go",
    style: {
      color: 'var(--gold-dark)',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem'
    }
  }, "play \u2192 earn ", /*#__PURE__*/React.createElement(Grit, {
    size: 17
  }), " GRIT \u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "egu-anim-rise",
    style: {
      animationDelay: '240ms'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    teaser: true,
    title: "More games",
    style: {
      textAlign: 'center',
      marginTop: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-card-blurb"
  }, "Coming to the universe."), /*#__PURE__*/React.createElement("a", {
    className: "member-go",
    style: {
      color: 'var(--gold-dark)',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "join the EGU \u2192"))));
}

// ── Proof / verify card ──────────────────────────────────────────────────
function ProofCard({
  onNav
}) {
  const [verified, setVerified] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVerified(true), 700);
    return () => clearTimeout(t);
  }, []);
  const checks = [{
    k: 'Signature',
    label: 'Signed by the staker’s key'
  }, {
    k: 'On-chain',
    label: 'Found in the longest chain'
  }, {
    k: 'Consistent',
    label: 'Matches the recorded stake'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      fontSize: 'var(--fs-lead)',
      margin: '0 0 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.4rem',
      flexWrap: 'wrap'
    }
  }, "\u201C4.20 ", /*#__PURE__*/React.createElement(Grit, {
    size: 20
  }), " in ", /*#__PURE__*/React.createElement(KindLabel, {
    kind: "support"
  }), " of the Local Library.\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "gc-card egu-anim-rise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gc-card-head"
  }, /*#__PURE__*/React.createElement(Seal, {
    verified: verified
  }), /*#__PURE__*/React.createElement("h2", null, "Verified on GumptionChain")), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Claim"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, /*#__PURE__*/React.createElement(KindLabel, {
    kind: "support"
  }), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "4.20 GRIT"), " on \u201CLocal Library\u201D")), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Signer"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, /*#__PURE__*/React.createElement("strong", null, "@thomas"), " ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: '.85rem'
    }
  }, "github \u2713"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: '.85rem',
      color: 'var(--gold-dark)'
    }
  }, "gc1q9zk7m4x2v8h3jp0\u2026"))), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Transaction"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: '.85rem',
      color: 'var(--gold-dark)'
    }
  }, "4f2a9c1e8b\u2026"), " \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "tn"
  }, "block 184,210")))), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-card)',
      padding: '1rem',
      marginTop: '1rem',
      background: 'var(--paper-card)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Verified live in your browser"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '0.5rem 0 0'
    }
  }, checks.map((c, i) => /*#__PURE__*/React.createElement("li", {
    key: c.k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.3rem 0',
      opacity: verified ? 1 : 0.4,
      transition: 'opacity var(--dur-base) var(--ease-out)',
      transitionDelay: `${i * 120}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: verified ? 'var(--support)' : 'var(--muted-gold)',
      fontWeight: 700
    }
  }, verified ? '✓' : '…'), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, c.k), " \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--muted)'
    }
  }, c.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem',
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm"
  }, "Copy link"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm"
  }, "Copy post text"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm"
  }, "Share on Mastodon")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to the universe")));
}

// ── About ──────────────────────────────────────────────────────────────────
function About({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "member-page",
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker"
  }, "about"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)'
    }
  }, "About the EGU"), /*#__PURE__*/React.createElement("p", null, "The ", /*#__PURE__*/React.createElement("strong", null, "Extended Gumption Universe"), " is a family of games and tools tied together by ", /*#__PURE__*/React.createElement("strong", null, "GumptionChain"), " \u2014 a proof-of-work chain where grains are staked as ", /*#__PURE__*/React.createElement(KindLabel, {
    kind: "opposition"
  }), " or ", /*#__PURE__*/React.createElement(KindLabel, {
    kind: "support"
  }), " for subjects."), /*#__PURE__*/React.createElement("p", null, "Gumption is measured in grains (100 grains to a grit). You earn it in EGU games, stake it on the subjects you care about, and the chain keeps the receipts: any stake can be turned into a portable proof and verified by anyone, anywhere."), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      marginTop: '1.5rem'
    }
  }, "Members"), /*#__PURE__*/React.createElement("ul", {
    style: {
      lineHeight: 1.9
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "Too Big To Fail (2b2f)"), " \u2014 the classic board game Acquire, reimagined online."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    },
    onClick: () => onNav('proof')
  }, "GumptionChain"), " \u2014 the chain itself: explorer, wallet, transacting, verification."), /*#__PURE__*/React.createElement("li", null, "More games coming.")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to the universe")));
}

// ── Contact (contact.html) ──────────────────────────────────────────────────
function Contact({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "member-page",
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker"
  }, "get in touch"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)'
    }
  }, "Contact"), /*#__PURE__*/React.createElement("p", null, "Email ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:thomas@gumption.com",
    style: {
      cursor: 'pointer'
    }
  }, "thomas@gumption.com"), "."), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      marginTop: '1.5rem'
    }
  }, "On GitHub"), /*#__PURE__*/React.createElement("ul", {
    style: {
      lineHeight: 1.9
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "gumptionchain"), " \u2014 the chain. Bugs and questions \u2192 the ", /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "issue tracker"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "gumption-hub"), " \u2014 this site. Bugs and questions \u2192 the ", /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "issue tracker"), ".")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      marginTop: '1.5rem'
    }
  }, "Run a node"), /*#__PURE__*/React.createElement("p", null, "The EGU runs on a small fleet of millers \u2014 and it grows one node at a time. Want to mill blocks from your house? Start from the ", /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "gumptionchain README"), " and say hello by email; a step-by-step member onboarding guide is on its way."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to the universe")));
}

// ── Bind (bind.html) — the three-step identity flow ─────────────────────────
function Bind({
  onNav
}) {
  const [step, setStep] = React.useState(1); // 1 unlock · 2 sign · 3 bind · 4 bound
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const armored = '-----BEGIN GC MESSAGE-----\nplatform: github\nhandle: thomas\naddress: gc1q9zk7m4x2v8h3jp0…\nsig: 3045022100c1e8b2d7a4f06e5c9b81d3f2a7e0c4b…\n-----END GC MESSAGE-----';
  const h2 = {
    fontSize: 'var(--fs-h2)',
    marginTop: '1.6rem'
  };
  const sub = {
    color: step >= 2 ? 'var(--ink)' : 'var(--muted-gold)',
    transition: 'color var(--dur-base) var(--ease-out)'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "member-page",
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker"
  }, "identity"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)'
    }
  }, "Put a name on your gumption"), /*#__PURE__*/React.createElement("p", null, "Bind your signing key to your GitHub handle so your stakes carry your name. You sign a claim locally; the proof is posted publicly under your handle; the hub checks both directions."), /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "1 \xB7 Unlock your signing key"), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)'
    }
  }, "Uses the signing key saved on this device."), step === 1 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "passphrase",
    style: {
      maxWidth: '22rem'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => setStep(2)
  }, "Unlock"))) : /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--gold-dark)'
    }
  }, "\u2713 unlocked \xB7 ", addr), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...h2,
      ...sub
    }
  }, "2 \xB7 Sign your claim"), step >= 2 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    placeholder: "github handle",
    defaultValue: "thomas",
    style: {
      maxWidth: '22rem'
    },
    disabled: step > 2
  }), step === 2 && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => setStep(3)
  }, "Sign claim")), step >= 3 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    className: "form-control mono",
    rows: "6",
    readOnly: true,
    value: armored,
    style: {
      fontSize: 'var(--fs-sm)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)',
      marginTop: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm"
  }, "Copy"), " \u2192 create a new ", /*#__PURE__*/React.createElement("strong", null, "public gist"), " containing exactly this block, then paste its URL below."))), /*#__PURE__*/React.createElement("h2", {
    style: {
      ...h2,
      color: step >= 3 ? 'var(--ink)' : 'var(--muted-gold)',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, "3 \xB7 Verify & bind"), step >= 3 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    placeholder: "https://gist.github.com/you/...",
    style: {
      maxWidth: '30rem'
    },
    disabled: step > 3
  }), step === 3 && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => setStep(4)
  }, "Verify & bind")), step === 4 && /*#__PURE__*/React.createElement("div", {
    className: "gc-card egu-anim-rise",
    style: {
      marginTop: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gc-card-head"
  }, /*#__PURE__*/React.createElement(Seal, {
    verified: true
  }), /*#__PURE__*/React.createElement("h2", null, "Bound on GumptionChain")), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Handle"), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "\u2713 ", /*#__PURE__*/React.createElement("strong", null, "@thomas"), " bound to this key")), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, "Address"), /*#__PURE__*/React.createElement("div", {
    className: "v mono",
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--gold-dark)'
    }
  }, addr)), /*#__PURE__*/React.createElement("div", {
    className: "gc-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => onNav('you')
  }, "Go to your gumption \u2192"))))), /*#__PURE__*/React.createElement("h2", {
    style: h2
  }, "Your bindings"), /*#__PURE__*/React.createElement("div", {
    className: "small",
    style: {
      color: 'var(--muted)',
      whiteSpace: 'pre-line'
    }
  }, step === 4 ? 'github: @thomas — verified (checked just now)' : 'Unlock to list bindings.'), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('you'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to your gumption")));
}

// ── You (me.html — “Your Gumption”) ──────────────────────────────────────
function You({
  onNav
}) {
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const stakes = [{
    kind: 'support',
    subject: 'Local Library',
    grit: '4.20',
    status: 'confirmed'
  }, {
    kind: 'opposition',
    subject: 'Toll Road',
    grit: '3.10',
    status: 'confirmed'
  }, {
    kind: 'support',
    subject: 'Night Market',
    grit: '12.00',
    status: 'pending'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "member-page",
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)'
    }
  }, "Your Gumption"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      flexWrap: 'wrap',
      margin: '0.5rem 0 0.25rem'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "@thomas"), /*#__PURE__*/React.createElement("span", {
    className: "small",
    style: {
      color: 'var(--muted)'
    }
  }, "github \u2713 \xB7 ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--gold-dark)'
    }
  }, addr.slice(0, 16), "\u2026"))), /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)',
      margin: '0 0 1rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('bind'),
    style: {
      cursor: 'pointer'
    }
  }, "manage your name \u2192"), " so your shares carry it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.6rem 0 1rem'
    }
  }, /*#__PURE__*/React.createElement(Grit, {
    size: 30
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--fw-bold)',
      fontSize: 'var(--fs-h2)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "27.9"), /*#__PURE__*/React.createElement("span", {
    className: "egu-kicker",
    style: {
      margin: 0
    }
  }, "GRIT balance")), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      marginTop: '1rem'
    }
  }, "Your stakes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      marginTop: '0.5rem'
    }
  }, stakes.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-card)',
      padding: '0.7rem 0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: '14rem'
    }
  }, "You ", /*#__PURE__*/React.createElement(KindLabel, {
    kind: s.kind
  }, s.kind === 'opposition' ? 'oppose' : 'support'), " ", s.subject, " with ", s.grit, " ", /*#__PURE__*/React.createElement(Grit, {
    size: 15
  }), " grit", /*#__PURE__*/React.createElement("span", {
    className: "small",
    style: {
      color: s.status === 'confirmed' ? 'var(--support)' : 'var(--muted-gold)',
      marginLeft: '0.4rem'
    }
  }, "\xB7 ", s.status)), /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    disabled: s.status !== 'confirmed',
    style: s.status !== 'confirmed' ? {
      opacity: 0.5,
      cursor: 'not-allowed'
    } : undefined
  }, "Share"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm",
    onClick: () => onNav('proof')
  }, "View")))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to the universe")));
}

// ── Onboarding (“Get your key”) — create key · back up · bind ──────────────
function Onboarding({
  onNav
}) {
  const [step, setStep] = React.useState(1); // 1 create · 2 back up · 3 name · 4 done
  const [backed, setBacked] = React.useState(false);
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  const stepTitle = (n, txt) => /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--fs-h2)',
      marginTop: '1.6rem',
      color: step >= n ? 'var(--gold-deep)' : 'var(--muted-gold)',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, step > n ? '✓' : n, " \xB7 ", txt);
  return /*#__PURE__*/React.createElement("div", {
    className: "member-page",
    style: {
      maxWidth: 'var(--w-prose)',
      margin: '0 auto',
      padding: '1rem'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "egu-kicker"
  }, "welcome to the universe"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'var(--fs-h1)'
    }
  }, "Get your key"), /*#__PURE__*/React.createElement("p", null, "Your signing key is your identity in the EGU \u2014 it marks your stakes as yours, the way a seal marks a letter. It\u2019s created right here in your browser and never sent anywhere. One key, and you\u2019re a member."), stepTitle(1, 'Create your signing key'), step === 1 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)'
    }
  }, "Choose a passphrase. It encrypts your key on this device \u2014 there\u2019s no \u201Creset\u201D, so make it one you\u2019ll remember."), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "choose a passphrase",
    style: {
      maxWidth: '22rem'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    onClick: () => setStep(2)
  }, "Create my key"))) : /*#__PURE__*/React.createElement("p", {
    className: "mono",
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--gold-dark)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement(Seal, {
    verified: true,
    size: "1.6rem"
  }), " ", addr), stepTitle(2, 'Back it up'), step === 2 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)'
    }
  }, "This key is the only way to prove your stakes are yours \u2014 lose it and it\u2019s gone for good. Save it where you keep your other secrets. (Optional, but strongly encouraged.)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      margin: '0.5rem 0'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm",
    onClick: () => setBacked(true)
  }, "Download encrypted backup"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm",
    onClick: () => setBacked(true)
  }, "Save to password manager")), backed && /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--support)'
    }
  }, "\u2713 Backed up. Keep it somewhere safe."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => setStep(3)
  }, "Continue"), ' ', /*#__PURE__*/React.createElement("a", {
    onClick: () => setStep(3),
    style: {
      cursor: 'pointer',
      fontSize: 'var(--fs-sm)',
      marginLeft: '0.5rem'
    }
  }, "I\u2019ll do this later"))), stepTitle(3, 'Put a name on it'), step === 3 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "small",
    style: {
      color: 'var(--muted)'
    }
  }, "Optional \u2014 but it makes sharing land. Bind your key to your GitHub handle and the stakes you share carry ", /*#__PURE__*/React.createElement("strong", null, "@you"), " instead of a raw address. You can always do this later from your gumption page."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => onNav('bind')
  }, "Bind to GitHub \u2192"), ' ', /*#__PURE__*/React.createElement("a", {
    onClick: () => setStep(4),
    style: {
      cursor: 'pointer',
      fontSize: 'var(--fs-sm)',
      marginLeft: '0.5rem'
    }
  }, "Skip for now"))), step === 4 && /*#__PURE__*/React.createElement("div", {
    className: "gc-card egu-anim-rise",
    style: {
      marginTop: '1.6rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "gc-card-head"
  }, /*#__PURE__*/React.createElement(Seal, {
    verified: true
  }), /*#__PURE__*/React.createElement("h2", null, "You\u2019re in")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 0
    }
  }, "Welcome to the Extended Gumption Universe. Your key lives on this device as ", /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      color: 'var(--gold-dark)'
    }
  }, addr.slice(0, 16), "\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    size: "sm",
    onClick: () => onNav('landing')
  }, "Explore the ledger"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm",
    onClick: () => onNav('you')
  }, "Your gumption"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-gold",
    size: "sm",
    onClick: () => onNav('bind')
  }, "Put a name on it")))), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer'
    }
  }, "\u2190 back to the universe")));
}
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      textAlign: 'center',
      padding: '2.5rem 0 1.5rem',
      color: 'var(--muted)',
      fontSize: 'var(--fs-sm)'
    }
  }, /*#__PURE__*/React.createElement(WordmarkLockup, {
    orientation: "stacked",
    size: 64,
    wordmarkSize: 18,
    onClick: () => onNav('landing'),
    style: {
      cursor: 'pointer',
      marginBottom: '1rem'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('about'),
    style: {
      cursor: 'pointer'
    }
  }, "about"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('contact'),
    style: {
      cursor: 'pointer'
    }
  }, "contact"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "gumption.com"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    style: {
      cursor: 'pointer'
    }
  }, "Too Big To Fail")));
}
Object.assign(window, {
  NavBar,
  Hero,
  Landing,
  ProofCard,
  About,
  Contact,
  Bind,
  You,
  Onboarding,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gumption-hub/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/gumptionchain-explorer/screens.jsx
try { (() => {
/* gumptionchain explorer UI kit — the VANILLA node browser under the 2B2F skin.
   Recreates base gumptionchain's stock Bootstrap markup (templates/base.html,
   _explorer_home.html, blocks.html, subjects.html, subject.html, verify.html)
   themed by the design system's explorer.css. Components come from the bundle. */
const {
  StatCard,
  NetStance,
  OutflowBadge,
  Seal
} = window.ExtendedGumptionUniverseDesignSystem_a80556;
const NAV = ['Home', 'Chains', 'Blocks', 'Subjects', 'Addresses', 'Mempool', 'Transact', 'Signing key', 'Advanced'];
const hash = s => s.padEnd(64, '0').slice(0, 64);
const BLOCKS = [{
  idx: 184213,
  hash: '00000a3f9c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b',
  ts: '2026-06-13 14:02:11',
  txns: 3
}, {
  idx: 184212,
  hash: '00000c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7',
  ts: '2026-06-13 13:51:44',
  txns: 1
}, {
  idx: 184211,
  hash: '00000f1a8c3e9b2d5074a6f8c1e3b5d7029a4c6e8b0d2f4a6c8e0b2d4f6a8c0e',
  ts: '2026-06-13 13:40:09',
  txns: 5
}, {
  idx: 184210,
  hash: '000004b9d2f7a1c8e3650b9d7f1a3c5e7029b4d6f8a0c2e4b6d8f0a2c4e6b8d0',
  ts: '2026-06-13 13:28:55',
  txns: 2
}, {
  idx: 184209,
  hash: '00000e6c1b9d3f7a205c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f',
  ts: '2026-06-13 13:17:30',
  txns: 4
}];
const SUBJECTS = [{
  subject: 'Local Library',
  opposition: 160,
  support: 420
}, {
  subject: 'City Budget',
  opposition: 620,
  support: 850
}, {
  subject: 'Toll Road',
  opposition: 940,
  support: 120
}, {
  subject: 'Night Market',
  opposition: 50,
  support: 1200
}, {
  subject: 'Parking Fees',
  opposition: 390,
  support: 210
}];
const ADDRESSES = [{
  address: 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4',
  ct: 1240
}, {
  address: 'gc1qf7r3m9x1v5h8j2p4q6s8u0w2y4a6c8e0g2',
  ct: 860
}, {
  address: 'gc1qd2f4h6k8m0p2r4t6v8x0z2b4d6f8h0j2l4',
  ct: 512
}, {
  address: 'gc1qa3c5e7g9i1k3m5o7q9s1u3w5y7a9c1e3g5',
  ct: 305
}, {
  address: 'gc1qb4d6f8h0j2l4n6p8r0t2v4x6z8b0d2f4h6',
  ct: 88
}];
const MEMPOOL = [{
  txid: hash('e1a4f7c9e3b5d8a0c2'),
  ts: '2026-06-13 14:05:39',
  inflows: 2,
  outflows: 3,
  total_out: 740
}, {
  txid: hash('b8d1a4f7c9e3b5d8a0'),
  ts: '2026-06-13 14:04:12',
  inflows: 1,
  outflows: 1,
  total_out: 120
}];

// ── Shell ────────────────────────────────────────────────────────────────
function Nav({
  view,
  onNav,
  theme,
  onToggleTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: theme ? 'gc-navbar' : 'navbar border-bottom',
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      flexWrap: 'wrap',
      padding: '0.5rem 1.5rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: theme ? 'gc-nav-brand' : 'navbar-brand',
    onClick: () => onNav('Home'),
    style: {
      cursor: 'pointer',
      marginRight: '0.5rem'
    }
  }, theme ? 'Gumption' : 'Home'), NAV.filter(n => theme || n !== 'Home').map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    onClick: () => onNav(n),
    style: {
      cursor: 'pointer',
      color: view === n ? theme ? 'var(--gold-dark)' : '#0d6efd' : theme ? 'var(--ink)' : '#212529',
      fontWeight: view === n ? 600 : 400,
      padding: '0.4rem 0.6rem',
      textDecoration: 'none',
      fontSize: '0.9rem'
    }
  }, n)), /*#__PURE__*/React.createElement("button", {
    className: 'btn btn-sm ' + (theme ? 'btn-primary' : 'btn-outline-secondary'),
    onClick: onToggleTheme,
    style: {
      marginLeft: 'auto'
    }
  }, theme ? '2B2F skin · ON' : 'Vanilla Bootstrap', " \u2014 flip"));
}
function Footer({
  theme
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: theme ? 'gc-footer' : 'footer text-center text-muted',
    style: {
      textAlign: 'center',
      padding: '1.5rem 0',
      fontSize: '0.85rem'
    }
  }, "Version 0.9.2 \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: theme ? {
      color: 'var(--gold-dark)'
    } : undefined,
    onClick: e => e.preventDefault()
  }, "gumption.com/chain"));
}

// ── Home ───────────────────────────────────────────────────────────────────
function Home({
  onNav,
  onBlock
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3 g-3"
  }, [['Height', '184,213'], ['Transactions', '9,604'], ['Total staked', '2,794', 'grains'], ['Subjects', '38'], ['Pending', '2']].map(([l, v, u]) => /*#__PURE__*/React.createElement("div", {
    className: "col-6 col-md",
    key: l
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: l,
    value: v,
    unit: u
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Chain Tip"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-info"
  }), "\xA0Last Block Index"), /*#__PURE__*/React.createElement("td", null, "184,213")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-hash"
  }), "\xA0Last Block Hash"), /*#__PURE__*/React.createElement("td", {
    style: {
      wordBreak: 'break-all'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onBlock(BLOCKS[0]);
    }
  }, BLOCKS[0].hash))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-clock"
  }), "\xA0Timestamp"), /*#__PURE__*/React.createElement("td", null, BLOCKS[0].ts, " UTC")))))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5 mb-0"
  }, "Recent Blocks"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Blocks');
    }
  }, "View all blocks"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Subjects');
    }
  }, "Subjects"))), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover mt-3"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Hash"), /*#__PURE__*/React.createElement("th", null, "Timestamp"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, BLOCKS.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b.idx,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onBlock(b)
  }, /*#__PURE__*/React.createElement("td", null, b.idx), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, b.hash)), /*#__PURE__*/React.createElement("td", null, b.ts))))))))));
}

// ── Blocks ───────────────────────────────────────────────────────────────
function Blocks({
  onBlock
}) {
  const rows = [...BLOCKS, ...BLOCKS.map((b, i) => ({
    ...b,
    idx: b.idx - 5 - i,
    txns: i * 3 % 5 + 1
  }))];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Blocks"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Hash"), /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "Txns"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, rows.map((b, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onBlock(b)
  }, /*#__PURE__*/React.createElement("td", null, b.idx), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, b.hash)), /*#__PURE__*/React.createElement("td", null, b.ts), /*#__PURE__*/React.createElement("td", null, b.txns))))), /*#__PURE__*/React.createElement("ul", {
    className: "pagination"
  }, /*#__PURE__*/React.createElement("li", {
    className: "page-item disabled"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-link"
  }, "Previous")), /*#__PURE__*/React.createElement("li", {
    className: "page-item active"
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "1")), /*#__PURE__*/React.createElement("li", {
    className: "page-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "2")), /*#__PURE__*/React.createElement("li", {
    className: "page-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "3")), /*#__PURE__*/React.createElement("li", {
    className: "page-item"
  }, /*#__PURE__*/React.createElement("a", {
    className: "page-link",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Next"))))))));
}

// ── Subjects ───────────────────────────────────────────────────────────────
function Subjects({
  onSubject
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Subjects"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Subject"), /*#__PURE__*/React.createElement("th", null, "Opposition"), /*#__PURE__*/React.createElement("th", null, "Support"), /*#__PURE__*/React.createElement("th", null, "Net"), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", null, SUBJECTS.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: s.subject,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onSubject(s)
  }, /*#__PURE__*/React.createElement("td", null, i + 1), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, s.subject)), /*#__PURE__*/React.createElement("td", null, s.opposition), /*#__PURE__*/React.createElement("td", null, s.support), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(NetStance, {
    opposition: s.opposition,
    support: s.support
  })), /*#__PURE__*/React.createElement("td", null, s.opposition + s.support))))))))));
}

// ── Subject detail ─────────────────────────────────────────────────────────
function SubjectDetail({
  subject,
  onNav,
  onTx
}) {
  const s = subject || SUBJECTS[0];
  const flows = (n, base) => Array.from({
    length: n
  }, (_, i) => ({
    amount: base - i * 17,
    txid: hash((base + i).toString(16) + 'a9c1e8b2d7')
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Subjects');
    }
  }, "\u2190 Subjects")), /*#__PURE__*/React.createElement("h3", null, s.subject), /*#__PURE__*/React.createElement("p", {
    className: "h5"
  }, "Net: ", /*#__PURE__*/React.createElement(NetStance, {
    opposition: s.opposition,
    support: s.support
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Opposition"), /*#__PURE__*/React.createElement("p", {
    className: "h4"
  }, s.opposition, " ", /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "grains")), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Amount"), /*#__PURE__*/React.createElement("th", null, "Transaction"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, flows(3, s.opposition).map((f, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, f.amount), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onTx && onTx(f.txid);
    }
  }, f.txid))))))))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Support"), /*#__PURE__*/React.createElement("p", {
    className: "h4"
  }, s.support, " ", /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "grains")), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Amount"), /*#__PURE__*/React.createElement("th", null, "Transaction"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, flows(4, s.support).map((f, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, f.amount), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onTx && onTx(f.txid);
    }
  }, f.txid)))))))))));
}

// ── Verify ───────────────────────────────────────────────────────────────
function Verify() {
  const [state, setState] = React.useState('idle'); // idle | verified
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Verify a stake"), /*#__PURE__*/React.createElement("p", null, "Paste a ", /*#__PURE__*/React.createElement("code", null, "gc-msg-v1"), " stake attestation to check it against the chain."), /*#__PURE__*/React.createElement("textarea", {
    className: "form-control",
    rows: "6",
    defaultValue: '{"scheme":"gc-msg-v1","claim":{"kind":"support","subject":"Local Library","amount":420},"address":"gc1q9zk7m4x2v8h3jp0…","sig":"…"}'
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary mt-2",
    onClick: () => setState('verified')
  }, "Verify"), state === 'verified' && /*#__PURE__*/React.createElement("div", {
    className: "mt-3 d-flex align-items-start gap-3"
  }, /*#__PURE__*/React.createElement(Seal, {
    verified: true
  }), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mt-1 mb-0"
  }, ['Signature', 'On-chain', 'Consistent'].map(c => /*#__PURE__*/React.createElement("li", {
    key: c,
    style: {
      padding: '0.2rem 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--support)',
      fontWeight: 700
    }
  }, "\u2713"), " ", c)))), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mt-3 mb-0"
  }, "Have a stake to prove? Create a signed attestation on the ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Transact page"), "."))))));
}

// ── Transaction detail (faithful to base transaction.html) ──────────────
const TX_ELLIP = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 0
};
function Transaction({
  txid,
  onNav,
  onTx
}) {
  const id = txid || '4f2a9c1e8b7d3a5f0c2e6b8d1a4f7c9e3b5d8a0c2e4f6b8d0a2c4e6f8b1d3a5c';
  const blockHash = '00000a3f9c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b';
  const inflows = [{
    txid: 'c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7a9c1e',
    idx: 0,
    amount: 500
  }, {
    txid: 'f1a8c3e9b2d5074a6f8c1e3b5d7029a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6',
    idx: 1,
    amount: 320
  }];
  const outflows = [{
    kind: 'support',
    target: 'Local Library',
    addr: false,
    amount: 420
  }, {
    kind: 'opposition',
    target: 'Toll Road',
    addr: false,
    amount: 150
  }, {
    kind: 'transfer',
    target: 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4',
    addr: true,
    amount: 200
  }, {
    kind: 'rescind',
    target: 'Parking Fees',
    addr: false,
    amount: 50
  }];
  const inflowTotal = inflows.reduce((a, b) => a + b.amount, 0);
  const outflowTotal = outflows.reduce((a, b) => a + b.amount, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Subjects');
    }
  }, "\u2190 back")), /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Transaction"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-hash"
  }), "\xA0\xA0ID"), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, id)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-activity"
  }), "\xA0\xA0Status"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    className: "badge bg-success"
  }, "Confirmed"), " 6 confirmations")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-box"
  }), "\xA0\xA0Block"), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, blockHash))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-outlet"
  }), "\xA0\xA0Version"), /*#__PURE__*/React.createElement("td", null, "1")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-clock"
  }), "\xA0\xA0Timestamp"), /*#__PURE__*/React.createElement("td", null, "2026-06-13 14:02:11 UTC")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-person"
  }), "\xA0\xA0Address"), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, "gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-key"
  }), "\xA0\xA0Public Key"), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, "02a7c4e9b1d3f5a7c9e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-check"
  }), "\xA0\xA0Signature"), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, "3045022100c1e8b2d7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b\u2026")))))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "UTXO Inflows"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-8"
  }, "Outflow Transaction ID"), /*#__PURE__*/React.createElement("th", {
    className: "col-1"
  }, "Index"), /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, "Amount"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, inflows.map((i, n) => /*#__PURE__*/React.createElement("tr", {
    key: n,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onTx && onTx(i.txid)
  }, /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, i.txid)), /*#__PURE__*/React.createElement("td", null, i.idx), /*#__PURE__*/React.createElement("td", null, i.amount)))), /*#__PURE__*/React.createElement("tfoot", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, inflowTotal)))))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "UTXO Outflows"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-1"
  }, "Index"), /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, "Kind"), /*#__PURE__*/React.createElement("th", {
    className: "col-7"
  }, "Target"), /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, "Amount"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, outflows.map((o, n) => /*#__PURE__*/React.createElement("tr", {
    key: n
  }, /*#__PURE__*/React.createElement("td", null, n), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(OutflowBadge, {
    kind: o.kind
  })), /*#__PURE__*/React.createElement("td", {
    style: TX_ELLIP
  }, o.addr ? o.target : /*#__PURE__*/React.createElement("span", null, o.target, " ", /*#__PURE__*/React.createElement("em", {
    className: "text-muted"
  }, "(subject)"))), /*#__PURE__*/React.createElement("td", null, o.amount)))), /*#__PURE__*/React.createElement("tfoot", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, outflowTotal)))))))));
}

// ── Chains (chains.html) ───────────────────────────────────────────────────
function Chains({
  onBlock
}) {
  const chains = [{
    id: 0,
    idx: 184213,
    hash: BLOCKS[0].hash,
    ts: BLOCKS[0].ts,
    main: true
  }, {
    id: 1,
    idx: 184207,
    hash: '00000b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e',
    ts: '2026-06-13 12:54:02',
    main: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, chains.map(c => /*#__PURE__*/React.createElement("div", {
    className: "row my-3",
    key: c.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Chain ", c.id, " ", c.main ? /*#__PURE__*/React.createElement("span", {
    className: "badge bg-success"
  }, "main") : /*#__PURE__*/React.createElement("span", {
    className: "badge bg-secondary"
  }, "fork")), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-info"
  }), "\xA0Last Block Index"), /*#__PURE__*/React.createElement("td", null, c.idx.toLocaleString())), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-hash"
  }), "\xA0Last Block Hash"), /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onBlock(c);
    }
  }, c.hash))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-clock"
  }), "\xA0Timestamp"), /*#__PURE__*/React.createElement("td", null, c.ts, " UTC"))))))))));
}

// ── Addresses (addresses.html) ─────────────────────────────────────────────
function Addresses({
  onAddress
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Addresses"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "#"), /*#__PURE__*/React.createElement("th", null, "Address"), /*#__PURE__*/React.createElement("th", null, "Balance"))), /*#__PURE__*/React.createElement("tbody", null, ADDRESSES.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.address,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onAddress(r)
  }, /*#__PURE__*/React.createElement("td", null, i + 1), /*#__PURE__*/React.createElement("td", {
    className: "font-monospace",
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, r.address)), /*#__PURE__*/React.createElement("td", null, r.ct.toLocaleString(), " ", /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "grains")))))))))));
}

// ── Address detail (address.html) ──────────────────────────────────────────
function AddressDetail({
  address,
  onNav,
  onTx
}) {
  const a = address || ADDRESSES[0];
  const holdings = [{
    amount: 500,
    txid: hash('a1f4b8c6035d7e1a9b')
  }, {
    amount: 420,
    txid: hash('c3e9b2d5074a6f8c1e')
  }, {
    amount: 320,
    txid: hash('f7029a4c6e8b0d2f4a')
  }];
  const txns = [{
    txid: hash('4f2a9c1e8b7d3a5f0c'),
    ts: '2026-06-13 14:02:11'
  }, {
    txid: hash('9b3f5c2d8e4a06b1f7'),
    ts: '2026-06-12 21:18:44'
  }];
  const ell = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Addresses');
    }
  }, "\u2190 Addresses")), /*#__PURE__*/React.createElement("h3", {
    className: "font-monospace",
    style: {
      wordBreak: 'break-all'
    }
  }, a.address), /*#__PURE__*/React.createElement("p", {
    className: "h4"
  }, a.ct.toLocaleString(), " ", /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "grains")))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Holdings"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Amount"), /*#__PURE__*/React.createElement("th", null, "Transaction"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, holdings.map((f, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onTx(f.txid)
  }, /*#__PURE__*/React.createElement("td", null, f.amount), /*#__PURE__*/React.createElement("td", {
    style: ell
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, f.txid))))))))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Transactions"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Transaction"), /*#__PURE__*/React.createElement("th", null, "Timestamp"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, txns.map((t, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onTx(t.txid)
  }, /*#__PURE__*/React.createElement("td", {
    style: ell
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, t.txid)), /*#__PURE__*/React.createElement("td", null, t.ts))))))))));
}

// ── Mempool (mempool.html) ─────────────────────────────────────────────────
function Mempool({
  onTx
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Mempool ", /*#__PURE__*/React.createElement("span", {
    className: "small text-muted"
  }, "(", MEMPOOL.length, " pending)")), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Txid"), /*#__PURE__*/React.createElement("th", null, "Timestamp"), /*#__PURE__*/React.createElement("th", null, "Inflows"), /*#__PURE__*/React.createElement("th", null, "Outflows"), /*#__PURE__*/React.createElement("th", null, "Total out"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, MEMPOOL.map((e, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onTx(e.txid)
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: 0
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: ev => ev.preventDefault()
  }, e.txid)), /*#__PURE__*/React.createElement("td", null, e.ts), /*#__PURE__*/React.createElement("td", null, e.inflows), /*#__PURE__*/React.createElement("td", null, e.outflows), /*#__PURE__*/React.createElement("td", null, e.total_out, " ", /*#__PURE__*/React.createElement("span", {
    className: "small text-muted"
  }, "grains")))))))))));
}

// ── Key gate (_key_import.html) — the three-state signing-key panel ────────
function KeyGate({
  initial = 'locked'
}) {
  const [state, setState] = React.useState(initial); // none | locked | unlocked
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  return /*#__PURE__*/React.createElement("div", null, state === 'none' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-semibold"
  }, "Create your signing key"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mb-2"
  }, "Your signing key marks your stakes as yours. It is created in your browser and saved encrypted on this device \u2014 it is never sent anywhere."), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Passphrase"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "choose a passphrase"
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-check mt-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    className: "form-check-input",
    id: "kg-ack"
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label small",
    htmlFor: "kg-ack"
  }, "Persist only on a node you trust: this saves your encrypted key in this browser, on this site.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm mt-2",
    onClick: () => setState('unlocked')
  }, "Create your signing key")), state === 'locked' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-semibold"
  }, "Your signing key ", /*#__PURE__*/React.createElement("span", {
    className: "badge bg-secondary"
  }, "locked")), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mb-2"
  }, "Saved on this device as ", /*#__PURE__*/React.createElement("code", null, addr), ". Unlock it to sign."), /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Passphrase"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "your key passphrase"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: () => setState('unlocked')
  }, "Unlock"))), state === 'unlocked' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge bg-success",
    style: {
      marginRight: '0.5rem'
    }
  }, "Unlocked \xB7 ", addr.slice(0, 14), "\u2026"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary btn-sm",
    onClick: () => setState('locked')
  }, "Lock")), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("a", {
    className: "small text-decoration-none",
    href: "#",
    onClick: e => e.preventDefault()
  }, "\u25B8 Advanced: use a one-session key instead")));
}

// ── Transact (transact.html) ───────────────────────────────────────────────
function Transact({
  onNav
}) {
  const [type, setType] = React.useState('transfer');
  const showAddress = type === 'transfer';
  const showSubject = type === 'opposition' || type === 'support' || type === 'rescind';
  const showKind = type === 'rescind';
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning",
    role: "alert"
  }, /*#__PURE__*/React.createElement("strong", null, "Your private key never leaves your browser"), " \u2014 signing happens here, and only signatures are sent."))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Build & sign a transaction"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Type"), /*#__PURE__*/React.createElement("select", {
    className: "form-select",
    value: type,
    onChange: e => setType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "transfer"
  }, "transfer"), /*#__PURE__*/React.createElement("option", {
    value: "opposition"
  }, "opposition"), /*#__PURE__*/React.createElement("option", {
    value: "support"
  }, "support"), /*#__PURE__*/React.createElement("option", {
    value: "rescind"
  }, "rescind"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Amount (grains)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    step: "1",
    className: "form-control",
    placeholder: "100"
  })), showAddress && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Destination address"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    placeholder: "GC...GC"
  })), showSubject && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subject"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    placeholder: "goblins"
  })), showKind && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rescind kind"), /*#__PURE__*/React.createElement("select", {
    className: "form-select"
  }, /*#__PURE__*/React.createElement("option", {
    value: "opposition"
  }, "opposition"), /*#__PURE__*/React.createElement("option", {
    value: "support"
  }, "support"))))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(KeyGate, null))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Build & review"), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("pre", {
    className: "small bg-light p-2",
    style: {
      minHeight: '2.5rem',
      margin: 0
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "small text-muted"
  }, "Looking for the power tools? Broadcasting a pre-signed transaction and signing stake attestations live on ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Advanced');
    }
  }, "Advanced tools"), "."))));
}

// ── Advanced (advanced.html) ───────────────────────────────────────────────
function Advanced({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning",
    role: "alert"
  }, /*#__PURE__*/React.createElement("strong", null, "Your private key never leaves your browser."), " This node does not store it, and reloading or closing this tab clears it. Only your signature and public key are ever sent."))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Signing key"), /*#__PURE__*/React.createElement(KeyGate, null))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, /*#__PURE__*/React.createElement("a", {
    className: "text-decoration-none",
    href: "#",
    onClick: e => e.preventDefault()
  }, "Broadcast a pre-signed transaction")), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted"
  }, "Paste an already-signed transaction JSON. The submit request itself is still authed, so the imported key signs the request envelope."), /*#__PURE__*/React.createElement("textarea", {
    className: "form-control",
    rows: "5",
    placeholder: '{"txid":"...","signature":"...", ...}'
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary mt-2"
  }, "Submit"))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("section", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Sign a stake attestation"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted"
  }, "Produce a signed ", /*#__PURE__*/React.createElement("code", null, "gc-msg-v1"), " proof that you staked on a subject \u2014 the producer side of ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Verify');
    }
  }, "Verify"), "."), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Transaction id (txid)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    placeholder: "64-char hex txid of your stake"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Kind"), /*#__PURE__*/React.createElement("select", {
    className: "form-select"
  }, /*#__PURE__*/React.createElement("option", null, "opposition"), /*#__PURE__*/React.createElement("option", null, "support"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subject"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    placeholder: "goblins"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Amount (grains)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    step: "1",
    className: "form-control",
    placeholder: "300"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Sign attestation"), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("pre", {
    className: "small bg-light p-2",
    style: {
      minHeight: '2.5rem',
      margin: 0
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mb-0"
  }, "Paste this into Verify.")))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Verify a stake attestation"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mb-0"
  }, "Check a proof someone shared with you against the chain on ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Verify');
    }
  }, "Verify"), "."))))));
}

// ── Signing key page (signing_key.html — has-key state) ────────────────────
function SigningKey() {
  const [unlocked, setUnlocked] = React.useState(false);
  const addr = 'gc1q9zk7m4x2v8h3jp0p6r8t2w4y6u8i0o2a4';
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning",
    role: "alert"
  }, /*#__PURE__*/React.createElement("strong", null, "Persist only on a node you trust \u2014 its page can use your key while unlocked."), " A saved signing key is stored ", /*#__PURE__*/React.createElement("em", null, "encrypted"), " in this browser, scoped to this origin. Your passphrase and private key never leave the browser."))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Saved signing key on this node"), /*#__PURE__*/React.createElement("p", {
    className: "mb-3 font-monospace"
  }, "Address: ", /*#__PURE__*/React.createElement("code", null, addr), " ", unlocked ? /*#__PURE__*/React.createElement("span", {
    className: "badge bg-success"
  }, "unlocked") : /*#__PURE__*/React.createElement("span", {
    className: "badge bg-secondary"
  }, "locked")), !unlocked ? /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h6"
  }, "Unlock"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Passphrase"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "your passphrase"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => setUnlocked(true)
  }, "Unlock")) : /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-secondary",
    onClick: () => setUnlocked(false)
  }, "Lock")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h6"
  }, "Download an encrypted backup"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted"
  }, "Exports the encrypted backup blob (safe to store). This is your recovery path. Lose both the passphrase and the backup and the signing key is unrecoverable."), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Passphrase"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "form-control",
    placeholder: "your passphrase"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    disabled: !unlocked
  }, "Download backup")), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h6"
  }, "Forget this signing key"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted"
  }, "Deletes the saved encrypted record from this node. Make sure you have a backup first."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-danger"
  }, "Forget signing key")))))));
}

// ── Block detail (block.html) ───────────────────────────────────
function BlockDetail({
  block,
  onNav,
  onTx
}) {
  const b = block || BLOCKS[0];
  const idxNum = typeof b.idx === 'number' ? b.idx : parseInt(String(b.idx).replace(/,/g, ''), 10);
  const prevHash = '00000c7d2e9a1f4b8c6035d7e1a9b3f5c2d8e4a06b1f7c9d3e5a7b09c1d3f5e7';
  const txns = [{
    txid: hash('4f2a9c1e8b7d3a5f0c'),
    ts: b.ts,
    coinbase: true
  }, {
    txid: hash('9b3f5c2d8e4a06b1f7'),
    ts: b.ts,
    coinbase: false
  }, {
    txid: hash('c1e8b2d7a4f06e5c9b'),
    ts: b.ts,
    coinbase: false
  }];
  const ell = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-1"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Blocks');
    }
  }, "\u2190 Blocks")), /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, "Block"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-info"
  }), "\xA0Index"), /*#__PURE__*/React.createElement("td", null, idxNum.toLocaleString())), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-hash"
  }), "\xA0Hash"), /*#__PURE__*/React.createElement("td", {
    style: ell
  }, b.hash)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-bullseye"
  }), "\xA0Target"), /*#__PURE__*/React.createElement("td", {
    style: ell
  }, "0000ffff00000000000000000000000000000000000000000000000000000000")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-outlet"
  }), "\xA0Version"), /*#__PURE__*/React.createElement("td", null, "1")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-clock"
  }), "\xA0Timestamp"), /*#__PURE__*/React.createElement("td", null, b.ts, " UTC")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-bookmark-check"
  }), "\xA0Proof Of Work"), /*#__PURE__*/React.createElement("td", null, "1,284,553")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-diagram-2"
  }), "\xA0Merkle Root"), /*#__PURE__*/React.createElement("td", {
    style: ell
  }, "7a4f06e5c9b81d3f2a7e0c4b6d8f1a9e3c5b7d0f2a4e6c8b00000a3f9c1e8b2d")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-box-arrow-in-left"
  }), "\xA0Previous Block Hash"), /*#__PURE__*/React.createElement("td", {
    style: ell
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Blocks');
    }
  }, prevHash))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-box-arrow-in-right"
  }), "\xA0Next Block Hash"), /*#__PURE__*/React.createElement("td", {
    className: "text-muted"
  }, "None")))))))), /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h5"
  }, "Block Transactions"), /*#__PURE__*/React.createElement("table", {
    className: "table table-hover table-sm",
    style: {
      tableLayout: 'fixed'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-9"
  }, "Transaction ID"), /*#__PURE__*/React.createElement("th", null, "Timestamp"))), /*#__PURE__*/React.createElement("tbody", {
    className: "font-monospace"
  }, txns.map((t, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    className: "clickable",
    style: {
      cursor: 'pointer'
    },
    onClick: () => onTx(t.txid)
  }, /*#__PURE__*/React.createElement("td", {
    style: ell
  }, /*#__PURE__*/React.createElement("i", {
    className: t.coinbase ? 'bi-award' : 'bi-shuffle',
    title: t.coinbase ? 'COINBASE' : 'TRANSACTION'
  }), "\xA0", t.txid), /*#__PURE__*/React.createElement("td", null, t.ts))))))))));
}
function ExplorerApp() {
  const [view, setView] = React.useState('Home');
  const [block, setBlock] = React.useState(null);
  const [subject, setSubject] = React.useState(null);
  const [txid, setTxid] = React.useState(null);
  const [address, setAddress] = React.useState(null);
  const [theme, setTheme] = React.useState(false); // false = vanilla Bootstrap; true = 2B2F hub skin
  const onNav = v => {
    setView(v);
    window.scrollTo({
      top: 0
    });
  };
  const openBlock = b => {
    setBlock(b);
    setView('BlockDetail');
    window.scrollTo({
      top: 0
    });
  };
  const openSubject = s => {
    setSubject(s);
    setView('SubjectDetail');
    window.scrollTo({
      top: 0
    });
  };
  const openTx = t => {
    setTxid(t);
    setView('Transaction');
    window.scrollTo({
      top: 0
    });
  };
  const openAddress = a => {
    setAddress(a);
    setView('AddressDetail');
    window.scrollTo({
      top: 0
    });
  };
  const KNOWN = ['Home', 'Chains', 'Blocks', 'BlockDetail', 'Subjects', 'SubjectDetail', 'Addresses', 'AddressDetail', 'Mempool', 'Transaction', 'Transact', 'Advanced', 'Signing key', 'Verify'];
  return /*#__PURE__*/React.createElement("div", {
    className: theme ? 'theme-2b2f' : '',
    style: {
      minHeight: '100vh',
      background: theme ? 'var(--bg-page)' : '#fff'
    }
  }, /*#__PURE__*/React.createElement(Nav, {
    view: view,
    onNav: onNav,
    theme: theme,
    onToggleTheme: () => setTheme(t => !t)
  }), view === 'Home' && /*#__PURE__*/React.createElement(Home, {
    onNav: onNav,
    onBlock: openBlock
  }), view === 'Chains' && /*#__PURE__*/React.createElement(Chains, {
    onBlock: openBlock
  }), view === 'Blocks' && /*#__PURE__*/React.createElement(Blocks, {
    onBlock: openBlock
  }), view === 'BlockDetail' && /*#__PURE__*/React.createElement(BlockDetail, {
    block: block,
    onNav: onNav,
    onTx: openTx
  }), view === 'Subjects' && /*#__PURE__*/React.createElement(Subjects, {
    onSubject: openSubject
  }), view === 'SubjectDetail' && /*#__PURE__*/React.createElement(SubjectDetail, {
    subject: subject,
    onNav: onNav,
    onTx: openTx
  }), view === 'Addresses' && /*#__PURE__*/React.createElement(Addresses, {
    onAddress: openAddress
  }), view === 'AddressDetail' && /*#__PURE__*/React.createElement(AddressDetail, {
    address: address,
    onNav: onNav,
    onTx: openTx
  }), view === 'Mempool' && /*#__PURE__*/React.createElement(Mempool, {
    onTx: openTx
  }), view === 'Transaction' && /*#__PURE__*/React.createElement(Transaction, {
    txid: txid,
    onNav: onNav,
    onTx: openTx
  }), view === 'Transact' && /*#__PURE__*/React.createElement(Transact, {
    onNav: onNav
  }), view === 'Advanced' && /*#__PURE__*/React.createElement(Advanced, {
    onNav: onNav
  }), view === 'Signing key' && /*#__PURE__*/React.createElement(SigningKey, null), view === 'Verify' && /*#__PURE__*/React.createElement(Verify, null), !KNOWN.includes(view) && /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row my-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-title h5"
  }, view), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "This vanilla view isn't recreated in the kit.")))))), /*#__PURE__*/React.createElement(Footer, {
    theme: theme
  }));
}
Object.assign(window, {
  ExplorerApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/gumptionchain-explorer/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Grit = __ds_scope.Grit;

__ds_ns.GritMint = __ds_scope.GritMint;

__ds_ns.HeroLogo = __ds_scope.HeroLogo;

__ds_ns.WordmarkLockup = __ds_scope.WordmarkLockup;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.NetStance = __ds_scope.NetStance;

__ds_ns.OutflowBadge = __ds_scope.OutflowBadge;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.KindLabel = __ds_scope.KindLabel;

__ds_ns.LedgerBoard = __ds_scope.LedgerBoard;

__ds_ns.Seal = __ds_scope.Seal;

__ds_ns.Ticker = __ds_scope.Ticker;

})();

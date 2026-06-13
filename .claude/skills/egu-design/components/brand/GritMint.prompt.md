One-line: The celebratory "GRIT minted!" moment — the hex strikes in, a gold sheen sweeps it, a ring pulses out, and the amount counts up.

```jsx
<GritMint amount={12} />                       {/* +12 GRIT minted */}
<GritMint amount={4.2} size={64} label="earned" />
<GritMint amount={50} showAmount={false} />    {/* just the struck-coin flourish */}
```

Use on a reward toast / earn confirmation (after a TBTF game, a stake, a daily grant). Click replays it. Respects `prefers-reduced-motion` (rests on the full coin + final amount) unless you pass `animate` explicitly to force it. Built on the system's `egu-stamp` / `egu-sheen` / `egu-mint-ring` / `egu-mint-spark` keyframes.

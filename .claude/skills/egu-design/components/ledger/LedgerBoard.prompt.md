One-line: The Great Ledger tug-of-war — each subject's support pulls the green bar left, opposition pulls the red bar right; bars grow from the center on mount.

```jsx
<LedgerBoard rows={[
  { subject: 'Local Library', support: 4.2, opposition: 1.6, href: '/subject/...' },
  { subject: 'Parking Fees', support: 2.1, opposition: 3.9 },
]} />
```

Bar widths are each side's *share* of the row total. Pass `inGrains` if amounts are raw grains (100 grains = 1 grit). The board is the landing page's centerpiece — keep it to ~5 rows.

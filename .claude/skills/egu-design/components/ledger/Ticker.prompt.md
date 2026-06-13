One-line: The dark stakes marquee — recent stakes scroll continuously across an inverted band, pausing on hover.

```jsx
<Ticker items={[
  { kind: 'support', subject: 'Local Library', amount: '4.20', signer: '@thomas', age: '2m' },
  { kind: 'opposition', subject: 'Parking Fees', amount: '1.50', signer: '@dana', age: '9m' },
]} duration={40} />
```

Items repeat internally for a seamless loop — pass the real set once. Lower `duration` = faster scroll. Hovering pauses it (CSS handles this via `.stakes-ticker`).

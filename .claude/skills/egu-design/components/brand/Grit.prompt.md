One-line: The GRIT currency mark — a struck gold hex token with the geometric “G” — shown wherever an amount of GRIT appears.

```jsx
<span style={{display:'inline-flex',alignItems:'center',gap:6,fontWeight:700}}>
  <Grit size={22} /> 27.9
</span>

Earn <Grit size={18} /> GRIT
<Grit size={64} mono />     {/* single-tone for stamps / favicon */}
```

Props: `size` (px, default 24), `mono` (1-color knockout), `title` (a11y label). Inline SVG — recolours and scales cleanly from hero to 16px. Pair it with tabular-figure amounts; don't restate “GRIT” in text right next to the mark unless for emphasis.

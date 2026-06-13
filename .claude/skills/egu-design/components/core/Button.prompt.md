One-line: The EGU action button — gold-leaf primary, outline-gold secondary, stone tertiary, with a gold-sheen sweep on hover.

```jsx
<Button variant="gold" size="md" onClick={...}>Get your key →</Button>
<Button variant="outline-gold" as="a" href="/about">How it works</Button>
<Button variant="stone" size="sm">Cancel</Button>
```

Variants: `gold` (primary, gradient + sheen), `outline-gold` (secondary), `stone` (quiet tertiary).
Sizes: `sm` / `md` / `lg`. Use `as="a"` for navigation. Disabled via the native `disabled` attribute.

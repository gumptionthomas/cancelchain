One-line: The EGU brand lockup — the HeroLogo mark with the “The Extended Gumption Universe” wordmark in Righteous gold, in one call.

```jsx
<WordmarkLockup />                          {/* horizontal: mark + wordmark */}
<WordmarkLockup orientation="stacked" size={150} />   {/* hero use */}
<WordmarkLockup size={40} animate={false} />          {/* compact header/footer */}
```

The wordmark scales from `size`. Horizontal suits nav bars and footers; stacked is the landing hero. Inherits HeroLogo's reduced-motion behavior.

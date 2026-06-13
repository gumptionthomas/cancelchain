One-line: A subject's net verdict — "{n} supported" (green), "{n} opposed" (red), or "even" (muted).

```jsx
<NetStance support={520} opposition={180} />   {/* "340 supported" (green) */}
<NetStance support={40} opposition={40} />     {/* "even" (muted) */}
```

Always shows magnitude + word so there's no implicit sign convention to decode. Green/red are the reserved ledger meanings.

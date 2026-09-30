export function TagList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-none tracking-tight text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

import type { ReactNode } from "react";

interface ScreenPanelProps {
  children: ReactNode;
  maxWidthClassName?: string;
}

/** Every screen's outer card. `--ink` and `--ground` share the same hex
 * value by design (frontend.md's tokens) -- --ink text is legible on
 * --surface, not on the page's --ground background, so screen content always
 * lives inside one of these rather than directly on the shell. */
export function ScreenPanel({ children, maxWidthClassName = "max-w-[640px]" }: ScreenPanelProps) {
  return (
    <section className={`mx-auto ${maxWidthClassName} rounded-panel border border-rule bg-surface p-6 text-ink`}>
      {children}
    </section>
  );
}

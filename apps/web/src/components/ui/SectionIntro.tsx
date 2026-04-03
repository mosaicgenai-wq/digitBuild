import type { PropsWithChildren } from 'react';

export function SectionEyebrow({ children }: PropsWithChildren) {
  return <span className="section-eyebrow">{children}</span>;
}

export function SectionTitle({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <h2 className={`section-title ${className}`.trim()}>{children}</h2>;
}

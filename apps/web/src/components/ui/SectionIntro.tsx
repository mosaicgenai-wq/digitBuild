import type { PropsWithChildren } from 'react';


export function SectionEyebrow({ children }: PropsWithChildren) {
  const label = typeof children === 'string' ? children : '';
  return (
    <span className="section-eyebrow">
      <span>{children}</span>
    </span>
  );
}

type SectionTitleProps = PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}>;

export function SectionTitle({ children, as: Tag = 'h2', className = '' }: SectionTitleProps) {
  return <Tag className={`section-title ${className}`.trim()}>{children}</Tag>;
}

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variant = 'pill' | 'pill-outline' | 'ghost';
type Size = 'sm' | 'lg';

function getClassName(variant: Variant = 'pill', size: Size = 'lg', block = false) {
  return ['btn', `btn-${variant}`, `btn-${size}`, block ? 'btn-block' : ''].filter(Boolean).join(' ');
}

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

export function Button({ children, variant = 'pill', size = 'lg', block = false, className = '', ...props }: ButtonProps) {
  return (
    <button {...props} className={`${getClassName(variant, size, block)} ${className}`.trim()}>
      {children}
    </button>
  );
}

type ButtonLinkProps = PropsWithChildren<LinkProps> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

export function ButtonLink({ children, variant = 'pill', size = 'lg', block = false, className = '', ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={`${getClassName(variant, size, block)} ${className}`.trim()}>
      {children}
    </Link>
  );
}

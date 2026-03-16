import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './Link.module.css';

type LinkVariant = 'text' | 'buttonPrimary' | 'buttonSecondary' | 'buttonGhost';
type LinkSize = 'sm' | 'md' | 'lg' | 'compact-lg';

type LinkSlots = {
  root?: string;
  label?: string;
};

type LinkTokenOverrides = {
  '--link-bg'?: string;
  '--link-color'?: string;
  '--link-border'?: string;
  '--link-radius'?: string;
  '--link-px'?: string;
  '--link-py'?: string;
  '--link-font-size'?: string;
  '--link-decoration'?: string;
  '--link-hover-decoration'?: string;
};

type NativeAnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps | 'href' | 'children'
>;

export type LinkProps = NextLinkProps &
  NativeAnchorProps & {
    children: ReactNode;
    variant?: LinkVariant;
    size?: LinkSize;
    classes?: LinkSlots;
    vars?: LinkTokenOverrides;
    unstyled?: boolean;
  };

export function Link({
  variant = 'text',
  size = 'md',
  classes,
  className,
  vars,
  style,
  children,
  unstyled = false,
  ...rest
}: LinkProps) {
  const mergedStyle = {
    ...(style ?? {}),
    ...(vars ?? {})
  } as CSSProperties;

  if (unstyled) {
    return (
      <NextLink className={cn(classes?.root, className)} style={mergedStyle} {...rest}>
        <span className={cn(classes?.label)}>{children}</span>
      </NextLink>
    );
  }

  return (
    <NextLink
      className={cn(styles.link, styles[size], styles[variant], classes?.root, className)}
      style={mergedStyle}
      {...rest}
    >
      <span className={cn(styles.label, classes?.label)}>{children}</span>
    </NextLink>
  );
}

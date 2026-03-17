import { ButtonHTMLAttributes, CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'none' | 'sm' | 'md' | 'lg';

type ButtonSlots = {
  root?: string;
  label?: string;
};

type ButtonTokenOverrides = {
  '--btn-bg'?: string;
  '--btn-color'?: string;
  '--btn-border'?: string;
  '--btn-radius'?: string;
  '--btn-px'?: string;
  '--btn-py'?: string;
};
/*
ButtonProps extends the standard ButtonHTMLAttributes which come from the native React button props
to include additional props for variant, size, custom classes, CSS variable overrides, and an
unstyled option. The Button component uses these props to render a styled button element with
appropriate classes and inline styles based on the provided variant, size, and token overrides.
*/
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  classes?: ButtonSlots;
  vars?: ButtonTokenOverrides;
  unstyled?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'none',
  className,
  classes,
  vars,
  style,
  children,
  unstyled = false,
  ...rest
}: ButtonProps) {
  const sizeClass = size === 'none' ? undefined : styles[size];

  const mergedStyle = {
    ...(style ?? {}),
    ...(vars ?? {})
  } as CSSProperties;

  if (unstyled) {
    return (
      <button className={cn(classes?.root, className)} style={mergedStyle} {...rest}>
        <span className={cn(classes?.label)}>{children}</span>
      </button>
    );
  }

  return (
    <button
      className={cn(styles.button, styles[variant], sizeClass, classes?.root, className)}
      style={mergedStyle}
      {...rest}
    >
      <span className={cn(styles.label, classes?.label)}>{children}</span>
    </button>
  );
}

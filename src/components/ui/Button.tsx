import React from 'react';
import styles from './Button.module.css';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isIconOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface ButtonAsButton extends ButtonBaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
  external?: never;
  target?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  external?: boolean;
  target?: string;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isIconOnly = false,
  className = '',
  style,
  children,
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isIconOnly ? styles['button--icon'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className={styles.button__icon}>{icon}</span>
      )}
      {!isIconOnly && children}
      {icon && iconPosition === 'right' && (
        <span className={styles.button__icon}>{icon}</span>
      )}
    </>
  );

  if ('href' in props && props.href) {
    const { href, external, target, ...rest } = props as ButtonAsLink;
    if (external || target) {
      return (
        <a
          href={href}
          target={target || (external ? '_blank' : undefined)}
          rel={external || target === '_blank' ? 'noopener noreferrer' : undefined}
          className={classNames}
          style={style}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classNames} style={style} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classNames} style={style} {...buttonProps}>
      {content}
    </button>
  );
}

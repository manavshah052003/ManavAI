import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  size = 'md',
  className = '',
  style,
  children
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[`badge--${variant}`]} ${styles[`badge--${size}`]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

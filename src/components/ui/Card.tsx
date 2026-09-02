import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  variant?: 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Card({
  variant = 'outlined',
  padding = 'md',
  hover = false,
  className = '',
  style,
  children,
  onClick,
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--pad-${padding}`],
    hover ? styles['card--hover'] : '',
    onClick ? styles['card--clickable'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

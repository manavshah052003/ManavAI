import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-6)'
      }}
    >
      <div style={{ fontSize: 'var(--text-9xl)', fontWeight: 800, color: 'var(--color-accent-text)', lineHeight: 1, letterSpacing: 'var(--tracking-tighter)' }}>
        404
      </div>
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, margin: 'var(--space-4) 0 var(--space-2)' }}>
        Outside the Portfolio Boundary
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '480px', marginBottom: 'var(--space-8)' }}>
        Looks like you&apos;ve navigated to a route that doesn&apos;t exist. Let&apos;s guide you back to the main engineering showcase.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        <Button href="/" variant="primary" size="lg">
          Back to Home
        </Button>
        <Button href="/projects" variant="secondary" size="lg">
          Explore Projects
        </Button>
      </div>
    </div>
  );
}

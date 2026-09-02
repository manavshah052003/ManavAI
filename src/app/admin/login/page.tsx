'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') || '/admin/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-8)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto var(--space-4)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Manav Shah Logo"
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, letterSpacing: 'var(--tracking-tight)' }}>
          Admin Portal
        </h1>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Authenticate to access the CMS &amp; portfolio controls.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-error-light)',
            color: 'var(--color-error)',
            border: '1px solid var(--color-error)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            marginBottom: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-1)'
            }}
          >
            Admin Email
          </label>
          <input
            type="email"
            required
            autoFocus
            placeholder="manav@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-tertiary)',
              marginBottom: 'var(--space-1)'
            }}
          >
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{ width: '100%', marginTop: 'var(--space-2)' }}
        >
          {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
        </Button>
      </form>

      <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
        <Link
          href="/"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            textDecoration: 'none',
            transition: 'color var(--duration-fast)'
          }}
        >
          &larr; Back to Public Portfolio
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(79, 70, 229, 0.15), rgba(10, 10, 10, 1))',
        padding: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />
      <Suspense fallback={<div style={{ color: 'var(--color-text-tertiary)' }}>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

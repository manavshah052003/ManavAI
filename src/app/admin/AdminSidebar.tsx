'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import styles from './admin.module.css';

const ADMIN_LINKS = [
  { href: '/admin/dashboard', label: 'Overview', group: 'General' },
  { href: '/admin/profile', label: 'Profile & Hero', group: 'Content' },
  { href: '/admin/projects', label: 'Projects', group: 'Content' },
  { href: '/admin/experience', label: 'Experience', group: 'Content' },
  { href: '/admin/skills', label: 'Skills', group: 'Content' },
  { href: '/admin/education', label: 'Education', group: 'Content' },
  { href: '/admin/certifications', label: 'Certifications', group: 'Content' },
  { href: '/admin/achievements', label: 'Achievements', group: 'Content' },
  { href: '/admin/services', label: 'Services', group: 'Content' },
  { href: '/admin/notes', label: 'Notes / Blog', group: 'Content' },
  { href: '/admin/resume', label: 'Resume File', group: 'Media' },
  { href: '/admin/chatbot', label: 'Chatbot Knowledge', group: 'AI & Search' },
  { href: '/admin/messages', label: 'Inbox / Messages', group: 'Communication' },
  { href: '/admin/settings', label: 'Site Settings', group: 'System' }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Group links
  const groups = Array.from(new Set(ADMIN_LINKS.map((l) => l.group)));

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div>
            <span className={styles.sidebarTitle}>Manav CMS</span>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Portfolio Admin</div>
          </div>
        </div>
      </div>

      <nav className={styles.navSection}>
        {groups.map((grp) => (
          <div key={grp}>
            <div className={styles.navHeader}>{grp}</div>
            {ADMIN_LINKS.filter((l) => l.group === grp).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${
                  pathname === link.href ? styles.navLinkActive : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarFooter} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Link
          href="/"
          target="_blank"
          className={styles.navLink}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)' }}
        >
          &larr; View Public Website
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-error)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 'var(--space-2) var(--space-3)',
            textAlign: 'left',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

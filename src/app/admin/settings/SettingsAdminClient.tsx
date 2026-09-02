'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { SiteSettings } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SettingsAdminClient({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const saved = await res.json();
        setSettings(saved);
        showNotification('✓ Site settings saved successfully!');
      } else {
        alert('Failed to save settings.');
      }
    } catch (err) {
      alert('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {notification && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--color-success-light)', color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
          {notification}
        </div>
      )}

      <Card variant="outlined" padding="lg">
        <form onSubmit={handleSave} className={styles.formGrid}>
          {/* Section: General */}
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '-0.01em' }}>General</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Site-wide title, description, and footer.</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Site Title</label>
            <input
              type="text"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Meta Description (SEO)</label>
            <textarea
              rows={2}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className={styles.textarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Footer Text</label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className={styles.input}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-primary)', margin: 'var(--space-4) 0' }} />

          {/* Section: Theme & Accent Colors */}
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '-0.01em' }}>Theme &amp; Accent Colors</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Default theme and accent token overrides.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Default Theme</label>
              <select
                value={settings.defaultTheme}
                onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value as SiteSettings['defaultTheme'] })}
                className={styles.select}
              >
                <option value="dark">Dark Mode (Default)</option>
                <option value="light">Light Mode</option>
                <option value="system">System Preference</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Accent Color (Light Mode)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input
                  type="color"
                  value={settings.accentColorLight}
                  onChange={(e) => setSettings({ ...settings, accentColorLight: e.target.value })}
                  style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                />
                <input
                  type="text"
                  value={settings.accentColorLight}
                  onChange={(e) => setSettings({ ...settings, accentColorLight: e.target.value })}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Accent Color (Dark Mode)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input
                  type="color"
                  value={settings.accentColorDark}
                  onChange={(e) => setSettings({ ...settings, accentColorDark: e.target.value })}
                  style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                />
                <input
                  type="text"
                  value={settings.accentColorDark}
                  onChange={(e) => setSettings({ ...settings, accentColorDark: e.target.value })}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-primary)', margin: 'var(--space-4) 0' }} />

          {/* Section: Portfolio Assistant */}
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '-0.01em' }}>Portfolio Assistant</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Configure the offline AI assistant&apos;s first message.</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Welcome Message</label>
            <textarea
              rows={3}
              value={settings.assistantWelcome}
              onChange={(e) => setSettings({ ...settings, assistantWelcome: e.target.value })}
              className={styles.textarea}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-primary)', margin: 'var(--space-4) 0' }} />

          {/* Section: Integrations */}
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, letterSpacing: '-0.01em' }}>Integrations &amp; Files</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Analytics tracking, resume, and external integrations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Google Analytics Tracking ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Resume File URL</label>
              <input
                type="text"
                value={settings.resumeUrl}
                onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

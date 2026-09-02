'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Profile } from '@/types/portfolio';

export function ProfileAdminClient({ initialProfile }: { initialProfile: Profile }) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setStatusMessage({ type: 'success', text: '✓ Profile updated successfully! Changes are live across the site.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to save profile changes.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card variant="outlined" padding="lg">
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {statusMessage && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: statusMessage.type === 'success' ? 'var(--color-success-light)' : 'var(--color-error-light)',
              color: statusMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600
            }}
          >
            {statusMessage.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Primary Role / Title</label>
            <input
              type="text"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hero Tagline</label>
          <input
            type="text"
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Short Bio</label>
          <textarea
            rows={3}
            value={profile.shortBio}
            onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
            className={styles.textarea}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Availability Status (Hero Badge)</label>
            <input
              type="text"
              value={profile.status}
              onChange={(e) => setProfile({ ...profile, status: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Contact Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>GitHub URL</label>
            <input
              type="url"
              value={profile.github}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>LinkedIn URL</label>
            <input
              type="url"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              className={styles.input}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className={styles.input}
            />
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" size="md" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

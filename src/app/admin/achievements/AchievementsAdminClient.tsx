'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Achievement } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_ACH: Achievement = {
  id: '',
  title: '',
  date: '2026',
  category: 'Publication',
  description: '',
  metrics: ''
};

export function AchievementsAdminClient({ initialAchievements }: { initialAchievements: Achievement[] }) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newAch = { ...EMPTY_ACH, id: `ach-${Date.now()}` };
    setEditingAch(newAch);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAch({ ...ach });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete achievement: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/achievements?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
        showNotification(`✓ Deleted achievement.`);
      }
    } catch (err) {
      alert('Error deleting achievement.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAch) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAch)
      });
      if (res.ok) {
        const saved = await res.json();
        setAchievements((prev) => {
          const index = prev.findIndex((a) => a.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingAch(null);
        showNotification(`✓ Saved achievement / publication!`);
      }
    } catch (err) {
      alert('Error saving achievement.');
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <Button onClick={handleOpenAdd} variant="primary" size="md">
          + Add Achievement / Publication
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Key Metric</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 700 }}>{a.title}</td>
                <td>
                  <Badge variant={a.category === 'Publication' ? 'accent' : 'default'} size="sm">
                    {a.category}
                  </Badge>
                </td>
                <td>{a.date}</td>
                <td>
                  {a.metrics ? <Badge variant="success" size="sm">{a.metrics}</Badge> : '-'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleOpenEdit(a)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-error-light)', border: '1px solid var(--color-error)', color: 'var(--color-error)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingAch && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '600px', maxWidth: '100%', maxHeight: '90vh', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-primary)', overflowY: 'auto', padding: 'var(--space-8)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              {editingAch.title ? `Edit Record` : 'Add Achievement / Paper'}
            </h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input type="text" required value={editingAch.title} onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })} className={styles.input} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select value={editingAch.category} onChange={(e) => setEditingAch({ ...editingAch, category: e.target.value as any })} className={styles.select}>
                    <option value="Publication">Publication</option>
                    <option value="Research">Research</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Honor">Honor</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date / Year</label>
                  <input type="text" value={editingAch.date} onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Key Metric / Badge (e.g. 88.02% Accuracy)</label>
                <input type="text" value={editingAch.metrics || ''} onChange={(e) => setEditingAch({ ...editingAch, metrics: e.target.value })} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Description / Citation</label>
                <textarea rows={4} value={editingAch.description} onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })} className={styles.textarea} />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>{saving ? 'Saving...' : 'Save Achievement'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

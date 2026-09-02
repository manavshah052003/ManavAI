'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Experience } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_EXP: Experience = {
  id: '',
  company: '',
  role: '',
  location: 'Ahmedabad, India',
  startDate: '',
  endDate: 'Present',
  current: false,
  description: '',
  responsibilities: ['Engineered scalable AI pipelines'],
  technologies: ['Python', 'FastAPI'],
  achievements: []
};

export function ExperienceAdminClient({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [respInput, setRespInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newExp: Experience = {
      ...EMPTY_EXP,
      id: `exp-${Date.now()}`
    };
    setEditingExp(newExp);
    setRespInput(newExp.responsibilities.join('\n'));
    setTechInput(newExp.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setRespInput(exp.responsibilities?.join('\n') || '');
    setTechInput(exp.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, role: string, company: string) => {
    if (!confirm(`Delete experience record: "${role} at ${company}"?`)) return;

    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
        showNotification(`✓ Deleted experience record for ${company}.`);
      } else {
        alert('Failed to delete experience.');
      }
    } catch (err) {
      alert('Error deleting experience.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    setSaving(true);
    const expToSave: Experience = {
      ...editingExp,
      responsibilities: respInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      technologies: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expToSave)
      });

      if (res.ok) {
        const saved = await res.json();
        setExperiences((prev) => {
          const index = prev.findIndex((e) => e.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingExp(null);
        showNotification(`✓ Successfully saved role at ${saved.company}!`);
      } else {
        alert('Failed to save experience.');
      }
    } catch (err) {
      alert('Error saving experience.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {notification && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-light)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBottom: 'var(--space-6)'
          }}
        >
          {notification}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <Button onClick={handleOpenAdd} variant="primary" size="md">
          + Add Work Experience
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Role &amp; Company</th>
              <th>Tenure</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{exp.role}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
                    {exp.company}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 'var(--text-xs)' }}>
                    {exp.startDate} &ndash; {exp.endDate}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {exp.location}
                  </div>
                </td>
                <td>
                  <Badge variant={exp.current ? 'success' : 'default'} size="sm">
                    {exp.current ? 'Current Role' : 'Completed'}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-primary)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id, exp.role, exp.company)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-error-light)',
                        border: '1px solid var(--color-error)',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
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

      {/* CREATE / EDIT EXPERIENCE MODAL */}
      {isModalOpen && editingExp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '700px',
              maxWidth: '100%',
              maxHeight: '90vh',
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-primary)',
              overflowY: 'auto',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {editingExp.role ? `Edit "${editingExp.role}"` : 'Add Work Experience'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 'var(--text-xl)', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. May 2026"
                    value={editingExp.startDate}
                    onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Present"
                    value={editingExp.endDate}
                    onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input
                    type="text"
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={editingExp.current}
                    onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                  />
                  Current Active Position
                </label>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>High-level Description</label>
                <textarea
                  rows={2}
                  value={editingExp.description}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Key Responsibilities &amp; Impact (One bullet per line)</label>
                <textarea
                  rows={5}
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  placeholder="Architected TaxProGenie...&#10;Achieved 98% extraction accuracy..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Technologies Used (Comma Separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Python, FastAPI, OpenAI API, Azure Document Intelligence"
                  className={styles.input}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Experience'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

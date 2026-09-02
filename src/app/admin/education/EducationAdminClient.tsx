'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Education } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_EDU: Education = {
  id: '',
  institution: '',
  degree: 'B.Tech',
  field: 'Computer Engineering',
  startYear: '2022',
  endYear: '2026',
  grade: 'CGPA: 9.5 / 10.0',
  location: 'Ahmedabad, India',
  description: '',
  highlights: [],
  subjects: []
};

export function EducationAdminClient({ initialEducations }: { initialEducations: Education[] }) {
  const [educations, setEducations] = useState<Education[]>(initialEducations);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState('');
  const [subjectsInput, setSubjectsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newEdu = { ...EMPTY_EDU, id: `edu-${Date.now()}` };
    setEditingEdu(newEdu);
    setHighlightsInput('');
    setSubjectsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu({ ...edu });
    setHighlightsInput(edu.highlights?.join('\n') || '');
    setSubjectsInput(edu.subjects?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, degree: string, institution: string) => {
    if (!confirm(`Delete education record: "${degree} at ${institution}"?`)) return;

    try {
      const res = await fetch(`/api/admin/education?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEducations((prev) => prev.filter((e) => e.id !== id));
        showNotification(`✓ Deleted education record.`);
      } else {
        alert('Failed to delete education.');
      }
    } catch (err) {
      alert('Error deleting education.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    setSaving(true);
    const eduToSave: Education = {
      ...editingEdu,
      highlights: highlightsInput.split('\n').map((h) => h.trim()).filter(Boolean),
      subjects: subjectsInput.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eduToSave)
      });

      if (res.ok) {
        const saved = await res.json();
        setEducations((prev) => {
          const index = prev.findIndex((e) => e.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingEdu(null);
        showNotification(`✓ Saved education record!`);
      } else {
        alert('Failed to save education.');
      }
    } catch (err) {
      alert('Error saving education.');
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
          + Add Education Record
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Degree &amp; Institution</th>
              <th>Years</th>
              <th>CGPA / Grade</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {educations.map((e) => (
              <tr key={e.id}>
                <td>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{e.degree} in {e.field}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>{e.institution}</div>
                </td>
                <td>{e.startYear} &ndash; {e.endYear}</td>
                <td>
                  <Badge variant="success" size="sm">{e.grade}</Badge>
                </td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{e.location}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleOpenEdit(e)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id, e.degree, e.institution)}
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

      {isModalOpen && editingEdu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '650px', maxWidth: '100%', maxHeight: '90vh', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-primary)', overflowY: 'auto', padding: 'var(--space-8)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              {editingEdu.degree ? `Edit Education Record` : 'Add Education Record'}
            </h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Degree</label>
                  <input type="text" required value={editingEdu.degree} onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Field of Study</label>
                  <input type="text" required value={editingEdu.field} onChange={(e) => setEditingEdu({ ...editingEdu, field: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Institution / University Name</label>
                <input type="text" required value={editingEdu.institution} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} className={styles.input} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Start Year</label>
                  <input type="text" value={editingEdu.startYear} onChange={(e) => setEditingEdu({ ...editingEdu, startYear: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Year</label>
                  <input type="text" value={editingEdu.endYear} onChange={(e) => setEditingEdu({ ...editingEdu, endYear: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CGPA / Grade</label>
                  <input type="text" value={editingEdu.grade} onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea rows={2} value={editingEdu.description} onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })} className={styles.textarea} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Highlights &amp; Honors (One per line)</label>
                <textarea rows={3} value={highlightsInput} onChange={(e) => setHighlightsInput(e.target.value)} className={styles.textarea} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Core Coursework / Subjects (Comma separated)</label>
                <input type="text" value={subjectsInput} onChange={(e) => setSubjectsInput(e.target.value)} className={styles.input} />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>{saving ? 'Saving...' : 'Save Record'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

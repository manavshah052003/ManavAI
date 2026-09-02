'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Certification } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_CERT: Certification = {
  id: '',
  name: '',
  issuer: '',
  date: '2026',
  credentialId: '',
  credentialUrl: '',
  skills: []
};

export function CertificationsAdminClient({ initialCertifications }: { initialCertifications: Certification[] }) {
  const [certs, setCerts] = useState<Certification[]>(initialCertifications);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newCert = { ...EMPTY_CERT, id: `cert-${Date.now()}` };
    setEditingCert(newCert);
    setSkillsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert({ ...cert });
    setSkillsInput(cert.skills?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certification: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCerts((prev) => prev.filter((c) => c.id !== id));
        showNotification(`✓ Deleted certification.`);
      }
    } catch (err) {
      alert('Error deleting certification.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    setSaving(true);
    const certToSave: Certification = {
      ...editingCert,
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certToSave)
      });
      if (res.ok) {
        const saved = await res.json();
        setCerts((prev) => {
          const index = prev.findIndex((c) => c.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingCert(null);
        showNotification(`✓ Saved certification!`);
      }
    } catch (err) {
      alert('Error saving certification.');
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
          + Add Certification
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Certification Name</th>
              <th>Issuer</th>
              <th>Date</th>
              <th>Credential ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.name}</td>
                <td>
                  <Badge variant="accent" size="sm">{c.issuer}</Badge>
                </td>
                <td>{c.date}</td>
                <td style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>{c.credentialId || '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
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

      {isModalOpen && editingCert && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '600px', maxWidth: '100%', maxHeight: '90vh', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-primary)', overflowY: 'auto', padding: 'var(--space-8)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              {editingCert.name ? `Edit Certification` : 'Add Certification'}
            </h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Certification Title *</label>
                <input type="text" required value={editingCert.name} onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })} className={styles.input} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Issuer (e.g. DeepLearning.AI)</label>
                  <input type="text" required value={editingCert.issuer} onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date / Year</label>
                  <input type="text" value={editingCert.date} onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Credential ID</label>
                  <input type="text" value={editingCert.credentialId || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Credential Verification URL</label>
                  <input type="url" value={editingCert.credentialUrl || ''} onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Skills / Tags (Comma separated)</label>
                <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="LLMs, RAG, PyTorch" className={styles.input} />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>{saving ? 'Saving...' : 'Save Certification'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

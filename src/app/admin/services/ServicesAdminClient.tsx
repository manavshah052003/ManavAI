'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { ServiceItem } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';

const EMPTY_SERVICE: ServiceItem = {
  id: '',
  title: '',
  tagline: '',
  description: '',
  capabilities: ['High-throughput pipelines'],
  technologies: ['Python', 'FastAPI'],
  icon: 'Brain'
};

export function ServicesAdminClient({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capsInput, setCapsInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newSrv = { ...EMPTY_SERVICE, id: `srv-${Date.now()}` };
    setEditingService(newSrv);
    setCapsInput(newSrv.capabilities.join('\n'));
    setTechInput(newSrv.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService({ ...srv });
    setCapsInput(srv.capabilities?.join('\n') || '');
    setTechInput(srv.technologies?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete service "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showNotification(`✓ Deleted service "${title}".`);
      }
    } catch (err) {
      alert('Error deleting service.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSaving(true);
    const srvToSave: ServiceItem = {
      ...editingService,
      capabilities: capsInput.split('\n').map((c) => c.trim()).filter(Boolean),
      technologies: techInput.split(',').map((t) => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(srvToSave)
      });
      if (res.ok) {
        const saved = await res.json();
        setServices((prev) => {
          const index = prev.findIndex((s) => s.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingService(null);
        showNotification(`✓ Saved service "${saved.title}"!`);
      }
    } catch (err) {
      alert('Error saving service.');
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
          + Add Service / Capability
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service Title</th>
              <th>Tagline</th>
              <th>Capabilities</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 700 }}>{s.title}</td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{s.tagline}</td>
                <td>
                  <div style={{ fontSize: 'var(--text-xs)' }}>
                    {s.capabilities.slice(0, 2).join(' • ')}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleOpenEdit(s)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.title)}
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

      {isModalOpen && editingService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '650px', maxWidth: '100%', maxHeight: '90vh', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-primary)', overflowY: 'auto', padding: 'var(--space-8)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              {editingService.title ? `Edit Service` : 'Add Service'}
            </h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Service Title *</label>
                <input type="text" required value={editingService.title} onChange={(e) => setEditingService({ ...editingService, title: e.target.value })} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tagline / Subtitle</label>
                <input type="text" required value={editingService.tagline} onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea rows={3} value={editingService.description} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className={styles.textarea} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Core Capabilities (One per line)</label>
                <textarea rows={4} value={capsInput} onChange={(e) => setCapsInput(e.target.value)} placeholder="Retrieval-Augmented Generation (RAG)&#10;LLM Evaluation" className={styles.textarea} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Technologies (Comma separated)</label>
                <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="OpenAI, LangChain, FastAPI" className={styles.input} />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

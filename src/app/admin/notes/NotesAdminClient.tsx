'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { NotePost } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_NOTE: NotePost = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '# Title\n\nWrite your technical article here...',
  date: new Date().toISOString().split('T')[0],
  readingTime: '5 min read',
  tags: ['AI Engineering'],
  published: true
};

export function NotesAdminClient({ initialNotes }: { initialNotes: NotePost[] }) {
  const [notes, setNotes] = useState<NotePost[]>(initialNotes);
  const [editingNote, setEditingNote] = useState<NotePost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newN: NotePost = { ...EMPTY_NOTE, id: `note-${Date.now()}`, slug: `article-${Date.now()}` };
    setEditingNote(newN);
    setTagsInput(newN.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n: NotePost) => {
    setEditingNote({ ...n });
    setTagsInput(n.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/notes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        showNotification(`✓ Deleted article.`);
      }
    } catch (err) {
      alert('Error deleting note.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    setSaving(true);
    const noteToSave: NotePost = {
      ...editingNote,
      slug: editingNote.slug || editingNote.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteToSave)
      });
      if (res.ok) {
        const saved = await res.json();
        setNotes((prev) => {
          const index = prev.findIndex((n) => n.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingNote(null);
        showNotification(`✓ Saved article "${saved.title}"!`);
      }
    } catch (err) {
      alert('Error saving article.');
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
          + Write New Article
        </Button>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Article Title &amp; Slug</th>
              <th>Date</th>
              <th>Reading Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((n) => (
              <tr key={n.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{n.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>/notes/{n.slug}</div>
                </td>
                <td style={{ fontSize: 'var(--text-xs)' }}>{n.date}</td>
                <td style={{ fontSize: 'var(--text-xs)' }}>{n.readingTime}</td>
                <td>
                  <Badge variant={n.published ? 'success' : 'default'} size="sm">
                    {n.published ? 'Published' : 'Draft'}
                  </Badge>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => handleOpenEdit(n)}
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                    >
                      Edit
                    </button>
                    <Link
                      href={`/notes/${n.slug}`}
                      target="_blank"
                      style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', color: 'var(--color-accent-text)', fontSize: 'var(--text-xs)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      View ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(n.id, n.title)}
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

      {isModalOpen && editingNote && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }} onClick={() => setIsModalOpen(false)}>
          <div style={{ width: '800px', maxWidth: '100%', maxHeight: '90vh', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-primary)', overflowY: 'auto', padding: 'var(--space-8)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
              {editingNote.title ? `Edit Article` : 'Write New Article'}
            </h2>
            <form onSubmit={handleSave} className={styles.formGrid}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Article Title *</label>
                  <input type="text" required value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>URL Slug *</label>
                  <input type="text" required value={editingNote.slug} onChange={(e) => setEditingNote({ ...editingNote, slug: e.target.value })} className={styles.input} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date</label>
                  <input type="text" value={editingNote.date} onChange={(e) => setEditingNote({ ...editingNote, date: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Reading Time</label>
                  <input type="text" value={editingNote.readingTime} onChange={(e) => setEditingNote({ ...editingNote, readingTime: e.target.value })} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '24px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    <input type="checkbox" checked={editingNote.published} onChange={(e) => setEditingNote({ ...editingNote, published: e.target.checked })} />
                    Published
                  </label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Excerpt Summary</label>
                <textarea rows={2} value={editingNote.excerpt} onChange={(e) => setEditingNote({ ...editingNote, excerpt: e.target.value })} className={styles.textarea} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Article Body (Markdown)</label>
                <textarea rows={10} value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} className={styles.textarea} style={{ fontFamily: 'var(--font-mono)' }} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tags (Comma separated)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="AI Engineering, LLMs, Research" className={styles.input} />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">Cancel</Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>{saving ? 'Saving...' : 'Save Article'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

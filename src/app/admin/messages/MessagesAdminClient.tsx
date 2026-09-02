'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { ContactMessage } from '@/types/portfolio';
import { Badge } from '@/components/ui/Badge';

export function MessagesAdminClient({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateStatus = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', id, status: newStatus })
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        showNotification(`✓ Message marked as ${newStatus}.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete message from "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showNotification(`✓ Deleted message.`);
      }
    } catch (err) {
      alert('Error deleting message.');
    }
  };

  return (
    <div>
      {notification && (
        <div style={{ padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', background: 'var(--color-success-light)', color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
          {notification}
        </div>
      )}

      <div className={styles.tableCard}>
        {messages.length === 0 ? (
          <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
            Inbox is clean. No inquiries received yet. Submit a message on the Contact page to test.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject &amp; Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                    <a href={`mailto:${m.email}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)' }}>
                      {m.email}
                    </a>
                    {m.company && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{m.company}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{m.subject}</div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', maxWidth: '400px' }}>
                      {m.message}
                    </p>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Badge variant={m.status === 'unread' ? 'error' : m.status === 'replied' ? 'success' : 'default'} size="sm">
                      {m.status}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {m.status === 'unread' ? (
                        <button
                          onClick={() => handleUpdateStatus(m.id, 'read')}
                          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                        >
                          Mark Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(m.id, 'replied')}
                          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-success-light)', border: '1px solid var(--color-success)', color: 'var(--color-success)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                        >
                          Replied
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
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
        )}
      </div>
    </div>
  );
}

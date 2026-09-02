import Link from 'next/link';
import styles from '../admin.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getProjects,
  getExperiences,
  getSkills,
  getMessages,
  getNotes
} from '@/lib/dataStore';

export default async function AdminDashboardPage() {
  const [projects, experiences, skills, messages, notes] = await Promise.all([
    getProjects(),
    getExperiences(),
    getSkills(),
    getMessages(),
    getNotes()
  ]);

  const unreadMessages = messages.filter((m) => m.status === 'unread').length;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>
            System telemetry, active records, and content status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button href="/admin/projects" variant="primary" size="sm">
            + Manage Projects
          </Button>
          <Button href="/admin/chatbot" variant="secondary" size="sm">
            Chatbot Console
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid--4" style={{ marginBottom: 'var(--space-8)' }}>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Total Projects
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: '2px' }}>
            {projects.filter((p) => p.featured).length} Featured
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Work Positions
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
            {experiences.length}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Analytix Solutions &amp; Internships
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Inbox Messages
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: unreadMessages > 0 ? 'var(--color-error)' : 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
            {messages.length}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: unreadMessages > 0 ? 'var(--color-error)' : 'var(--color-text-secondary)', marginTop: '2px' }}>
            {unreadMessages} Unread
          </div>
        </Card>

        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Offline AI Index
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-accent-text)', marginTop: 'var(--space-1)' }}>
            Active
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: '2px' }}>
            Zero External APIs
          </div>
        </Card>
      </div>

      {/* Recent Messages & Quick Overview */}
      <div className="grid grid--2">
        <div className={styles.tableCard}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Recent Inquiries</h3>
            <Link href="/admin/messages" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
              View All &rarr;
            </Link>
          </div>
          {messages.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No messages received yet. Submit a test message on the Contact page.
            </div>
          ) : (
            <table className={styles.table}>
              <tbody>
                {messages.slice(0, 4).map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{msg.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{msg.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{msg.subject}</div>
                    </td>
                    <td>
                      <Badge variant={msg.status === 'unread' ? 'error' : 'default'} size="sm">
                        {msg.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.tableCard}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Production AI Projects</h3>
            <Link href="/admin/projects" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
              Edit &rarr;
            </Link>
          </div>
          <table className={styles.table}>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{p.category} &bull; {p.year}</div>
                  </td>
                  <td>
                    <Badge variant={p.status === 'Production' ? 'success' : 'default'} size="sm">
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

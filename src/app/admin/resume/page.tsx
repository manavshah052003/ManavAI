import styles from '../admin.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminResumePage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Resume File Manager</h1>
          <p className={styles.pageSubtitle}>
            Active public PDF, version timestamp, and replace uploader.
          </p>
        </div>
      </div>

      <Card variant="outlined" padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Manav_Shah_Resume.pdf</span>
              <Badge variant="success" size="sm">Active in Production</Badge>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
              Path: <code>/public/resume/Manav_Shah_Resume.pdf</code> &bull; Size: ~217 KB
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button href="/resume/Manav_Shah_Resume.pdf" external variant="secondary" size="sm">
              Open File &rarr;
            </Button>
            <Button href="/resume" target="_blank" variant="primary" size="sm">
              View Public Page
            </Button>
          </div>
        </div>

        <div style={{ padding: 'var(--space-6)', border: '2px dashed var(--color-border-primary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto var(--space-2)', color: 'var(--color-text-tertiary)' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Upload New PDF Version</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Uploading automatically updates all public download links and embeds.
          </div>
        </div>
      </Card>
    </div>
  );
}

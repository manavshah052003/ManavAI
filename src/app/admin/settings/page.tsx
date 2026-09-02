import styles from '../admin.module.css';
import { getSettings } from '@/lib/dataStore';
import { SettingsAdminClient } from './SettingsAdminClient';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>System &amp; Site Settings</h1>
          <p className={styles.pageSubtitle}>
            Theme defaults, accent tokens, SEO metadata, and integration configs.
          </p>
        </div>
      </div>

      <SettingsAdminClient initialSettings={settings} />
    </div>
  );
}

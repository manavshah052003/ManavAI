import styles from '../admin.module.css';
import { getProfile } from '@/lib/dataStore';
import { ProfileAdminClient } from './ProfileAdminClient';

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Profile &amp; Hero Settings</h1>
          <p className={styles.pageSubtitle}>
            Update your public headline, biography, availability status, and contact links in real-time.
          </p>
        </div>
      </div>

      <ProfileAdminClient initialProfile={profile} />
    </div>
  );
}

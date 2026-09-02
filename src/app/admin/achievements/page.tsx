import styles from '../admin.module.css';
import { getAchievements } from '@/lib/dataStore';
import { AchievementsAdminClient } from './AchievementsAdminClient';

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Achievements &amp; Publications Management</h1>
          <p className={styles.pageSubtitle}>
            Manage IEEE research publications, metrics, citations, and honors.
          </p>
        </div>
      </div>

      <AchievementsAdminClient initialAchievements={achievements} />
    </div>
  );
}

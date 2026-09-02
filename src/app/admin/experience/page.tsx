import styles from '../admin.module.css';
import { getExperiences } from '@/lib/dataStore';
import { ExperienceAdminClient } from './ExperienceAdminClient';

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Experience Management</h1>
          <p className={styles.pageSubtitle}>
            Add, update, or remove work positions and internship records.
          </p>
        </div>
      </div>

      <ExperienceAdminClient initialExperiences={experiences} />
    </div>
  );
}

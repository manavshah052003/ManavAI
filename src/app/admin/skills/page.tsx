import styles from '../admin.module.css';
import { getSkills } from '@/lib/dataStore';
import { SkillsAdminClient } from './SkillsAdminClient';

export default async function AdminSkillsPage() {
  const categories = await getSkills();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Skills &amp; Competencies Management</h1>
          <p className={styles.pageSubtitle}>
            Add, update, or remove technical skills and proficiency tiers.
          </p>
        </div>
      </div>

      <SkillsAdminClient initialSkills={categories} />
    </div>
  );
}

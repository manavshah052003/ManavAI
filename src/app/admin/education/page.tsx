import styles from '../admin.module.css';
import { getEducations } from '@/lib/dataStore';
import { EducationAdminClient } from './EducationAdminClient';

export default async function AdminEducationPage() {
  const educations = await getEducations();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Education Records Management</h1>
          <p className={styles.pageSubtitle}>
            Add, update, or remove university degrees, grades, and academic achievements.
          </p>
        </div>
      </div>

      <EducationAdminClient initialEducations={educations} />
    </div>
  );
}

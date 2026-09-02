import styles from '../admin.module.css';
import { getCertifications } from '@/lib/dataStore';
import { CertificationsAdminClient } from './CertificationsAdminClient';

export default async function AdminCertificationsPage() {
  const certs = await getCertifications();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Certifications Management</h1>
          <p className={styles.pageSubtitle}>
            Add, update, or remove credentials and specialized certifications.
          </p>
        </div>
      </div>

      <CertificationsAdminClient initialCertifications={certs} />
    </div>
  );
}

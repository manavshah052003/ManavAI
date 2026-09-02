import styles from '../admin.module.css';
import { getServices } from '@/lib/dataStore';
import { ServicesAdminClient } from './ServicesAdminClient';

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Services &amp; Capabilities Management</h1>
          <p className={styles.pageSubtitle}>
            Define what you build for enterprise clients and engineering teams.
          </p>
        </div>
      </div>

      <ServicesAdminClient initialServices={services} />
    </div>
  );
}

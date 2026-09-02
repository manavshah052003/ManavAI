import styles from '../admin.module.css';
import { getProjects } from '@/lib/dataStore';
import { ProjectsAdminClient } from './ProjectsAdminClient';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Projects Management</h1>
          <p className={styles.pageSubtitle}>
            Add, update, or remove projects. Changes instantly reflect on the public website and portfolio assistant.
          </p>
        </div>
      </div>

      <ProjectsAdminClient initialProjects={projects} />
    </div>
  );
}

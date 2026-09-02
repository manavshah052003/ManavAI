import styles from '../admin.module.css';
import { getNotes } from '@/lib/dataStore';
import { NotesAdminClient } from './NotesAdminClient';

export default async function AdminNotesPage() {
  const notes = await getNotes();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Notes &amp; Blog CMS</h1>
          <p className={styles.pageSubtitle}>
            Publish and manage engineering articles, lessons, and case notes.
          </p>
        </div>
      </div>

      <NotesAdminClient initialNotes={notes} />
    </div>
  );
}

import styles from '../admin.module.css';
import { getMessages } from '@/lib/dataStore';
import { MessagesAdminClient } from './MessagesAdminClient';

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inbox &amp; Inquiries Management</h1>
          <p className={styles.pageSubtitle}>
            Review, mark read/replied, and manage messages submitted via the contact form.
          </p>
        </div>
      </div>

      <MessagesAdminClient initialMessages={messages} />
    </div>
  );
}

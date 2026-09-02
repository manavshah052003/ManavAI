import styles from '../admin.module.css';
import { ChatbotAdminClient } from './ChatbotAdminClient';

export default function AdminChatbotPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portfolio Assistant Knowledge &amp; Diagnostics</h1>
          <p className={styles.pageSubtitle}>
            Test search ranking, query parsing, and verify zero-hallucination grounding.
          </p>
        </div>
      </div>

      <ChatbotAdminClient />
    </div>
  );
}

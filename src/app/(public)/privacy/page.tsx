import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Manav Shah\'s portfolio website.'
};

export default function PrivacyPage() {
  return (
    <div className="container section page-enter" style={{ maxWidth: '720px' }}>
      <SectionHeader
        label="Legal"
        title="Privacy Policy"
        subtitle="Transparent data handling practices for this personal portfolio."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
        <section>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            1. Information Collection
          </h3>
          <p>
            When you submit a message via the Contact form, we collect the name, email address, company name, and message content you provide solely for direct communication purposes.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            2. Offline Portfolio Assistant
          </h3>
          <p>
            The Portfolio Assistant operates locally on-device and on our server without transmitting any queries or user data to third-party generative AI providers (such as OpenAI, Anthropic, or Google Gemini).
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            3. Cookies &amp; Storage
          </h3>
          <p>
            We use local browser storage strictly to remember your preferred color theme (Light/Dark mode). No tracking cookies are used.
          </p>
        </section>
      </div>
    </div>
  );
}

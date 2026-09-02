import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ContactFormClient } from './ContactFormClient';
import { getProfile } from '@/lib/dataStore';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Manav Shah for AI engineering roles, consultations, and collaborations.'
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      <ScrollReveal>
        <SectionHeader
          label="Direct Inquiries"
          title="Let's Build Something Exceptional"
          subtitle="Have an AI opportunity, architecture challenge, or collaboration proposal? Send a message directly below."
        />
      </ScrollReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Direct Email
          </div>
          <a
            href={`mailto:${profile.email}`}
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: 'var(--space-1)', display: 'block' }}
          >
            {profile.email}
          </a>
        </Card>

        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Professional Network
          </div>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: 'var(--space-1)', display: 'block' }}
          >
            LinkedIn Profile &rarr;
          </a>
        </Card>

        <Card variant="outlined" padding="md">
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Open Source &amp; Code
          </div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: 'var(--space-1)', display: 'block' }}
          >
            GitHub Repositories &rarr;
          </a>
        </Card>
      </div>

      <ScrollReveal>
        <ContactFormClient />
      </ScrollReveal>
    </div>
  );
}

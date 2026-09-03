import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getCertifications } from '@/lib/dataStore';

export const metadata = {
  title: 'Certifications',
  description: 'Verified professional certifications and technical specializations completed by Manav Shah.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CertificationsPage() {
  const certs = await getCertifications();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <SectionHeader
          label="Credentials"
          title="Certifications &amp; Specializations"
          subtitle="Continuous learning, professional specializations, and verified technical credentials."
        />
      </ScrollReveal>

      <div className="grid grid--3">
        {certs.map((cert, idx) => (
          <ScrollReveal key={cert.id} delay={((idx % 3) + 1) as 1 | 2 | 3}>
            <Card variant="outlined" padding="lg" hover style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-text)', textTransform: 'uppercase' }}>
                  {cert.issuer}
                </span>
                <Badge variant="default" size="sm">{cert.date}</Badge>
              </div>

              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', flex: 1 }}>
                {cert.name}
              </h3>

              {cert.credentialId && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
                  Credential ID: <code>{cert.credentialId}</code>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
                {cert.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 'var(--text-xs)',
                      padding: '2px var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {cert.credentialUrl && (
                <div style={{ marginTop: 'auto' }}>
                  <Button href={cert.credentialUrl} external variant="secondary" size="sm">
                    Verify Credential &rarr;
                  </Button>
                </div>
              )}
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

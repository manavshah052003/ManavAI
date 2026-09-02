import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getServices } from '@/lib/dataStore';

export const metadata = {
  title: 'Services & Capabilities',
  description: 'What Manav Shah builds: Production AI Systems, Enterprise Workflow Automation, and Full-Stack Engineering.'
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <SectionHeader
          label="Capabilities"
          title="What I Build"
          subtitle="Engineering resilient AI architectures, automated business pipelines, and end-to-end software solutions."
        />
      </ScrollReveal>

      <div className="grid grid--2" style={{ marginBottom: 'var(--space-16)' }}>
        {services.map((srv, idx) => (
          <ScrollReveal key={srv.id} delay={((idx % 2) + 1) as 1 | 2}>
            <Card variant="outlined" padding="lg" hover style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                {srv.title}
              </h3>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-accent-text)', marginBottom: 'var(--space-4)' }}>
                {srv.tagline}
              </div>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
                {srv.description}
              </p>

              <div style={{ marginBottom: 'var(--space-6)', flex: 1 }}>
                <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                  Core Capabilities
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {srv.capabilities.map((cap, cIdx) => (
                    <li key={cIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>&bull;</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: 'var(--space-4)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {srv.technologies.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 'var(--text-xs)',
                      padding: '2px var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border-primary)' }}>
          <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Have a project or technical challenge in mind?
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-3) 0 var(--space-6)' }}>
            Let&apos;s evaluate your requirements and architect a robust automated solution.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Discuss Your System &rarr;
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}

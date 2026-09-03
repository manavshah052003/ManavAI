import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getEducations } from '@/lib/dataStore';

export const metadata = {
  title: 'Education',
  description: 'Academic background, degrees, research specialization, and coursework of Manav Shah.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EducationPage() {
  const educations = await getEducations();

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      <ScrollReveal>
        <SectionHeader
          label="Academic Foundation"
          title="Education"
          subtitle="Rigorous engineering and research curriculum in Computer Engineering and Artificial Intelligence."
        />
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {educations.map((edu, idx) => (
          <ScrollReveal key={edu.id} delay={((idx % 2) + 1) as 1 | 2}>
            <Card variant="outlined" padding="lg" hover>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: '2px' }}>
                    {edu.institution}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant="accent" size="md">
                    {edu.startYear} &ndash; {edu.endYear}
                  </Badge>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-success)', marginTop: '4px' }}>
                    {edu.grade}
                  </div>
                </div>
              </div>

              <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
                {edu.description}
              </p>

              {edu.highlights && edu.highlights.length > 0 && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                    Key Highlights &amp; Leadership
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {edu.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>&bull;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {edu.subjects && edu.subjects.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                    Core Coursework
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {edu.subjects.map((sub) => (
                      <span
                        key={sub}
                        style={{
                          fontSize: 'var(--text-xs)',
                          padding: '2px var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-bg-tertiary)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

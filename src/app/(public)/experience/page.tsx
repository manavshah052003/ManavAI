import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getExperiences, getProjects } from '@/lib/dataStore';

export const metadata = {
  title: 'Experience',
  description: 'Professional experience, roles, responsibilities, and key impact of Manav Shah.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ExperiencePage() {
  const experiences = await getExperiences();
  const projects = await getProjects();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <SectionHeader
          label="Track Record"
          title="Work Experience"
          subtitle="Direct impact, technical ownership, and systems engineered across enterprise AI and software roles."
        />
      </ScrollReveal>

      {/* Timeline Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: 'var(--max-width-narrow)',
          margin: '0 auto',
          paddingLeft: '40px'
        }}
      >
        {/* Vertical Timeline Line */}
        <div
          style={{
            position: 'absolute',
            left: '15px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--color-accent) 0%, var(--color-border-primary) 30%, var(--color-border-primary) 100%)',
            borderRadius: '2px'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {experiences.map((exp, idx) => (
            <ScrollReveal key={exp.id} delay={((idx % 3) + 1) as 1 | 2 | 3}>
              <div style={{ position: 'relative' }}>
                {/* Timeline Dot Node */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-33px',
                    top: '24px',
                    width: exp.current ? '14px' : '12px',
                    height: exp.current ? '14px' : '12px',
                    borderRadius: '50%',
                    background: exp.current
                      ? '#22C55E'
                      : 'var(--color-bg-card)',
                    border: exp.current
                      ? '3px solid rgba(34, 197, 94, 0.3)'
                      : '2px solid var(--color-border-primary)',
                    boxShadow: exp.current
                      ? '0 0 0 4px rgba(34, 197, 94, 0.15), 0 0 12px rgba(34, 197, 94, 0.3)'
                      : '0 0 0 3px var(--color-bg-primary)',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Horizontal connector from dot to card */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-19px',
                    top: '29px',
                    width: '19px',
                    height: '2px',
                    background: exp.current ? 'rgba(34, 197, 94, 0.4)' : 'var(--color-border-primary)',
                    zIndex: 1
                  }}
                />

                <Card variant="outlined" padding="lg" hover>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {exp.role}
                      </h3>
                      <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: '2px' }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant={exp.current ? 'success' : 'default'} size="md">
                        {exp.startDate} &ndash; {exp.endDate}
                      </Badge>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                        {exp.location}
                      </div>
                    </div>
                  </div>

                  <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-4) 0', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
                    {exp.description}
                  </p>

                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                      Key Responsibilities &amp; Systems
                    </h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                          <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>&bull;</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>
                        Key Milestone / Achievement
                      </h4>
                      {exp.achievements.map((ach, aIdx) => (
                        <div key={aIdx} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                          {ach}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                      Technologies &amp; Tools Used
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: 'var(--text-xs)',
                            padding: '2px var(--space-2)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-bg-tertiary)',
                            color: 'var(--color-text-secondary)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {exp.associatedProjects && exp.associatedProjects.length > 0 && (
                    <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-primary)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Associated Projects:</span>
                      {exp.associatedProjects.map((pSlug) => {
                        const proj = projects.find((p) => p.slug === pSlug);
                        if (!proj) return null;
                        return (
                          <Link
                            key={pSlug}
                            href={`/projects/${pSlug}`}
                            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 500 }}
                          >
                            {proj.title} &rarr;
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}

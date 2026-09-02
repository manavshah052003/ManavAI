import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SkillIcon } from '@/components/ui/SkillIcon';
import { getSkills } from '@/lib/dataStore';

export const metadata = {
  title: 'Skills & Competencies',
  description: 'Technical competencies, proficiency tiers, frameworks, and engineering tools used by Manav Shah.'
};

export const revalidate = 0; // Live data updates from Admin CRUD

export default async function SkillsPage() {
  const categories = await getSkills();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <SectionHeader
          label="Technical Stack"
          title="Skills &amp; Engineering Competencies"
          subtitle="Honest, production-tested proficiency tiers across AI engineering, LLM systems, deep learning, backend architecture, and cloud infrastructure."
        />
      </ScrollReveal>

      {/* Proficiency Legend Bar */}
      <ScrollReveal>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            padding: 'var(--space-4) var(--space-6)',
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-primary)',
            marginBottom: 'var(--space-12)',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              Proficiency Levels:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="accent" size="sm">Primary</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Daily production architecture</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="success" size="sm">Advanced</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Deep implementation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Badge variant="default" size="sm">Working Knowledge</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Competent &amp; applied</span>
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
            {categories.reduce((acc, c) => acc + c.skills.length, 0)} Total Technologies
          </div>
        </div>
      </ScrollReveal>

      {/* Categories & Skills Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
        {categories.map((cat, idx) => (
          <ScrollReveal key={cat.category} delay={((idx % 3) + 1) as 1 | 2 | 3}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                  {cat.category}
                </h2>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                  ({cat.skills.length})
                </span>
              </div>

              {cat.description && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '800px' }}>
                  {cat.description}
                </p>
              )}

              <div className="grid grid--3">
                {cat.skills.map((skill) => (
                  <Card key={skill.name} variant="outlined" padding="md" hover>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <SkillIcon name={skill.name} />
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
                            {skill.name}
                          </div>
                          {skill.years && (
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                              {skill.years} Experience
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant={
                          skill.level === 'Primary'
                            ? 'accent'
                            : skill.level === 'Advanced'
                            ? 'success'
                            : 'default'
                        }
                        size="sm"
                      >
                        {skill.level}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

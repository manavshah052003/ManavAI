import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getAchievements } from '@/lib/dataStore';

export const metadata = {
  title: 'Achievements & Publications',
  description: 'IEEE research publications, academic milestones, and leadership honors by Manav Shah.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      <ScrollReveal>
        <SectionHeader
          label="Honors &amp; Papers"
          title="Achievements &amp; Publications"
          subtitle="Peer-reviewed IEEE research contributions, biomedical deep learning models, and academic leadership."
        />
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {achievements.map((ach, idx) => (
          <ScrollReveal key={ach.id} delay={((idx % 3) + 1) as 1 | 2 | 3}>
            <Card variant="outlined" padding="lg" hover>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <Badge variant={ach.category === 'Publication' ? 'accent' : 'default'} size="sm">
                      {ach.category}
                    </Badge>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      {ach.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {ach.title}
                  </h3>
                </div>

                {ach.metrics && (
                  <div style={{ padding: 'var(--space-1) var(--space-3)', background: 'var(--color-success-light)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-full)', color: 'var(--color-success)', fontWeight: 700, fontSize: 'var(--text-xs)' }}>
                    {ach.metrics}
                  </div>
                )}
              </div>

              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                {ach.description}
              </p>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

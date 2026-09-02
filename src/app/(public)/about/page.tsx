import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getProfile } from '@/lib/dataStore';

export const metadata = {
  title: 'About',
  description: 'Learn about Manav Shah — AI Engineer, background, philosophy, metrics, and technical journey.'
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
          <div>
            <SectionHeader
              label="About Manav"
              title="Engineer. Builder. Problem Solver."
              subtitle={profile.shortBio}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                position: 'relative',
                maxWidth: '420px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Soft ambient halo behind head */}
              <div
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '280px',
                  height: '280px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none'
                }}
              />
              <Image
                src="/images/manav-cutout.png"
                alt="Manav Shah — AI Engineer"
                width={420}
                height={500}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.25))'
                }}
              />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Metrics Grid */}
      <div className="grid grid--4" style={{ marginBottom: 'var(--space-16)' }}>
        {profile.metrics.map((metric, idx) => (
          <ScrollReveal key={metric.label} delay={((idx % 4) + 1) as 1 | 2 | 3 | 4}>
            <Card variant="outlined" padding="md" hover>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, color: 'var(--color-accent-text)' }}>
                {metric.value}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 'var(--space-1)', color: 'var(--color-text-primary)' }}>
                {metric.label}
              </div>
              {metric.helper && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-1)' }}>
                  {metric.helper}
                </div>
              )}
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* Narrative Story */}
      <ScrollReveal>
        <div style={{ maxWidth: 'var(--max-width-narrow)', margin: '0 auto var(--space-20)' }}>
          <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
            My Engineering Journey
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-text-secondary)' }}>
            {profile.aboutStory.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Engineering Philosophy */}
      <ScrollReveal>
        <SectionHeader
          label="Core Principles"
          title="What I Believe About Software & AI"
          subtitle="Guiding heuristics developed through academic research and high-stakes production deployments."
        />
      </ScrollReveal>

      <div className="grid grid--2" style={{ marginBottom: 'var(--space-16)' }}>
        {profile.philosophies.map((phil, idx) => (
          <ScrollReveal key={phil.title} delay={((idx % 2) + 1) as 1 | 2}>
            <Card variant="outlined" padding="lg" hover>
              <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                {phil.title}
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                {phil.description}
              </p>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* CTA Box */}
      <ScrollReveal>
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border-primary)' }}>
          <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Interested in working together?
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-3) 0 var(--space-6)' }}>
            I am always eager to discuss challenging engineering problems and AI architecture.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Button href="/contact" variant="primary" size="lg">
              Contact Me
            </Button>
            <Button href="/projects" variant="secondary" size="lg">
              Explore Projects
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

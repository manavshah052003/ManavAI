import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getProjects } from '@/lib/dataStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Case Study`,
    description: project.shortDescription
  };
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getProjects();
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      {/* Back Link */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link
          href="/projects"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)'
          }}
        >
          &larr; Back to all projects
        </Link>
      </div>

      {/* Case Study Hero */}
      <ScrollReveal>
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <Badge variant="accent" size="md">{project.category}</Badge>
            <Badge variant="default" size="md">{project.year}</Badge>
            <Badge variant="success" size="md">{project.status}</Badge>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, var(--text-6xl))', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tighter)', lineHeight: 'var(--leading-tight)' }}>
            {project.title}
          </h1>

          <p style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
            {project.shortDescription}
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', flexWrap: 'wrap' }}>
            {project.githubUrl && (
              <Button href={project.githubUrl} external variant="secondary" size="md">
                View on GitHub
              </Button>
            )}
            {project.demoUrl && (
              <Button href={project.demoUrl} external variant="primary" size="md">
                Live Demo
              </Button>
            )}
            <Button href="/contact" variant="ghost" size="md">
              Inquire about this architecture &rarr;
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Overview & Problem */}
      <ScrollReveal>
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            The Problem
          </h2>
          <Card variant="outlined" padding="lg" style={{ background: 'var(--color-bg-secondary)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-relaxed)' }}>
              {project.problem}
            </p>
          </Card>
        </div>
      </ScrollReveal>

      {/* Solution */}
      <ScrollReveal>
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            The Solution
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
            {project.solution}
          </p>
        </div>
      </ScrollReveal>

      {/* System Architecture Diagram */}
      {project.architectureSteps && project.architectureSteps.length > 0 && (
        <ScrollReveal>
          <div style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              System Architecture &amp; Dataflow
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
              Multi-stage pipeline designed for low latency, fault tolerance, and deterministic outputs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {project.architectureSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 'var(--space-4)',
                      background: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border-primary)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <ScrollReveal>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>
              Key Features
            </h2>
            <div className="grid grid--2">
              {project.features.map((feat, idx) => (
                <Card key={idx} variant="outlined" padding="md" hover>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>&bull;</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', lineHeight: 'var(--leading-normal)' }}>
                      {feat}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Engineering Decisions */}
      {project.engineeringDecisions && project.engineeringDecisions.length > 0 && (
        <ScrollReveal>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              Engineering Decisions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {project.engineeringDecisions.map((dec, idx) => (
                <Card key={idx} variant="outlined" padding="md">
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-accent-text)', marginBottom: 'var(--space-1)' }}>
                    {dec.decision}
                  </h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {dec.rationale}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Results & Measurable Impact */}
      {project.results && project.results.length > 0 && (
        <ScrollReveal>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
              Measurable Results &amp; Impact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {project.results.map((res, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-success-light)',
                    border: '1px solid var(--color-success)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500
                  }}
                >
                  ✓ {res}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Technologies Grid */}
      <ScrollReveal>
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            Technologies &amp; Libraries
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {project.technologies.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 'var(--text-sm)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Related Projects */}
      <ScrollReveal>
        <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: 'var(--space-12)' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
            Explore Related Projects
          </h3>
          <div className="grid grid--3">
            {relatedProjects.map((rel) => (
              <Link key={rel.id} href={`/projects/${rel.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" padding="md" hover style={{ height: '100%' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {rel.category}
                  </div>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-1) 0 var(--space-2)' }}>
                    {rel.title}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                    {rel.shortDescription}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

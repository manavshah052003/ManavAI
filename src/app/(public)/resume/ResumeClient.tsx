'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Profile, Experience, Project, Education, Achievement, SkillCategory, Certification } from '@/types/portfolio';

interface ResumeClientProps {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  educations: Education[];
  achievements: Achievement[];
  skills: SkillCategory[];
  certifications: Certification[];
}

export function ResumeClient({
  profile,
  experiences,
  projects,
  educations,
  achievements,
  skills,
  certifications
}: ResumeClientProps) {
  const [viewMode, setViewMode] = useState<'interactive' | 'pdf'>('interactive');
  const resumeUrl = '/resume/Manav_Shah_Resume.pdf';

  return (
    <div>
      {/* Header & View Switcher */}
      <ScrollReveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <Badge variant="success" size="sm">Active Resume</Badge>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Updated 2026</span>
            </div>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)' }}>
              {profile.name} &mdash; Curriculum Vitae
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', marginTop: 'var(--space-1)' }}>
              {profile.role} &bull; {profile.location}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '3px',
                border: '1px solid var(--color-border-primary)'
              }}
            >
              <button
                onClick={() => setViewMode('interactive')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: viewMode === 'interactive' ? 'var(--color-bg-card)' : 'none',
                  color: viewMode === 'interactive' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: viewMode === 'interactive' ? 700 : 500,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'interactive' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all var(--duration-fast)'
                }}
              >
                📄 Interactive Web CV
              </button>
              <button
                onClick={() => setViewMode('pdf')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: viewMode === 'pdf' ? 'var(--color-bg-card)' : 'none',
                  color: viewMode === 'pdf' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontWeight: viewMode === 'pdf' ? 700 : 500,
                  fontSize: 'var(--text-xs)',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'pdf' ? 'var(--shadow-xs)' : 'none',
                  transition: 'all var(--duration-fast)'
                }}
              >
                📑 PDF Document Viewer
              </button>
            </div>

            <Button href={resumeUrl} external variant="primary" size="md">
              Download PDF ⬇
            </Button>
            <Button href={resumeUrl} external variant="secondary" size="md">
              Open Fullscreen ↗
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* VIEW MODE 1: INTERACTIVE WEB CV */}
      {viewMode === 'interactive' && (
        <ScrollReveal>
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-10)',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: 'var(--space-10)',
              maxWidth: '900px',
              margin: '0 auto var(--space-10)'
            }}
          >
            {/* Header / Contact Banner */}
            <div style={{ borderBottom: '2px solid var(--color-border-primary)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
                    {profile.name}
                  </h2>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-accent-text)', marginTop: '2px' }}>
                    {profile.role}
                  </div>
                </div>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                  <div>📍 {profile.location}</div>
                  <div>✉️ <a href={`mailto:${profile.email}`} style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{profile.email}</a></div>
                  <div>🐙 <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)' }}>GitHub Profile</a> &bull; 💼 <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-text)' }}>LinkedIn</a></div>
                </div>
              </div>

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', lineHeight: 1.6 }}>
                {profile.shortBio}
              </p>
            </div>

            {/* SECTION 1: WORK EXPERIENCE */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent-text)', marginBottom: 'var(--space-4)' }}>
                Work Experience
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {experiences.map((exp) => (
                  <div key={exp.id} style={{ borderLeft: '2px solid var(--color-border-primary)', paddingLeft: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                        {exp.role} <span style={{ color: 'var(--color-accent-text)' }}>@ {exp.company}</span>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                        {exp.startDate} &ndash; {exp.endDate} | {exp.location}
                      </div>
                    </div>

                    {exp.description && (
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        {exp.description}
                      </p>
                    )}

                    <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{r}</li>
                      ))}
                    </ul>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                        {exp.technologies.map((t) => (
                          <Badge key={t} variant="default" size="sm">{t}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: KEY AI & ENGINEERING PROJECTS */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent-text)', margin: 0 }}>
                  Featured AI &amp; Engineering Projects
                </h3>
                <Link href="/projects" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
                  View All Projects &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {projects.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'var(--color-bg-secondary)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-primary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                        <Link href={`/projects/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {p.title}
                        </Link>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontWeight: 500, marginLeft: '6px' }}>
                          ({p.year})
                        </span>
                      </div>
                      <Badge variant="accent" size="sm">{p.category}</Badge>
                    </div>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {p.shortDescription}
                    </p>

                    {p.results && p.results.length > 0 && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>
                        ★ {p.results[0]}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                      {p.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border-primary)',
                            color: 'var(--color-text-secondary)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: RESEARCH & PUBLICATIONS */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent-text)', marginBottom: 'var(--space-4)' }}>
                Research &amp; IEEE Publications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {achievements.map((ach) => (
                  <div key={ach.id} style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                        {ach.title}
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        {ach.metrics && <Badge variant="success" size="sm">{ach.metrics}</Badge>}
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{ach.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {ach.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: EDUCATION */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent-text)', marginBottom: 'var(--space-4)' }}>
                Education
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {educations.map((edu) => (
                  <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                        {edu.degree} in {edu.field}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        {edu.institution} &bull; {edu.location}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge variant="accent" size="sm">{edu.grade}</Badge>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                        {edu.startYear} &ndash; {edu.endYear}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5: SKILLS SUMMARY */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent-text)', marginBottom: 'var(--space-4)' }}>
                Core Technical Skills
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {skills.map((cat) => (
                  <div key={cat.category} style={{ fontSize: 'var(--text-xs)' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{cat.category}: </strong>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {cat.skills.map((s) => s.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* VIEW MODE 2: CLEAN FULL-WIDTH PDF VIEWER */}
      {viewMode === 'pdf' && (
        <ScrollReveal>
          <Card
            variant="outlined"
            padding="none"
            style={{
              overflow: 'hidden',
              height: '920px',
              marginBottom: 'var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              background: '#525659'
            }}
          >
            <iframe
              src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH`}
              title="Manav Shah Official Resume"
              width="100%"
              height="100%"
              style={{ border: 'none', display: 'block' }}
            />
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
}

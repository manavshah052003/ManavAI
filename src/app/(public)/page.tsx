import Link from 'next/link';
import styles from './home.module.css';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { HeroSection } from './HeroSection';
import {
  getProfile,
  getProjects,
  getExperiences,
  getSkills
} from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const profile = await getProfile();
  const allProjects = await getProjects();
  const featuredProjects = allProjects.filter((p) => p.featured);
  const experiences = await getExperiences();
  const skills = await getSkills();

  return (
    <div className="page-enter">
      {/* 1. HERO SECTION */}
      <HeroSection profile={profile} />

      {/* 2. INTRODUCTION STATEMENT */}
      <ScrollReveal>
        <section className={styles.intro} aria-label="Philosophy Statement">
          <div className={styles.intro__inner}>
            <h2 className={styles.intro__statement}>{profile.heroHeadline}</h2>
            <p className={styles.intro__text}>{profile.heroSubheadline}</p>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. FEATURED PROJECTS */}
      <section className={styles['projects-section']} aria-label="Featured Projects">
        <div className={styles['projects-section__inner']}>
          <ScrollReveal>
            <SectionHeader
              label="Selected Work"
              title="Featured Engineering Projects"
              subtitle="Production-grade AI systems, LLM evaluation pipelines, and high-throughput automation platforms."
            />
          </ScrollReveal>

          <div className={styles.projects__grid}>
            {featuredProjects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={((idx % 2) + 1) as 1 | 2}>
                <Link href={`/projects/${project.slug}`} className={styles['project-card']}>
                  <div className={styles['project-card__image']}>
                    <div className={styles['project-card__image-placeholder']}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                      <span>{project.category} Architecture</span>
                    </div>
                  </div>

                  <div className={styles['project-card__body']}>
                    <div className={styles['project-card__meta']}>
                      <span className={styles['project-card__category']}>{project.category}</span>
                      <span>&bull;</span>
                      <span className={styles['project-card__year']}>{project.year}</span>
                      <span>&bull;</span>
                      <Badge variant="accent" size="sm">{project.status}</Badge>
                    </div>

                    <h3 className={styles['project-card__title']}>{project.title}</h3>
                    <p className={styles['project-card__description']}>{project.shortDescription}</p>

                    <div className={styles['project-card__techs']}>
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className={styles['project-card__tech']}>{tech}</span>
                      ))}
                    </div>

                    <div className={styles['project-card__cta']}>
                      <span>View Engineering Case Study</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <Button href="/projects" variant="secondary" size="lg">
              Explore All Projects &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE PREVIEW */}
      <section className={styles['experience-section']} aria-label="Experience Preview">
        <div className={styles['experience-section__inner']}>
          <ScrollReveal>
            <SectionHeader
              label="Track Record"
              title="Work Experience"
              subtitle="Building enterprise AI pipelines, LLM fine-tuning, and production automation systems."
            />
          </ScrollReveal>

          <div className={styles.experience__timeline}>
            {experiences.map((exp, idx) => (
              <ScrollReveal key={exp.id} delay={((idx % 3) + 1) as 1 | 2 | 3}>
                <div className={styles['experience-item']}>
                  <div className={styles['experience-item__indicator']}>
                    <div className={styles['experience-item__dot']} />
                    <div className={styles['experience-item__line']} />
                  </div>
                  <div className={styles['experience-item__content']}>
                    <h3 className={styles['experience-item__company']}>{exp.company}</h3>
                    <p className={styles['experience-item__role']}>{exp.role}</p>
                    <span className={styles['experience-item__duration']}>
                      {exp.startDate} &ndash; {exp.endDate} &bull; {exp.location}
                    </span>
                    <p className={styles['experience-item__description']}>{exp.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Button href="/experience" variant="secondary" size="md">
              View Detailed Experience &amp; Responsibilities &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 5. SKILLS PREVIEW */}
      <section className={styles['skills-section']} aria-label="Skills Preview">
        <div className={styles['skills-section__inner']}>
          <ScrollReveal>
            <SectionHeader
              label="Core Competencies"
              title="Technical Stack &amp; Skills"
              subtitle="Specialized in applied generative AI, deep learning architectures, and scalable full-stack engineering."
            />
          </ScrollReveal>

          <div className={styles.skills__grid}>
            {skills.slice(0, 3).map((cat, idx) => (
              <ScrollReveal key={cat.category} delay={((idx % 3) + 1) as 1 | 2 | 3}>
                <div className={styles['skill-category']}>
                  <h3 className={styles['skill-category__title']}>{cat.category}</h3>
                  <div className={styles['skill-category__items']}>
                    {cat.skills.map((s) => (
                      <span key={s.name} className={styles['skill-category__item']}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Button href="/skills" variant="secondary" size="md">
              View Full Skill Directory &amp; Proficiency Levels &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 6. PORTFOLIO ASSISTANT CTA */}
      <ScrollReveal>
        <section className={styles['assistant-section']} aria-label="Assistant Inquiry">
          <div className={styles['assistant-section__inner']}>
            <h2 className={styles.assistant__heading}>Have a question about my work?</h2>
            <p className={styles.assistant__text}>
              Ask my offline portfolio assistant &mdash; powered strictly by local portfolio data and zero external APIs.
            </p>
            <Button href="/ask" variant="primary" size="lg">
              Ask Manav&apos;s Assistant
            </Button>

            <div className={styles.assistant__suggestions}>
              <Link href="/ask?q=What+AI+projects+has+Manav+built%3F" className={styles.assistant__suggestion}>
                &ldquo;What AI projects has Manav built?&rdquo;
              </Link>
              <Link href="/ask?q=Tell+me+about+TaxProGenie" className={styles.assistant__suggestion}>
                &ldquo;Tell me about TaxProGenie&rdquo;
              </Link>
              <Link href="/ask?q=What+is+Manav%27s+current+role%3F" className={styles.assistant__suggestion}>
                &ldquo;What is Manav&apos;s current role?&rdquo;
              </Link>
              <Link href="/ask?q=What+research+papers+has+he+published%3F" className={styles.assistant__suggestion}>
                &ldquo;What research papers has he published?&rdquo;
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. CONTACT CTA */}
      <ScrollReveal>
        <section className={styles['contact-section']} aria-label="Contact Section">
          <div className={styles['contact-section__inner']}>
            <h2 className={styles.contact__heading}>Let&apos;s build something exceptional.</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
              Open for AI engineering roles, high-impact consulting, and technical collaborations.
            </p>
            <div className={styles.contact__buttons}>
              <Button href="/contact" variant="primary" size="lg">
                Get in Touch
              </Button>
              <Button href="/resume" variant="secondary" size="lg">
                View Resume
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

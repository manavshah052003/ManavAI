import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  getProjects,
  getExperiences,
  getSkills,
  getEducations,
  getAchievements,
  getNotes
} from '@/lib/dataStore';
import { SearchClient } from './SearchClient';

export const metadata = {
  title: 'Search',
  description: 'Search across all projects, experience, skills, and notes in Manav Shah\'s portfolio.'
};

export default async function SearchPage() {
  const [projects, experiences, skills, education, achievements, notes] =
    await Promise.all([
      getProjects(),
      getExperiences(),
      getSkills(),
      getEducations(),
      getAchievements(),
      getNotes()
    ]);

  const allDocs = [
    ...projects.map((p) => ({
      title: p.title,
      category: 'Project',
      snippet: p.shortDescription,
      url: `/projects/${p.slug}`,
      tags: p.technologies
    })),
    ...experiences.map((e) => ({
      title: `${e.role} — ${e.company}`,
      category: 'Experience',
      snippet: `${e.description} (${e.startDate} – ${e.endDate})`,
      url: '/experience',
      tags: e.technologies
    })),
    ...skills.flatMap((c) =>
      c.skills.map((s) => ({
        title: s.name,
        category: `Skill (${c.category})`,
        snippet: `Proficiency: ${s.level} | Category: ${c.category}`,
        url: '/skills'
      }))
    ),
    ...education.map((ed) => ({
      title: `${ed.degree} in ${ed.field} — ${ed.institution}`,
      category: 'Education',
      snippet: `${ed.grade} (${ed.startYear}–${ed.endYear})`,
      url: '/education'
    })),
    ...achievements.map((a) => ({
      title: a.title,
      category: a.category,
      snippet: a.description,
      url: '/achievements'
    })),
    ...notes.map((n) => ({
      title: n.title,
      category: 'Notes / Blog',
      snippet: n.excerpt,
      url: `/notes/${n.slug}`,
      tags: n.tags
    }))
  ];

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      <ScrollReveal>
        <SectionHeader
          label="Search Index"
          title="Global Search"
          subtitle="Explore all verified records across projects, technical skills, career timeline, and research."
        />
      </ScrollReveal>

      <SearchClient docs={allDocs} />
    </div>
  );
}

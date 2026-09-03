import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getProjects } from '@/lib/dataStore';
import { ProjectsClient } from './ProjectsClient';

export const metadata = {
  title: 'Projects',
  description: 'Selected engineering projects, AI pipelines, LLM architectures, and experiments built by Manav Shah.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container section page-enter">
      <ScrollReveal>
        <SectionHeader
          label="Portfolio"
          title="Things I've Built"
          subtitle="Selected AI engineering projects, enterprise automation pipelines, and research implementations."
        />
      </ScrollReveal>

      <ProjectsClient projects={projects} />
    </div>
  );
}

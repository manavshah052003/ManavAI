import { ResumeClient } from './ResumeClient';
import {
  getProfile,
  getExperiences,
  getProjects,
  getEducations,
  getAchievements,
  getSkills,
  getCertifications
} from '@/lib/dataStore';

export const metadata = {
  title: 'Resume & Curriculum Vitae | Manav Shah',
  description: 'View and download the verified curriculum vitae of Manav Shah — AI Engineer with experience at Analytix Solutions & Schbang.'
};

export const revalidate = 0; // Always serve updated resume data

export default async function ResumePage() {
  const [profile, experiences, projects, educations, achievements, skills, certifications] = await Promise.all([
    getProfile(),
    getExperiences(),
    getProjects(),
    getEducations(),
    getAchievements(),
    getSkills(),
    getCertifications()
  ]);

  return (
    <div className="container section page-enter">
      <ResumeClient
        profile={profile}
        experiences={experiences}
        projects={projects}
        educations={educations}
        achievements={achievements}
        skills={skills}
        certifications={certifications}
      />
    </div>
  );
}

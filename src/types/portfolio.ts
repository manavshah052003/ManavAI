export interface Profile {
  name: string;
  role: string;
  tagline: string;
  shortBio: string;
  aboutStory: string[];
  location: string;
  email: string;
  phone?: string;
  github: string;
  linkedin: string;
  status: string;
  heroHeadline: string;
  heroSubheadline: string;
  philosophies: { title: string; description: string }[];
  metrics: { label: string; value: string; helper?: string }[];
  avatarUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'AI' | 'Machine Learning' | 'Automation' | 'Web' | 'SaaS' | 'Backend' | 'Experiments';
  featured: boolean;
  status: 'Completed' | 'In Progress' | 'Production';
  year: string;
  technologies: string[];
  problem: string;
  solution: string;
  architectureSteps: string[];
  features: string[];
  challenges: string[];
  engineeringDecisions: { decision: string; rationale: string }[];
  results: string[];
  lessonsLearned: string[];
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  gallery?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  associatedProjects?: string[];
}

export interface SkillItem {
  name: string;
  level: 'Primary' | 'Advanced' | 'Working Knowledge' | 'Learning';
  years?: string;
  icon?: string;
  projects?: string[];
}

export interface SkillCategory {
  category: string;
  description?: string;
  skills: SkillItem[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
  location: string;
  description: string;
  subjects?: string[];
  projects?: string[];
  highlights?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  category: 'Research' | 'Hackathon' | 'Leadership' | 'Publication' | 'Honor';
  description: string;
  metrics?: string;
  url?: string;
  badge?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: string[];
  technologies: string[];
  icon: string;
}

export interface NotePost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  tags: string[];
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
}

export interface SiteSettings {
  siteTitle: string;
  defaultTheme: 'dark' | 'light' | 'system';
  accentColorLight: string;
  accentColorDark: string;
  assistantWelcome: string;
  metaDescription: string;
  footerText: string;
  googleAnalyticsId: string;
  resumeUrl: string;
}

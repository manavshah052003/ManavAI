import fs from 'fs';
import path from 'path';
import {
  Profile,
  Project,
  Experience,
  SkillCategory,
  Education,
  Certification,
  Achievement,
  ServiceItem,
  NotePost,
  ContactMessage,
  SiteSettings
} from '@/types/portfolio';
import {
  initialProfile,
  initialProjects,
  initialExperience,
  initialSkills,
  initialEducation,
  initialCertifications,
  initialAchievements,
  initialServices,
  initialNotes
} from '@/data/portfolioData';

export interface PortfolioStore {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  skills: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  services: ServiceItem[];
  notes: NotePost[];
  messages: ContactMessage[];
  settings: SiteSettings;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

// Global in-memory cache for serverless environments (e.g. Vercel)
let memoryStore: PortfolioStore | null = null;

export function getInitialStore(): PortfolioStore {
  return {
    profile: initialProfile,
    projects: initialProjects,
    experience: initialExperience,
    skills: initialSkills,
    education: initialEducation,
    certifications: initialCertifications,
    achievements: initialAchievements,
    services: initialServices,
    notes: initialNotes,
    messages: [],
    settings: {
      siteTitle: 'Manav Shah — AI Engineer & Software Builder',
      defaultTheme: 'light',
      accentColorLight: '#4F46E5',
      accentColorDark: '#818CF8',
      assistantWelcome: 'Hello! I am Manav\'s local portfolio assistant. Ask me anything about his production AI projects, work at Analytix Solutions, research publications, or education.',
      metaDescription: 'Portfolio of Manav Shah – AI Engineer building intelligent production systems.',
      footerText: '© 2026 Manav Shah. Engineered with precision.',
      googleAnalyticsId: '',
      resumeUrl: '/resume/Manav_Shah_Resume.pdf'
    }
  };
}

// Ensure db.json exists and ALWAYS read fresh data from disk when available
export function getStore(): PortfolioStore {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      memoryStore = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('Could not read db.json file from disk:', error);
  }

  if (memoryStore) {
    return memoryStore;
  }

  const initialStore = getInitialStore();
  memoryStore = initialStore;

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialStore, null, 2), 'utf-8');
  } catch (err) {
    // Read-only filesystem on serverless hosting (Vercel) — memoryStore handles state seamlessly
    console.warn('Filesystem is read-only (standard in Vercel serverless functions). Using in-memory store.');
  }

  return initialStore;
}

export function saveStore(store: PortfolioStore): void {
  memoryStore = store;
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist store to disk (expected on read-only serverless runtimes). Memory store updated.');
  }
}

// -------------------------------------------------------------
// PROFILE CRUD
// -------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  return getStore().profile;
}

export async function updateProfile(data: Partial<Profile>): Promise<Profile> {
  const store = getStore();
  store.profile = { ...store.profile, ...data };
  saveStore(store);
  return store.profile;
}

// -------------------------------------------------------------
// PROJECTS CRUD
// -------------------------------------------------------------
export async function getProjects(): Promise<Project[]> {
  return getStore().projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return getStore().projects.find((p) => p.slug === slug);
}

export async function saveProject(project: Project): Promise<Project> {
  const store = getStore();
  const index = store.projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    store.projects[index] = project;
  } else {
    store.projects.push(project);
  }
  saveStore(store);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const store = getStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// EXPERIENCE CRUD
// -------------------------------------------------------------
export async function getExperiences(): Promise<Experience[]> {
  return getStore().experience;
}

export async function saveExperience(exp: Experience): Promise<Experience> {
  const store = getStore();
  const index = store.experience.findIndex((e) => e.id === exp.id);
  if (index >= 0) {
    store.experience[index] = exp;
  } else {
    store.experience.push(exp);
  }
  saveStore(store);
  return exp;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const store = getStore();
  store.experience = store.experience.filter((e) => e.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// SKILLS CRUD
// -------------------------------------------------------------
export async function getSkills(): Promise<SkillCategory[]> {
  return getStore().skills;
}

export async function saveSkills(skills: SkillCategory[]): Promise<SkillCategory[]> {
  const store = getStore();
  store.skills = skills;
  saveStore(store);
  return store.skills;
}

// -------------------------------------------------------------
// EDUCATION CRUD
// -------------------------------------------------------------
export async function getEducations(): Promise<Education[]> {
  return getStore().education;
}

export async function saveEducation(edu: Education): Promise<Education> {
  const store = getStore();
  const index = store.education.findIndex((e) => e.id === edu.id);
  if (index >= 0) {
    store.education[index] = edu;
  } else {
    store.education.push(edu);
  }
  saveStore(store);
  return edu;
}

export async function deleteEducation(id: string): Promise<boolean> {
  const store = getStore();
  store.education = store.education.filter((e) => e.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// CERTIFICATIONS CRUD
// -------------------------------------------------------------
export async function getCertifications(): Promise<Certification[]> {
  return getStore().certifications;
}

export async function saveCertification(cert: Certification): Promise<Certification> {
  const store = getStore();
  const index = store.certifications.findIndex((c) => c.id === cert.id);
  if (index >= 0) {
    store.certifications[index] = cert;
  } else {
    store.certifications.push(cert);
  }
  saveStore(store);
  return cert;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const store = getStore();
  store.certifications = store.certifications.filter((c) => c.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// ACHIEVEMENTS CRUD
// -------------------------------------------------------------
export async function getAchievements(): Promise<Achievement[]> {
  return getStore().achievements;
}

export async function saveAchievement(ach: Achievement): Promise<Achievement> {
  const store = getStore();
  const index = store.achievements.findIndex((a) => a.id === ach.id);
  if (index >= 0) {
    store.achievements[index] = ach;
  } else {
    store.achievements.push(ach);
  }
  saveStore(store);
  return ach;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const store = getStore();
  store.achievements = store.achievements.filter((a) => a.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// SERVICES CRUD
// -------------------------------------------------------------
export async function getServices(): Promise<ServiceItem[]> {
  return getStore().services;
}

export async function saveService(service: ServiceItem): Promise<ServiceItem> {
  const store = getStore();
  const index = store.services.findIndex((s) => s.id === service.id);
  if (index >= 0) {
    store.services[index] = service;
  } else {
    store.services.push(service);
  }
  saveStore(store);
  return service;
}

export async function deleteService(id: string): Promise<boolean> {
  const store = getStore();
  store.services = store.services.filter((s) => s.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// NOTES / BLOG CRUD
// -------------------------------------------------------------
export async function getNotes(): Promise<NotePost[]> {
  return getStore().notes;
}

export async function getNoteBySlug(slug: string): Promise<NotePost | undefined> {
  return getStore().notes.find((n) => n.slug === slug);
}

export async function saveNote(note: NotePost): Promise<NotePost> {
  const store = getStore();
  const index = store.notes.findIndex((n) => n.id === note.id);
  if (index >= 0) {
    store.notes[index] = note;
  } else {
    store.notes.push(note);
  }
  saveStore(store);
  return note;
}

export async function deleteNote(id: string): Promise<boolean> {
  const store = getStore();
  store.notes = store.notes.filter((n) => n.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// MESSAGES CRUD
// -------------------------------------------------------------
export async function getMessages(): Promise<ContactMessage[]> {
  return getStore().messages;
}

export async function addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> {
  const store = getStore();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'unread'
  };
  store.messages.unshift(newMessage);
  saveStore(store);
  return newMessage;
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  const store = getStore();
  const msg = store.messages.find((m) => m.id === id);
  if (msg) {
    msg.status = status;
    saveStore(store);
    return true;
  }
  return false;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const store = getStore();
  store.messages = store.messages.filter((m) => m.id !== id);
  saveStore(store);
  return true;
}

// -------------------------------------------------------------
// SITE SETTINGS CRUD
// -------------------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  const store = getStore();
  return store.settings;
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const store = getStore();
  store.settings = { ...store.settings, ...settings };
  saveStore(store);
  return store.settings;
}

import { getStore } from '@/lib/dataStore';

export interface AssistantSource {
  title: string;
  category: string;
  snippet: string;
  url?: string;
}

export interface AssistantResponse {
  answer: string;
  sources: AssistantSource[];
  suggestedFollowUps?: string[];
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'could', 'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'tell', 'show', 'know', 'manav', 'shah', 'manav\'s', 'he', 'his'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\.\-\+\#]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function queryPortfolioAssistant(rawQuery: string): AssistantResponse {
  const store = getStore();
  const profile = store.profile;
  const projects = store.projects;
  const experience = store.experience;
  const skills = store.skills;
  const education = store.education;
  const achievements = store.achievements;
  const services = store.services;

  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return {
      answer: "Hi! 👋 I'm Manav's local portfolio assistant. Ask me about his AI projects, work experience, skills, education, or research.",
      sources: [],
      suggestedFollowUps: [
        "What AI projects has Manav built?",
        "What is Manav's current role?",
        "Tell me about TaxProGenie.",
        "What research papers has he published?"
      ]
    };
  }

  const tokens = tokenize(query);

  // Helper: Find education by degree keyword
  const findEduByDegree = (keyword: string) => {
    return education.find(
      (e) => e.degree.toLowerCase().includes(keyword) || e.field.toLowerCase().includes(keyword)
    );
  };

  // ──────────────────────────────────────────────
  // 1. CONTACT & SOCIAL
  // ──────────────────────────────────────────────
  if (
    query.includes('contact') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('reach') ||
    query.includes('hire') ||
    query.includes('linkedin') ||
    query.includes('github')
  ) {
    return {
      answer: `You can reach Manav directly via:\n\n• **Email**: [${profile.email}](mailto:${profile.email})\n• **Phone**: ${profile.phone}\n• **LinkedIn**: [linkedin.com/in/manavshah-11ai](${profile.linkedin})\n• **GitHub**: [github.com/manavshah052003](${profile.github})\n• **Location**: ${profile.location}\n\nHe is currently ${profile.status.toLowerCase()}.`,
      sources: [
        {
          title: 'Profile & Contact Information',
          category: 'Contact',
          snippet: `${profile.email} | ${profile.location}`
        }
      ],
      suggestedFollowUps: [
        "What is Manav's current experience?",
        "View his top AI projects",
        "How can I download his resume?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 2. RESUME
  // ──────────────────────────────────────────────
  if (query.includes('resume') || query.includes('cv') || query.includes('download')) {
    return {
      answer: `You can view and download Manav's resume on the **[Resume page](/resume)**.\n\n**Quick Highlights:**\n• ${experience[0]?.role || 'AI Developer'} at ${experience[0]?.company || 'Analytix Solutions'}\n• M.Tech in AI (PDEU, 9.06 CGPA)\n• B.Tech in CE (Indus University, 9.70 CGPA)\n• 2 IEEE publications in Deep Learning & Biomedical AI`,
      sources: [
        {
          title: 'Manav Shah — Resume',
          category: 'Resume',
          snippet: 'AI Engineer | Generative AI | LLMs',
          url: '/resume'
        }
      ],
      suggestedFollowUps: [
        "What technologies does he work with?",
        "Tell me about his work at Analytix Solutions",
        "Show me his AI projects"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 3. EDUCATION — GRANULAR SUB-INTENTS
  // ──────────────────────────────────────────────
  const isBtechQuery = query.includes('btech') || query.includes('b.tech') || query.includes('bachelor') || query.includes('undergraduate') || query.includes('ug');
  const isMtechQuery = query.includes('mtech') || query.includes('m.tech') || query.includes('master') || query.includes('postgraduate') || query.includes('pg');
  const isCollegeQuery = query.includes('college') || query.includes('university') || query.includes('institute') || query.includes('school');
  const isCgpaQuery = query.includes('cgpa') || query.includes('gpa') || query.includes('grades') || query.includes('score') || query.includes('percentage');

  // Specific: "What is his BTech college?"
  if (isBtechQuery && !isMtechQuery) {
    const btech = findEduByDegree('b.tech') || education.find(e => e.degree.toLowerCase().includes('bachelor'));
    if (btech) {
      return {
        answer: `Manav completed his **${btech.degree} in ${btech.field}** from **${btech.institution}**, ${btech.location}.\n\n• **Grade**: ${btech.grade}\n• **Duration**: ${btech.startYear}–${btech.endYear}${btech.highlights && btech.highlights.length > 0 ? `\n• **Highlight**: ${btech.highlights[0]}` : ''}`,
        sources: [{
          title: `${btech.degree} — ${btech.institution}`,
          category: 'Education',
          snippet: `${btech.grade} | ${btech.location}`,
          url: '/education'
        }],
        suggestedFollowUps: [
          "Where did he do his MTech?",
          "What research papers has he published?",
          "What are his core skills?"
        ]
      };
    }
  }

  // Specific: "What is his MTech university?"
  if (isMtechQuery && !isBtechQuery) {
    const mtech = findEduByDegree('m.tech') || education.find(e => e.degree.toLowerCase().includes('master'));
    if (mtech) {
      return {
        answer: `Manav completed his **${mtech.degree} in ${mtech.field}** from **${mtech.institution}**, ${mtech.location}.\n\n• **Grade**: ${mtech.grade}\n• **Duration**: ${mtech.startYear}–${mtech.endYear}${mtech.highlights && mtech.highlights.length > 0 ? `\n• **Highlight**: ${mtech.highlights[0]}` : ''}`,
        sources: [{
          title: `${mtech.degree} — ${mtech.institution}`,
          category: 'Education',
          snippet: `${mtech.grade} | ${mtech.location}`,
          url: '/education'
        }],
        suggestedFollowUps: [
          "Where did he do his BTech?",
          "What IEEE papers has he published?",
          "What is his current role?"
        ]
      };
    }
  }

  // Specific: CGPA / Grades query
  if (isCgpaQuery && !isCollegeQuery) {
    const grades = education.map(e => `• **${e.degree} in ${e.field}** — ${e.institution}: **${e.grade}**`).join('\n');
    return {
      answer: `Here are Manav's academic grades:\n\n${grades}`,
      sources: education.map(e => ({
        title: `${e.degree} — ${e.institution}`,
        category: 'Education',
        snippet: e.grade,
        url: '/education'
      })),
      suggestedFollowUps: [
        "What research papers has he published?",
        "What are his core technical skills?",
        "What projects did he build?"
      ]
    };
  }

  // General education query
  if (
    query.includes('education') ||
    query.includes('degree') ||
    isCollegeQuery ||
    query.includes('pdeu') ||
    query.includes('indus')
  ) {
    if (query.includes('pdeu') || query.includes('pandit') || query.includes('deendayal')) {
      const pdeu = education.find(e => e.institution.toLowerCase().includes('pandit'));
      if (pdeu) {
        return {
          answer: `At **${pdeu.institution}**, Manav completed his **${pdeu.degree} in ${pdeu.field}** with **${pdeu.grade}** (${pdeu.startYear}–${pdeu.endYear}).${pdeu.highlights && pdeu.highlights.length > 0 ? `\n\n**Highlights**: ${pdeu.highlights.join(', ')}` : ''}`,
          sources: [{ title: `${pdeu.degree} — ${pdeu.institution}`, category: 'Education', snippet: pdeu.grade, url: '/education' }],
          suggestedFollowUps: ["Where did he do BTech?", "What research papers?", "Core skills?"]
        };
      }
    }
    if (query.includes('indus')) {
      const indus = education.find(e => e.institution.toLowerCase().includes('indus'));
      if (indus) {
        return {
          answer: `At **${indus.institution}**, Manav completed his **${indus.degree} in ${indus.field}** with **${indus.grade}** (${indus.startYear}–${indus.endYear}).${indus.highlights && indus.highlights.length > 0 ? `\n\n**Highlights**: ${indus.highlights.join(', ')}` : ''}`,
          sources: [{ title: `${indus.degree} — ${indus.institution}`, category: 'Education', snippet: indus.grade, url: '/education' }],
          suggestedFollowUps: ["Where did he do MTech?", "What are his skills?", "What projects?"]
        };
      }
    }

    const eduList = education
      .map(e => `• **${e.degree} in ${e.field}** — *${e.institution}* (${e.grade}, ${e.startYear}–${e.endYear})`)
      .join('\n');

    return {
      answer: `Manav's educational background:\n\n${eduList}`,
      sources: education.map(e => ({
        title: `${e.degree} — ${e.institution}`,
        category: 'Education',
        snippet: `${e.grade} | ${e.location}`,
        url: '/education'
      })),
      suggestedFollowUps: [
        "What research papers has he published?",
        "What are his core technical skills?",
        "What projects did he build during university?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 4. RESEARCH & PUBLICATIONS
  // ──────────────────────────────────────────────
  if (
    query.includes('research') ||
    query.includes('paper') ||
    query.includes('publication') ||
    query.includes('ieee') ||
    query.includes('eeg') ||
    query.includes('sleep') ||
    query.includes('apnea')
  ) {
    const research = achievements.filter((a) => a.category === 'Publication');
    const list = research
      .map((r) => `• **${r.title}** (${r.date})\n  ${r.description}`)
      .join('\n\n');

    return {
      answer: `Manav has authored peer-reviewed research papers:\n\n${list}`,
      sources: research.map((r) => ({
        title: r.title,
        category: 'Research Publication',
        snippet: r.description,
        url: '/achievements'
      })),
      suggestedFollowUps: [
        "What deep learning frameworks does he use?",
        "Tell me about the Smart Greenhouse project",
        "View his work experience"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 5. EXPERIENCE — GRANULAR SUB-INTENTS
  // ──────────────────────────────────────────────
  const isCurrentRoleQuery = query.includes('current') || query.includes('now') || query.includes('present') || query.includes('today');
  const isInternQuery = query.includes('intern') || query.includes('internship');

  if (isCurrentRoleQuery && (query.includes('role') || query.includes('job') || query.includes('work') || query.includes('position') || query.includes('doing'))) {
    const currentExp = experience.find(e => e.current) || experience[0];
    if (currentExp) {
      return {
        answer: `Manav is currently working as **${currentExp.role}** at **${currentExp.company}**, ${currentExp.location} (since ${currentExp.startDate}).\n\n${currentExp.description}\n\n**Key Responsibilities:**\n${currentExp.responsibilities.slice(0, 4).map(r => `• ${r}`).join('\n')}\n\n**Tech Stack:** ${currentExp.technologies.join(', ')}`,
        sources: [{
          title: `${currentExp.role} — ${currentExp.company}`,
          category: 'Experience',
          snippet: `${currentExp.startDate} – Present | ${currentExp.location}`,
          url: '/experience'
        }],
        suggestedFollowUps: [
          "Tell me about TaxProGenie",
          "What internships has he done?",
          "What AI technologies does he use?"
        ]
      };
    }
  }

  if (isInternQuery) {
    const internships = experience.filter(e => e.role.toLowerCase().includes('intern'));
    if (internships.length > 0) {
      const list = internships.map(e =>
        `### ${e.role} at ${e.company}\n*${e.startDate} – ${e.endDate} | ${e.location}*\n\n${e.description}\n\n**Key Work:**\n${e.responsibilities.slice(0, 3).map(r => `• ${r}`).join('\n')}`
      ).join('\n\n---\n\n');

      return {
        answer: `Manav's internship experience:\n\n${list}`,
        sources: internships.map(e => ({
          title: `${e.role} — ${e.company}`,
          category: 'Experience',
          snippet: `${e.startDate} – ${e.endDate}`,
          url: '/experience'
        })),
        suggestedFollowUps: [
          "What is his current role?",
          "What projects did he build?",
          "What are his core skills?"
        ]
      };
    }
  }

  if (
    query.includes('experience') ||
    query.includes('job') ||
    query.includes('role') ||
    query.includes('company') ||
    query.includes('work') ||
    query.includes('analytix') ||
    query.includes('schbang')
  ) {
    const expList = experience
      .map(
        (exp) =>
          `### ${exp.role} at ${exp.company}\n*${exp.startDate} – ${exp.endDate} | ${exp.location}*\n\n${exp.description}\n\n**Key Deliverables:**\n${exp.responsibilities.slice(0, 4).map((r) => `• ${r}`).join('\n')}\n\n**Technologies:** ${exp.technologies.join(', ')}`
      )
      .join('\n\n---\n\n');

    return {
      answer: `Manav's professional experience:\n\n${expList}`,
      sources: experience.map((exp) => ({
        title: `${exp.role} — ${exp.company}`,
        category: 'Experience',
        snippet: `${exp.startDate} – ${exp.endDate} | ${exp.location}`,
        url: '/experience'
      })),
      suggestedFollowUps: [
        "Tell me about TaxProGenie",
        "Tell me about AI-VOX",
        "What AI technologies does he work with?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 6. SPECIFIC PROJECT MATCH
  // ──────────────────────────────────────────────
  const matchedProject = projects.find(
    (p) =>
      query.includes(p.slug) ||
      query.includes(p.title.toLowerCase()) ||
      (query.includes('tax') && p.slug === 'taxpro-genie') ||
      (query.includes('vox') && p.slug === 'ai-vox') ||
      (query.includes('artifax') && p.slug === 'artifax') ||
      (query.includes('applied') && p.slug === 'applied-ai-os') ||
      (query.includes('mushroom') && p.slug === 'smart-greenhouse')
  );

  if (matchedProject) {
    return {
      answer: `### ${matchedProject.title} (${matchedProject.year})\n\n${matchedProject.fullDescription}\n\n**Problem:** ${matchedProject.problem}\n\n**Solution:** ${matchedProject.solution}\n\n**Key Results:**\n${matchedProject.results.map((r) => `• ${r}`).join('\n')}\n\n**Tech Stack:** ${matchedProject.technologies.join(', ')}`,
      sources: [
        {
          title: matchedProject.title,
          category: `Project (${matchedProject.category})`,
          snippet: matchedProject.shortDescription,
          url: `/projects/${matchedProject.slug}`
        }
      ],
      suggestedFollowUps: [
        "View the full case study",
        "What other AI projects has he built?",
        "What technologies does he specialize in?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 7. GENERAL PROJECTS QUERY
  // ──────────────────────────────────────────────
  if (query.includes('project') || query.includes('built') || query.includes('portfolio')) {
    const list = projects
      .map(
        (p) =>
          `• **[${p.title}](/projects/${p.slug})** (${p.year} · ${p.category})\n  ${p.shortDescription}`
      )
      .join('\n\n');

    return {
      answer: `Manav's key AI & engineering projects:\n\n${list}\n\nExplore detailed case studies on the **[Projects page](/projects)**.`,
      sources: projects.map((p) => ({
        title: p.title,
        category: p.category,
        snippet: p.shortDescription,
        url: `/projects/${p.slug}`
      })),
      suggestedFollowUps: [
        "Tell me about TaxProGenie",
        "Tell me about Applied AI OS",
        "Tell me about AI-VOX"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 8. SKILLS
  // ──────────────────────────────────────────────
  if (
    query.includes('skill') ||
    query.includes('python') ||
    query.includes('pytorch') ||
    query.includes('llm') ||
    query.includes('rag') ||
    query.includes('langchain') ||
    query.includes('fastapi') ||
    query.includes('react') ||
    query.includes('sql') ||
    query.includes('docker') ||
    query.includes('technolog')
  ) {
    const specificTech = tokens.find(t =>
      ['python', 'pytorch', 'tensorflow', 'langchain', 'fastapi', 'react', 'docker', 'sql', 'azure', 'openai'].includes(t)
    );

    if (specificTech) {
      for (const cat of skills) {
        const skill = cat.skills.find(s => s.name.toLowerCase().includes(specificTech));
        if (skill) {
          return {
            answer: `Yes! Manav has **${skill.level}** proficiency in **${skill.name}**.\n\nIt falls under his **${cat.category}** skill set${skill.years ? ` with ${skill.years} of experience` : ''}.\n\n**Other skills in ${cat.category}:**\n${cat.skills.filter(s => s.name !== skill.name).map(s => `• ${s.name} (${s.level})`).join('\n')}`,
            sources: [{ title: cat.category, category: 'Skills', snippet: cat.skills.map(s => s.name).join(', '), url: '/skills' }],
            suggestedFollowUps: [
              "What projects use this technology?",
              "Show all his skills",
              "What is his current role?"
            ]
          };
        }
      }
    }

    const allSkills = skills
      .map(
        (cat) =>
          `**${cat.category}:**\n${cat.skills.map((s) => `• ${s.name} (${s.level})`).join('\n')}`
      )
      .join('\n\n');

    return {
      answer: `Manav's technical proficiency:\n\n${allSkills}`,
      sources: skills.map((cat) => ({
        title: cat.category,
        category: 'Skill Category',
        snippet: cat.skills.map((s) => s.name).join(', '),
        url: '/skills'
      })),
      suggestedFollowUps: [
        "Show projects using Python and LLMs",
        "What is his experience with Azure?",
        "What frameworks does he use?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 9. WHO IS MANAV / ABOUT
  // ──────────────────────────────────────────────
  if (
    query.includes('who') ||
    query.includes('about') ||
    query.includes('introduce') ||
    query.includes('overview') ||
    query.includes('summary')
  ) {
    return {
      answer: `**Manav Shah** — ${profile.role}, based in ${profile.location}.\n\n${profile.shortBio}\n\n**Highlights:**\n• **Current Role**: ${experience[0]?.role || 'AI Developer'} at ${experience[0]?.company || 'Analytix Solutions'}\n• **Flagship Project**: TaxProGenie — automated 28+ tax forms for 1.5L taxpayers (98% accuracy)\n• **Education**: M.Tech AI (PDEU, 9.06) & B.Tech CE (Indus, 9.70)\n• **Research**: 2 IEEE publications`,
      sources: [
        {
          title: 'About Manav Shah',
          category: 'Profile',
          snippet: profile.shortBio,
          url: '/about'
        }
      ],
      suggestedFollowUps: [
        "What projects has he built?",
        "What are his core technical skills?",
        "How can I contact him?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 10. SERVICES
  // ──────────────────────────────────────────────
  if (query.includes('service') || query.includes('offer') || query.includes('freelance') || query.includes('consulting')) {
    const serviceList = services
      .map(s => `• **${s.title}** — ${s.tagline}`)
      .join('\n');

    return {
      answer: `Manav offers the following professional services:\n\n${serviceList}\n\nLearn more on the **[Services page](/services)**.`,
      sources: services.map(s => ({
        title: s.title,
        category: 'Service',
        snippet: s.tagline,
        url: '/services'
      })),
      suggestedFollowUps: [
        "How can I contact him?",
        "What projects has he built?",
        "What is his hourly rate?"
      ]
    };
  }

  // ──────────────────────────────────────────────
  // 11. FALLBACK — Semantic Token Overlap
  // ──────────────────────────────────────────────
  const allDocuments = [
    ...projects.map((p) => ({
      title: p.title,
      category: 'Project',
      text: `${p.title} ${p.shortDescription} ${p.fullDescription} ${p.problem} ${p.solution} ${p.technologies.join(' ')}`,
      url: `/projects/${p.slug}`,
      snippet: p.shortDescription
    })),
    ...experience.map((e) => ({
      title: `${e.role} at ${e.company}`,
      category: 'Experience',
      text: `${e.company} ${e.role} ${e.description} ${e.responsibilities.join(' ')} ${e.technologies.join(' ')}`,
      url: '/experience',
      snippet: e.description
    })),
    ...skills.map((s) => ({
      title: s.category,
      category: 'Skills',
      text: `${s.category} ${s.skills.map((k) => k.name).join(' ')}`,
      url: '/skills',
      snippet: s.skills.map((k) => k.name).join(', ')
    })),
    ...education.map((ed) => ({
      title: `${ed.degree} in ${ed.field}`,
      category: 'Education',
      text: `${ed.institution} ${ed.degree} ${ed.field} ${ed.description} ${ed.subjects?.join(' ')}`,
      url: '/education',
      snippet: `${ed.institution} — ${ed.grade}`
    }))
  ];

  let bestMatch: { doc: (typeof allDocuments)[0]; score: number } | null = null;

  for (const doc of allDocuments) {
    const docLower = doc.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (docLower.includes(t)) {
        score += 1;
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { doc, score };
    }
  }

  if (bestMatch && bestMatch.score >= 1) {
    return {
      answer: `Based on Manav's records — **${bestMatch.doc.title}**:\n\n${bestMatch.doc.snippet}\n\nExplore more on the [${bestMatch.doc.title}](${bestMatch.doc.url}) page.`,
      sources: [
        {
          title: bestMatch.doc.title,
          category: bestMatch.doc.category,
          snippet: bestMatch.doc.snippet,
          url: bestMatch.doc.url
        }
      ],
      suggestedFollowUps: [
        "Tell me about his AI projects",
        "What is his experience with Python and LLMs?",
        "How can I get in touch with Manav?"
      ]
    };
  }

  // Safe Fallback — Zero Hallucination
  return {
    answer: "I couldn't find a specific match for that in Manav's verified portfolio data. Try asking about his **projects**, **experience**, **skills**, **education**, or **contact info**.",
    sources: [],
    suggestedFollowUps: [
      "What AI projects has Manav built?",
      "Tell me about his work at Analytix Solutions",
      "What are his core skills?",
      "How can I download his resume?"
    ]
  };
}

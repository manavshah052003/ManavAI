'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CommandPalette.module.css';

interface SearchItem {
  title: string;
  category: string;
  url: string;
  description: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { title: 'Home', category: 'Navigation', url: '/', description: 'Portfolio overview & hero' },
  { title: 'About Manav', category: 'Navigation', url: '/about', description: 'Story, philosophy & metrics' },
  { title: 'Work Experience', category: 'Navigation', url: '/experience', description: 'Analytix Solutions & internships' },
  { title: 'Projects', category: 'Navigation', url: '/projects', description: 'All AI & software projects' },
  { title: 'TaxProGenie', category: 'Project', url: '/projects/taxpro-genie', description: '28+ U.S. tax forms automated across 1.5L taxpayers' },
  { title: 'Applied AI OS', category: 'Project', url: '/projects/applied-ai-os', description: 'Independent AI developer workspace' },
  { title: 'AI-VOX', category: 'Project', url: '/projects/ai-vox', description: 'Speech evaluation with Gemini TTS' },
  { title: 'Artifax', category: 'Project', url: '/projects/artifax', description: 'Video meeting to Word BRD documentation' },
  { title: 'Smart Greenhouse', category: 'Project', url: '/projects/smart-greenhouse', description: 'YOLOv8 + ViT on Raspberry Pi 5' },
  { title: 'Skills', category: 'Navigation', url: '/skills', description: 'LLMs, PyTorch, Python, FastAPI, React' },
  { title: 'Education', category: 'Navigation', url: '/education', description: 'PDEU (M.Tech AI) & Indus (B.Tech CE)' },
  { title: 'Certifications', category: 'Navigation', url: '/certifications', description: 'DeepLearning.AI & Microsoft Azure' },
  { title: 'Achievements & Publications', category: 'Navigation', url: '/achievements', description: 'IEEE papers on EEGNet & DeepBoost' },
  { title: 'Services & Capabilities', category: 'Navigation', url: '/services', description: 'What Manav builds: AI, Automation, SaaS' },
  { title: 'Engineering Playground', category: 'Navigation', url: '/playground', description: 'Interactive AI & NLP demos' },
  { title: 'Resume (PDF)', category: 'Navigation', url: '/resume', description: 'View & download official resume' },
  { title: 'Contact Manav', category: 'Navigation', url: '/contact', description: 'Send an opportunity or project inquiry' },
  { title: 'Ask Portfolio Assistant', category: 'Assistant', url: '/ask', description: 'Offline conversational assistant' },
  { title: 'Notes / Blog', category: 'Blog', url: '/notes', description: 'Technical engineering writeups' }
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 8);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.searchHeader}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.input}
            placeholder="Search projects, experience, skills, pages... (ESC to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
          />
        </div>

        <div className={styles.resultsList}>
          {filtered.length === 0 ? (
            <div className={styles.emptyState}>No results found for &quot;{query}&quot;</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.url}
                className={`${styles.resultItem} ${
                  idx === selectedIndex ? styles.resultItemActive : ''
                }`}
                onClick={() => handleSelect(item.url)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={styles.itemMain}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemDescription}>{item.description}</span>
                </div>
                <span className={styles.itemCategory}>{item.category}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <span>Use <strong>↑</strong> <strong>↓</strong> to navigate</span>
          <span><strong>↵</strong> to select</span>
          <span><strong>ESC</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { Project } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const EMPTY_PROJECT: Project = {
  id: '',
  slug: '',
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: 'AI',
  featured: false,
  status: 'Production',
  year: new Date().getFullYear().toString(),
  technologies: ['Python', 'LLMs', 'FastAPI'],
  problem: '',
  solution: '',
  architectureSteps: ['Document Ingestion', 'Model Inference', 'Output Validation'],
  features: [],
  challenges: [],
  engineeringDecisions: [],
  results: ['Reduced processing time by 80%'],
  lessonsLearned: [],
  githubUrl: '',
  demoUrl: ''
};

export function ProjectsAdminClient({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [archStepInput, setArchStepInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    const newProj: Project = {
      ...EMPTY_PROJECT,
      id: `proj-${Date.now()}`,
      slug: `new-project-${Date.now()}`
    };
    setEditingProject(newProj);
    setTechInput(newProj.technologies.join(', '));
    setArchStepInput(newProj.architectureSteps.join('\n'));
    setResultInput(newProj.results.join('\n'));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setTechInput(project.technologies.join(', '));
    setArchStepInput(project.architectureSteps?.join('\n') || '');
    setResultInput(project.results?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showNotification(`✓ Deleted project "${title}".`);
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      alert('Error deleting project.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);

    const projectToSave: Project = {
      ...editingProject,
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      technologies: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      architectureSteps: archStepInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      results: resultInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave)
      });

      if (res.ok) {
        const saved = await res.json();
        setProjects((prev) => {
          const index = prev.findIndex((p) => p.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        setIsModalOpen(false);
        setEditingProject(null);
        showNotification(`✓ Successfully saved project "${saved.title}"!`);
      } else {
        alert('Failed to save project.');
      }
    } catch (err) {
      alert('Error saving project.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const updated = { ...project, featured: !project.featured };
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
        showNotification(`✓ Updated featured status for "${project.title}".`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {notification && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-light)',
            color: 'var(--color-success)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBottom: 'var(--space-6)'
          }}
        >
          {notification}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
        <Button onClick={handleOpenAdd} variant="primary" size="md">
          + Add New Project
        </Button>
      </div>

      {/* Projects Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title &amp; Slug</th>
              <th>Category</th>
              <th>Status</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>{p.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    /projects/{p.slug}
                  </div>
                </td>
                <td>
                  <Badge variant="accent" size="sm">{p.category}</Badge>
                </td>
                <td>
                  <Badge variant={p.status === 'Production' ? 'success' : 'default'} size="sm">
                    {p.status}
                  </Badge>
                </td>
                <td>{p.year}</td>
                <td>
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: p.featured ? 'var(--color-warning)' : 'var(--color-text-tertiary)'
                    }}
                  >
                    {p.featured ? '⭐️ Featured' : '☆ Standard'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-primary)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
                    >
                      Edit
                    </button>
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-accent-text)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      View ↗
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--color-error-light)',
                        border: '1px solid var(--color-error)',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && editingProject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: '800px',
              maxWidth: '100%',
              maxHeight: '90vh',
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border-primary)',
              overflowY: 'auto',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {editingProject.title ? `Edit "${editingProject.title}"` : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 'var(--text-xl)', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className={styles.select}
                  >
                    <option value="AI">AI</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Automation">Automation</option>
                    <option value="Web">Web</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Backend">Backend</option>
                    <option value="Experiments">Experiments</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className={styles.select}
                  >
                    <option value="Production">Production</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Short Summary Description *</label>
                <input
                  type="text"
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Project Description</label>
                <textarea
                  rows={3}
                  value={editingProject.fullDescription}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Technologies (Comma Separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Python, OpenAI, Claude, Azure Document Intelligence"
                  className={styles.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>The Problem Solved</label>
                  <textarea
                    rows={3}
                    value={editingProject.problem}
                    onChange={(e) => setEditingProject({ ...editingProject, problem: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>The Technical Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Architecture Steps (One per line)</label>
                <textarea
                  rows={4}
                  value={archStepInput}
                  onChange={(e) => setArchStepInput(e.target.value)}
                  placeholder="Step 1: Document Ingestion&#10;Step 2: LLM Classification&#10;Step 3: Validation"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Measurable Results (One per line)</label>
                <textarea
                  rows={3}
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder="Reduced processing time from 10m to 1m&#10;98% accuracy achieved"
                  className={styles.textarea}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>GitHub URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.demoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

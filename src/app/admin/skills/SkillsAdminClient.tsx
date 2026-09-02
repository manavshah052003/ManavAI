'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { SkillCategory, SkillItem } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function SkillsAdminClient({ initialSkills }: { initialSkills: SkillCategory[] }) {
  const [categories, setCategories] = useState<SkillCategory[]>(initialSkills);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Primary');
  const [newSkillYears, setNewSkillYears] = useState('2+');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const persistSkills = async (updated: SkillCategory[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setCategories(updated);
        showNotification('✓ Skills updated successfully!');
      } else {
        alert('Failed to save skills.');
      }
    } catch (err) {
      alert('Error saving skills.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (catIndex: number) => {
    if (!newSkillName.trim()) return;
    const updated = [...categories];
    updated[catIndex].skills.push({
      name: newSkillName.trim(),
      level: newSkillLevel,
      years: newSkillYears
    });
    setNewSkillName('');
    await persistSkills(updated);
  };

  const handleDeleteSkill = async (catIndex: number, skillIndex: number) => {
    const updated = [...categories];
    updated[catIndex].skills.splice(skillIndex, 1);
    await persistSkills(updated);
  };

  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) return;
    const updated = [
      ...categories,
      {
        category: newCategoryTitle.trim(),
        description: 'Custom competency group.',
        skills: []
      }
    ];
    setNewCategoryTitle('');
    await persistSkills(updated);
  };

  const handleDeleteCategory = async (catIndex: number) => {
    if (!confirm(`Delete entire category "${categories[catIndex].category}" and all its skills?`)) return;
    const updated = [...categories];
    updated.splice(catIndex, 1);
    await persistSkills(updated);
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

      {/* Add New Category Card */}
      <Card variant="outlined" padding="md" style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="New Category Name (e.g. MLOps & Infrastructure)..."
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            className={styles.input}
            style={{ flex: 1 }}
          />
          <Button onClick={handleAddCategory} variant="secondary" size="md" disabled={saving || !newCategoryTitle.trim()}>
            + Add Category
          </Button>
        </div>
      </Card>

      {/* Categories & Skills List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {categories.map((cat, catIdx) => (
          <div key={cat.category} className={styles.tableCard}>
            <div
              style={{
                padding: 'var(--space-4) var(--space-6)',
                background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border-primary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{cat.category}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {cat.skills.length} skills listed
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(catIdx)}
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
                Delete Category
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Level</th>
                  <th>Years</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cat.skills.map((s, sIdx) => (
                  <tr key={s.name}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td>
                      <Badge
                        variant={
                          s.level === 'Primary'
                            ? 'accent'
                            : s.level === 'Advanced'
                            ? 'success'
                            : 'default'
                        }
                        size="sm"
                      >
                        {s.level}
                      </Badge>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {s.years || 'N/A'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteSkill(catIdx, sIdx)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-error)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600
                        }}
                      >
                        Remove &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* In-table Add Skill Form */}
            <div
              style={{
                padding: 'var(--space-4) var(--space-6)',
                borderTop: '1px solid var(--color-border-primary)',
                background: 'var(--color-bg-card)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <input
                type="text"
                placeholder="Skill name (e.g. LangGraph)..."
                value={editingCategoryIndex === catIdx ? newSkillName : ''}
                onFocus={() => setEditingCategoryIndex(catIdx)}
                onChange={(e) => {
                  setEditingCategoryIndex(catIdx);
                  setNewSkillName(e.target.value);
                }}
                className={styles.input}
                style={{ flex: 2, minWidth: '160px' }}
              />

              <select
                value={editingCategoryIndex === catIdx ? newSkillLevel : 'Primary'}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className={styles.select}
                style={{ flex: 1, minWidth: '130px' }}
              >
                <option value="Primary">Primary</option>
                <option value="Advanced">Advanced</option>
                <option value="Working Knowledge">Working Knowledge</option>
                <option value="Learning">Learning</option>
              </select>

              <input
                type="text"
                placeholder="Years (e.g. 2+)"
                value={editingCategoryIndex === catIdx ? newSkillYears : '2+'}
                onChange={(e) => setNewSkillYears(e.target.value)}
                className={styles.input}
                style={{ width: '100px' }}
              />

              <Button
                onClick={() => handleAddSkill(catIdx)}
                variant="primary"
                size="sm"
                disabled={saving || (editingCategoryIndex === catIdx && !newSkillName.trim())}
              >
                + Add Skill
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

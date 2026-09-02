'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/portfolio';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const CATEGORIES = ['All', 'AI', 'Machine Learning', 'Automation'];

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-10)'
        }}
      >
        {/* Category Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                border: '1px solid',
                transition: 'all var(--duration-fast)',
                backgroundColor:
                  selectedCategory === cat
                    ? 'var(--color-accent)'
                    : 'var(--color-bg-secondary)',
                borderColor:
                  selectedCategory === cat
                    ? 'var(--color-accent)'
                    : 'var(--color-border-primary)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search by name or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-16)',
            color: 'var(--color-text-tertiary)'
          }}
        >
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="grid grid--2">
          {filteredProjects.map((p, idx) => (
            <ScrollReveal key={p.id} delay={((idx % 2) + 1) as 1 | 2}>
              <Link href={`/projects/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card variant="outlined" padding="lg" hover style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-accent-text)', textTransform: 'uppercase' }}>
                        {p.category}
                      </span>
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>&bull;</span>
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>{p.year}</span>
                    </div>
                    <Badge variant={p.status === 'Production' ? 'success' : 'default'} size="sm">
                      {p.status}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                    {p.title}
                  </h3>

                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)', flex: 1 }}>
                    {p.shortDescription}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 'var(--text-xs)',
                          padding: '2px var(--space-2)',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-bg-tertiary)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-accent-text)' }}>
                    <span>Explore Case Study</span>
                    <span>&rarr;</span>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SearchDoc {
  title: string;
  category: string;
  snippet: string;
  url: string;
  tags?: string[];
}

export function SearchClient({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.snippet.toLowerCase().includes(query.toLowerCase()) ||
          d.category.toLowerCase().includes(query.toLowerCase()) ||
          d.tags?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : docs;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <input
          type="text"
          placeholder="Search across all projects, experience, skills, and publications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            padding: 'var(--space-4)',
            fontSize: 'var(--text-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-primary)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-tertiary)' }}>
            No records found for &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map((doc, idx) => (
            <Link key={idx} href={doc.url} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card variant="outlined" padding="md" hover>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <Badge variant="accent" size="sm">{doc.category}</Badge>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', margin: 'var(--space-1) 0' }}>
                  {doc.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                  {doc.snippet}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

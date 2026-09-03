import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { getNotes } from '@/lib/dataStore';

export const metadata = {
  title: 'Engineering Notes & Blog',
  description: 'Technical writeups on AI engineering, deterministic LLM pipelines, and biomedical deep learning.'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className="container section page-enter" style={{ maxWidth: 'var(--max-width-narrow)' }}>
      <ScrollReveal>
        <SectionHeader
          label="Writing"
          title="Engineering Notes"
          subtitle="Thoughts, architectural lessons, and post-mortems from building production AI software."
        />
      </ScrollReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {notes.map((note, idx) => (
          <ScrollReveal key={note.id} delay={((idx % 2) + 1) as 1 | 2}>
            <Link href={`/notes/${note.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card variant="outlined" padding="lg" hover>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{note.date}</span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>&bull;</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>{note.readingTime}</span>
                </div>

                <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                  {note.title}
                </h3>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
                  {note.excerpt}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                  {note.tags.map((t) => (
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
                      #{t}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

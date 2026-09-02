import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNoteBySlug } from '@/lib/dataStore';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) return { title: 'Note Not Found' };
  return {
    title: note.title,
    description: note.excerpt
  };
}

export default async function NoteDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);
  if (!note) notFound();

  return (
    <div className="container section page-enter" style={{ maxWidth: '720px' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link
          href="/notes"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)'
          }}
        >
          &larr; Back to all notes
        </Link>
      </div>

      <ScrollReveal>
        <article>
          <header style={{ marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-border-primary)', paddingBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
              <span>{note.date}</span>
              <span>&bull;</span>
              <span>{note.readingTime}</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, var(--text-5xl))', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)' }}>
              {note.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginTop: 'var(--space-4)' }}>
              {note.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 'var(--text-xs)',
                    padding: '2px var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-tertiary)',
                    color: 'var(--color-accent-text)'
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          </header>

          <div
            style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-loose)',
              color: 'var(--color-text-primary)',
              whiteSpace: 'pre-line'
            }}
          >
            {note.content}
          </div>
        </article>
      </ScrollReveal>
    </div>
  );
}

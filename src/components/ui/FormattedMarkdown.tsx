import React from 'react';

// Helper to parse inline markdown (bold, italic, links, code)
function formatInlineText(text: string): React.ReactNode[] {
  // Regex pattern matching:
  // 1. Markdown link: [text](url)
  // 2. Bold: **text**
  // 3. Italic: *text* or _text_
  // 4. Code: `text`
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          style={{
            color: 'var(--color-accent-text)',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: '2px'
          }}
        >
          {linkText}
        </a>
      );
    }

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} style={{ fontWeight: 700, color: 'inherit' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9em',
            padding: '2px 5px',
            borderRadius: '4px',
            background: 'rgba(79, 70, 229, 0.12)',
            color: 'var(--color-accent-text)'
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function FormattedMarkdown({ text }: { text: string }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          style={{
            margin: 'var(--space-2) 0',
            paddingLeft: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      elements.push(<div key={`space-${idx}`} style={{ height: '8px' }} />);
      return;
    }

    // Markdown Headers: ### Heading or ## Heading or # Heading
    if (trimmed.startsWith('#')) {
      flushList();
      const headerLevel = trimmed.match(/^#+/)?.[0].length || 1;
      const headerText = trimmed.replace(/^#+\s*/, '');
      const fontSize = headerLevel === 1 ? '1.15em' : headerLevel === 2 ? '1.05em' : '0.98em';

      elements.push(
        <div
          key={`header-${idx}`}
          style={{
            fontWeight: 800,
            fontSize,
            marginTop: 'var(--space-2)',
            marginBottom: 'var(--space-1)',
            color: 'inherit',
            letterSpacing: '-0.01em'
          }}
        >
          {formatInlineText(headerText)}
        </div>
      );
      return;
    }

    // Bullet points: • or - or * (with space)
    if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemContent = trimmed.replace(/^(•|-|\*)\s*/, '');
      currentList.push(
        <li key={`item-${idx}`} style={{ lineHeight: 1.55 }}>
          {formatInlineText(itemContent)}
        </li>
      );
      return;
    }

    // Numbered list: 1. or 2.
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      flushList();
      elements.push(
        <div key={`num-${idx}`} style={{ display: 'flex', gap: '6px', margin: '3px 0', lineHeight: 1.55 }}>
          <span style={{ fontWeight: 700, minWidth: '18px', color: 'var(--color-accent-text)' }}>{numberedMatch[1]}.</span>
          <div style={{ flex: 1 }}>{formatInlineText(numberedMatch[2])}</div>
        </div>
      );
      return;
    }

    // Standard paragraph line
    flushList();
    elements.push(
      <p key={`p-${idx}`} style={{ margin: '3px 0', lineHeight: 1.6 }}>
        {formatInlineText(trimmed)}
      </p>
    );
  });

  flushList();

  return <div style={{ fontSize: 'inherit', color: 'inherit' }}>{elements}</div>;
}

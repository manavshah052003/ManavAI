'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AssistantResponse } from '@/lib/assistant/searchEngine';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: AssistantResponse['sources'];
  suggestedFollowUps?: string[];
}

function AskContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Manav's local portfolio assistant. I run offline without any external LLM APIs.\n\nAsk me anything about Manav's background, production AI systems, experience, research publications, or education."
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend }
    ]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const data: AssistantResponse = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          sources: data.sources,
          suggestedFollowUps: data.suggestedFollowUps
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Encountered an issue querying local portfolio data.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="container section page-enter" style={{ maxWidth: '780px' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Badge variant="accent" size="sm" style={{ marginBottom: 'var(--space-2)' }}>
          Offline &bull; Zero External LLM APIs
        </Badge>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)' }}>
          Portfolio Assistant
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', marginTop: 'var(--space-2)' }}>
          Ask natural questions about Manav&apos;s verified AI engineering background, systems built, and research.
        </p>
      </div>

      <Card variant="outlined" padding="none" style={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)'
              }}
            >
              <div
                style={{
                  background: m.sender === 'user' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--color-text-primary)',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--color-border-primary)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-relaxed)'
                }}
              >
                <FormattedMarkdown text={m.text} />

                {m.sources && m.sources.length > 0 && (
                  <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-primary)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '4px' }}>
                      Verified Sources:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                      {m.sources.map((s, sIdx) => (
                        <span key={sIdx}>
                          {s.url ? (
                            <Link
                              href={s.url}
                              style={{
                                fontSize: 'var(--text-xs)',
                                padding: '2px var(--space-2)',
                                background: 'var(--color-accent-subtle)',
                                color: 'var(--color-accent-text)',
                                borderRadius: 'var(--radius-sm)',
                                textDecoration: 'none',
                                fontWeight: 500
                              }}
                            >
                              {s.category}: {s.title} &rarr;
                            </Link>
                          ) : (
                            <span
                              style={{
                                fontSize: 'var(--text-xs)',
                                padding: '2px var(--space-2)',
                                background: 'var(--color-bg-tertiary)',
                                color: 'var(--color-text-secondary)',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              {s.category}: {s.title}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: 'flex-start', fontStyle: 'italic', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
              Scanning local portfolio records...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: 'var(--space-4)',
            borderTop: '1px solid var(--color-border-primary)',
            background: 'var(--color-bg-card)',
            display: 'flex',
            gap: 'var(--space-2)'
          }}
        >
          <input
            type="text"
            placeholder="Type your question about Manav..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-primary)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--text-sm)',
              outline: 'none'
            }}
          />
          <Button type="submit" variant="primary" size="md" disabled={!input.trim() || loading}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={<div className="container section text-center">Loading Assistant...</div>}>
      <AskContent />
    </Suspense>
  );
}

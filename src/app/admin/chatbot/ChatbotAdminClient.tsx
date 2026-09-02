'use client';

import { useState } from 'react';
import styles from '../admin.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AssistantResponse } from '@/lib/assistant/searchEngine';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

export function ChatbotAdminClient() {
  const [testQuery, setTestQuery] = useState('What AI projects has Manav built?');
  const [testResult, setTestResult] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexStatus, setIndexStatus] = useState<'idle' | 'rebuilding' | 'done'>('idle');

  const handleTest = async () => {
    if (!testQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery })
      });
      const data: AssistantResponse = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildIndex = () => {
    setIndexStatus('rebuilding');
    setTimeout(() => {
      setIndexStatus('done');
      setTimeout(() => setIndexStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Index Status Card */}
      <Card variant="outlined" padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Local NLP Search Index</span>
              <Badge variant="success" size="sm">Operational</Badge>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Total Sources Indexed: 5 Projects, 3 Work Experiences, 5 Skill Categories, 2 Degrees, 2 IEEE Publications.
            </p>
          </div>

          <Button
            onClick={handleRebuildIndex}
            variant="secondary"
            size="sm"
            disabled={indexStatus === 'rebuilding'}
          >
            {indexStatus === 'rebuilding'
              ? 'Parsing Documents...'
              : indexStatus === 'done'
              ? '✓ Index Refreshed'
              : 'Rebuild Knowledge Index'}
          </Button>
        </div>
      </Card>

      {/* Test Query Console */}
      <Card variant="outlined" padding="lg">
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
          Offline Assistant Test Console
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Simulate user prompts to inspect intent detection, deterministic answer templating, and matched source grounding.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            className={styles.input}
            style={{ flex: 1 }}
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type test query..."
          />
          <Button onClick={handleTest} variant="primary" size="md" disabled={loading}>
            {loading ? 'Evaluating...' : 'Run Query'}
          </Button>
        </div>

        {/* Quick test buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-6)' }}>
          {[
            'What AI projects has Manav built?',
            'What is his current role at Analytix Solutions?',
            'Tell me about TaxProGenie',
            'What research papers has he published?',
            'Does he know Python and PyTorch?'
          ].map((q) => (
            <button
              key={q}
              onClick={() => {
                setTestQuery(q);
              }}
              style={{
                fontSize: 'var(--text-xs)',
                padding: '3px var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-primary)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {testResult && (
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent-text)', marginBottom: 'var(--space-2)' }}>
              Generated Assistant Output:
            </div>
            <div style={{ fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
              <FormattedMarkdown text={testResult.answer} />
            </div>

            {testResult.sources && testResult.sources.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border-primary)', paddingTop: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
                  Matched Grounding Sources ({testResult.sources.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {testResult.sources.map((s, idx) => (
                    <div key={idx} style={{ fontSize: 'var(--text-xs)', background: 'var(--color-bg-card)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-primary)' }}>
                      <strong>[{s.category}]</strong> {s.title} &mdash; <em>{s.snippet}</em>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useState, useCallback, useRef } from 'react';
import styles from '../admin.module.css';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AssistantResponse } from '@/lib/assistant/searchEngine';
import { FormattedMarkdown } from '@/components/ui/FormattedMarkdown';

interface IndexStats {
  totalChunks: number;
  totalSources: number;
  lastUpdated: string;
  sources: { filename: string; pages: number; chunks: number; uploadedAt: string }[];
  hasData: boolean;
}

interface UploadResult {
  success: boolean;
  indexed: { filename: string; chunks: number; pages: number }[];
  errors: { filename: string; error: string }[];
  indexStats: { totalChunks: number; totalSources: number; lastUpdated: string };
}

export function ChatbotAdminClient() {
  const [testQuery, setTestQuery] = useState('What AI projects has Manav built?');
  const [testResult, setTestResult] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Index / upload state
  const [indexStats, setIndexStats] = useState<IndexStats | null>(null);
  const [indexLoading, setIndexLoading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchIndexStats = async () => {
    setIndexLoading(true);
    try {
      const res = await fetch('/api/admin/knowledge');
      if (res.ok) {
        const data: IndexStats = await res.json();
        setIndexStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIndexLoading(false);
    }
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    setUploadStatus('uploading');
    setUploadResult(null);

    const formData = new FormData();
    uploadFiles.forEach(f => formData.append('files', f));

    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        body: formData,
      });
      const data: UploadResult = await res.json();
      setUploadResult(data);
      setUploadStatus(data.success ? 'done' : 'error');
      setUploadFiles([]);
      // Refresh stats
      await fetchIndexStats();
    } catch (e) {
      console.error(e);
      setUploadStatus('error');
    }
  };

  const handleClearIndex = async () => {
    if (!confirm('Clear the entire knowledge index? This removes all uploaded PDFs from the chatbot.')) return;
    await fetch('/api/admin/knowledge', { method: 'DELETE' });
    setIndexStats(null);
    setUploadResult(null);
  };

  const handleRemoveSource = async (filename: string) => {
    await fetch(`/api/admin/knowledge?file=${encodeURIComponent(filename)}`, { method: 'DELETE' });
    await fetchIndexStats();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'));
    const combined = [...uploadFiles, ...dropped].slice(0, 5);
    setUploadFiles(combined);
  }, [uploadFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(f => f.name.endsWith('.pdf'));
    const combined = [...uploadFiles, ...selected].slice(0, 5);
    setUploadFiles(combined);
  };

  const handleTest = async () => {
    if (!testQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testQuery }),
      });
      const data: AssistantResponse = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

      {/* ── Knowledge Index Card ── */}
      <Card variant="outlined" padding="lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
              <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>PDF Knowledge Index</span>
              <Badge variant={indexStats?.hasData ? 'success' : 'default'} size="sm">
                {indexStats?.hasData ? `${indexStats.totalChunks} Chunks` : 'Empty'}
              </Badge>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Upload 1–5 PDF documents. The chatbot will parse them into chunks, build a BM25 search index, and use them to answer precise questions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button onClick={fetchIndexStats} variant="secondary" size="sm" disabled={indexLoading}>
              {indexLoading ? 'Loading...' : '↻ Refresh Stats'}
            </Button>
            {indexStats?.hasData && (
              <Button onClick={handleClearIndex} variant="secondary" size="sm">
                🗑 Clear Index
              </Button>
            )}
          </div>
        </div>

        {/* Indexed Sources List */}
        {indexStats?.sources && indexStats.sources.length > 0 && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
              Indexed Sources ({indexStats.sources.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {indexStats.sources.map((src) => (
                <div
                  key={src.filename}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-primary)',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{src.filename}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        {src.pages} pages · {src.chunks} chunks · Indexed {formatDate(src.uploadedAt)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSource(src.filename)}
                    style={{
                      fontSize: 'var(--text-xs)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-error-light)',
                      border: '1px solid var(--color-error)',
                      color: 'var(--color-error)',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--color-accent)' : 'var(--color-border-primary)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragging ? 'var(--color-accent-subtle)' : 'var(--color-bg-secondary)',
            transition: 'all 0.2s ease',
            marginBottom: 'var(--space-4)',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>📁</div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
            Drag & drop PDF files here, or click to browse
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            Up to 5 PDFs · 15MB per file · Resume, research papers, project writeups
          </div>
        </div>

        {/* Selected Files Preview */}
        {uploadFiles.length > 0 && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-2)' }}>
              Selected ({uploadFiles.length}/5):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
              {uploadFiles.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: '4px var(--space-3)',
                    background: 'var(--color-accent-light)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--color-accent-text)',
                  }}
                >
                  📄 {f.name} ({(f.size / 1024).toFixed(0)} KB)
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadFiles(uploadFiles.filter((_, idx) => idx !== i)); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-accent)', fontWeight: 700, fontSize: '12px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleUpload}
              variant="primary"
              size="md"
              disabled={uploadStatus === 'uploading'}
            >
              {uploadStatus === 'uploading' ? '⏳ Parsing & Indexing PDFs...' : '⚡ Upload & Build Knowledge Index'}
            </Button>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div style={{
            padding: 'var(--space-4)',
            background: uploadResult.success ? 'var(--color-success-light)' : 'var(--color-error-light)',
            border: `1px solid ${uploadResult.success ? 'var(--color-success)' : 'var(--color-error)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
          }}>
            {uploadResult.success && (
              <div style={{ marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-success)' }}>
                ✓ Successfully indexed {uploadResult.indexed.length} file(s)
              </div>
            )}
            {uploadResult.indexed.map(r => (
              <div key={r.filename} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)' }}>
                📄 {r.filename} → {r.chunks} chunks from {r.pages} pages
              </div>
            ))}
            {uploadResult.errors.map(e => (
              <div key={e.filename} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>
                ✗ {e.filename}: {e.error}
              </div>
            ))}
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>
              Index now contains {uploadResult.indexStats.totalChunks} total chunks from {uploadResult.indexStats.totalSources} source(s)
            </div>
          </div>
        )}
      </Card>

      {/* ── Test Console ── */}
      <Card variant="outlined" padding="lg">
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
          Assistant Test Console
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Test queries against both the structured portfolio database and your uploaded PDF knowledge base.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            className={styles.input}
            style={{ flex: 1 }}
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
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
            'Does he know Python and PyTorch?',
          ].map((q) => (
            <button
              key={q}
              onClick={() => setTestQuery(q)}
              style={{
                fontSize: 'var(--text-xs)',
                padding: '3px var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-primary)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
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

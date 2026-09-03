/**
 * Knowledge Index Builder — BM25-style TF-IDF index
 *
 * Pipeline:
 *   PDF Buffer → text extraction → sentence-aware chunking →
 *   TF-IDF computation → index stored in knowledge_index.json
 */

import fs from 'fs';
import path from 'path';

const INDEX_PATH = path.join(process.cwd(), 'src', 'data', 'knowledge_index.json');
const CHUNK_SIZE = 120; // words per chunk (about 2-3 sentences)
const CHUNK_OVERLAP = 30; // words of overlap between chunks for context continuity

export interface KnowledgeChunk {
  id: string;
  source: string; // filename
  pageNumber?: number;
  text: string;
  words: string[];
  // TF-IDF cache (computed on index build)
  tf: Record<string, number>;
}

export interface KnowledgeIndex {
  version: number;
  lastUpdated: string;
  totalChunks: number;
  sources: { filename: string; pages: number; chunks: number; uploadedAt: string }[];
  chunks: KnowledgeChunk[];
  // Document frequency per term (for IDF computation)
  df: Record<string, number>;
  totalDocs: number;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'did', 'do', 'does', 'doing', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'out', 'over',
  'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
  'you', 'your',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-\+\.]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

function computeTF(words: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }
  // Normalize by doc length
  const len = words.length || 1;
  for (const w in freq) {
    freq[w] = freq[w] / len;
  }
  return freq;
}

/**
 * Split long text into overlapping word-based chunks.
 */
function chunkText(text: string, source: string, pageNumber?: number): Omit<KnowledgeChunk, 'tf'>[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks: Omit<KnowledgeChunk, 'tf'>[] = [];
  let i = 0;
  let chunkIdx = 0;

  while (i < words.length) {
    const slice = words.slice(i, i + CHUNK_SIZE);
    if (slice.length < 15) break; // Skip tiny trailing fragments

    const chunkText = slice.join(' ');
    const chunkWords = tokenize(chunkText);
    chunks.push({
      id: `${source}::${pageNumber ?? 0}::${chunkIdx}`,
      source,
      pageNumber,
      text: chunkText,
      words: chunkWords,
    });

    i += CHUNK_SIZE - CHUNK_OVERLAP;
    chunkIdx++;
  }

  return chunks;
}

/**
 * Load the existing knowledge index from disk.
 * Returns an empty index if none exists yet.
 */
export function loadIndex(): KnowledgeIndex {
  if (fs.existsSync(INDEX_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8')) as KnowledgeIndex;
    } catch {
      // corrupted — start fresh
    }
  }
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    totalChunks: 0,
    sources: [],
    chunks: [],
    df: {},
    totalDocs: 0,
  };
}

/**
 * Save a knowledge index to disk.
 */
function saveIndex(index: KnowledgeIndex) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), 'utf-8');
}

/**
 * Add a new document to the index.
 * If a document with the same filename already exists, it is replaced.
 */
export function addDocumentToIndex(
  filename: string,
  pages: { pageNumber: number; text: string }[],
  totalPages: number
): KnowledgeIndex {
  const index = loadIndex();

  // Remove existing chunks for this filename
  index.chunks = index.chunks.filter(c => c.source !== filename);
  index.sources = index.sources.filter(s => s.filename !== filename);

  // Build new chunks from all pages
  const newRawChunks: Omit<KnowledgeChunk, 'tf'>[] = [];
  for (const page of pages) {
    const pageChunks = chunkText(page.text, filename, page.pageNumber);
    newRawChunks.push(...pageChunks);
  }

  // Compute TF for each chunk and add to index
  const newChunks: KnowledgeChunk[] = newRawChunks.map(c => ({
    ...c,
    tf: computeTF(c.words),
  }));

  index.chunks.push(...newChunks);
  index.sources.push({
    filename,
    pages: totalPages,
    chunks: newChunks.length,
    uploadedAt: new Date().toISOString(),
  });

  // Recompute DF across all chunks
  const df: Record<string, number> = {};
  for (const chunk of index.chunks) {
    const uniqueWords = new Set(chunk.words);
    for (const w of uniqueWords) {
      df[w] = (df[w] || 0) + 1;
    }
  }
  index.df = df;
  index.totalDocs = index.chunks.length;
  index.totalChunks = index.chunks.length;
  index.lastUpdated = new Date().toISOString();

  saveIndex(index);
  return index;
}

/**
 * Remove a specific source document from the index.
 */
export function removeDocumentFromIndex(filename: string): KnowledgeIndex {
  const index = loadIndex();
  index.chunks = index.chunks.filter(c => c.source !== filename);
  index.sources = index.sources.filter(s => s.filename !== filename);

  // Recompute DF
  const df: Record<string, number> = {};
  for (const chunk of index.chunks) {
    const uniqueWords = new Set(chunk.words);
    for (const w of uniqueWords) {
      df[w] = (df[w] || 0) + 1;
    }
  }
  index.df = df;
  index.totalDocs = index.chunks.length;
  index.totalChunks = index.chunks.length;
  index.lastUpdated = new Date().toISOString();

  saveIndex(index);
  return index;
}

/**
 * Clear the entire index.
 */
export function clearIndex(): void {
  const empty: KnowledgeIndex = {
    version: 1,
    lastUpdated: new Date().toISOString(),
    totalChunks: 0,
    sources: [],
    chunks: [],
    df: {},
    totalDocs: 0,
  };
  saveIndex(empty);
}

export { tokenize as indexTokenize };

/**
 * Vector Search — BM25+ Retrieval over Knowledge Index
 *
 * Enhanced BM25 with:
 * 1. Semantic query expansion for universal CV & portfolio queries (contact, phone, email, projects, skills, education)
 * 2. Smoothed IDF baseline (+0.5) so small document collections don't zero out
 * 3. Exact phrase boost for multi-word matches (e.g. "Daniel Steele", "Feed Us Up", "AudioStats")
 * 4. Intent-specific pattern detection (emails with '@', phone numbers, links)
 * 5. Document-length normalization
 */

import { loadIndex, indexTokenize, KnowledgeChunk } from './indexBuilder';

const BM25_K1 = 1.5;
const BM25_B = 0.75;

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  rank: number;
}

/**
 * Expand query tokens with synonyms for universal document matching.
 */
function expandQueryTokens(query: string, rawTokens: string[]): string[] {
  const q = query.toLowerCase();
  const expanded = new Set(rawTokens);

  if (q.includes('email') || q.includes('mail') || q.includes('contact') || q.includes('reach') || q.includes('hire')) {
    expanded.add('email');
    expanded.add('gmail');
    expanded.add('contact');
  }
  if (q.includes('phone') || q.includes('call') || q.includes('number') || q.includes('mobile') || q.includes('cell')) {
    expanded.add('mobile');
    expanded.add('phone');
    expanded.add('tel');
  }
  if (q.includes('social') || q.includes('linkedin') || q.includes('github') || q.includes('portfolio') || q.includes('website')) {
    expanded.add('linkedin');
    expanded.add('github');
  }
  if (q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('education') || q.includes('study') || q.includes('school')) {
    expanded.add('education');
    expanded.add('university');
    expanded.add('bachelor');
    expanded.add('master');
    expanded.add('science');
  }
  if (q.includes('project') || q.includes('built') || q.includes('app') || q.includes('application')) {
    expanded.add('projects');
    expanded.add('personal');
  }
  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('tool') || q.includes('framework')) {
    expanded.add('skills');
    expanded.add('technical');
    expanded.add('stack');
  }
  if (q.includes('work') || q.includes('job') || q.includes('experience') || q.includes('career') || q.includes('role')) {
    expanded.add('experience');
    expanded.add('developer');
  }

  return Array.from(expanded);
}

/**
 * Score a single chunk against query tokens and the raw query string.
 */
function scoreChunk(
  queryTokens: string[],
  rawQuery: string,
  chunk: KnowledgeChunk,
  df: Record<string, number>,
  totalDocs: number,
  avgDocLen: number
): number {
  let score = 0;
  const docLen = chunk.words.length || 1;
  const chunkTextLower = chunk.text.toLowerCase();
  const cleanQuery = rawQuery.trim().toLowerCase();

  // 1. Exact phrase boost (huge relevance signal if multi-word query appears verbatim)
  if (queryTokens.length >= 2 && chunkTextLower.includes(cleanQuery)) {
    score += 8.0;
  }

  // 2. Intent-specific pattern boosts
  if ((cleanQuery.includes('email') || cleanQuery.includes('mail') || cleanQuery.includes('contact')) && (chunkTextLower.includes('@') || chunkTextLower.includes('gmail'))) {
    score += 6.0;
  }
  if ((cleanQuery.includes('phone') || cleanQuery.includes('mobile') || cleanQuery.includes('number') || cleanQuery.includes('contact')) && (chunkTextLower.includes('mobile') || chunkTextLower.includes('07') || chunkTextLower.includes('+'))) {
    score += 6.0;
  }
  if ((cleanQuery.includes('college') || cleanQuery.includes('university') || cleanQuery.includes('education') || cleanQuery.includes('degree')) && (chunkTextLower.includes('university') || chunkTextLower.includes('bachelor') || chunkTextLower.includes('education'))) {
    score += 5.0;
  }
  if ((cleanQuery.includes('skill') || cleanQuery.includes('technolog') || cleanQuery.includes('stack')) && (chunkTextLower.includes('technical skills') || chunkTextLower.includes('core stack') || chunkTextLower.includes('frameworks'))) {
    score += 5.0;
  }

  // 3. Token scoring with smoothed BM25-IDF
  for (const term of queryTokens) {
    const rawTf = chunk.tf[term] ? chunk.tf[term] * docLen : 0;
    const inText = chunkTextLower.includes(term);

    if (rawTf === 0 && !inText) continue;

    const effectiveTf = Math.max(rawTf, inText ? 1 : 0);
    const docFreq = df[term] || 1;

    // Smoothed BM25+ IDF: guaranteed positive even when totalDocs is small or term is in all chunks
    const idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5)) + 0.5;

    const termScore =
      idf *
      (effectiveTf * (BM25_K1 + 1)) /
      (effectiveTf + BM25_K1 * (1 - BM25_B + BM25_B * (docLen / (avgDocLen || 1))));

    score += termScore;
  }

  return score;
}

/**
 * Search the knowledge index for the top-k chunks matching the query.
 *
 * @param query Raw user query string
 * @param topK   Number of top results to return (default: 3)
 * @param minScore Minimum score threshold (default: 0.15)
 */
export function searchKnowledgeIndex(
  query: string,
  topK = 3,
  minScore = 0.15
): SearchResult[] {
  const index = loadIndex();
  if (!index || !index.chunks || index.chunks.length === 0) return [];

  const baseTokens = indexTokenize(query);
  const queryTokens = expandQueryTokens(query, baseTokens);
  if (queryTokens.length === 0) return [];

  // Compute average document length
  const avgDocLen =
    index.chunks.reduce((sum, c) => sum + (c.words?.length || 0), 0) / index.chunks.length;

  // Score all chunks
  const scored: { chunk: KnowledgeChunk; score: number }[] = index.chunks
    .map(chunk => ({
      chunk,
      score: scoreChunk(queryTokens, query, chunk, index.df || {}, index.totalDocs || index.chunks.length, avgDocLen),
    }))
    .filter(r => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((r, i) => ({ ...r, rank: i + 1 }));
}

/**
 * Get a human-readable summary of what's in the knowledge index.
 */
export function getIndexStats() {
  const index = loadIndex();
  return {
    totalChunks: index.totalChunks || 0,
    totalSources: index.sources ? index.sources.length : 0,
    lastUpdated: index.lastUpdated,
    sources: index.sources || [],
    hasData: Boolean(index && index.chunks && index.chunks.length > 0),
  };
}

/**
 * Check if the knowledge index has any content.
 */
export function hasKnowledgeIndex(): boolean {
  try {
    const index = loadIndex();
    return Boolean(index && index.chunks && index.chunks.length > 0);
  } catch {
    return false;
  }
}

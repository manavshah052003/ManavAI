/**
 * Vector Search — BM25 Retrieval over Knowledge Index
 *
 * BM25 is the industry-standard keyword-based ranking function used by
 * Elasticsearch, Lucene, and most production search engines. It provides
 * much better results than plain TF-IDF by normalizing for document length.
 *
 * Formula: BM25(q, d) = Σ IDF(qᵢ) * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * |d|/avgDL))
 */

import { loadIndex, indexTokenize, KnowledgeChunk } from './indexBuilder';

const BM25_K1 = 1.5; // Term frequency saturation — higher = more weight to freq
const BM25_B = 0.75; // Length normalization — 0.75 is the standard default

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
  rank: number;
}

/**
 * Compute BM25 score for a single chunk against a query.
 */
function bm25Score(
  queryTokens: string[],
  chunk: KnowledgeChunk,
  df: Record<string, number>,
  totalDocs: number,
  avgDocLen: number
): number {
  let score = 0;
  const docLen = chunk.words.length || 1;

  for (const term of queryTokens) {
    const tf = (chunk.tf[term] || 0) * docLen; // de-normalize TF back to raw freq
    const docFreq = df[term] || 0;

    if (tf === 0) continue;

    // IDF with smoothing to avoid log(0)
    const idf = Math.log((totalDocs - docFreq + 0.5) / (docFreq + 0.5) + 1);
    const termScore =
      idf *
      (tf * (BM25_K1 + 1)) /
      (tf + BM25_K1 * (1 - BM25_B + BM25_B * (docLen / (avgDocLen || 1))));

    score += termScore;
  }

  return score;
}

/**
 * Search the knowledge index for the top-k chunks matching the query.
 *
 * @param query Raw user query string
 * @param topK   Number of top results to return (default: 3)
 * @param minScore Minimum BM25 score threshold to filter noise (default: 0.5)
 */
export function searchKnowledgeIndex(
  query: string,
  topK = 3,
  minScore = 0.5
): SearchResult[] {
  const index = loadIndex();
  if (index.chunks.length === 0) return [];

  const queryTokens = indexTokenize(query);
  if (queryTokens.length === 0) return [];

  // Compute average document length for BM25 normalization
  const avgDocLen =
    index.chunks.reduce((sum, c) => sum + c.words.length, 0) / index.chunks.length;

  // Score all chunks
  const scored: { chunk: KnowledgeChunk; score: number }[] = index.chunks
    .map(chunk => ({
      chunk,
      score: bm25Score(queryTokens, chunk, index.df, index.totalDocs, avgDocLen),
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
    totalChunks: index.totalChunks,
    totalSources: index.sources.length,
    lastUpdated: index.lastUpdated,
    sources: index.sources,
    hasData: index.totalChunks > 0,
  };
}

/**
 * Check if the knowledge index has any content.
 */
export function hasKnowledgeIndex(): boolean {
  const index = loadIndex();
  return index.chunks.length > 0;
}

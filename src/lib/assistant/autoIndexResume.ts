/**
 * Auto-index the resume PDF into the knowledge index on first server startup.
 * This runs once when the module is first loaded (via instrumentation.ts).
 */

import fs from 'fs';
import path from 'path';
import { addDocumentToIndex, loadIndex } from './indexBuilder';
import { initPdfjsWorkerOnce } from './pdfjsWorkerInit';

const RESUME_PATH = path.join(process.cwd(), 'public', 'resume', 'Manav_Shah_Resume.pdf');
const RESUME_FILENAME = 'Manav_Shah_Resume.pdf';

async function extractPdfPages(buffer: Buffer): Promise<{ pageNumber: number; text: string }[]> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    initPdfjsWorkerOnce();

    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      verbosity: 0,
    });

    const pdf = await loadingTask.promise;
    const pages: { pageNumber: number; text: string }[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageText = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const y =
            'transform' in item && Array.isArray(item.transform)
              ? (item.transform as number[])[5]
              : null;
          if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
            pageText += '\n';
          }
          pageText += (item as { str: string }).str;
          lastY = y;
        }
      }

      const trimmedText = pageText.replace(/\s+/g, ' ').trim();
      if (trimmedText.length > 0) {
        pages.push({ pageNumber: pageNum, text: trimmedText });
      }
    }

    return pages;
  } catch (err) {
    console.error('[autoIndexResume] Failed to parse PDF:', err);
    return [];
  }
}

/**
 * Auto-index the resume PDF if it hasn't been indexed yet.
 * This is idempotent — it only runs if the resume isn't already in the index.
 */
export async function autoIndexResumePdf(): Promise<void> {
  try {
    // Check if resume is already indexed
    const index = loadIndex();
    const alreadyIndexed = index.sources.some(s => s.filename === RESUME_FILENAME);
    if (alreadyIndexed) {
      console.log('[autoIndexResume] Resume already indexed. Skipping.');
      return;
    }

    // Check if the resume PDF file exists
    if (!fs.existsSync(RESUME_PATH)) {
      console.log('[autoIndexResume] Resume PDF not found at', RESUME_PATH);
      return;
    }

    console.log('[autoIndexResume] Indexing resume PDF...');
    const buffer = fs.readFileSync(RESUME_PATH);
    const pages = await extractPdfPages(buffer);

    if (pages.length === 0) {
      console.warn('[autoIndexResume] No text extracted from resume PDF.');
      return;
    }

    addDocumentToIndex(RESUME_FILENAME, pages, pages.length);
    console.log(`[autoIndexResume] ✓ Resume indexed: ${pages.length} pages.`);
  } catch (err) {
    console.error('[autoIndexResume] Error:', err);
  }
}

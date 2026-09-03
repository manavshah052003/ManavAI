/**
 * PDF Text Extractor — Uses pdfjs-dist in Node.js (no canvas/DOM needed)
 * Extracts raw text from a PDF Buffer, page by page.
 */

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';

// Disable worker for Node.js server-side usage
GlobalWorkerOptions.workerSrc = '';

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedDocument {
  filename: string;
  totalPages: number;
  pages: ExtractedPage[];
  fullText: string;
}

/**
 * Extract text from a PDF buffer.
 * Returns structured page-by-page content + full concatenated text.
 */
export async function extractPdfText(
  buffer: Buffer | ArrayBuffer,
  filename: string
): Promise<ExtractedDocument> {
  const uint8Array = buffer instanceof Buffer ? new Uint8Array(buffer) : new Uint8Array(buffer);

  const loadingTask = getDocument({
    data: uint8Array,
    verbosity: 0,
  });

  const pdf = await loadingTask.promise;
  const pages: ExtractedPage[] = [];
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Join items — preserve line breaks by checking y-position gaps
    let lastY: number | null = null;
    let pageText = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const y = ('transform' in item && Array.isArray(item.transform)) ? item.transform[5] : null;
        if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
          pageText += '\n';
        }
        pageText += item.str;
        lastY = y;
      }
    }

    const trimmedText = pageText.replace(/\s+/g, ' ').trim();
    pages.push({ pageNumber: pageNum, text: trimmedText });
    fullText += trimmedText + '\n\n';
  }

  return {
    filename,
    totalPages: pdf.numPages,
    pages,
    fullText: fullText.trim()
  };
}

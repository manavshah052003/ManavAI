/**
 * Shared pdfjs initializer for Node.js (server-side API routes).
 * Sets GlobalWorkerOptions.workerSrc to the bundled worker file path.
 * Must be called before any getDocument() call on the server.
 */
import path from 'path';
import { pathToFileURL } from 'url';
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';

let workerInitialized = false;

export function initPdfjsWorkerOnce() {
  if (workerInitialized) return;
  // Resolve the absolute path to the bundled pdfjs worker
  const workerPath = path.join(
    process.cwd(),
    'node_modules',
    'pdfjs-dist',
    'legacy',
    'build',
    'pdf.worker.mjs'
  );
  GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  workerInitialized = true;
}

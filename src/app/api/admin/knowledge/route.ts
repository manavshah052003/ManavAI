import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { addDocumentToIndex, removeDocumentFromIndex, clearIndex, loadIndex } from '@/lib/assistant/indexBuilder';
import { initPdfjsWorkerOnce } from '@/lib/assistant/pdfjsWorkerInit';

export const dynamic = 'force-dynamic';

const SESSION_TOKEN = 'manav-authenticated-admin-session-2026';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === SESSION_TOKEN;
}

async function extractPdfTextServerSide(buffer: Buffer, filename: string) {
  // Init pdfjs worker (safe to call multiple times — idempotent)
  initPdfjsWorkerOnce();

  const uint8Array = new Uint8Array(buffer);
  const loadingTask = getDocument({
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

  return { filename, totalPages: pdf.numPages, pages };
}

// GET — Return index stats
export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const index = loadIndex();
  return NextResponse.json({
    totalChunks: index.totalChunks,
    totalSources: index.sources.length,
    lastUpdated: index.lastUpdated,
    sources: index.sources,
    hasData: index.chunks.length > 0,
  });
}

// POST — Upload & index PDF files
export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const contentType = req.headers.get('content-type') || '';
  
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  if (files.length > 5) {
    return NextResponse.json({ error: 'Maximum 5 files per upload' }, { status: 400 });
  }

  const results: { filename: string; chunks: number; pages: number }[] = [];
  const errors: { filename: string; error: string }[] = [];

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      errors.push({ filename: file.name, error: 'Only PDF files are supported' });
      continue;
    }

    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_SIZE) {
      errors.push({ filename: file.name, error: 'File exceeds 15MB limit' });
      continue;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { filename, totalPages, pages } = await extractPdfTextServerSide(buffer, file.name);
      const updatedIndex = addDocumentToIndex(filename, pages, totalPages);
      const addedSource = updatedIndex.sources.find(s => s.filename === filename);

      results.push({
        filename,
        chunks: addedSource?.chunks || 0,
        pages: totalPages,
      });
    } catch (err) {
      errors.push({
        filename: file.name,
        error: err instanceof Error ? err.message : 'Failed to parse PDF',
      });
    }
  }

  const finalIndex = loadIndex();

  return NextResponse.json({
    success: results.length > 0,
    indexed: results,
    errors,
    indexStats: {
      totalChunks: finalIndex.totalChunks,
      totalSources: finalIndex.sources.length,
      lastUpdated: finalIndex.lastUpdated,
    },
  });
}

// DELETE — Remove a source or clear everything
export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('file');

  if (filename) {
    removeDocumentFromIndex(filename);
    return NextResponse.json({ success: true, message: `Removed "${filename}" from index` });
  } else {
    clearIndex();
    return NextResponse.json({ success: true, message: 'Knowledge index cleared' });
  }
}

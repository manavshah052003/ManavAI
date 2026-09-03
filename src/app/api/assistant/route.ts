import { NextRequest, NextResponse } from 'next/server';
import { queryPortfolioAssistant } from '@/lib/assistant/searchEngine';
import { autoIndexResumePdf } from '@/lib/assistant/autoIndexResume';

export const dynamic = 'force-dynamic';

// Auto-index the resume PDF on first cold start (runs once per process)
let resumeIndexed = false;

export async function POST(req: NextRequest) {
  // Trigger resume auto-indexing on first call (non-blocking)
  if (!resumeIndexed) {
    resumeIndexed = true;
    autoIndexResumePdf().catch(console.error);
  }

  try {
    const body = await req.json();
    const query = body.query || '';
    const result = queryPortfolioAssistant(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      {
        answer: 'An error occurred while querying the local portfolio index.',
        sources: []
      },
      { status: 500 }
    );
  }
}

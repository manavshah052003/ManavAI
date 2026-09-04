import { NextRequest, NextResponse } from 'next/server';
import { queryPortfolioAssistant } from '@/lib/assistant/searchEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const query = body.query || '';
    const result = await queryPortfolioAssistant(query);
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

import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/dataStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    const savedMessage = await addMessage({
      name,
      email,
      company: company || '',
      subject: subject || 'General Inquiry',
      message
    });

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error processing contact message.' },
      { status: 500 }
    );
  }
}

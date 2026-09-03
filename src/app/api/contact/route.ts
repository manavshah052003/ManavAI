import { NextRequest, NextResponse } from 'next/server';
import { addMessage } from '@/lib/dataStore';
import { sendContactEmail } from '@/lib/mailer';

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

    // 1. Persist to internal database (for /admin/messages dashboard)
    const savedMessage = await addMessage({
      name,
      email,
      company: company || '',
      subject: subject || 'General Inquiry',
      message
    });

    // 2. Dispatch live notification email with all filled details
    const emailResult = await sendContactEmail({
      name,
      email,
      company,
      subject,
      message
    });

    if (!emailResult.success && emailResult.provider === 'none') {
      console.warn('Message saved locally, but no email provider is configured. Add RESEND_API_KEY to your environment variables.');
    }

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success,
      provider: emailResult.provider,
      message: savedMessage
    });
  } catch (error) {
    console.error('Error processing contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error processing contact message.' },
      { status: 500 }
    );
  }
}

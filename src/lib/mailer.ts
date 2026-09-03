export interface ContactEmailPayload {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
}

export interface SendEmailResult {
  success: boolean;
  provider?: 'resend' | 'web3forms' | 'none';
  error?: string;
}

/**
 * Sends notification email via Resend or Web3Forms using free tiers.
 * Zero external npm packages required — runs directly on Node/Vercel fetch runtime.
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<SendEmailResult> {
  const { name, email, company, subject, message } = payload;
  const rawRecipient = process.env.CONTACT_RECEIVER_EMAIL || 'manavshah052003@gmail.com';
  const recipientEmail = rawRecipient.toLowerCase().trim();
  const emailSubject = subject?.trim() ? `[Portfolio Inquiry] ${subject} - from ${name}` : `[Portfolio Inquiry] New message from ${name}`;

  // 1. Check for Resend API Key (Recommended free tier: 3,000 emails/mo)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0d1117; color: #e6edf3; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #161b22; border-radius: 12px; border: 1px solid #30363d; overflow: hidden; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; text-align: center; color: #ffffff; }
            .content { padding: 24px; }
            .field-row { margin-bottom: 16px; border-bottom: 1px solid #21262d; padding-bottom: 12px; }
            .label { font-size: 11px; text-transform: uppercase; color: #8b949e; letter-spacing: 0.05em; font-weight: 700; margin-bottom: 4px; }
            .value { font-size: 15px; color: #f0f6fc; font-weight: 500; }
            .value a { color: #818cf8; text-decoration: none; }
            .message-box { background: #0d1117; padding: 16px; border-radius: 8px; border: 1px solid #30363d; margin-top: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #f0f6fc; }
            .footer { padding: 16px 24px; background: #0d1117; text-align: center; font-size: 12px; color: #8b949e; border-top: 1px solid #21262d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; font-size: 20px;">📬 New Portfolio Contact Message</h2>
              <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Submitted via manav-ai.vercel.app</p>
            </div>
            <div class="content">
              <div class="field-row">
                <div class="label">Sender Name</div>
                <div class="value">${escapeHtml(name)}</div>
              </div>
              <div class="field-row">
                <div class="label">Sender Email</div>
                <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
              </div>
              ${company ? `
              <div class="field-row">
                <div class="label">Company / Organization</div>
                <div class="value">${escapeHtml(company)}</div>
              </div>` : ''}
              <div class="field-row">
                <div class="label">Subject</div>
                <div class="value">${escapeHtml(subject || 'General Inquiry')}</div>
              </div>
              <div>
                <div class="label">Message Body</div>
                <div class="message-box">${escapeHtml(message)}</div>
              </div>
            </div>
            <div class="footer">
              Sent to ${recipientEmail} • Reply directly to this email to respond to ${escapeHtml(name)}.
            </div>
          </div>
        </body>
        </html>
      `;

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: [recipientEmail],
          reply_to: email,
          subject: emailSubject,
          html: htmlBody
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Resend API error:', errorData);
        return { success: false, provider: 'resend', error: errorData.message || 'Resend API rejected message' };
      }

      return { success: true, provider: 'resend' };
    } catch (err: any) {
      console.error('Resend fetch failed:', err);
      return { success: false, provider: 'resend', error: err.message };
    }
  }

  // 2. Alternative fallback: Web3Forms Access Key
  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3formsKey) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          name,
          email,
          subject: emailSubject,
          message: `Company: ${company || 'N/A'}\n\nMessage:\n${message}`,
          from_name: `${name} (Portfolio)`
        })
      });

      const data = await res.json();
      if (data.success) {
        return { success: true, provider: 'web3forms' };
      }
      return { success: false, provider: 'web3forms', error: data.message };
    } catch (err: any) {
      console.error('Web3Forms fetch failed:', err);
      return { success: false, provider: 'web3forms', error: err.message };
    }
  }

  // No API keys configured yet
  return {
    success: false,
    provider: 'none',
    error: 'No email service API key configured (RESEND_API_KEY or WEB3FORMS_ACCESS_KEY)'
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

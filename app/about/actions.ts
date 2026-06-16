"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmailAction(data: {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
}): Promise<{ error: string } | void> {
  if (!process.env.RESEND_API_KEY) {
    return { error: "Email service not configured." };
  }

  const { error } = await resend.emails.send({
    from: "Travel With Emma <onboarding@resend.dev>",
    to: "emmamazaraki1@gmail.com",
    replyTo: data.email,
    subject: `[${data.inquiryType}] Μήνυμα από ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Νέο μήνυμα επικοινωνίας</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Όνομα:</strong></td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Είδος:</strong></td>
            <td style="padding: 8px 0;">${data.inquiryType}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
    `,
  });

  if (error) return { error: error.message };
}

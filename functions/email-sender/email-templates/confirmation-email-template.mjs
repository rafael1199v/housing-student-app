import { escapeHtml } from "../utils/escape-html.mjs";

export function buildConfirmationEmailTemplateHtml (firstName, confirmationLink) {
    const safeFirstName = escapeHtml(firstName);
    const safeConfirmationLink = escapeHtml(confirmationLink);
  
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm your email</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
                <tr>
                  <td style="background-color:#1a1a2e;padding:32px;text-align:center;">
                    <p style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.5px;">Itersapiens</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 32px 24px;">
                    <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#111827;">Confirm your email</p>
                    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.7;">
                      Welcome to Itersapiens, ${safeFirstName}! We just need to verify your email address to activate your account.
                      This link will expire in <strong style="color:#111827;">24 hours</strong>.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom:24px;">
                          <a href="${safeConfirmationLink}" style="display:inline-block;background-color:#1a1a2e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
                            Confirm my email
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;line-height:1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin:0 0 24px;font-size:11px;color:#6b7280;word-break:break-all;background-color:#f9fafb;padding:10px 12px;border-radius:6px;font-family:monospace;">
                      ${safeConfirmationLink}
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #f3f4f6;">
                      <tr>
                        <td style="padding-top:20px;">
                          <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                            If you didn't create an account with Itersapiens, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
                    <p style="margin:0;font-size:11px;color:#9ca3af;">Copyright 2026 Itersapiens. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`;
  }
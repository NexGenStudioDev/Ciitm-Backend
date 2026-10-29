/**
 * General / Custom Student Notification Email Template for Ednora
 */
export const generateNotificationEmail = ({
  studentName = 'Student',
  uniqueId = 'N/A',
  title = 'Institutional Announcement',
  message = 'You have received an official notification from Ednora Administration.',
  priority = 'Normal',
  date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  portalUrl = 'https://ednora-web.vercel.app',
}) => {
  const isUrgent = priority?.toLowerCase() === 'urgent' || priority?.toLowerCase() === 'high';
  const badgeColor = isUrgent ? '#EF4444' : '#6366F1';
  const headerGradient = isUrgent
    ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #B91C1C 100%)'
    : 'linear-gradient(135deg, #312E81 0%, #4F46E5 50%, #2563EB 100%)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Ednora</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07080C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0D0F18; border: 1px solid #1E2337; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: ${headerGradient}; padding: 36px 32px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px 16px; background-color: rgba(255, 255, 255, 0.15); border-radius: 50px; backdrop-filter: blur(8px); margin-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #FFFFFF;">
                        🔔 Institutional Dispatch • ${priority}
                      </span>
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.3px;">
                      ${title}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #CBD5E1;">
                Dear <strong style="color: #FFFFFF;">${studentName}</strong> (ID: <span style="font-family: monospace; color: #93C5FD;">${uniqueId}</span>),
              </p>

              <!-- Message Card -->
              <div style="background-color: #131726; border-left: 4px solid ${badgeColor}; border-top: 1px solid #1E2337; border-right: 1px solid #1E2337; border-bottom: 1px solid #1E2337; border-radius: 0 16px 16px 0; padding: 22px 24px; margin: 24px 0;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #F1F5F9; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Metadata -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="font-size: 12px; color: #64748B;">Date of Dispatch: <strong>${date}</strong></td>
                  <td style="font-size: 12px; color: #64748B; text-align: right;">Authority: <strong>Academic Affairs / Registrar</strong></td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4); letter-spacing: 0.3px;">
                      Open Student Portal ➔
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748B; text-align: center;">
                For immediate assistance or concerns regarding this notice, please consult your department academic coordinator.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0C13; border-top: 1px solid #1E2337; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">
                &copy; ${new Date().getFullYear()} Ednora Institutional ERP. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                Ednora — Where Knowledge Finds Its Future.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

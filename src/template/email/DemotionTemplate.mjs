/**
 * Student Academic Term / Demotion Notice Email Template for Ednora
 */
export const generateDemotionEmail = ({
  studentName = 'Student',
  uniqueId = 'N/A',
  courseName = 'Enrolled Program',
  previousSemester = 2,
  currentSemester = 1,
  reason = 'Curriculum & Academic Standing Review',
  date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  portalUrl = 'https://ednora-web.vercel.app',
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academic Status & Term Notice - Ednora</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07080C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0D0F18; border: 1px solid #1E2337; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #B45309 0%, #D97706 50%, #EA580C 100%); padding: 36px 32px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px 16px; background-color: rgba(255, 255, 255, 0.15); border-radius: 50px; backdrop-filter: blur(8px); margin-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #FFFFFF;">
                        ⚠️ Academic Term Notice
                      </span>
                    </div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                      Academic Standing Update
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.95); font-weight: 500;">
                      Enrollment Term Adjustment for Semester ${currentSemester}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #CBD5E1;">
                Dear <strong style="color: #FFFFFF;">${studentName}</strong>,
              </p>
              <p style="margin: 0 0 26px 0; font-size: 15px; line-height: 1.6; color: #94A3B8;">
                This formal notification is to inform you that your academic enrollment term in <strong>${courseName}</strong> has been adjusted to <strong>Semester ${currentSemester}</strong>.
              </p>

              <!-- Term Adjustment Details -->
              <div style="background-color: #131726; border: 1px solid #232B45; border-radius: 16px; padding: 22px; margin-bottom: 28px; text-align: center;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom: 14px;">
                      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">
                        Updated Academic Standing
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding: 10px 18px; background-color: #1E2337; border-radius: 12px; border: 1px solid #2D3748; text-align: center;">
                            <span style="display: block; font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Prior Status</span>
                            <span style="font-size: 16px; font-weight: 700; color: #CBD5E1;">Sem ${previousSemester}</span>
                          </td>
                          <td style="padding: 0 16px; text-align: center;">
                            <span style="font-size: 20px; color: #F59E0B;">➔</span>
                          </td>
                          <td style="padding: 10px 22px; background: rgba(245, 158, 11, 0.15); border-radius: 12px; border: 1px solid #F59E0B; text-align: center;">
                            <span style="display: block; font-size: 11px; color: #FBBF24; text-transform: uppercase; font-weight: 700;">Current Term</span>
                            <span style="font-size: 18px; font-weight: 800; color: #FFFFFF;">Semester ${currentSemester}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Student Academic Record -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #131726; border: 1px solid #1E2337; border-radius: 16px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #64748B;">Student ID:</td>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #FFFFFF; font-weight: 700; font-family: monospace; text-align: right;">${uniqueId}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #64748B;">Reason / Category:</td>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #F59E0B; font-weight: 600; text-align: right;">${reason}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; font-size: 13px; color: #64748B;">Effective Date:</td>
                  <td style="padding: 14px 20px; font-size: 13px; color: #CBD5E1; text-align: right;">${date}</td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94A3B8;">
                Our academic counseling cell is available to assist you in formulating an updated study roadmap and prerequisite course completion schedule.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; background-color: #27272A; border: 1px solid #3F3F46; color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; letter-spacing: 0.3px;">
                      View Academic Record on Portal ➔
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0C13; border-top: 1px solid #1E2337; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
                &copy; ${new Date().getFullYear()} Ednora Institutional ERP. All rights reserved.
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

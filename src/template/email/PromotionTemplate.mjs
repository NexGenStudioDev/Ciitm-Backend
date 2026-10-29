/**
 * Student Promotion Email Template for Ednora Academic Platform
 */
export const generatePromotionEmail = ({
  studentName = 'Student',
  uniqueId = 'N/A',
  courseName = 'Enrolled Program',
  previousSemester = 1,
  currentSemester = 2,
  date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  portalUrl = 'https://ednora-web.vercel.app',
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Congratulations on Your Academic Promotion - Ednora</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07080C; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #0D0F18; border: 1px solid #1E2337; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4338CA 0%, #3B82F6 50%, #06B6D4 100%); padding: 36px 32px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; padding: 6px 16px; background-color: rgba(255, 255, 255, 0.15); border-radius: 50px; backdrop-filter: blur(8px); margin-bottom: 12px;">
                      <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #FFFFFF;">
                        🎓 Academic Advancement Notice
                      </span>
                    </div>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                      Congratulations, ${studentName}!
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
                      You have officially been promoted to Semester ${currentSemester}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              
              <!-- Greeting & Announcement -->
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #CBD5E1;">
                Dear <strong style="color: #FFFFFF;">${studentName}</strong>,
              </p>
              <p style="margin: 0 0 26px 0; font-size: 15px; line-height: 1.6; color: #94A3B8;">
                We are delighted to confirm that following the review of your academic performance and enrollment milestones, you have successfully advanced to the next semester of your program at <strong>Ednora</strong>.
              </p>

              <!-- Milestone Progression Badge Card -->
              <div style="background-color: #131726; border: 1px solid #232B45; border-radius: 16px; padding: 24px; margin-bottom: 28px; text-align: center;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom: 16px;">
                      <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600;">
                        Academic Progression Pathway
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                        <tr>
                          <!-- Old Semester -->
                          <td style="padding: 10px 18px; background-color: #1E2337; border-radius: 12px; border: 1px solid #2D3748; text-align: center;">
                            <span style="display: block; font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Previous</span>
                            <span style="font-size: 16px; font-weight: 700; color: #CBD5E1;">Sem ${previousSemester}</span>
                          </td>
                          <!-- Arrow -->
                          <td style="padding: 0 16px; text-align: center;">
                            <span style="font-size: 22px; color: #10B981;">➔</span>
                          </td>
                          <!-- New Semester -->
                          <td style="padding: 10px 22px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%); border-radius: 12px; border: 1px solid #10B981; text-align: center;">
                            <span style="display: block; font-size: 11px; color: #34D399; text-transform: uppercase; font-weight: 700;">Promoted To</span>
                            <span style="font-size: 20px; font-weight: 800; color: #FFFFFF;">Semester ${currentSemester} 🎓</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Student Academic Record Summary Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #131726; border: 1px solid #1E2337; border-radius: 16px; margin-bottom: 28px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #64748B; font-weight: 500;">Student Unique ID:</td>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #FFFFFF; font-weight: 700; font-family: monospace; text-align: right;">${uniqueId}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #64748B; font-weight: 500;">Enrolled Program:</td>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #FFFFFF; font-weight: 600; text-align: right;">${courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #64748B; font-weight: 500;">Effective Date:</td>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #1E2337; font-size: 13px; color: #CBD5E1; font-weight: 500; text-align: right;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 20px; font-size: 13px; color: #64748B; font-weight: 500;">Academic Status:</td>
                  <td style="padding: 14px 20px; font-size: 13px; color: #10B981; font-weight: 700; text-align: right;">Active • Good Standing</td>
                </tr>
              </table>

              <!-- Action Steps -->
              <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #E2E8F0;">
                Next Steps for Semester ${currentSemester}:
              </h3>
              <ul style="margin: 0 0 32px 0; padding-left: 20px; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Access your updated curriculum, syllabus modules, and course materials.</li>
                <li style="margin-bottom: 8px;">Verify your enrolled lecture timetable and assigned faculty advisors.</li>
                <li>Check your tuition installment ledger to ensure your fee clearance status remains current.</li>
              </ul>

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

              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748B; text-align: center;">
                If you have questions regarding your academic progression, please contact the Office of the Registrar at <a href="mailto:academic@ednora.edu" style="color: #60A5FA; text-decoration: none;">academic@ednora.edu</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0A0C13; border-top: 1px solid #1E2337; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #475569;">
                &copy; ${new Date().getFullYear()} Ednora Institutional ERP. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                This is an automated academic dispatch. Please do not reply directly to this email.
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

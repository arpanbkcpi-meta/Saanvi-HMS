const appointmentBookedTemplate = (patientName, doctorName, date, reason) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color: white; margin: 0;">🏥 Saanvi HMS</h2>
    </div>
    <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
      <h3 style="color: #0f172a;">Appointment Request Received</h3>
      <p>Hi ${patientName},</p>
      <p>Your appointment request has been submitted successfully and is now <strong style="color: #ca8a04;">pending approval</strong>.</p>
      <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #64748b;">Doctor:</td><td style="padding: 8px 0; font-weight: 600;">Dr. ${doctorName}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Date:</td><td style="padding: 8px 0; font-weight: 600;">${new Date(date).toLocaleDateString()}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Reason:</td><td style="padding: 8px 0; font-weight: 600;">${reason}</td></tr>
      </table>
      <p>We'll notify you as soon as the doctor responds.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This is an automated message from Saanvi HMS. Please do not reply.</p>
    </div>
  </div>
`;

const appointmentStatusTemplate = (patientName, doctorName, date, status) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, ${status === 'approved' ? '#10b981, #059669' : '#ef4444, #dc2626'}); padding: 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color: white; margin: 0;">🏥 Saanvi HMS</h2>
    </div>
    <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
      <h3 style="color: #0f172a;">
        Appointment ${status === 'approved' ? '✅ Approved' : '❌ Rejected'}
      </h3>
      <p>Hi ${patientName},</p>
      <p>Your appointment with <strong>Dr. ${doctorName}</strong> on <strong>${new Date(date).toLocaleDateString()}</strong> has been 
        <strong style="color: ${status === 'approved' ? '#16a34a' : '#dc2626'};">${status}</strong>.
      </p>
      ${status === 'approved'
        ? `<p>Please arrive 10 minutes early. You can view full details anytime on your patient dashboard.</p>`
        : `<p>You're welcome to book a new appointment with another available time or doctor.</p>`
      }
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This is an automated message from Saanvi HMS. Please do not reply.</p>
    </div>
  </div>
`;

const prescriptionTemplate = (patientName, doctorName, medicines) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color: white; margin: 0;">🏥 Saanvi HMS</h2>
    </div>
    <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
      <h3 style="color: #0f172a;">💊 New Prescription</h3>
      <p>Hi ${patientName},</p>
      <p><strong>Dr. ${doctorName}</strong> has prescribed the following medicines for you:</p>
      <ul style="line-height: 1.8;">
        ${medicines.map(m => `<li><strong>${m.name}</strong> — ${m.dosage}, ${m.frequency}, for ${m.duration}</li>`).join('')}
      </ul>
      <p>Full details are available on your patient dashboard.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This is an automated message from Saanvi HMS. Please do not reply.</p>
    </div>
  </div>
`;

const labReportTemplate = (patientName, doctorName, testName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); padding: 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color: white; margin: 0;">🏥 Saanvi HMS</h2>
    </div>
    <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
      <h3 style="color: #0f172a;">🔬 New Lab Report Available</h3>
      <p>Hi ${patientName},</p>
      <p><strong>Dr. ${doctorName}</strong> has uploaded a new lab report: <strong>${testName}</strong>.</p>
      <p>Log in to your patient dashboard to view and download it.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This is an automated message from Saanvi HMS. Please do not reply.</p>
    </div>
  </div>
`;

const resetPasswordTemplate = (name, resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 24px; border-radius: 12px 12px 0 0;">
      <h2 style="color: white; margin: 0;">🏥 Saanvi HMS</h2>
    </div>
    <div style="padding: 24px; background: #f8fafc; border-radius: 0 0 12px 12px;">
      <h3 style="color: #0f172a;">🔒 Password Reset Request</h3>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to set a new one:</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
          Reset My Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">This link will expire in <strong>30 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">This is an automated message from Saanvi HMS. Please do not reply.</p>
    </div>
  </div>
`;

module.exports = {
  appointmentBookedTemplate,
  appointmentStatusTemplate,
  prescriptionTemplate,
  resetPasswordTemplate,
  labReportTemplate
};
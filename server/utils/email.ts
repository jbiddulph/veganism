// Create Mailtrap transporter
let transporter: any = null

async function getTransporter() {
  if (!transporter) {
    const nodemailer = await import('nodemailer')
    transporter = nodemailer.default.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/verify-email?token=${token}`
  
  // Fallback to mock email if Mailtrap credentials not configured
  if (!process.env.MAILTRAP_USERNAME || !process.env.MAILTRAP_PASSWORD) {
    console.log(`[MOCK EMAIL] Send verification email to ${email}: ${verificationUrl}`)
    return { success: true }
  }
  
  try {
    const mailTransporter = await getTransporter()
    await mailTransporter.sendMail({
      from: '"Vegan App" <noreply@veganapp.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to Vegan App!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    })
    
    console.log(`✅ Verification email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    return { success: false, error: error.message }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  
  // Fallback to mock email if Mailtrap credentials not configured
  if (!process.env.MAILTRAP_USERNAME || !process.env.MAILTRAP_PASSWORD) {
    console.log(`[MOCK EMAIL] Send password reset email to ${email}: ${resetUrl}`)
    return { success: true }
  }
  
  try {
    const mailTransporter = await getTransporter()
    await mailTransporter.sendMail({
      from: '"Vegan App" <noreply@veganapp.com>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })
    
    console.log(`✅ Password reset email sent to ${email}`)
    return { success: true }
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error)
    return { success: false, error: error.message }
  }
}

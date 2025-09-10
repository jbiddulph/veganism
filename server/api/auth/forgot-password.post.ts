import { prisma } from '../../utils/prisma'
import { createSessionToken } from '../../utils/auth'
import { sendPasswordResetEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  const user = await prisma.veganUser.findUnique({ where: { email } })
  if (!user) {
    // Don't reveal if user exists for security
    return { success: true, message: 'If the email exists, a reset link has been sent' }
  }

  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.veganVerificationToken.create({
    data: {
      userId: user.id,
      token,
      type: 'reset_password',
      expiresAt
    }
  })

  await sendPasswordResetEmail(email, token)

  return { success: true, message: 'If the email exists, a reset link has been sent' }
})

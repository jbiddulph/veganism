import { prisma } from '../../utils/prisma'
import { createSessionToken } from '../../utils/auth'
import { sendVerificationEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  const user = await prisma.veganUser.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await prisma.veganVerificationToken.create({
    data: {
      userId: user.id,
      token,
      type: 'verify_email',
      expiresAt
    }
  })

  await sendVerificationEmail(email, token)

  return { success: true, message: 'Verification email sent' }
})

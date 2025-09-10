import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string }>(event)
  const token = body.token
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token is required' })
  }

  const verificationToken = await prisma.veganVerificationToken.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!verificationToken) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid token' })
  }

  if (verificationToken.type !== 'verify_email') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid token type' })
  }

  if (verificationToken.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Token expired' })
  }

  if (verificationToken.usedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Token already used' })
  }

  // Mark token as used and verify user email
  await prisma.$transaction([
    prisma.veganVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.veganUser.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true }
    })
  ])

  return { success: true, message: 'Email verified successfully' }
})

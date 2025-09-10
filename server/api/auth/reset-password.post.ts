import { prisma } from '../../utils/prisma'
import { hashPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; password?: string }>(event)
  const { token, password } = body
  if (!token || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Token and password are required' })
  }

  const verificationToken = await prisma.veganVerificationToken.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!verificationToken) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid token' })
  }

  if (verificationToken.type !== 'reset_password') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid token type' })
  }

  if (verificationToken.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Token expired' })
  }

  if (verificationToken.usedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Token already used' })
  }

  const passwordHash = await hashPassword(password)

  // Update user password and mark token as used
  await prisma.$transaction([
    prisma.veganUser.update({
      where: { id: verificationToken.userId },
      data: { passwordHash }
    }),
    prisma.veganVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() }
    })
  ])

  return { success: true, message: 'Password reset successfully' }
})

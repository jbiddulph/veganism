import { prisma } from '../../utils/prisma'
import { hashPassword, createSessionToken } from '../../utils/auth'
import { sendVerificationEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  const password = body.password
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const existing = await prisma.veganUser.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const passwordHash = await hashPassword(password)
  const user = await prisma.veganUser.create({ data: { email, passwordHash, emailVerified: false } })

  // Send verification email
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

  return { 
    id: user.id, 
    email: user.email,
    message: 'Registration successful! Please check your email to verify your account before logging in.'
  }
})



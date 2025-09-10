import { prisma } from '../../utils/prisma'
import { verifyPassword, createSession, SESSION_COOKIE } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.toLowerCase().trim()
  const password = body.password
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const user = await prisma.veganUser.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  if (!user.emailVerified) {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Please verify your email before logging in. Check your inbox for a verification link.' 
    })
  }

  const session = await createSession(user.id)
  
  // Set session cookie
  setCookie(event, SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })

  return { 
    id: user.id, 
    email: user.email, 
    emailVerified: user.emailVerified,
    sessionToken: session.token // Include token in response for localStorage backup
  }
})



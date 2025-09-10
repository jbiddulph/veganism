import { prisma } from '../../utils/prisma'
import { getUserBySessionToken, SESSION_COOKIE } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  
  const user = await getUserBySessionToken(token)
  
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
  
  return { id: user.id, email: user.email, emailVerified: user.emailVerified }
})



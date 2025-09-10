import { getUserBySessionToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token: string }>(event)
  const { token } = body
  
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token is required' })
  }
  
  const user = await getUserBySessionToken(token)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired session token' })
  }
  
  return { id: user.id, email: user.email, emailVerified: user.emailVerified }
})

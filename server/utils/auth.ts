import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { prisma } from './prisma'

const SESSION_COOKIE = 'vegan_session'
const SESSION_TTL_DAYS = 30

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function createSession(userId: string) {
  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  const session = await prisma.veganSession.create({
    data: { token, userId, expiresAt }
  })
  return session
}

export async function getUserBySessionToken(token: string) {
  if (!token) return null
  const session = await prisma.veganSession.findUnique({ where: { token }, include: { user: true } })
  if (!session) return null
  if (session.expiresAt < new Date()) return null
  return session.user
}

export async function destroySession(token: string) {
  if (!token) return
  await prisma.veganSession.deleteMany({ where: { token } })
}

export { SESSION_COOKIE }



import { auth } from './auth'

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }
  return session.user
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id || null
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session.user
}

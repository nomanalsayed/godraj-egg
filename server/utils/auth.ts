import { H3Event } from 'h3'
import type { User } from '~/types'

export async function checkRole(event: H3Event, allowedRoles: string[]) {
  const user = event.context.user as User | undefined
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication required'
    })
  }

  if (!user.roles?.some((role: string) => allowedRoles.includes(role))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Insufficient permissions'
    })
  }
}

export function hasRole(user: User | undefined, role: string): boolean {
  return user?.roles?.includes(role) || false
}

import type { User } from '~/types'

export const useAuthUser = () => {
  // Mock user for development - remove in production
  return useState<User | null>('authUser', () => ({
    id: 'admin-001',
    name: 'Admin User',
    roles: ['Admin'],
    email: 'admin@example.com'
  }))
}

export const useAuth = () => {
  const user = useAuthUser()

  const hasRole = (role: string) => user.value?.roles?.includes(role) || false
  
  return {
    user,
    hasRole,
    login: () => {
      user.value = {
        id: 'admin-001',
        name: 'Admin User',
        roles: ['Admin'],
        email: 'admin@example.com'
      }
    },
    logout: () => { user.value = null }
  }
}

export type { User }

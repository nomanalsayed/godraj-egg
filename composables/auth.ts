interface User {
  id: string
  name: string
  roles: string[]
  email: string
}

export const useAuthUser = () => {
  // Mock user for development - remove in production
  return useState('authUser', () => ({
    id: 'admin-001',
    name: 'Admin User',
    roles: ['Admin'],
    email: 'admin@example.com'
  }))
}

export const useAuth = () => {
  const user = useAuthUser()
  
  return {
    user,
    login: () => user.value = {
      id: 'admin-001',
      name: 'Admin User', 
      roles: ['Admin'],
      email: 'admin@example.com'
    },
    logout: () => { user.value = null }
  }
}

export type { User }

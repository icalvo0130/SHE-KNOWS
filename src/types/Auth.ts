import type { User } from 'firebase/auth'
import type { UserProfile } from './Post'

// Estado y acciones disponibles en el contexto de autenticacion
export interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
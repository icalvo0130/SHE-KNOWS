import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

// Si no hay usuario autenticado, redirige al login
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext)

  // Mientras se verifica la sesion no renderizamos nada
  if (auth?.loading) return null

  if (!auth?.user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default ProtectedRoute
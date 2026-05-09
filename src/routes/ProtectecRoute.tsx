import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

type ProtectedRouteProps = {
  children: React.ReactNode
}

// Si no hay usuario autenticado, redirige al login
// Componente que protege rutas requiriendo autenticacion
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext)

  // Mientras se verifica si hay sesion activa, no muestra nada
  if (auth?.loading) return null

  // Si no hay usuario autenticado, redirige al login
  if (!auth?.user) {
    return <Navigate to="/login" />
  }

  // Si hay usuario, muestra el contenido protegido
  return <>{children}</>
}

export default ProtectedRoute
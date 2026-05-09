import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { isInstitutionalEmail } from '../../types/Helpers'
import logoImg from '../../assets/logo.png'
import './Login.css'

export const Login = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Maneja el login de la usuaria
  const handleLogin = async () => {
    // Limpia el error anterior
    setAuthError('')

    // Valida que el email sea institucional antes de enviar a Firebase
    // De esta manera ahorra llamadas innecesarias a la API
    if (!isInstitutionalEmail(email)) {
      setEmailError('Use your institutional email (.edu.co)')
      return
    }

    // Limpia el error de email si paso la validacion
    setEmailError('')
    // Marca que se esta procesando el login
    setSubmitting(true)

    try {
      // Intenta autenticar a la usuaria
      await auth?.login(email, password)
      // Si es exitoso, redirige al feed
      navigate('/girl-talk')
    } catch (err: unknown) {
      // Extrae el codigo de error de Firebase
      const code = (err as { code?: string }).code
      // Muestra un mensaje de error segun el codigo
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setAuthError('Incorrect email or password.')
      } else if (code === 'auth/user-not-found') {
        setAuthError('No account found with this email.')
      } else {
        setAuthError('Something went wrong. Try again.')
      }
    } finally {
      // Siempre marca que termino el procesamiento
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        {/* Logo de la app */}
        <img src={logoImg} alt="She Knows logo" className="login__logo" />

        <h1 className="login__title">Log In</h1>
        <p className="login__subtitle">Where women speak freely</p>

        {/* Campos de acceso */}
        <div className="login__fields">
          <div className="login__field-wrap">
            <input
              className={`login__input ${emailError ? 'login__input--error' : ''}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
            />
            {emailError && <p className="login__field-error">{emailError}</p>}
          </div>

          <input
            className="login__input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error general de Firebase */}
        {authError && <p className="login__field-error">{authError}</p>}

        <button className="login__btn" onClick={handleLogin} disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </button>

        {/* Enlace para ir a registro */}
        <p className="login__footer">
          Don&apos;t have an account?{' '}
          <button className="login__link" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
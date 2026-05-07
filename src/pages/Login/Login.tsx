import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.png'
import './Login.css'

// Dominios institucionales permitidos
const ALLOWED_DOMAINS = ['uninorte.edu.co', 'icesi.edu.co', 'javerianacali.edu.co']

const isInstitutionalEmail = (email: string): boolean => {
  const domain = email.split('@')[1]
  return ALLOWED_DOMAINS.includes(domain)
}

export const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')

  // Valida el dominio del correo antes de intentar ingresar
  const handleLogin = () => {
    if (!isInstitutionalEmail(email)) {
      setEmailError('Use your institutional email (.edu.co)')
      return
    }
    setEmailError('')
    // Aqui se conectara Firebase en la rama feature/auth
    navigate('/girl-talk')
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

        <button className="login__btn" onClick={handleLogin}>
          Log In
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
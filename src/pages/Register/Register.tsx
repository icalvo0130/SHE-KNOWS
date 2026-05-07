import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.png'
import './Register.css'

// Dominios institucionales permitidos
const ALLOWED_DOMAINS = ['uninorte.edu.co', 'icesi.edu.co', 'javerianacali.edu.co']

const isInstitutionalEmail = (email: string): boolean => {
  const domain = email.split('@')[1]
  return ALLOWED_DOMAINS.includes(domain)
}

export const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')

  // Valida el dominio del correo antes de continuar
  const handleSignUp = () => {
    if (!isInstitutionalEmail(email)) {
      setEmailError('Use your institutional (.edu.co) email')
      return
    }
    setEmailError('')
    // Aqui se conectara Firebase en la rama feature/auth
    navigate('/girl-talk')
  }

  return (
    <div className="register">
      <div className="register__card">
        {/* Logo de la app */}
        <img src={logoImg} alt="She Knows logo" className="register__logo" />

        <h1 className="register__title">Sign up</h1>
        <p className="register__subtitle">Verified women. Real stories.</p>

        {/* Campos de registro */}
        <div className="register__fields">
          <div className="register__field-wrap">
            <input
              className={`register__input ${emailError ? 'register__input--error' : ''}`}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
            />
            <p className="register__hint">Use your institutional (.edu.co) email</p>
            {emailError && <p className="register__field-error">{emailError}</p>}
          </div>

          <input
            className="register__input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="register__btn" onClick={handleSignUp}>
          Sign Up
        </button>

        {/* Enlace para ir a login */}
        <p className="register__footer">
          Already have an account?{' '}
          <button className="register__link" onClick={() => navigate('/login')}>
            Log In
          </button>
        </p>
      </div>
    </div>
  )
}
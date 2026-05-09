import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { isInstitutionalEmail } from '../../types/Helpers'
import logoImg from '../../assets/logo.png'
import './Register.css'

export const Register = () => {
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [authError, setAuthError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSignUp = async () => {
    setAuthError('')

    // Solo se permite continuar con correo institucional
    if (!isInstitutionalEmail(email)) {
      setEmailError('Use your institutional (.edu.co) email')
      return
    }

    setEmailError('')
    setSubmitting(true)

    try {
      await auth?.register(email, password)
      navigate('/girl-talk')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered.')
      } else if (code === 'auth/weak-password') {
        setAuthError('Password must be at least 6 characters.')
      } else {
        setAuthError('Something went wrong. Try again.')
      }
    } finally {
      setSubmitting(false)
    }
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

        {/* Error general de Firebase */}
        {authError && <p className="register__field-error">{authError}</p>}

        <button className="register__btn" onClick={handleSignUp} disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign Up'}
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
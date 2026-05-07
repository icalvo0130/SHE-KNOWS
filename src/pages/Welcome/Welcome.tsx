import { useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.png'
import './Welcome.css'

export const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="welcome">
      <div className="welcome__card">
        {/* Logo de la app */}
        <img src={logoImg} alt="She Knows logo" className="welcome__logo" />

        <h1 className="welcome__title">Welcome!</h1>
        <p className="welcome__subtitle">Where women speak freely</p>

        {/* Opciones de acceso */}
        <div className="welcome__actions">
          <button className="welcome__btn" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="welcome__btn" onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
import logoImg from '../../assets/logo.png'
import './Header.css'

export const Header = () => {
  return (
    <header className="header">
      {/* Logo principal de la app */}
      <a href="/girl-talk" className="header__logo">
        <img src={logoImg} alt="SheKnows logo" className="header__logo-img" />
        <span className="header__logo-text">She Knows</span>
      </a>
    </header>
  )
}
import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo.png'
import './Header.css'

export const Header = () => {
  return (
    <header className="header">
      <Link to="/girl-talk" className="header__logo">
        <img src={logoImg} alt="SheKnows logo" className="header__logo-img" />
        <span className="header__logo-text">She Knows</span>
      </Link>
    </header>
  )
}
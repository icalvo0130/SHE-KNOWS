import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './NavBar.css'

/* ---- SVG Icons ---- */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const DevilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <path d="M8 7.5C8 6 9 4.5 7 3" />
    <path d="M16 7.5C16 6 15 4.5 17 3" />
    <path d="M9.5 15.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1" />
    <path d="M10 11.5v.5" />
    <path d="M14 11.5v.5" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const LipstickIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="5" rx="1" />
    <path d="M9 7l-2 4h10l-2-4" />
    <rect x="7" y="11" width="10" height="10" rx="1" />
    <line x1="12" y1="11" x2="12" y2="21" />
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

export const NavBar = () => {
  const [popupOpen, setPopupOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const togglePopup = () => setPopupOpen((prev) => !prev)
  const closePopup = () => setPopupOpen(false)

  return (
    <>
      {/* Overlay to close popup when clicking outside */}
      {popupOpen && <div className="navbar__overlay" onClick={closePopup} />}

      <nav className="navbar">
        {/* Home — Girl Talk */}
        <Link
          to="/girl-talk"
          className={`navbar__item ${isActive('/girl-talk') ? 'active' : ''}`}
          onClick={closePopup}
        >
          <HomeIcon />
          <span className="navbar__item-label">Girl Talk</span>
        </Link>

        {/* Men Reviews */}
        <Link
          to="/men-review"
          className={`navbar__item ${isActive('/men-review') ? 'active' : ''}`}
          onClick={closePopup}
        >
          <DevilIcon />
          <span className="navbar__item-label">Men Reviews</span>
        </Link>

        {/* Center: Add post button */}
        <div className="navbar__add">
          <button className="navbar__add-btn" onClick={togglePopup} aria-label="Crear post">
            <PlusIcon />
            <span className="navbar__item-label">Speak Up</span>
          </button>

          {/* Popup menu */}
          {popupOpen && (
            <div className="navbar__popup">
              <button className="navbar__popup-item" onClick={closePopup}>
                <ChatIcon />
                Girl Talk
              </button>
              <button className="navbar__popup-item" onClick={closePopup}>
                <DevilIcon />
                Rate a Profile
              </button>
              <button className="navbar__popup-item" onClick={closePopup}>
                <StarIcon />
                Review a Product
              </button>
            </div>
          )}
        </div>

        {/* Products We Trust */}
        <Link
          to="/products"
          className={`navbar__item ${isActive('/products') ? 'active' : ''}`}
          onClick={closePopup}
        >
          <LipstickIcon />
          <span className="navbar__item-label">Beauty</span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className={`navbar__item ${isActive('/profile') ? 'active' : ''}`}
          onClick={closePopup}
        >
          <ProfileIcon />
          <span className="navbar__item-label">Profile</span>
        </Link>
      </nav>
    </>
  )
}
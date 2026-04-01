import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GirlTalkForm } from '../PostForms/GirlTalkForm/GirlTalkForm'
import { RateGuyForm } from '../PostForms/RateGuyForm/RateGuyForm'
import { ReviewProductForm } from '../PostForms/Reviewproductform/Reviewproductform'
import '../Popup/Popup.css'
import './NavBar.css'

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

const FlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

type ActivePopup = 'girl-talk' | 'rate-guy' | 'review-product' | null

export const NavBar = () => {
  const [popupOpen, setPopupOpen] = useState(false)
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  const location = useLocation()
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside of it
  useEffect(() => {
    if (!popupOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [popupOpen])

  const isActive = (path: string) => location.pathname === path

  const openPopup = (type: ActivePopup) => {
    setPopupOpen(false)
    setActivePopup(type)
  }

  const closePopup = () => setActivePopup(null)

  const handleGirlTalkPost = (text: string) => {
    const addPost = (window as unknown as Record<string, unknown>).__addGirlTalkPost as ((t: string) => void) | undefined
    if (addPost) addPost(text)
    closePopup()
  }

  return (
    <>
      <nav className="navbar">
        <Link
          to="/girl-talk"
          className={`navbar__item ${isActive('/girl-talk') || isActive('/') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <HomeIcon />
          <span className="navbar__item-label">Girl Talk</span>
        </Link>

        <Link
          to="/men-review"
          className={`navbar__item ${isActive('/men-review') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <DevilIcon />
          <span className="navbar__item-label">Men Reviews</span>
        </Link>

        {/* Center add button — ref wraps button + popup together */}
        <div className="navbar__add" ref={popupRef}>
          <button
            className="navbar__add-btn"
            onClick={() => setPopupOpen((prev) => !prev)}
            aria-label="Crear post"
          >
            <PlusIcon />
            <span className="navbar__item-label">Speak Up</span>
          </button>

          {popupOpen && (
            <div className="navbar__popup">
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('girl-talk') }}
              >
                <ChatIcon />
                Girl Talk
              </button>
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('rate-guy') }}
              >
                <FlagIcon />
                Rate a Profile
              </button>
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('review-product') }}
              >
                <StarIcon />
                Review a Product
              </button>
            </div>
          )}
        </div>

        <Link
          to="/products"
          className={`navbar__item ${isActive('/products') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <LipstickIcon />
          <span className="navbar__item-label">Beauty</span>
        </Link>

        <Link
          to="/profile"
          className={`navbar__item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <ProfileIcon />
          <span className="navbar__item-label">Profile</span>
        </Link>
      </nav>

      {/* Popups — rendered outside nav so z-index is clean */}
      {activePopup === 'girl-talk' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <GirlTalkForm onClose={closePopup} onPost={handleGirlTalkPost} />
          </div>
        </div>
      )}

      {activePopup === 'rate-guy' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <RateGuyForm onClose={closePopup} />
          </div>
        </div>
      )}

      {activePopup === 'review-product' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <ReviewProductForm onClose={closePopup} />
          </div>
        </div>
      )}
    </>
  )
}
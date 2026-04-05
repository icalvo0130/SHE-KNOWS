import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Flag, Plus, ShoppingBag, User, MessageSquare, Star } from 'lucide-react'
import { GirlTalkForm } from '../PostForms/GirlTalkForm/GirlTalkForm'
import { RateGuyForm } from '../PostForms/RateGuyForm/RateGuyForm'
import { ReviewProductForm } from '../PostForms/Reviewproductform/Reviewproductform'
import '../Popup/Popup.css'
import './NavBar.css'

type ActivePopup = 'girl-talk' | 'rate-guy' | 'review-product' | null

export const NavBar = () => {
  const [popupOpen, setPopupOpen] = useState(false)
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  const location = useLocation()
  const popupRef = useRef<HTMLDivElement>(null)

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
          <Home size={24} />
          <span className="navbar__item-label">Girl Talk</span>
        </Link>

        <Link
          to="/men-review"
          className={`navbar__item ${isActive('/men-review') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <Flag size={24} />
          <span className="navbar__item-label">Men Reviews</span>
        </Link>

        <div className="navbar__add" ref={popupRef}>
          <button
            className="navbar__add-btn"
            onClick={() => setPopupOpen((prev) => !prev)}
            aria-label="Crear post"
          >
            <Plus size={22} />
            <span className="navbar__item-label">Speak Up</span>
          </button>

          {popupOpen && (
            <div className="navbar__popup">
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('girl-talk') }}
              >
                <MessageSquare size={20} />
                Girl Talk
              </button>
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('rate-guy') }}
              >
                <Flag size={20} />
                Rate a Profile
              </button>
              <button
                className="navbar__popup-item"
                onMouseDown={(e) => { e.stopPropagation(); openPopup('review-product') }}
              >
                <Star size={20} />
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
          <ShoppingBag size={24} />
          <span className="navbar__item-label">Beauty</span>
        </Link>

        <Link
          to="/profile"
          className={`navbar__item ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => setPopupOpen(false)}
        >
          <User size={24} />
          <span className="navbar__item-label">Profile</span>
        </Link>
      </nav>

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
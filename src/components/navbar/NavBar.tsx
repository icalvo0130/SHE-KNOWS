import { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Home, Flag, Plus, ShoppingBag, User, MessageSquare, Star } from 'lucide-react'
import { GirlTalkForm } from '../PostForms/GirlTalkForm/GirlTalkForm'
import { RateGuyForm } from '../PostForms/RateGuyForm/RateGuyForm'
import { ReviewProductForm } from '../PostForms/Reviewproductform/Reviewproductform'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { ProductsContext } from '../../context/Productscontext'
import '../Popup/Popup.css'
import './NavBar.css'

// Tipo para controlar cual popup esta activo
type ActivePopup = 'girl-talk' | 'rate-guy' | 'review-product' | null

export const NavBar = () => {
  // Estado para controlar si el menu desplegable esta abierto
  const [popupOpen, setPopupOpen] = useState(false)
  // Estado para saber cual formulario debe mostrarse
  const [activePopup, setActivePopup] = useState<ActivePopup>(null)
  // Hook para obtener la ruta actual
  const location = useLocation()
  // Referencia al elemento del popup para detectar clicks fuera
  const popupRef = useRef<HTMLDivElement>(null)

  // Obtenemos las funciones para agregar posts de cada contexto
  const { addPost: addGirlTalkPost } = useContext(GirlTalkContext)!
  const { addPost: addMenReviewPost } = useContext(MenReviewContext)!
  const { addPost: addProductPost } = useContext(ProductsContext)!

  // Cierra el menu si se toca fuera de el
  useEffect(() => {
    // Si el popup no esta abierto, no hace falta ejecutar el resto
    if (!popupOpen) return
    // Crea una funcion que se ejecutara cuando el usuario haga click
    const handleClickOutside = (e: MouseEvent) => {
      // Verifica si el click fue dentro del elemento popupRef o fuera
      // Si fue fuera, cierra el popup
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupOpen(false)
      }
    }
    // Agrega el listener para detectar clicks en todo el documento
    document.addEventListener('mousedown', handleClickOutside)
    // Limpia el listener cuando el componente se desmonta o cuando popupOpen cambia
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [popupOpen])

  // Verifica si la ruta actual coincide con la ruta pasada como parametro
  // Esto se usa para marcar el menu como activo
  const isActive = (path: string) => location.pathname === path

  // Abre el formulario del tipo de post elegido
  // Cierra el menu desplegable y abre el popup correspondiente
  const openPopup = (type: ActivePopup) => {
    setPopupOpen(false)
    setActivePopup(type)
  }

  // Cierra el popup de formulario actual
  const closePopup = () => setActivePopup(null)

  return (
    <>
      {/* Barra de navegacion principal */}
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

        <div className="navbar__add" ref={popupRef}>
          <button
            className="navbar__add-btn-red"
            // Alterna entre abrir y cerrar el menu desplegable de opciones
            onClick={() => setPopupOpen((prev) => !prev)}
            aria-label="Crear post"
          >
            <Plus size={20} className="navbar__add-icon" />
            <span className="navbar__item-label">Speak Up</span>
          </button>

          {popupOpen && (
            <div className="navbar__popup">
              <button
                className="navbar__popup-item"
                // Detiene la propagacion del evento para que no cierre el popup
                // Luego abre el formulario de Girl Talk
                onMouseDown={(e) => { e.stopPropagation(); openPopup('girl-talk') }}
              >
                <MessageSquare size={20} />
                Girl Talk
              </button>
              <button
                className="navbar__popup-item"
                // Detiene la propagacion del evento para que no cierre el popup
                // Luego abre el formulario para valorar un perfil
                onMouseDown={(e) => { e.stopPropagation(); openPopup('rate-guy') }}
              >
                <Flag size={20} />
                Rate a Profile
              </button>
              <button
                className="navbar__popup-item"
                // Detiene la propagacion del evento para que no cierre el popup
                // Luego abre el formulario para resena un producto
                onMouseDown={(e) => { e.stopPropagation(); openPopup('review-product') }}
              >
                <Star size={20} />
                Review a Product
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Ventana para publicar en Girl Talk */}
      {activePopup === 'girl-talk' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <GirlTalkForm
              onClose={closePopup}
              // Cuando el usuario publica, agrega el post y luego cierra el formulario
              onPost={async (text) => { await addGirlTalkPost(text); closePopup() }}
            />
          </div>
        </div>
      )}

      {/* Ventana para valorar un chico */}
      {activePopup === 'rate-guy' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <RateGuyForm onClose={closePopup} onPost={addMenReviewPost} />
          </div>
        </div>
      )}

      {/* Ventana para resena un producto */}
      {activePopup === 'review-product' && (
        <div className="Popup-overlay" onClick={closePopup}>
          <div className="Popup" onClick={(e) => e.stopPropagation()}>
            <ReviewProductForm onClose={closePopup} onPost={addProductPost} />
          </div>
        </div>
      )}
    </>
  )
}
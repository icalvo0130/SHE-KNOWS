import { useState } from 'react'
import { X } from 'lucide-react'
import './GirlTalkForm.css'
import '../../Popup/Popup.css'

type GirlTalkFormProps = {
  onClose: () => void
  onPost: (text: string) => void
}

export const GirlTalkForm = ({ onClose, onPost }: GirlTalkFormProps) => {
  // Texto que se esta escribiendo
  const [text, setText] = useState('')
  // Valida que haya contenido antes de permitir publicar
  const canPost = text.trim().length > 0

  // Publica el post si hay contenido y cierra la ventana
  const handlePost = () => {
    // Si el texto esta vacio, no hace nada
    if (!canPost) return
    // Envía el texto sin espacios al principio o final
    onPost(text.trim())
    // Cierra el formulario
    onClose()
  }

  return (
    <>
      {/* Barra de acciones en celular */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>Cancel</button>
        <span className="Popup__mobile-header-title">Post</span>
        <button className="Popup__mobile-header-post" onClick={handlePost} disabled={!canPost}>
          Post
        </button>
      </div>

      {/* Titulo de la ventana */}
      <h2 className="girl-talk-form__title">Post</h2>
      <button className="Popup__close" onClick={onClose}><X size={20} /></button>

      {/* Texto del nuevo mensaje */}
      <textarea
        className="girl-talk-form__textarea"
        placeholder="Time to spill..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      {/* Boton para publicar */}
      <div className="girl-talk-form__footer">
        <button className="girl-talk-form__post-btn" onClick={handlePost} disabled={!canPost}>
          Post
        </button>
      </div>
    </>
  )
}
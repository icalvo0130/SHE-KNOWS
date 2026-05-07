import { useState, useRef } from 'react'
import { Upload, X, Flag } from 'lucide-react'
import type { MenReviewPost } from '../../../types/Post'
import '../../Popup/Popup.css'
import './RateGuyForm.css'

type RateGuyFormProps = {
  onClose: () => void
  onPost: (post: MenReviewPost) => void
}

export const RateGuyForm = ({ onClose, onPost }: RateGuyFormProps) => {
  const [name, setName] = useState('')
  const [experience, setExperience] = useState('')
  const [flag, setFlag] = useState<'red' | 'green' | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Solo permite publicar cuando esta todo completo
  const canPost = name.trim() !== '' && experience.trim() !== '' && flag !== null

  // Guarda la imagen elegida para ver una vista previa
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setImageUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Crea el post y lo envia al contexto a traves de la prop onPost
  const handlePost = () => {
    if (!canPost || !flag) return
    const newPost: MenReviewPost = {
      id: Date.now(),
      username: 'AnonymousCat',
      avatarColor: '#fd6fae',
      manName: name.trim(),
      description: experience.trim(),
      imageUrl: imageUrl ?? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80',
      redFlags: flag === 'red' ? 1 : 0,
      greenFlags: flag === 'green' ? 1 : 0,
      userVote: flag,
    }
    onPost(newPost)
  }

  return (
    <>
      {/* Barra de acciones en celular */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>Cancel</button>
        <span className="Popup__mobile-header-title">Post</span>
        <button className="Popup__mobile-header-post" onClick={handlePost} disabled={!canPost}>Post</button>
      </div>

      {/* Titulo de la ventana */}
      <h2 className="rate-guy-form__title">Rate a guy</h2>
      <button className="Popup__close" onClick={onClose}><X size={20} /></button>

      {/* Paso uno con el nombre */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">1</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">His name is</p>
          <input className="rate-guy-form__input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>

      {/* Paso dos con la experiencia */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">2</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">How was your experience?</p>
          <textarea className="rate-guy-form__textarea" value={experience} onChange={(e) => setExperience(e.target.value)} />
        </div>
      </div>

      {/* Paso tres para subir una foto */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">3</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">Picture</p>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          {imageUrl ? (
            <div className="rate-guy-form__preview">
              <img src={imageUrl} alt="preview" className="rate-guy-form__preview-img" />
              <button className="rate-guy-form__upload-btn" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} /> Change picture
              </button>
            </div>
          ) : (
            <button className="rate-guy-form__upload-btn" onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} /> {imageName || 'Upload his picture'}
            </button>
          )}
        </div>
      </div>

      {/* Paso cuatro para elegir el tipo de flag */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">4</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">Is he a red flag or a green flag?</p>
          <div className="rate-guy-form__flag-options">
            <button
              className={`rate-guy-form__flag-btn ${flag === 'red' ? 'selected-red' : ''}`}
              onClick={() => setFlag(flag === 'red' ? null : 'red')}
            >
              <Flag size={22} color="#e53935" fill={flag === 'red' ? '#e53935' : 'none'} />
              Red flag
            </button>
            <button
              className={`rate-guy-form__flag-btn ${flag === 'green' ? 'selected-green' : ''}`}
              onClick={() => setFlag(flag === 'green' ? null : 'green')}
            >
              <Flag size={22} color="#2e7d32" fill={flag === 'green' ? '#2e7d32' : 'none'} />
              Green flag
            </button>
          </div>
        </div>
      </div>

      {/* Boton final para publicar */}
      <div className="rate-guy-form__footer">
        <button className="rate-guy-form__post-btn" onClick={handlePost} disabled={!canPost}>Post</button>
      </div>
    </>
  )
}
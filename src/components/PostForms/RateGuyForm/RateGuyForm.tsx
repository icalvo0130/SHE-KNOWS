import { useState, useRef, useContext } from 'react'
import { Upload, X, Flag } from 'lucide-react'
import { supabase } from '../../../data/supabase'
import { AuthContext } from '../../../context/AuthContext'
import type { MenReviewPost } from '../../../types/Post'
import '../../Popup/Popup.css'
import './RateGuyForm.css'

type RateGuyFormProps = {
  onClose: () => void
  onPost: (post: Omit<MenReviewPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'redFlags' | 'greenFlags' | 'created_at'>) => Promise<void>
}

export const RateGuyForm = ({ onClose, onPost }: RateGuyFormProps) => {
  const auth = useContext(AuthContext)

  const [name, setName] = useState('')
  const [experience, setExperience] = useState('')
  const [flag, setFlag] = useState<'red' | 'green' | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Solo permite publicar cuando esta todo completo
  const canPost = name.trim() !== '' && experience.trim() !== '' && flag !== null && !uploading

  // Guarda el archivo y genera vista previa local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Sube la imagen al bucket de Supabase y retorna la URL publica
  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !auth?.profile) return ''
    const ext = imageFile.name.split('.').pop()
    const path = `men/${auth.profile.id}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('men-images')
      .upload(path, imageFile, { upsert: false })

    if (error) {
      console.error('Error uploading image:', error)
      return ''
    }

    const { data } = supabase.storage.from('men-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handlePost = async () => {
    if (!canPost || !flag) return
    setUploading(true)

    const imageUrl = await uploadImage()

    await onPost({
      manName: name.trim(),
      description: experience.trim(),
      imageUrl,
      userVote: flag,
    })

    setUploading(false)
    onClose()
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
          {imagePreview ? (
            <div className="rate-guy-form__preview">
              <img src={imagePreview} alt="preview" className="rate-guy-form__preview-img" />
              <button className="rate-guy-form__upload-btn" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} /> Change picture
              </button>
            </div>
          ) : (
            <button className="rate-guy-form__upload-btn" onClick={() => fileInputRef.current?.click()}>
              <Upload size={18} /> Upload his picture
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
        <button className="rate-guy-form__post-btn" onClick={handlePost} disabled={!canPost}>
          {uploading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </>
  )
}
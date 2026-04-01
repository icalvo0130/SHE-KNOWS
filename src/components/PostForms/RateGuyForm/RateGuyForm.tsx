import { useState, useRef } from 'react'
import '../../Popup/Popup.css'
import './RateGuyForm.css'

type RateGuyFormProps = {
  onClose: () => void
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
)

const RedFlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const GreenFlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="#2e7d32" stroke="#2e7d32" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

export const RateGuyForm = ({ onClose }: RateGuyFormProps) => {
  const [name, setName] = useState('')
  const [experience, setExperience] = useState('')
  const [flag, setFlag] = useState<'red' | 'green' | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canPost = name.trim() !== '' && experience.trim() !== '' && flag !== null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageUrl(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePost = () => {
    if (!canPost) return

    const newPost = {
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

    const addPost = (window as unknown as Record<string, unknown>).__addMenReviewPost as ((p: typeof newPost) => void) | undefined
    if (addPost) addPost(newPost)
    onClose()
  }

  return (
    <>
      {/* Mobile header */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>Cancel</button>
        <span className="Popup__mobile-header-title">Post</span>
        <button
          className="Popup__mobile-header-post"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>

      <h2 className="rate-guy-form__title">Rate a guy</h2>
      <button className="Popup__close" onClick={onClose}>✕</button>

      {/* Step 1 */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">1</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">His name is</p>
          <input
            className="rate-guy-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      {/* Step 2 */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">2</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">How was your experience?</p>
          <textarea
            className="rate-guy-form__textarea"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
      </div>

      {/* Step 3 — file upload */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">3</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">Picture</p>

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* Preview if image selected */}
          {imageUrl ? (
            <div className="rate-guy-form__preview">
              <img src={imageUrl} alt="preview" className="rate-guy-form__preview-img" />
              <button
                className="rate-guy-form__upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon />
                Change picture
              </button>
            </div>
          ) : (
            <button
              className="rate-guy-form__upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon />
              {imageName || 'Upload his picture'}
            </button>
          )}
        </div>
      </div>

      {/* Step 4 */}
      <div className="rate-guy-form__step">
        <div className="rate-guy-form__step-num">4</div>
        <div className="rate-guy-form__step-content">
          <p className="rate-guy-form__step-label">Is he a red flag or a green flag?</p>
          <div className="rate-guy-form__flag-options">
            <button
              className={`rate-guy-form__flag-btn ${flag === 'red' ? 'selected-red' : ''}`}
              onClick={() => setFlag(flag === 'red' ? null : 'red')}
            >
              <RedFlagIcon />
              Red flag
            </button>
            <button
              className={`rate-guy-form__flag-btn ${flag === 'green' ? 'selected-green' : ''}`}
              onClick={() => setFlag(flag === 'green' ? null : 'green')}
            >
              <GreenFlagIcon />
              Green flag
            </button>
          </div>
        </div>
      </div>

      <div className="rate-guy-form__footer">
        <button
          className="rate-guy-form__post-btn"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </>
  )
}
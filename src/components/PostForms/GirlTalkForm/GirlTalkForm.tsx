import { useState } from 'react'
import './GirlTalkForm.css'
import '../../Popup/Popup.css'

type GirlTalkFormProps = {
  onClose: () => void
  onPost: (text: string) => void
}

export const GirlTalkForm = ({ onClose, onPost }: GirlTalkFormProps) => {
  const [text, setText] = useState('')
  const canPost = text.trim().length > 0

  const handlePost = () => {
    if (!canPost) return
    onPost(text.trim())
    onClose()
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>
          Cancel
        </button>
        <span className="Popup__mobile-header-title">Post</span>
        <button
          className="Popup__mobile-header-post"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>

      {/* Desktop title */}
      <h2 className="girl-talk-form__title">Post</h2>
      <button className="Popup__close" onClick={onClose}>✕</button>

      <textarea
        className="girl-talk-form__textarea"
        placeholder="Time to spill..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />

      {/* Desktop footer */}
      <div className="girl-talk-form__footer">
        <button
          className="girl-talk-form__post-btn"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </>
  )
}
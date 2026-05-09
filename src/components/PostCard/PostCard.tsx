import { useState, useContext } from 'react'
import { Heart, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { GirlTalkPost } from '../../types/Post'
import { AuthContext } from '../../context/AuthContext'
import './PostCard.css'

type PostCardProps = {
  post: GirlTalkPost
  onLike: (id: string) => Promise<void>
  onComment: (postId: string, text: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const PostCard = ({ post, onLike, onComment, onDelete }: PostCardProps) => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  // Envia el comentario si tiene contenido y limpia el campo
  const handleSendComment = async () => {
    // Si el comentario esta vacio, no hace nada
    if (!commentText.trim()) return
    // Envía el comentario al contexto
    await onComment(post.id, commentText.trim())
    // Limpia el campo de texto
    setCommentText('')
  }

  // Navega al perfil de la usuaria que hizo el post
  // Si es el perfil propio, va a /profile, sino va al perfil con su ID
  const handleUsernameClick = () => {
    if (post.user_id === auth?.profile?.id) {
      navigate('/profile')
    } else {
      navigate(`/profile/${post.user_id}`)
    }
  }

  // Elimina el post tras pedir confirmacion
  const handleDelete = async () => {
    // Solicita confirmacion antes de borrar
    if (!window.confirm('Delete this post?')) return
    // Elimina el post del contexto
    await onDelete(post.id)
  }

  // Verifica si la usuaria actual es dueña del post
  const isOwner = post.user_id === auth?.profile?.id

  return (
    <div className="post-card">
      <div className="post-card__header">
        {post.avatar_url ? (
          <img src={post.avatar_url} alt={post.username} className="post-card__avatar" />
        ) : (
          <div className="post-card__avatar" />
        )}
        <button className="post-card__username-btn" onClick={handleUsernameClick}>
          {post.username}
        </button>
        {isOwner && (
          <button className="post-card__delete-btn" onClick={handleDelete} aria-label="Delete post">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p className="post-card__text">{post.text}</p>

      <div className="post-card__actions">
        <button
          className={`post-card__action ${post.liked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
          {post.likes}
        </button>
        <button
          className="post-card__action"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageSquare size={16} />
          {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="post-card__comments">
          {post.comments.map((c) => (
            <div key={c.id} className="post-card__comment">
              {c.avatar_url ? (
                <img src={c.avatar_url} alt={c.username} className="post-card__comment-avatar" />
              ) : (
                <div className="post-card__comment-avatar" />
              )}
              <div className="post-card__comment-body">
                <span className="post-card__comment-username">{c.username}</span>
                <p className="post-card__comment-text">{c.text}</p>
              </div>
            </div>
          ))}

          {auth?.profile && (
            <div className="post-card__comment-input">
              {auth.profile.avatar_url ? (
                <img src={auth.profile.avatar_url} alt={auth.profile.username} className="post-card__comment-avatar" />
              ) : (
                <div className="post-card__comment-avatar" />
              )}
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment() }}
              />
              <button className="post-card__comment-send" onClick={handleSendComment}>
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
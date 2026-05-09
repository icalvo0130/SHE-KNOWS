import { useState, useContext } from 'react'
import { Star, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ProductPost, ProductComment } from '../../types/Post'
import { formatRating } from '../../types/Helpers'
import { AuthContext } from '../../context/AuthContext'
import './ProductCard.css'

type ProductCardProps = {
  post: ProductPost
  onComment: (id: string, text: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const ProductCard = ({ post, onComment, onDelete }: ProductCardProps) => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  // Envia el comentario si tiene contenido y limpia el campo
  const handleComment = async () => {
    // Si el comentario esta vacio, no hace nada
    if (!commentText.trim()) return
    // Envía el comentario al contexto
    await onComment(post.id, commentText.trim())
    // Limpia el campo de texto
    setCommentText('')
  }

  // Navega al perfil de la usuaria que publico la resena
  // Si es el perfil propio, va a /profile, sino va al perfil con su ID
  const handleUsernameClick = () => {
    if (post.user_id === auth?.profile?.id) {
      navigate('/profile')
    } else {
      navigate(`/profile/${post.user_id}`)
    }
  }

  // Elimina la resena tras pedir confirmacion
  const handleDelete = async () => {
    // Solicita confirmacion antes de borrar
    if (!window.confirm('Delete this product review?')) return
    // Elimina la resena del contexto
    await onDelete(post.id)
  }

  // Verifica si la usuaria actual es dueña de la resena
  const isOwner = post.user_id === auth?.profile?.id

  return (
    <article className="product-card">
      <div className="product-card__header">
        {post.avatar_url ? (
          <img src={post.avatar_url} alt={post.username} className="product-card__avatar" />
        ) : (
          <div className="product-card__avatar" />
        )}
        <button className="product-card__username-btn" onClick={handleUsernameClick}>
          {post.username}
        </button>
        {isOwner && (
          <button className="product-card__delete-btn" onClick={handleDelete} aria-label="Delete review">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p className="product-card__description">{post.description}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.productName} className="product-card__image" />
      )}

      <div className="product-card__info">
        <div>
          <p className="product-card__name">{post.productName}</p>
          <p className="product-card__brand">Brand: {post.brand}</p>
        </div>
        <span className="product-card__category-badge">{post.category}</span>
      </div>

      {/* Estrellas fijas: muestran la calificacion de quien publico el post */}
      <div className="product-card__rating-row">
        <div className="product-card__stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={20}
              color="#e0a800"
              fill={s <= post.userRating ? '#e0a800' : 'none'}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="product-card__rating-text">
            {formatRating(post.userRating)}
          </span>
          <button
            className="product-card__comment-btn"
            onClick={() => setShowComments((p) => !p)}
          >
            <MessageSquare size={18} />
            {post.comments.length}
          </button>
        </div>
      </div>

      {showComments && (
        <>
          {post.comments.length > 0 && (
            <div className="product-card__comments">
              {post.comments.map((c: ProductComment) => (
                <div key={c.id} className="product-card__comment">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.username} className="product-card__comment-avatar" />
                  ) : (
                    <div className="product-card__comment-avatar" />
                  )}
                  <div className="product-card__comment-body">
                    <p className="product-card__comment-username">{c.username}</p>
                    <p className="product-card__comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {auth?.profile && (
            <div className="product-card__comment-input">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleComment() }}
              />
              <button onClick={handleComment}><Send size={16} /></button>
            </div>
          )}
        </>
      )}
    </article>
  )
}
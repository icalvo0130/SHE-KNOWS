import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import type { ProductPost, ProductComment } from '../../types/Post'
import { getAvgRating, formatRating } from '../../types/Helpers'
import './ProductCard.css'

type ProductCardProps = {
  post: ProductPost
  onRate: (id: number, stars: number) => void
  onComment: (id: number, text: string) => void
}

let nextCommentId = 100

export const ProductCard = ({ post, onRate, onComment }: ProductCardProps) => {
  // Muestra o esconde los comentarios
  const [showComments, setShowComments] = useState(false)
  // Texto que se va a publicar en un comentario
  const [commentText, setCommentText] = useState('')
  // Sirve para resaltar una estrella al pasar el mouse
  const [hoverStar, setHoverStar] = useState(0)

  // Calcula el promedio de votos del producto
  const avg = getAvgRating(post)
  // Cuenta los votos totales que tiene el producto
  const totalVotes = 1 + post.communityRatings.length

  // Publica un comentario si hay texto
  const handleComment = () => {
    if (!commentText.trim()) return
    onComment(post.id, commentText.trim())
    setCommentText('')
    nextCommentId++
  }

  return (
    <article className="product-card">
      {/* Datos de la persona que hizo la reseña */}
      <div className="product-card__header">
        <div className="product-card__avatar" style={{ backgroundColor: post.avatarColor }} />
        <span className="product-card__username">{post.username}</span>
      </div>

      <p className="product-card__description">{post.description}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.productName} className="product-card__image" />
      )}

      {/* Nombre, marca y categoria del producto */}
      <div className="product-card__info">
        <div>
          <p className="product-card__name">{post.productName}</p>
          <p className="product-card__brand">Brand: {post.brand}</p>
        </div>
        <span className="product-card__category-badge">{post.category}</span>
      </div>

      {/* Zona para votar y ver comentarios */}
      <div className="product-card__rating-row">
        <div className="product-card__stars">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              className="product-card__star"
              onClick={() => onRate(post.id, s)}
              onMouseEnter={() => setHoverStar(s)}
              onMouseLeave={() => setHoverStar(0)}
            >
              <Star
                size={20}
                color="#e0a800"
                fill={s <= Math.round(hoverStar || avg) ? '#e0a800' : 'none'}
              />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="product-card__rating-text">
            {formatRating(avg)} ({totalVotes})
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
          {/* Comentarios guardados del producto */}
          {post.comments.length > 0 && (
            <div className="product-card__comments">
              {post.comments.map((c: ProductComment) => (
                <div key={c.id} className="product-card__comment">
                  <div
                    className="product-card__comment-avatar"
                    style={{ backgroundColor: c.avatarColor }}
                  />
                  <div className="product-card__comment-body">
                    <p className="product-card__comment-username">{c.username}</p>
                    <p className="product-card__comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Campo para escribir un comentario nuevo */}
          <div className="product-card__comment-input">
            <input
              type="text"
              placeholder="Escribe un comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            />
            <button onClick={handleComment}>Post</button>
          </div>
        </>
      )}
    </article>
  )
}
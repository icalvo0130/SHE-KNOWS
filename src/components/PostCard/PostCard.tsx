import { useState } from 'react'
import { MessageSquare, Heart } from 'lucide-react'
import type { GirlTalkPost } from '../../types/Post'
import './PostCard.css'

type PostCardProps = {
  post: GirlTalkPost
  onLike: (id: number) => void
  onComment: (id: number, text: string) => void
}

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  // Muestra o esconde los comentarios
  const [showComments, setShowComments] = useState(false)
  // Texto que escribe la usuaria antes de publicar
  const [commentText, setCommentText] = useState('')

  // Envia un comentario si el texto no esta vacio
  const handleComment = () => {
    if (commentText.trim() === '') return
    onComment(post.id, commentText.trim())
    setCommentText('')
  }

  // Permite publicar con Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleComment()
  }

  return (
    <article className="post-card">
      {/* Cabecera del mensaje */}
      <div className="post-card__header">
        <div className="post-card__avatar" style={{ backgroundColor: post.avatarColor }} />
        <div className="post-card__info">
          <p className="post-card__username">{post.username}</p>
          <p className="post-card__text">{post.text}</p>
        </div>
      </div>

      {/* Acciones para comentar y dar like */}
      <div className="post-card__actions">
        <button
          className="post-card__action-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageSquare size={18} />
          {post.comments.length}
        </button>
        <button
          className={`post-card__action-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
          {post.likes}
        </button>
      </div>

      {showComments && (
        <>
          {/* Lista de comentarios ya guardados */}
          {post.comments.length > 0 && (
            <div className="post-card__comments">
              {post.comments.map((comment) => (
                <div key={comment.id} className="post-card__comment">
                  <div className="post-card__comment-avatar" style={{ backgroundColor: comment.avatarColor }} />
                  <div className="post-card__comment-body">
                    <p className="post-card__comment-username">{comment.username}</p>
                    <p className="post-card__comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Campo para escribir un comentario nuevo */}
          <div className="post-card__comment-input">
            <input
              type="text"
              placeholder="Spill your wisdom..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleComment}>Post</button>
          </div>
        </>
      )}
    </article>
  )
}
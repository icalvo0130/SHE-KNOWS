import { useState } from 'react'
import type { GirlTalkPost } from '../../types/Post'
import './PostCard.css'

type PostCardProps = {
  post: GirlTalkPost
  onLike: (id: number) => void
  onComment: (id: number, text: string) => void
}

const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleComment = () => {
    if (commentText.trim() === '') return
    onComment(post.id, commentText.trim())
    setCommentText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleComment()
  }

  return (
    <article className="post-card">
      <div className="post-card__header">
        <div
          className="post-card__avatar"
          style={{ backgroundColor: post.avatarColor }}
        />
        <div className="post-card__info">
          <p className="post-card__username">{post.username}</p>
          <p className="post-card__text">{post.text}</p>
        </div>
      </div>

      <div className="post-card__actions">
        <button
          className="post-card__action-btn"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <CommentIcon />
          {post.comments.length}
        </button>
        <button
          className={`post-card__action-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <HeartIcon filled={post.liked} />
          {post.likes}
        </button>
      </div>

      {showComments && (
        <>
          {post.comments.length > 0 && (
            <div className="post-card__comments">
              {post.comments.map((comment) => (
                <div key={comment.id} className="post-card__comment">
                  <div
                    className="post-card__comment-avatar"
                    style={{ backgroundColor: comment.avatarColor }}
                  />
                  <div className="post-card__comment-body">
                    <p className="post-card__comment-username">{comment.username}</p>
                    <p className="post-card__comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="post-card__comment-input">
            <input
              type="text"
              placeholder="Escribe un comentario..."
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
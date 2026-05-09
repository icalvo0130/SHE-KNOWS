import { useState, useContext } from 'react'
import { Search, Flag, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { AuthContext } from '../../context/AuthContext'
import './MenReview.css'

const FILTERS = ['Todos', 'Recientes', 'Green flags', 'Red flags']

const getTopByGreen = (posts: { greenFlags: number; id: string; manName: string }[]) =>
  [...posts].sort((a, b) => b.greenFlags - a.greenFlags).slice(0, 4)

const getTopByRed = (posts: { redFlags: number; id: string; manName: string }[]) =>
  [...posts].sort((a, b) => b.redFlags - a.redFlags).slice(0, 4)

export const MenReview = () => {
  const { posts, handleVote, deletePost } = useContext(MenReviewContext)!
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  // Filtra los posts segun el texto de busqueda y el filtro activo
  const filteredPosts = posts.filter((post) => {
    // Valida que el nombre del chico contenga el texto de busqueda
    const matchesSearch = post.manName.toLowerCase().includes(search.toLowerCase())
    // Si el filtro es Green flags, muestra solo los que tienen mas green que red
    if (activeFilter === 'Green flags') return matchesSearch && post.greenFlags > post.redFlags
    // Si el filtro es Red flags, muestra solo los que tienen red >= green
    if (activeFilter === 'Red flags') return matchesSearch && post.redFlags >= post.greenFlags
    // Para los otros filtros, muestra todos los que coincidan con la busqueda
    return matchesSearch
  })

  // Calcula los chicos con mas green flags
  const topGreen = getTopByGreen(posts)
  // Calcula los chicos con mas red flags
  const topRed = getTopByRed(posts)

  // Navega al perfil de la usuaria que publico la resena
  // Si es el perfil propio, va a /profile, sino va al perfil con su ID
  const handleUsernameClick = (postUserId: string) => {
    if (postUserId === auth?.profile?.id) {
      navigate('/profile')
    } else {
      navigate(`/profile/${postUserId}`)
    }
  }

  // Elimina la resena tras pedir confirmacion
  const handleDelete = async (id: string) => {
    // Solicita confirmacion antes de borrar
    if (!window.confirm('Delete this review?')) return
    // Elimina la resena del contexto
    await deletePost(id)
  }

  return (
    <div className="men-review">
      <div className="men-review__layout">
        <div className="men-review__feed">
          <div className="men-review__filters">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`men-review__filter-tag ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredPosts.map((post) => (
            <div key={post.id} className="review-card">
              <div className="review-card__header">
                {post.avatar_url ? (
                  <img src={post.avatar_url} alt={post.username} className="review-card__avatar" />
                ) : (
                  <div className="review-card__avatar" />
                )}
                <button
                  className="review-card__username-btn"
                  onClick={() => handleUsernameClick(post.user_id)}
                >
                  {post.username}
                </button>
                {post.user_id === auth?.profile?.id && (
                  <button
                    className="review-card__delete-btn"
                    onClick={() => handleDelete(post.id)}
                    aria-label="Delete review"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <span className="review-card__man-name">{post.manName}</span>

              {post.imageUrl && (
                <img src={post.imageUrl} alt={post.manName} className="review-card__image" />
              )}

              <p className="review-card__description">{post.description}</p>

              <div className="review-card__votes">
                <button
                  className={`review-card__vote-btn ${post.userVote === 'red' ? 'voted-red' : ''}`}
                  onClick={() => handleVote(post.id, 'red')}
                >
                  <Flag size={16} color="#e53935" fill={post.userVote === 'red' ? '#e53935' : 'none'} />
                  {post.redFlags}
                </button>
                <button
                  className={`review-card__vote-btn ${post.userVote === 'green' ? 'voted-green' : ''}`}
                  onClick={() => handleVote(post.id, 'green')}
                >
                  <Flag size={16} color="#2e7d32" fill={post.userVote === 'green' ? '#2e7d32' : 'none'} />
                  {post.greenFlags}
                </button>
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
              No reviews yet.
            </p>
          )}
        </div>

        <aside className="men-review__sidebar">
          <div className="men-review__search-bar">
            <div className="men-review__search-input-wrap">
              <input
                type="text"
                placeholder="Search a man"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={20} />
            </div>
          </div>

          <p className="men-review__sidebar-title">Most voted</p>

          <div className="men-review__rank-box">
            <p className="men-review__rank-box-title green">
              Top Green flags
            </p>
            {topGreen.map((post) => (
              <div key={`g-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <Flag size={14} color="#2e7d32" fill="#2e7d32" />
                  {post.greenFlags}
                </span>
              </div>
            ))}
          </div>

          <div className="men-review__rank-box">
            <p className="men-review__rank-box-title red">
              Top Red flags
            </p>
            {topRed.map((post) => (
              <div key={`r-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <Flag size={14} color="#e53935" fill="#e53935" />
                  {post.redFlags}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
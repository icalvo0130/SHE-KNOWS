import { useState, useContext } from 'react'
import { Search, Flag } from 'lucide-react'
import { MenReviewContext } from '../../context/Menreviewcontext'
import './MenReview.css'

const FILTERS = ['Todos', 'Recientes', 'Green flags', 'Red flags']

const getTopByGreen = (posts: { greenFlags: number; id: number; manName: string }[]) =>
  [...posts].sort((a, b) => b.greenFlags - a.greenFlags).slice(0, 4)

const getTopByRed = (posts: { redFlags: number; id: number; manName: string }[]) =>
  [...posts].sort((a, b) => b.redFlags - a.redFlags).slice(0, 4)

export const MenReview = () => {
  const { posts, handleVote } = useContext(MenReviewContext)!
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  // Filtra por texto de busqueda y por tipo de filtro activo
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.manName.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'Green flags') return matchesSearch && post.greenFlags > post.redFlags
    if (activeFilter === 'Red flags') return matchesSearch && post.redFlags >= post.greenFlags
    return matchesSearch
  })

  const topGreen = getTopByGreen(posts)
  const topRed = getTopByRed(posts)

  return (
    <div className="men-review">
      {/* Barra de busqueda */}
      <div className="men-review__search-bar">
        <div className="men-review__search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search man"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros para ordenar la lista */}
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

      {/* Lista principal y resumen lateral */}
      <div className="men-review__layout">
        <div className="men-review__feed">
          {filteredPosts.map((post) => (
            <div key={post.id} className="review-card">
              <div className="review-card__header">
                <div className="review-card__avatar" style={{ backgroundColor: post.avatarColor }} />
                <span className="review-card__username">{post.username}</span>
              </div>

              <span className="review-card__man-name">{post.manName}</span>

              <img src={post.imageUrl} alt={post.manName} className="review-card__image" />

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
        </div>

        {/* Ranking de los mas votados */}
        <aside className="men-review__sidebar">
          <p className="men-review__sidebar-title">Most voted</p>

          <div className="men-review__rank-box">
            <p className="men-review__rank-box-title green">
              <Flag size={14} color="#2e7d32" fill="#2e7d32" /> Green flag
            </p>
            {topGreen.map((post) => (
              <div key={`g-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <Flag size={14} color="#fff" fill="#fff" />
                  {post.greenFlags}
                </span>
              </div>
            ))}
          </div>

          <div className="men-review__rank-box">
            <p className="men-review__rank-box-title red">
              <Flag size={14} color="#e53935" fill="#e53935" /> Red flag
            </p>
            {topRed.map((post) => (
              <div key={`r-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <Flag size={14} color="#fff" fill="#fff" />
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
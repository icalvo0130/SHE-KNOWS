import { useState } from 'react'
import type { MenReviewPost } from '../../types/Post'
import './MenReview.css'

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

/* ---- Static seed data ---- */
const PLACEHOLDER_IMAGE_1 = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80'
const PLACEHOLDER_IMAGE_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
const PLACEHOLDER_IMAGE_3 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80'

const initialPosts: MenReviewPost[] = [
  {
    id: 1,
    username: 'IvoryPulse',
    avatarColor: '#fd9a3e',
    manName: 'Sebastian Rojas',
    description: 'Very charismatic and confident in social settings, but inconsistent when it comes to communication. He tends to disappear for days and then come back as if nothing happened. It creates unnecessary confusion.',
    imageUrl: PLACEHOLDER_IMAGE_1,
    redFlags: 5,
    greenFlags: 12,
    userVote: null,
  },
  {
    id: 2,
    username: 'IvoryPulse',
    avatarColor: '#fd9a3e',
    manName: 'Sebastian Rojas',
    description: 'Super attentive at first. Remembered every little detail I told him. But then completely changed after the third date. Classic situationship energy.',
    imageUrl: PLACEHOLDER_IMAGE_2,
    redFlags: 8,
    greenFlags: 3,
    userVote: null,
  },
  {
    id: 3,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    manName: 'Mateo Vargas',
    description: 'The most thoughtful person I have ever met. Always showed up, always communicated. Genuinely one of the good ones.',
    imageUrl: PLACEHOLDER_IMAGE_3,
    redFlags: 1,
    greenFlags: 20,
    userVote: null,
  },
]

/* Compute top 3 by green flags and red flags */
const getTopByGreen = (posts: MenReviewPost[]) =>
  [...posts].sort((a, b) => b.greenFlags - a.greenFlags).slice(0, 4)

const getTopByRed = (posts: MenReviewPost[]) =>
  [...posts].sort((a, b) => b.redFlags - a.redFlags).slice(0, 4)

const FILTERS = ['Todos', 'Recientes', 'Green flags', 'Red flags']

export const MenReview = () => {
  const [posts, setPosts] = useState<MenReviewPost[]>(initialPosts)

  // Bridge so RateGuyForm (inside NavBar) can add posts here
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__addMenReviewPost = (post: MenReviewPost) => {
      setPosts((prev) => [post, ...prev])
    }
  }
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Todos')

  const handleVote = (postId: number, vote: 'red' | 'green') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        // Toggle off if same vote
        if (post.userVote === vote) {
          return {
            ...post,
            userVote: null,
            redFlags: vote === 'red' ? post.redFlags - 1 : post.redFlags,
            greenFlags: vote === 'green' ? post.greenFlags - 1 : post.greenFlags,
          }
        }
        // Switch vote
        const wasRed = post.userVote === 'red'
        const wasGreen = post.userVote === 'green'
        return {
          ...post,
          userVote: vote,
          redFlags: vote === 'red' ? post.redFlags + 1 : wasRed ? post.redFlags - 1 : post.redFlags,
          greenFlags: vote === 'green' ? post.greenFlags + 1 : wasGreen ? post.greenFlags - 1 : post.greenFlags,
        }
      })
    )
  }

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
      {/* Search */}
      <div className="men-review__search-bar">
        <div className="men-review__search-input-wrap">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search man"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter tags */}
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

      <div className="men-review__layout">
        {/* Feed */}
        <div className="men-review__feed">
          {filteredPosts.map((post) => (
            <div key={post.id} className="review-card">
              <div className="review-card__header">
                <div className="review-card__avatar" style={{ backgroundColor: post.avatarColor }} />
                <span className="review-card__username">{post.username}</span>
              </div>

              <span className="review-card__man-name">{post.manName}</span>

              <img
                src={post.imageUrl}
                alt={post.manName}
                className="review-card__image"
              />

              <p className="review-card__description">{post.description}</p>

              <div className="review-card__votes">
                <button
                  className={`review-card__vote-btn ${post.userVote === 'red' ? 'voted-red' : ''}`}
                  onClick={() => handleVote(post.id, 'red')}
                >
                  <RedFlagIcon />
                  {post.redFlags}
                </button>
                <button
                  className={`review-card__vote-btn ${post.userVote === 'green' ? 'voted-green' : ''}`}
                  onClick={() => handleVote(post.id, 'green')}
                >
                  <GreenFlagIcon />
                  {post.greenFlags}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop sidebar — Most voted */}
        <aside className="men-review__sidebar">
          <p className="men-review__sidebar-title">Most voted</p>

          <div className="men-review__rank-box men-review__rank-box--green">
            <p className="men-review__rank-box-title green">
              <GreenFlagIcon /> Green flag
            </p>
            {topGreen.map((post) => (
              <div key={`g-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <GreenFlagIcon />
                  {post.greenFlags}
                </span>
              </div>
            ))}
          </div>

          <div className="men-review__rank-box men-review__rank-box--red">
            <p className="men-review__rank-box-title red">
              <RedFlagIcon /> Red flag
            </p>
            {topRed.map((post) => (
              <div key={`r-${post.id}`} className="men-review__rank-item">
                <span className="men-review__rank-item-name">{post.manName}</span>
                <span className="men-review__rank-item-count">
                  <RedFlagIcon />
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
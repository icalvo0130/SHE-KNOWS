import { useState, useMemo } from 'react'
import type { ProductPost, ProductCategory, ProductComment } from '../../types/Post'
import productsBanner from '../../assets/Products.png'
import topRatedImg from '../../assets/TopRated.png'
import './Products.css'

/* ---- Icons ---- */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const CommentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)
const StarFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const StarEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

/* ---- Category icons (emoji-based for simplicity) ---- */
const CATEGORY_ICONS: Record<string, string> = {
  'Make-Up': '💄',
  'Skin Care': '🧴',
  'Clothes': '👗',
  'Gym': '🏋️',
}

const CATEGORIES: ProductCategory[] = ['Make-Up', 'Skin Care', 'Clothes', 'Gym']

const AVATAR_COLORS = ['#fd6fae', '#c60017', '#fc007b', '#ffc1d8', '#ff6b6b']
const getRandomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

/* ---- Seed data ---- */
const NOW = Date.now()
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

const initialPosts: ProductPost[] = [
  {
    id: 1,
    username: 'SoftVenom',
    avatarColor: '#fc007b',
    productName: 'Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f2e?w=600&q=80',
    category: 'Make-Up',
    userRating: 3,
    communityRatings: [4, 3, 4],
    description: 'Buena cobertura pero ligeramente oxidado después de unas horas.',
    comments: [],
    createdAt: NOW - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    productName: 'Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f2e?w=600&q=80',
    category: 'Make-Up',
    userRating: 4,
    communityRatings: [5, 4],
    description: 'Me encanta la textura, dura todo el día sin retoques.',
    comments: [],
    createdAt: NOW - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 3,
    username: 'CherryOracle',
    avatarColor: '#c60017',
    productName: 'Yoga Leggings High Waist',
    brand: 'Gymshark',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    category: 'Gym',
    userRating: 5,
    communityRatings: [5, 5, 4],
    description: 'Perfectos para el gym, no se transparentan y aguantan cualquier ejercicio.',
    comments: [],
    createdAt: NOW - ONE_WEEK - 1000,
  },
]

let nextPostId = initialPosts.length + 1
let nextCommentId = 20

/* ---- Helpers ---- */
const getAvgRating = (post: ProductPost): number => {
  const all = [post.userRating, ...post.communityRatings]
  return all.reduce((a, b) => a + b, 0) / all.length
}

const formatRating = (r: number) => r.toFixed(1)

/* ---- ProductCard sub-component ---- */
type ProductCardProps = {
  post: ProductPost
  onRate: (id: number, stars: number) => void
  onComment: (id: number, text: string) => void
}

const ProductCard = ({ post, onRate, onComment }: ProductCardProps) => {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [hoverStar, setHoverStar] = useState(0)
  const avg = getAvgRating(post)
  const totalVotes = 1 + post.communityRatings.length

  const handleComment = () => {
    if (!commentText.trim()) return
    onComment(post.id, commentText.trim())
    setCommentText('')
  }

  return (
    <article className="product-card">
      <div className="product-card__header">
        <div className="product-card__avatar" style={{ backgroundColor: post.avatarColor }} />
        <span className="product-card__username">{post.username}</span>
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
              {s <= Math.round(hoverStar || avg) ? <StarFilled /> : <StarEmpty />}
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
            <CommentIcon />
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
                  <div className="product-card__comment-avatar" style={{ backgroundColor: c.avatarColor }} />
                  <div className="product-card__comment-body">
                    <p className="product-card__comment-username">{c.username}</p>
                    <p className="product-card__comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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

/* ---- Top Rated view sub-component ---- */
type TopRatedViewProps = {
  category: ProductCategory
  posts: ProductPost[]
  onBack: () => void
}

const TopRatedView = ({ category, posts, onBack }: TopRatedViewProps) => {
  const [period, setPeriod] = useState<'weekly' | 'alltime'>('weekly')
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

  const ranked = useMemo(() => {
    const filtered = posts.filter((p) => {
      if (p.category !== category) return false
      if (period === 'weekly') return Date.now() - p.createdAt <= ONE_WEEK_MS
      return true
    })
    // Group by productName+brand, average ratings
    const map = new Map<string, { post: ProductPost; avg: number; count: number }>()
    filtered.forEach((p) => {
      const key = `${p.productName}__${p.brand}`
      const avg = getAvgRating(p)
      if (!map.has(key)) {
        map.set(key, { post: p, avg, count: 1 })
      } else {
        const prev = map.get(key)!
        map.set(key, {
          post: prev.post,
          avg: (prev.avg * prev.count + avg) / (prev.count + 1),
          count: prev.count + 1,
        })
      }
    })
    return [...map.values()].sort((a, b) => b.avg - a.avg)
  }, [posts, category, period])

  const top3 = ranked.slice(0, 3)
  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const podiumBars = [
    'top-rated-view__podium-bar--2',
    'top-rated-view__podium-bar--1',
    'top-rated-view__podium-bar--3',
  ]
  const podiumNums = [2, 1, 3]

  return (
    <div className="top-rated-view">
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--rojo)',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 16,
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Back to {category}
      </button>

      <div className="top-rated-view__toggle">
        <button
          className={`top-rated-view__toggle-btn ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button
          className={`top-rated-view__toggle-btn ${period === 'alltime' ? 'active' : ''}`}
          onClick={() => setPeriod('alltime')}
        >
          All Time
        </button>
      </div>

      {top3.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
          No rankings yet for this period.
        </p>
      ) : (
        <>
          <div className="top-rated-view__podium-area">
            {podiumOrder.map((entry, idx) => (
              <div key={idx} className="top-rated-view__podium-item">
                <img
                  src={entry.post.imageUrl}
                  alt={entry.post.productName}
                  className="top-rated-view__podium-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <p className="top-rated-view__podium-name">{entry.post.productName}</p>
                <span className="top-rated-view__podium-score">
                  {formatRating(entry.avg)} ★
                </span>
                <div className={`top-rated-view__podium-bar ${podiumBars[idx]}`}>
                  <span className="top-rated-view__podium-number">{podiumNums[idx]}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="top-rated-view__title">{category} Ranking</p>
          <div className="top-rated-view__list">
            {ranked.slice(0, 10).map((entry, i) => (
              <div key={i} className="top-rated-view__item">
                <span className="top-rated-view__item-rank">{i + 1}</span>
                <img
                  src={entry.post.imageUrl}
                  alt={entry.post.productName}
                  className="top-rated-view__item-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div className="top-rated-view__item-info">
                  <p className="top-rated-view__item-name">{entry.post.productName}</p>
                  <p className="top-rated-view__item-brand">Brand: {entry.post.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---- Main Products page ---- */
type ProductsView = 'home' | ProductCategory | 'top-rated'

export const Products = () => {
  const [posts, setPosts] = useState<ProductPost[]>(initialPosts)
  const [view, setView] = useState<ProductsView>('home')
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null)
  const [search, setSearch] = useState('')

  // Bridge for ReviewProductForm
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__addProductPost = (post: ProductPost) => {
      setPosts((prev) => [post, ...prev])
    }
  }

  const handleRate = (postId: number, stars: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, communityRatings: [...p.communityRatings, stars] }
          : p
      )
    )
  }

  const handleComment = (postId: number, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: nextCommentId++,
                  username: 'AnonymousCat',
                  avatarColor: getRandomColor(),
                  text,
                },
              ],
            }
          : p
      )
    )
  }

  const addPost = (post: ProductPost) => {
    setPosts((prev) => [{ ...post, id: nextPostId++ }, ...prev])
  }
  // make addPost accessible
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__addProductPost = addPost
  }

  /* Tendencias sidebar: most reviewed products (by count of posts) */
  const tendencias = useMemo(() => {
    const map = new Map<string, { post: ProductPost; count: number; avg: number }>()
    posts.forEach((p) => {
      const key = `${p.productName}__${p.brand}`
      const avg = getAvgRating(p)
      if (!map.has(key)) {
        map.set(key, { post: p, count: 1, avg })
      } else {
        const prev = map.get(key)!
        map.set(key, {
          post: prev.post,
          avg: (prev.avg * prev.count + avg) / (prev.count + 1),
          count: prev.count + 1,
        })
      }
    })
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  }, [posts])

  /* Which posts to show in feed */
  const visiblePosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = activeCategory ? p.category === activeCategory : true
      const matchSearch = search
        ? p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
        : true
      return matchCat && matchSearch
    })
  }, [posts, activeCategory, search])

  const handleCategoryClick = (cat: ProductCategory) => {
    setActiveCategory(cat)
    setView(cat)
  }

  const handleBackToHome = () => {
    setActiveCategory(null)
    setView('home')
  }

  /* Top rated view */
  if (view === 'top-rated' && activeCategory) {
    return (
      <div className="products">
        <div className="products__layout">
          <div className="products__feed">
            <TopRatedView
              category={activeCategory}
              posts={posts}
              onBack={() => setView(activeCategory)}
            />
          </div>
          <SidebarTendencias tendencias={tendencias} />
        </div>
      </div>
    )
  }

  return (
    <div className="products">
      {/* Mobile search */}
      <div className="products__search-bar">
        <div className="products__search-input-wrap">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search a product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="products__layout">
        <div className="products__feed">
          {/* Hero banner (only on home) */}
          {view === 'home' && (
            <div className="products__banner">
              <img src={productsBanner} alt="Products We Trust" />
            </div>
          )}

          {/* Top Rated banner (when in a category) */}
          {view !== 'home' && (
            <button
              className="products__top-rated-banner"
              onClick={() => setView('top-rated')}
              style={{ border: 'none', padding: 0, width: '100%' }}
            >
              <img src={topRatedImg} alt="Top Rated" />
            </button>
          )}

          {/* Category heading */}
          {activeCategory && (
            <p className="products__category-heading">{activeCategory}</p>
          )}

          {/* Category pills */}
          <p className="products__categories-title">
            {view === 'home' ? 'Categories' : ''}
          </p>
          <div className="products__categories">
            {view !== 'home' && (
              <button className="products__category-pill" onClick={handleBackToHome}>
                <div className="products__category-icon">← </div>
                <span className="products__category-label">All</span>
              </button>
            )}
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`products__category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="products__category-icon">
                  <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[cat]}</span>
                </div>
                <span className="products__category-label">{cat}</span>
              </button>
            ))}
          </div>

          {/* Posts feed */}
          {visiblePosts.map((post) => (
            <ProductCard
              key={post.id}
              post={post}
              onRate={handleRate}
              onComment={handleComment}
            />
          ))}

          {visiblePosts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
              No posts yet in this category. Be the first! ✨
            </p>
          )}
        </div>

        <SidebarTendencias tendencias={tendencias} />
      </div>
    </div>
  )
}

/* ---- Sidebar component ---- */
type SidebarProps = {
  tendencias: { post: ProductPost; count: number; avg: number }[]
}

const SidebarTendencias = ({ tendencias }: SidebarProps) => (
  <aside className="products__sidebar">
    <p className="products__sidebar-title">Tendencies</p>
    {tendencias.map((t, i) => (
      <div key={i} className="products__sidebar-card">
        <img
          src={t.post.imageUrl}
          alt={t.post.productName}
          className="products__sidebar-card-img"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div className="products__sidebar-card-info">
          <p className="products__sidebar-card-name">{t.post.productName}</p>
          <p className="products__sidebar-card-brand">Brand: {t.post.brand}</p>
          <div className="products__sidebar-card-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>
                {s <= Math.round(t.avg) ? <StarFilled /> : <StarEmpty />}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </aside>
)
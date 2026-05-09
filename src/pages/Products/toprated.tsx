import { useState, useMemo, useContext } from 'react'
import { useParams } from 'react-router-dom'
import type { ProductPost, ProductCategory } from '../../types/Post'
import { formatRating } from '../../types/Helpers'
import { ProductsContext } from '../../context/Productscontext'
import './Products.css'

const slugToCategory = (slug: string): ProductCategory | null => {
  const map: Record<string, ProductCategory> = {
    'make-up': 'Make-Up',
    'skin-care': 'Skin Care',
    'clothes': 'Clothes',
    'gym': 'Gym',
  }
  return map[slug] ?? null
}

export const TopRated = () => {
  const { category: categorySlug } = useParams<{ category: string }>()
  const ctx = useContext(ProductsContext)
  const posts = ctx?.posts ?? []

  const category = slugToCategory(categorySlug ?? '')

  const [period, setPeriod] = useState<'weekly' | 'alltime'>('weekly')
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

  const ranked = useMemo(() => {
    if (!category) return []
    const filtered = posts.filter((p) => {
      if (p.category !== category) return false
      if (period === 'weekly') {
        const createdAtMs = new Date(p.createdAt).getTime()
        return Date.now() - createdAtMs <= ONE_WEEK_MS
      }
      return true
    })

    const map = new Map<string, { post: ProductPost; avg: number; count: number }>()
    filtered.forEach((p) => {
      const key = `${p.productName}__${p.brand}`
      // FIX: antes se llamaba getAvgRating(p) con un solo arg — ahora pasa los 3 correctos
      const avg = p.communityRatingCount === 0 ? p.userRating : p.avgRating
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
  }, [category, period, posts])

  const top3 = ranked.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const podiumBars = [
    'top-rated-view__podium-bar--2',
    'top-rated-view__podium-bar--1',
    'top-rated-view__podium-bar--3',
  ]
  const podiumNums = [2, 1, 3]

  return (
    <div className="products">
      <div className="products__layout">
        <div className="products__feed">
          <div className="top-rated-view">
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
                      <div className="top-rated-view__podium-img-wrap">
                        <img
                          src={entry.post.imageUrl}
                          alt={entry.post.productName}
                          className="top-rated-view__podium-img"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                        <span className="top-rated-view__podium-score">
                          ★ {formatRating(entry.avg)}
                        </span>
                      </div>
                      <div className={`top-rated-view__podium-bar ${podiumBars[idx]}`}>
                        <p className="top-rated-view__podium-name">{entry.post.productName}</p>
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
        </div>
      </div>
    </div>
  )
}
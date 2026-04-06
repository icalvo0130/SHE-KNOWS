import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { ProductPost, ProductCategory } from '../../types/Post'
import { getAvgRating, getRandomColor, CATEGORIES, CATEGORY_ICONS } from '../../types/Post'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import { initialPosts } from './productsData'
import topRatedImg from '../../assets/Topratedlogo.png'
import './Products.css'

// Convierte la ruta en el nombre de la categoria
const slugToCategory = (slug: string): ProductCategory | null => {
  const map: Record<string, ProductCategory> = {
    'make-up': 'Make-Up',
    'skin-care': 'Skin Care',
    'clothes': 'Clothes',
    'gym': 'Gym',
  }
  return map[slug] ?? null
}

let nextCommentId = 200

type SidebarProps = {
  tendencias: { post: ProductPost; avg: number }[]
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
              <Star key={s} size={12} color="#e0a800" fill={s <= Math.round(t.avg) ? '#e0a800' : 'none'} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </aside>
)

export const CategoryFeed = () => {
  // Lee la categoria desde la ruta actual
  const { category: categorySlug } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const category = slugToCategory(categorySlug ?? '')

  // Productos que se van a mostrar en la lista
  const [posts, setPosts] = useState<ProductPost[]>(initialPosts)

  // Suma una nueva nota a un producto
  const handleRate = (postId: number, stars: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, communityRatings: [...p.communityRatings, stars] } : p
      )
    )
  }

  // Agrega un comentario al producto elegido
  const handleComment = (postId: number, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: nextCommentId++, username: 'AnonymousCat', avatarColor: getRandomColor(), text },
              ],
            }
          : p
      )
    )
  }

  // Busca los productos mas usados para mostrar el ranking lateral
  const tendencias = useMemo(() => {
    const map = new Map<string, { post: ProductPost; count: number; avg: number }>()
    posts.forEach((p) => {
      const key = `${p.productName}__${p.brand}`
      const avg = getAvgRating(p)
      if (!map.has(key)) {
        map.set(key, { post: p, count: 1, avg })
      } else {
        const prev = map.get(key)!
        map.set(key, { post: prev.post, avg: (prev.avg * prev.count + avg) / (prev.count + 1), count: prev.count + 1 })
      }
    })
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  }, [posts])

  // Deja ver solo los productos de la categoria actual
  const filteredPosts = useMemo(
    () => (category ? posts.filter((p) => p.category === category) : []),
    [posts, category]
  )

  if (!category) {
    return (
      <div className="products">
        <div className="products__layout">
          <div className="products__feed">
            {/* Mensaje cuando la categoria no existe */}
            <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
              Category not found.{' '}
              <button onClick={() => navigate('/products')} style={{ color: 'var(--rojo)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="products">
      <div className="products__layout">
        <div className="products__feed">
          {/* Banner que lleva al ranking */}
          <button
            className="products__top-rated-banner"
            onClick={() => navigate(`/products/${categorySlug}/top-rated`)}
          >
            <img src={topRatedImg} alt="Top Rated" />
          </button>

          {/* Nombre de la categoria actual */}
          <p className="products__category-heading">{category}</p>

          {/* Botones para cambiar de categoria */}
          <div className="products__categories">
            <button className="products__category-pill" onClick={() => navigate('/products')}>
              <div className="products__category-icon" style={{ fontSize: '1.5rem' }}>←</div>
              <span className="products__category-label">All</span>
            </button>
            {CATEGORIES.map((cat) => {
              const slug = cat.toLowerCase().replace(' ', '-')
              return (
                <button
                  key={cat}
                  className={`products__category-pill ${cat === category ? 'active' : ''}`}
                  onClick={() => navigate(`/products/${slug}`)}
                >
                  <div className="products__category-icon">
                    <img src={CATEGORY_ICONS[cat]} alt={cat} />
                  </div>
                  <span className="products__category-label">{cat}</span>
                </button>
              )
            })}
          </div>

          {/* Productos que pertenecen a esta categoria */}
          {filteredPosts.map((post) => (
            <ProductCard key={post.id} post={post} onRate={handleRate} onComment={handleComment} />
          ))}

          {/* Mensaje cuando no hay resultados en la categoria */}
          {filteredPosts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
              No posts yet in {category}. Be the first! ✨
            </p>
          )}
        </div>

        <SidebarTendencias tendencias={tendencias} />
      </div>
    </div>
  )
}
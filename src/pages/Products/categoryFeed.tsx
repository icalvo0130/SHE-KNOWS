import { useMemo, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { ProductPost, ProductCategory } from '../../types/Post'
import { CATEGORIES, CATEGORY_ICONS } from '../../types/Helpers'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import { ProductsContext } from '../../context/Productscontext'
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

type SidebarProps = {
  tendencias: { post: ProductPost; avg: number }[]
}

const SidebarTendencias = ({ tendencias }: SidebarProps) => (
  <aside className="products__sidebar">
    <p className="products__sidebar-title">Tendencies</p>
    {tendencias.map((t, i) => (
      <div key={i} className="products__sidebar-card">
        {t.post.imageUrl ? (
          <img
            src={t.post.imageUrl}
            alt={t.post.productName}
            className="products__sidebar-card-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : null}
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
  const { category: categorySlug } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const { posts, handleComment, deletePost, tendencias } = useContext(ProductsContext)!

  const category = slugToCategory(categorySlug ?? '')

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
              <button
                onClick={() => navigate('/products')}
                style={{ color: 'var(--rojo)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
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

          {/* Productos de esta categoria */}
          {filteredPosts.map((post) => (
            <ProductCard key={post.id} post={post} onComment={handleComment} onDelete={deletePost} />
          ))}

          {/* Mensaje cuando no hay resultados en esta categoria */}
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
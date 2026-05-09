import { useState, useMemo, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Search } from 'lucide-react'
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

export const CategoryFeed = () => {
  const { category: categorySlug } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const { posts, handleComment, deletePost, tendencias } = useContext(ProductsContext)!
  const [search, setSearch] = useState('')

  const category = slugToCategory(categorySlug ?? '')

  // Deja ver solo los productos de la categoria actual, filtrados por busqueda
  const filteredPosts = useMemo(() => {
    let currentPosts = category ? posts.filter((p) => p.category === category) : []
    if (search) {
      currentPosts = currentPosts.filter(
        (p) =>
          p.productName.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      )
    }
    return currentPosts
  }, [posts, category, search])

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
          <div
            className="products__banner"
            onClick={() => navigate(`/products/${categorySlug}/top-rated`)}
          >
            <img src={topRatedImg} alt="Top Rated" />
          </div>

          {/* Botones para cambiar de categoria */}
          <div className="products__categories">
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
              No posts found.
            </p>
          )}
        </div>

        <aside className="products__sidebar">
          {/* Buscador de productos en el sidebar */}
          <div className="products__search-bar">
            <div className="products__search-input-wrap">
              <input
                type="text"
                placeholder="Search a product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search size={20} />
            </div>
          </div>

          <p className="products__sidebar-title">Tendencias</p>
          {tendencias.map((t, i) => (
            <div key={i} className="products__sidebar-card">
              <div className="products__sidebar-card-info">
                <p className="products__sidebar-card-name">{t.post.productName}</p>
                <p className="products__sidebar-card-brand">Brand: {t.post.brand}</p>
                <div className="products__sidebar-card-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      color="#e0a800"
                      fill={s <= Math.round(t.avg) ? '#e0a800' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import type { ProductPost } from '../../types/Post'
import { CATEGORIES, CATEGORY_ICONS } from '../../types/Helpers'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import { ProductsContext } from '../../context/Productscontext'
import productsBanner from '../../assets/Bannerproductspage.png'
import './Products.css'

type SidebarProps = {
  tendencias: { post: ProductPost; avg: number }[]
}

const SidebarTendencias = ({ tendencias }: SidebarProps) => (
  <aside className="products__sidebar">
    {/* Lista de productos con mejor promedio */}
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
              <Star
                key={s}
                size={12}
                color="#e0a800"
                fill={s <= Math.round(t.avg) ? '#e0a800' : 'none'}
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </aside>
)

export const Products = () => {
  const navigate = useNavigate()
  const { posts, handleComment, deletePost, tendencias } = useContext(ProductsContext)!
  const [search, setSearch] = useState('')

  // Filtra los productos visibles segun el texto de busqueda
  const visiblePosts = useMemo(() => {
    if (!search) return posts
    return posts.filter(
      (p) =>
        p.productName.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    )
  }, [posts, search])

  return (
    <div className="products">
      {/* Buscador de productos */}
      <div className="products__search-bar">
        <div className="products__search-input-wrap">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search a product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Lista principal y barra lateral */}
      <div className="products__layout">
        <div className="products__feed">
          {/* Banner de la seccion */}
          <div className="products__banner">
            <img src={productsBanner} alt="Products We Trust" />
          </div>

          {/* Accesos por categoria */}
          <p className="products__categories-title">Categories</p>
          <div className="products__categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="products__category-pill"
                onClick={() => navigate(`/products/${cat.toLowerCase().replace(' ', '-')}`)}
              >
                <div className="products__category-icon">
                  <img src={CATEGORY_ICONS[cat]} alt={cat} />
                </div>
                <span className="products__category-label">{cat}</span>
              </button>
            ))}
          </div>

          {/* Tarjetas de productos visibles */}
          {visiblePosts.map((post) => (
            <ProductCard key={post.id} post={post} onComment={handleComment} onDelete={deletePost} />
          ))}

          {/* Mensaje cuando no hay resultados */}
          {visiblePosts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
              No posts yet. Be the first! ✨
            </p>
          )}
        </div>

        <SidebarTendencias tendencias={tendencias} />
      </div>
    </div>
  )
}
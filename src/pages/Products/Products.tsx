import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import type { ProductPost } from '../../types/Post'
import { CATEGORIES, CATEGORY_ICONS } from '../../types/Helpers'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import { ProductsContext } from '../../context/Productscontext'
import productsBanner from '../../assets/Bannerproductspage.png'
import './Products.css'


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
      {/* Lista principal y barra lateral */}
      <div className="products__layout">
        <div className="products__feed">
          {/* Banner de la seccion */}
          <div className="products__banner">
            <img src={productsBanner} alt="Products We Trust" />
          </div>

          {/* Accesos por categoria */}
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
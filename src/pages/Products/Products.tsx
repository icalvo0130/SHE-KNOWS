import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import type { ProductPost } from '../../types/Post'
import { getAvgRating, getRandomColor, CATEGORIES, CATEGORY_ICONS } from '../../types/Post'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import { initialPosts } from './productsData'
import productsBanner from '../../assets/Bannerproductspage.png'
import './Products.css'

let nextPostId = initialPosts.length + 1
let nextCommentId = 20
let sharedPosts: ProductPost[] = [...initialPosts]

type SidebarProps = {
  tendencias: { post: ProductPost; avg: number }[]
}

import { Star } from 'lucide-react'

const SidebarTendencias = ({ tendencias }: SidebarProps) => (
  <aside className="products__sidebar">
    {/* Lista de productos con mejor promedio */}
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
  // Datos de la pagina y texto de busqueda
  const navigate = useNavigate()
  const [posts, setPosts] = useState<ProductPost[]>(sharedPosts)
  const [search, setSearch] = useState('')

  // Permite recibir nuevos productos desde el formulario
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__addProductPost = (post: ProductPost) => {
      const newPost = { ...post, id: nextPostId++ }
      sharedPosts = [newPost, ...sharedPosts]
      setPosts([...sharedPosts])
    }
  }

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

  // Busca los productos mas repetidos y mejor valorados
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

  // Filtra lo que se ve en pantalla segun la busqueda
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
            <ProductCard key={post.id} post={post} onRate={handleRate} onComment={handleComment} />
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
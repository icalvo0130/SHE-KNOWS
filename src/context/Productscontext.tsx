import { createContext, useState, useEffect, useContext, useMemo } from 'react'
import { supabase } from '../data/supabase'
import { AuthContext } from './AuthContext'
import type { ProductPost, ProductComment } from '../types/Post'

type ProductsContextType = {
  posts: ProductPost[]
  loading: boolean
  addPost: (post: Omit<ProductPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'avgRating' | 'communityRatingCount' | 'comments' | 'createdAt'>) => Promise<void>
  handleComment: (postId: string, text: string) => Promise<void>
  deletePost: (id: string) => Promise<void>
  tendencias: { post: ProductPost; avg: number }[]
}

export const ProductsContext = createContext<ProductsContextType | null>(null)

// Transforma los datos de la base de datos al formato que usa la aplicacion
const mapRow = (row: Record<string, unknown>): ProductPost => ({
  id: row.id as string,
  user_id: row.user_id as string,
  username: row.username as string,
  avatar_url: row.avatar_url as string,
  productName: row.product_name as string,
  brand: row.brand as string,
  imageUrl: (row.image_url as string) ?? '',
  category: row.category as ProductPost['category'],
  userRating: row.user_rating as number,
  // Convierte el promedio de rating a numero con precision decimal
  avgRating: parseFloat((row.avg_rating as string) ?? '0'),
  communityRatingCount: (row.community_rating_count as number) ?? 0,
  description: row.description as string,
  comments: [],
  createdAt: row.created_at as string,
})

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  // Lista de todos los posts de productos
  const [posts, setPosts] = useState<ProductPost[]>([])
  // Indica si se estan cargando los posts
  const [loading, setLoading] = useState(true)
  // Accede al contexto de autenticacion para saber quien es el usuario
  const auth = useContext(AuthContext)

  // Carga todos los posts al iniciar el componente
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      // Obtiene todos los posts de la vista product_feed
      const { data: feedData, error: feedError } = await supabase
        .from('product_feed')
        .select('*')

      if (feedError) {
        console.error('Error loading products feed:', feedError)
        setLoading(false)
        return
      }

      // Procesa cada post para agregar sus comentarios
      const enriched: ProductPost[] = await Promise.all(
        (feedData as Record<string, unknown>[]).map(async (row) => {
          // Convierte la fila a un post
          const post = mapRow(row)

          // Obtiene todos los comentarios de este producto
          const { data: commentsData } = await supabase
            .from('product_comments')
            .select('id, text, created_at, profiles(username, avatar_url)')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true })

          // Transforma los comentarios al formato requerido
          post.comments = ((commentsData as Record<string, unknown>[]) ?? []).map((c) => {
            const profile = c.profiles as Record<string, string> | null
            return {
              id: c.id as string,
              username: profile?.username ?? 'unknown',
              avatar_url: profile?.avatar_url ?? '',
              text: c.text as string,
              created_at: c.created_at as string,
            } as ProductComment
          })

          return post
        })
      )

      // Actualiza el estado con todos los posts enriquecidos
      setPosts(enriched)
      setLoading(false)
    }

    loadPosts()
  }, [auth?.profile?.id])

  // Crea un nuevo post de producto en la base de datos
  const addPost = async (
    postData: Omit<ProductPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'avgRating' | 'communityRatingCount' | 'comments' | 'createdAt'>
  ) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Inserta el post en Supabase con los datos del producto
    const { data, error } = await supabase
      .from('product_posts')
      .insert({
        user_id: auth.profile.id,
        product_name: postData.productName,
        brand: postData.brand,
        image_url: postData.imageUrl,
        category: postData.category,
        user_rating: postData.userRating,
        description: postData.description,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product post:', error)
      return
    }

    // Crea el objeto del post con los datos del usuario actual
    const newPost: ProductPost = {
      id: (data as Record<string, unknown>).id as string,
      user_id: auth.profile.id,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      productName: postData.productName,
      brand: postData.brand,
      imageUrl: postData.imageUrl,
      category: postData.category,
      userRating: postData.userRating,
      avgRating: postData.userRating,
      communityRatingCount: 0,
      description: postData.description,
      comments: [],
      createdAt: (data as Record<string, unknown>).created_at as string,
    }

    // Agrega el nuevo post al principio de la lista
    setPosts((prev) => [newPost, ...prev])
  }

  // Agrega un comentario a un producto especifico
  const handleComment = async (postId: string, text: string) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Inserta el comentario en la base de datos
    const { data, error } = await supabase
      .from('product_comments')
      .insert({ post_id: postId, user_id: auth.profile.id, text })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return
    }

    // Crea el objeto del comentario con los datos del usuario
    const newComment: ProductComment = {
      id: (data as Record<string, unknown>).id as string,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      text,
      created_at: (data as Record<string, unknown>).created_at as string,
    }

    // Agrega el comentario al producto correspondiente
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    )
  }

  // Elimina un post de producto propio de la base de datos y del estado local
  const deletePost = async (id: string) => {
    // Elimina el post de Supabase
    const { error } = await supabase
      .from('product_posts')
      .delete()
      .eq('id', id)
    if (error) { console.error('Error deleting product post:', error); return }
    // Elimina el post del estado local
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  // Calcula las tendencias agrupando productos por nombre y marca
  // Luego calcula el promedio de ratings para cada producto unico
  const tendencias = useMemo(() => {
    // Crea un mapa para agrupar productos por nombre y marca
    const map = new Map<string, { post: ProductPost; total: number; count: number }>()
    posts.forEach((p) => {
      // La clave es el nombre del producto mas la marca separados por __
      const key = `${p.productName}__${p.brand}`
      // Si es la primera vez que ve este producto, lo agrega al mapa
      if (!map.has(key)) {
        map.set(key, { post: p, total: p.userRating, count: 1 })
      } else {
        // Si ya existe, suma el rating y aumenta el contador
        const prev = map.get(key)!
        map.set(key, {
          post: prev.post,
          total: prev.total + p.userRating,
          count: prev.count + 1,
        })
      }
    })
    // Convierte el mapa a un array, calcula el promedio y ordena por promedio descendente
    return [...map.values()]
      .map((v) => ({ post: v.post, avg: v.total / v.count }))
      .sort((a, b) => b.avg - a.avg)
      // Toma solo los 4 productos con mas rating
      .slice(0, 4)
  }, [posts])

  return (
    <ProductsContext.Provider value={{ posts, loading, addPost, deletePost, handleComment, tendencias }}>
      {children}
    </ProductsContext.Provider>
  )
}
import { createContext, useState, useMemo } from 'react'
import type { ProductPost, ProductComment } from '../types/Post'
import { getAvgRating, getRandomColor } from '../types/Helpers'

// Datos iniciales de productos de ejemplo
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

// Tipado del contexto
type ProductsContextType = {
  posts: ProductPost[]
  addPost: (post: ProductPost) => void
  handleRate: (postId: number, stars: number) => void
  handleComment: (postId: number, text: string) => void
  tendencias: { post: ProductPost; avg: number }[]
}

// Creacion del contexto
export const ProductsContext = createContext<ProductsContextType | null>(null)

let nextId = initialPosts.length + 1
let nextCommentId = 20

// Provider que envuelve las paginas que necesitan acceso a los productos
export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<ProductPost[]>(initialPosts)

  // Agrega un nuevo producto al inicio de la lista
  const addPost = (post: ProductPost) => {
    const newPost = { ...post, id: nextId++ }
    setPosts((prev) => [newPost, ...prev])
  }

  // Agrega una calificacion de la comunidad a un producto
  const handleRate = (postId: number, stars: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, communityRatings: [...p.communityRatings, stars] } : p
      )
    )
  }

  // Agrega un comentario a un producto especifico
  const handleComment = (postId: number, text: string) => {
    const newComment: ProductComment = {
      id: nextCommentId++,
      username: 'AnonymousCat',
      avatarColor: getRandomColor(),
      text,
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    )
  }

  // Calcula los productos mas repetidos y mejor valorados para el sidebar
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

  return (
    <ProductsContext.Provider value={{ posts, addPost, handleRate, handleComment, tendencias }}>
      {children}
    </ProductsContext.Provider>
  )
}
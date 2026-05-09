import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../data/supabase'
import { AuthContext } from './AuthContext'
import type { GirlTalkPost, Comment } from '../types/Post'

export type GirlTalkContextType = {
  posts: GirlTalkPost[]
  loading: boolean
  addPost: (text: string) => Promise<void>
  handleLike: (id: string) => Promise<void>
  handleComment: (postId: string, text: string) => Promise<void>
  deletePost: (id: string) => Promise<void>
}


export const GirlTalkContext = createContext<GirlTalkContextType | null>(null)

// Transforma los datos de la base de datos al formato que usa la aplicacion
const mapRow = (row: Record<string, unknown>): GirlTalkPost => ({
  id: row.id as string,
  user_id: row.user_id as string,
  username: row.username as string,
  avatar_url: row.avatar_url as string,
  text: row.text as string,
  likes: (row.likes_count as number) ?? 0,
  liked: false,
  comments: [],
  created_at: row.created_at as string,
})

export const GirlTalkProvider = ({ children }: { children: React.ReactNode }) => {
  // Lista de todos los posts del feed
  const [posts, setPosts] = useState<GirlTalkPost[]>([])
  // Indica si se estan cargando los posts
  const [loading, setLoading] = useState(true)
  // Accede al contexto de autenticacion para saber quien es el usuario
  const auth = useContext(AuthContext)

  // Carga todos los posts al iniciar el componente
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      // Obtiene todos los posts de la vista girl_talk_feed
      const { data: feedData, error: feedError } = await supabase
        .from('girl_talk_feed')
        .select('*')

      if (feedError) {
        console.error('Error loading girl talk feed:', feedError)
        setLoading(false)
        return
      }

      // Procesa cada post para agregar comentarios e informacion de likes
      const enriched: GirlTalkPost[] = await Promise.all(
        (feedData as Record<string, unknown>[]).map(async (row) => {
          // Convierte la fila a un post
          const post = mapRow(row)

          // Obtiene todos los comentarios de este post
          const { data: commentsData } = await supabase
            .from('girl_talk_comments')
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
            } as Comment
          })

          // Verifica si la usuaria actual le dio like a este post
          if (auth?.profile?.id) {
            const { data: likeData } = await supabase
              .from('girl_talk_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', auth.profile.id)
              .maybeSingle()

            // Actualiza el estado del like
            post.liked = !!likeData
          }

          return post
        })
      )

      // Actualiza el estado con todos los posts enriquecidos
      setPosts(enriched)
      setLoading(false)
    }

    loadPosts()
  }, [auth?.profile?.id])

  // Crea un nuevo post en la base de datos
  const addPost = async (text: string) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Inserta el post en Supabase y obtiene los datos del post creado
    const { data, error } = await supabase
      .from('girl_talk_posts')
      .insert({ user_id: auth.profile.id, text })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return
    }

    // Crea el objeto del post con los datos del usuario actual
    const newPost: GirlTalkPost = {
      id: (data as Record<string, unknown>).id as string,
      user_id: auth.profile.id,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      text,
      likes: 0,
      liked: false,
      comments: [],
      created_at: (data as Record<string, unknown>).created_at as string,
    }

    // Agrega el nuevo post al principio de la lista
    setPosts((prev) => [newPost, ...prev])
  }

  // Agrega o quita el like de la usuaria actual en un post
  const handleLike = async (id: string) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Busca el post en la lista
    const post = posts.find((p) => p.id === id)
    if (!post) return

    // Si ya le dio like, lo quita
    if (post.liked) {
      await supabase
        .from('girl_talk_likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', auth.profile.id)

      // Actualiza el estado local
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: false, likes: p.likes - 1 } : p
        )
      )
    } else {
      // Si no le dio like, lo agrega
      await supabase
        .from('girl_talk_likes')
        .insert({ post_id: id, user_id: auth.profile.id })

      // Actualiza el estado local
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p
        )
      )
    }
  }

  // Agrega un comentario a un post especifico
  const handleComment = async (postId: string, text: string) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Inserta el comentario en la base de datos
    const { data, error } = await supabase
      .from('girl_talk_comments')
      .insert({ post_id: postId, user_id: auth.profile.id, text })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return
    }

    // Crea el objeto del comentario con los datos del usuario
    const newComment: Comment = {
      id: (data as Record<string, unknown>).id as string,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      text,
      created_at: (data as Record<string, unknown>).created_at as string,
    }

    // Agrega el comentario al post correspondiente
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    )
  }

  // Elimina un post propio de la base de datos y del estado local
  const deletePost = async (id: string) => {
    // Elimina el post de Supabase
    const { error } = await supabase
      .from('girl_talk_posts')
      .delete()
      .eq('id', id)
    if (error) { console.error('Error deleting girl talk post:', error); return }
    // Elimina el post del estado local
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <GirlTalkContext.Provider value={{ posts, loading, addPost, handleLike, handleComment, deletePost }}>
      {children}
    </GirlTalkContext.Provider>
  )
}
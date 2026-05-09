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

// Convierte una fila de la vista girl_talk_feed al tipo local
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
  const [posts, setPosts] = useState<GirlTalkPost[]>([])
  const [loading, setLoading] = useState(true)
  const auth = useContext(AuthContext)

  // Carga los posts junto con sus comentarios al iniciar
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      const { data: feedData, error: feedError } = await supabase
        .from('girl_talk_feed')
        .select('*')

      if (feedError) {
        console.error('Error loading girl talk feed:', feedError)
        setLoading(false)
        return
      }

      // Para cada post cargamos sus comentarios y si el usuario actual ya dio like
      const enriched: GirlTalkPost[] = await Promise.all(
        (feedData as Record<string, unknown>[]).map(async (row) => {
          const post = mapRow(row)

          // Comentarios del post
          const { data: commentsData } = await supabase
            .from('girl_talk_comments')
            .select('id, text, created_at, profiles(username, avatar_url)')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true })

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

          // Verifica si la usuaria actual ya dio like
          if (auth?.profile?.id) {
            const { data: likeData } = await supabase
              .from('girl_talk_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', auth.profile.id)
              .maybeSingle()

            post.liked = !!likeData
          }

          return post
        })
      )

      setPosts(enriched)
      setLoading(false)
    }

    loadPosts()
  }, [auth?.profile?.id])

  // Crea un nuevo post en Supabase
  const addPost = async (text: string) => {
    if (!auth?.profile) return

    const { data, error } = await supabase
      .from('girl_talk_posts')
      .insert({ user_id: auth.profile.id, text })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return
    }

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

    setPosts((prev) => [newPost, ...prev])
  }

  // Agrega o quita el like de la usuaria actual en un post
  const handleLike = async (id: string) => {
    if (!auth?.profile) return

    const post = posts.find((p) => p.id === id)
    if (!post) return

    if (post.liked) {
      await supabase
        .from('girl_talk_likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', auth.profile.id)

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: false, likes: p.likes - 1 } : p
        )
      )
    } else {
      await supabase
        .from('girl_talk_likes')
        .insert({ post_id: id, user_id: auth.profile.id })

      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, liked: true, likes: p.likes + 1 } : p
        )
      )
    }
  }

  // Agrega un comentario a un post especifico
  const handleComment = async (postId: string, text: string) => {
    if (!auth?.profile) return

    const { data, error } = await supabase
      .from('girl_talk_comments')
      .insert({ post_id: postId, user_id: auth.profile.id, text })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return
    }

    const newComment: Comment = {
      id: (data as Record<string, unknown>).id as string,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      text,
      created_at: (data as Record<string, unknown>).created_at as string,
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    )
  }

  // Elimina un post propio de Supabase y del estado local
  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('girl_talk_posts')
      .delete()
      .eq('id', id)
    if (error) { console.error('Error deleting girl talk post:', error); return }
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <GirlTalkContext.Provider value={{ posts, loading, addPost, handleLike, handleComment, deletePost }}>
      {children}
    </GirlTalkContext.Provider>
  )
}
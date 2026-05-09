import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../data/supabase'
import { AuthContext } from './AuthContext'
import type { MenReviewPost } from '../types/Post'
import type { MenReviewContextType } from '../types/Post'

export const MenReviewContext = createContext<MenReviewContextType | null>(null)

// Transforma los datos de la base de datos al formato que usa la aplicacion
// userVote indica si la usuaria actual voto red o green
const mapRow = (row: Record<string, unknown>, userVote: 'red' | 'green' | null): MenReviewPost => ({
  id: row.id as string,
  user_id: row.user_id as string,
  username: row.username as string,
  avatar_url: row.avatar_url as string,
  manName: row.man_name as string,
  description: row.description as string,
  imageUrl: (row.image_url as string) ?? '',
  redFlags: (row.red_flags as number) ?? 0,
  greenFlags: (row.green_flags as number) ?? 0,
  userVote,
  created_at: row.created_at as string,
})

export const MenReviewProvider = ({ children }: { children: React.ReactNode }) => {
  // Lista de todos los posts del feed
  const [posts, setPosts] = useState<MenReviewPost[]>([])
  // Indica si se estan cargando los posts
  const [loading, setLoading] = useState(true)
  // Accede al contexto de autenticacion para saber quien es el usuario
  const auth = useContext(AuthContext)

  // Carga todos los posts al iniciar el componente
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      // Obtiene todos los posts de la vista men_review_feed
      const { data: feedData, error: feedError } = await supabase
        .from('men_review_feed')
        .select('*')

      if (feedError) {
        console.error('Error loading men review feed:', feedError)
        setLoading(false)
        return
      }

      // Procesa cada post para agregar el voto de la usuaria actual
      const enriched: MenReviewPost[] = await Promise.all(
        (feedData as Record<string, unknown>[]).map(async (row) => {
          // Busca si la usuaria ya voto en este post
          let userVote: 'red' | 'green' | null = null

          if (auth?.profile?.id) {
            const { data: voteData } = await supabase
              .from('men_review_votes')
              .select('vote')
              .eq('post_id', row.id as string)
              .eq('user_id', auth.profile.id)
              .maybeSingle()

            // Si hay voto, lo extrae (red o green)
            userVote = voteData ? (voteData as Record<string, string>).vote as 'red' | 'green' : null
          }

          return mapRow(row, userVote)
        })
      )

      // Actualiza el estado con todos los posts enriquecidos
      setPosts(enriched)
      setLoading(false)
    }

    loadPosts()
  }, [auth?.profile?.id])

  // Crea un nuevo post de valoracion de hombre en la base de datos
  const addPost = async (
    postData: Omit<MenReviewPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'redFlags' | 'greenFlags' | 'created_at'>
  ) => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Inserta el post en Supabase con los datos del hombre
    const { data, error } = await supabase
      .from('men_review_posts')
      .insert({
        user_id: auth.profile.id,
        man_name: postData.manName,
        description: postData.description,
        image_url: postData.imageUrl,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating men review post:', error)
      return
    }

    // Crea el objeto del post con los datos del usuario actual
    const newPost: MenReviewPost = {
      id: (data as Record<string, unknown>).id as string,
      user_id: auth.profile.id,
      username: auth.profile.username,
      avatar_url: auth.profile.avatar_url,
      manName: postData.manName,
      description: postData.description,
      imageUrl: postData.imageUrl,
      redFlags: postData.userVote === 'red' ? 1 : 0,
      greenFlags: postData.userVote === 'green' ? 1 : 0,
      userVote: postData.userVote,
      created_at: (data as Record<string, unknown>).created_at as string,
    }

    // Si la usuaria selecciono una flag, registra el voto inicial
    if (postData.userVote) {
      await supabase
        .from('men_review_votes')
        .insert({ post_id: newPost.id, user_id: auth.profile.id, vote: postData.userVote })
    }

    // Agrega el nuevo post al principio de la lista
    setPosts((prev) => [newPost, ...prev])
  }

  // Maneja los votos red flag o green flag de la usuaria
  const handleVote = async (postId: string, vote: 'red' | 'green') => {
    // Si no hay usuario autenticado, no hace nada
    if (!auth?.profile) return

    // Busca el post en la lista
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    // Si la usuaria ya voto lo mismo, lo deshace
    if (post.userVote === vote) {
      // Elimina el voto de la base de datos
      await supabase
        .from('men_review_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', auth.profile.id)

      // Actualiza el estado local reduciendo los flags
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p
          return {
            ...p,
            userVote: null,
            redFlags: vote === 'red' ? p.redFlags - 1 : p.redFlags,
            greenFlags: vote === 'green' ? p.greenFlags - 1 : p.greenFlags,
          }
        })
      )
    } else {
      // Si habia un voto anterior, lo elimina primero
      if (post.userVote) {
        await supabase
          .from('men_review_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', auth.profile.id)
      }

      // Agrega el nuevo voto
      const { error } = await supabase
        .from('men_review_votes')
        .insert({ post_id: postId, user_id: auth.profile.id, vote })

      if (error) {
        console.error('Error saving vote:', error)
        return
      }

      // Actualiza el estado local
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p
          // Verifica si el voto anterior era red o green
          const wasRed = p.userVote === 'red'
          const wasGreen = p.userVote === 'green'
          return {
            ...p,
            userVote: vote,
            // Suma el nuevo voto y resta el anterior si existia
            redFlags: vote === 'red' ? p.redFlags + 1 : wasRed ? p.redFlags - 1 : p.redFlags,
            greenFlags: vote === 'green' ? p.greenFlags + 1 : wasGreen ? p.greenFlags - 1 : p.greenFlags,
          }
        })
      )
    }
  }

  // Elimina un post propio de la base de datos y del estado local
  const deletePost = async (id: string) => {
    // Elimina el post de Supabase
    const { error } = await supabase
      .from('men_review_posts')
      .delete()
      .eq('id', id)
    if (error) { console.error('Error deleting men review post:', error); return }
    // Elimina el post del estado local
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <MenReviewContext.Provider value={{ posts, loading, addPost, handleVote, deletePost }}>
      {children}
    </MenReviewContext.Provider>
  )
}
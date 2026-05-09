import { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../data/supabase'
import { AuthContext } from './AuthContext'
import type { MenReviewPost } from '../types/Post'
import type { MenReviewContextType } from '../types/Post'

export const MenReviewContext = createContext<MenReviewContextType | null>(null)

// Convierte una fila de la vista men_review_feed al tipo local
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
  const [posts, setPosts] = useState<MenReviewPost[]>([])
  const [loading, setLoading] = useState(true)
  const auth = useContext(AuthContext)

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true)

      const { data: feedData, error: feedError } = await supabase
        .from('men_review_feed')
        .select('*')

      if (feedError) {
        console.error('Error loading men review feed:', feedError)
        setLoading(false)
        return
      }

      // Carga el voto de la usuaria actual para cada post
      const enriched: MenReviewPost[] = await Promise.all(
        (feedData as Record<string, unknown>[]).map(async (row) => {
          let userVote: 'red' | 'green' | null = null

          if (auth?.profile?.id) {
            const { data: voteData } = await supabase
              .from('men_review_votes')
              .select('vote')
              .eq('post_id', row.id as string)
              .eq('user_id', auth.profile.id)
              .maybeSingle()

            userVote = voteData ? (voteData as Record<string, string>).vote as 'red' | 'green' : null
          }

          return mapRow(row, userVote)
        })
      )

      setPosts(enriched)
      setLoading(false)
    }

    loadPosts()
  }, [auth?.profile?.id])

  // Sube la foto del hombre a Supabase Storage y crea el post
  const addPost = async (
    postData: Omit<MenReviewPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'redFlags' | 'greenFlags' | 'created_at'>
  ) => {
    if (!auth?.profile) return

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

    // Si eligio una flag, registramos el voto inicial
    if (postData.userVote) {
      await supabase
        .from('men_review_votes')
        .insert({ post_id: newPost.id, user_id: auth.profile.id, vote: postData.userVote })
    }

    setPosts((prev) => [newPost, ...prev])
  }

  // Agrega, cambia o quita el voto de la usuaria en un post
  const handleVote = async (postId: string, vote: 'red' | 'green') => {
    if (!auth?.profile) return

    const post = posts.find((p) => p.id === postId)
    if (!post) return

    if (post.userVote === vote) {
      // Deshace el voto
      await supabase
        .from('men_review_votes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', auth.profile.id)

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
      // Elimina el voto anterior si existia y agrega el nuevo
      if (post.userVote) {
        await supabase
          .from('men_review_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', auth.profile.id)
      }

      const { error } = await supabase
        .from('men_review_votes')
        .insert({ post_id: postId, user_id: auth.profile.id, vote })

      if (error) {
        console.error('Error saving vote:', error)
        return
      }

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p
          const wasRed = p.userVote === 'red'
          const wasGreen = p.userVote === 'green'
          return {
            ...p,
            userVote: vote,
            redFlags: vote === 'red' ? p.redFlags + 1 : wasRed ? p.redFlags - 1 : p.redFlags,
            greenFlags: vote === 'green' ? p.greenFlags + 1 : wasGreen ? p.greenFlags - 1 : p.greenFlags,
          }
        })
      )
    }
  }

  // Elimina un post propio de Supabase y del estado local
  const deletePost = async (id: string) => {
    const { error } = await supabase
      .from('men_review_posts')
      .delete()
      .eq('id', id)
    if (error) { console.error('Error deleting men review post:', error); return }
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <MenReviewContext.Provider value={{ posts, loading, addPost, handleVote, deletePost }}>
      {children}
    </MenReviewContext.Provider>
  )
}
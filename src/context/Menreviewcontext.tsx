import { createContext, useState } from 'react'
import type { MenReviewPost } from '../types/Post'

// Fotos de ejemplo para los posts iniciales
const PLACEHOLDER_IMAGE_1 = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80'
const PLACEHOLDER_IMAGE_2 = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
const PLACEHOLDER_IMAGE_3 = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80'

const initialPosts: MenReviewPost[] = [
  {
    id: 1,
    username: 'IvoryPulse',
    avatarColor: '#fd9a3e',
    manName: 'Sebastian Rojas',
    description: 'Very charismatic and confident in social settings, but inconsistent when it comes to communication. He tends to disappear for days and then come back as if nothing happened.',
    imageUrl: PLACEHOLDER_IMAGE_1,
    redFlags: 5,
    greenFlags: 12,
    userVote: null,
  },
  {
    id: 2,
    username: 'IvoryPulse',
    avatarColor: '#fd9a3e',
    manName: 'Sebastian Rojas',
    description: 'Super attentive at first. Remembered every little detail I told him. But then completely changed after the third date. Classic situationship energy.',
    imageUrl: PLACEHOLDER_IMAGE_2,
    redFlags: 8,
    greenFlags: 3,
    userVote: null,
  },
  {
    id: 3,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    manName: 'Mateo Vargas',
    description: 'The most thoughtful person I have ever met. Always showed up, always communicated. Genuinely one of the good ones.',
    imageUrl: PLACEHOLDER_IMAGE_3,
    redFlags: 1,
    greenFlags: 20,
    userVote: null,
  },
]

// Tipado del contexto
type MenReviewContextType = {
  posts: MenReviewPost[]
  addPost: (post: MenReviewPost) => void
  handleVote: (postId: number, vote: 'red' | 'green') => void
}

// Creacion del contexto
export const MenReviewContext = createContext<MenReviewContextType | null>(null)

let nextId = initialPosts.length + 1

// Provider que envuelve las paginas que necesitan acceso a los posts de Men Review
export const MenReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<MenReviewPost[]>(initialPosts)

  // Agrega un nuevo post al inicio de la lista
  const addPost = (post: MenReviewPost) => {
    const newPost = { ...post, id: nextId++ }
    setPosts((prev) => [newPost, ...prev])
  }

  // Cambia el voto de red/green en un post
  const handleVote = (postId: number, vote: 'red' | 'green') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post

        // Si ya voto lo mismo, se deshace el voto
        if (post.userVote === vote) {
          return {
            ...post,
            userVote: null,
            redFlags: vote === 'red' ? post.redFlags - 1 : post.redFlags,
            greenFlags: vote === 'green' ? post.greenFlags - 1 : post.greenFlags,
          }
        }

        // Si cambia de voto, se resta el anterior y se suma el nuevo
        const wasRed = post.userVote === 'red'
        const wasGreen = post.userVote === 'green'
        return {
          ...post,
          userVote: vote,
          redFlags: vote === 'red' ? post.redFlags + 1 : wasRed ? post.redFlags - 1 : post.redFlags,
          greenFlags: vote === 'green' ? post.greenFlags + 1 : wasGreen ? post.greenFlags - 1 : post.greenFlags,
        }
      })
    )
  }

  return (
    <MenReviewContext.Provider value={{ posts, addPost, handleVote }}>
      {children}
    </MenReviewContext.Provider>
  )
}
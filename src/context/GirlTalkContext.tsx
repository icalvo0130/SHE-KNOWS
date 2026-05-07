import { createContext, useState } from 'react'
import type { GirlTalkPost, Comment } from '../types/Post'

// Datos iniciales de ejemplo
const initialPosts: GirlTalkPost[] = [
  {
    id: 1,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    text: 'He said he \u201cdoesn\u2019t believe in labels\u201d but acts jealous when I go out. Make it make sense.',
    likes: 15,
    liked: false,
    comments: [
      { id: 1, username: 'CherryOracle', avatarColor: '#c60017', text: 'Red flag wrapped in a riddle \uD83D\uDEA9' },
    ],
  },
  {
    id: 2,
    username: 'CherryOracle',
    avatarColor: '#c60017',
    text: "I\u2019m going to my first Pilates class tomorrow and I\u2019m terrified. Do I need to be flexible already or do I just show up and pretend?",
    likes: 15,
    liked: false,
    comments: [],
  },
  {
    id: 3,
    username: 'SoftVenom',
    avatarColor: '#fc007b',
    text: 'I urgently need a healthy snack I can eat in questionable quantities without guilt. Does that even exist or is it a myth?',
    likes: 15,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    username: 'SoftVenom',
    avatarColor: '#ffc1d8',
    text: "Has anyone experienced the horror of using your boyfriend\u2019s bathroom and it won\u2019t flush. I am currently living this nightmare. Immediate solutions appreciated.",
    likes: 9,
    liked: false,
    comments: [],
  },
]

// Tipado del contexto
type GirlTalkContextType = {
  posts: GirlTalkPost[]
  addPost: (text: string) => void
  handleLike: (id: number) => void
  handleComment: (postId: number, text: string) => void
}

// Creacion del contexto
export const GirlTalkContext = createContext<GirlTalkContextType | null>(null)

let nextId = initialPosts.length + 1
let nextCommentId = 10

// Provider que envuelve las paginas que necesitan acceso a los posts de Girl Talk
export const GirlTalkProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<GirlTalkPost[]>(initialPosts)

  // Agrega un nuevo post al inicio de la lista
  const addPost = (text: string) => {
    const newPost: GirlTalkPost = {
      id: nextId++,
      username: 'AnonymousCat',
      avatarColor: '#888',
      text,
      likes: 0,
      liked: false,
      comments: [],
    }
    setPosts((prev) => [newPost, ...prev])
  }

  // Cambia el estado de like de un post
  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  // Agrega un comentario a un post especifico
  const handleComment = (postId: number, text: string) => {
    const newComment: Comment = {
      id: nextCommentId++,
      username: 'AnonymousCat',
      avatarColor: '#888',
      text,
    }
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    )
  }

  return (
    <GirlTalkContext.Provider value={{ posts, addPost, handleLike, handleComment }}>
      {children}
    </GirlTalkContext.Provider>
  )
}
// Tipos de datos compartidos entre contextos y componentes
// Los IDs son strings (UUID de Supabase)

// Perfil de usuario anonimo guardado en Supabase
export interface UserProfile {
  id: string
  firebase_uid: string
  username: string
  avatar_url: string
  created_at: string
}

// Girl Talk
export interface Comment {
  id: string
  username: string
  avatar_url: string
  text: string
  created_at: string
}

export interface GirlTalkPost {
  id: string
  user_id: string
  username: string
  avatar_url: string
  text: string
  likes: number
  liked: boolean
  comments: Comment[]
  created_at: string
}

// Men Under Review
export interface MenReviewPost {
  id: string
  user_id: string
  username: string
  avatar_url: string
  manName: string
  description: string
  imageUrl: string
  redFlags: number
  greenFlags: number
  userVote: 'red' | 'green' | null
  created_at: string
}

export type MenReviewContextType = {
  posts: MenReviewPost[]
  loading: boolean
  addPost: (post: Omit<MenReviewPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'redFlags' | 'greenFlags' | 'created_at'>) => Promise<void>
  handleVote: (postId: string, vote: 'red' | 'green') => Promise<void>
  deletePost: (id: string) => Promise<void>
}

// Products We Trust
export type ProductCategory = 'Make-Up' | 'Skin Care' | 'Clothes' | 'Gym'

export interface ProductComment {
  id: string
  username: string
  avatar_url: string
  text: string
  created_at: string
}

export interface ProductPost {
  id: string
  user_id: string
  username: string
  avatar_url: string
  productName: string
  brand: string
  imageUrl: string
  category: ProductCategory
  userRating: number
  avgRating: number
  communityRatingCount: number
  description: string
  comments: ProductComment[]
  createdAt: string
}

export type ProductsContextType = {
  posts: ProductPost[]
  loading: boolean
  addPost: (post: Omit<ProductPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'avgRating' | 'communityRatingCount' | 'comments' | 'createdAt'>) => Promise<void>
  handleComment: (postId: string, text: string) => Promise<void>
  deletePost: (id: string) => Promise<void>
  tendencias: { post: ProductPost; avg: number }[]
}
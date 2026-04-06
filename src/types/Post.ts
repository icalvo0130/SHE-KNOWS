import clothesIcon from '../assets/clothes.png'
import gymIcon from '../assets/gym.png'
import makeupIcon from '../assets/make-up.png'
import skinCareIcon from '../assets/skin-care.png'

// Girl Talk 
export interface Comment {
  id: number
  username: string
  avatarColor: string
  text: string
}

export interface GirlTalkPost {
  id: number
  username: string
  avatarColor: string
  text: string
  likes: number
  liked: boolean
  comments: Comment[]
}

// Men Review 
export interface MenReviewPost {
  id: number
  username: string
  avatarColor: string
  manName: string
  description: string
  imageUrl: string
  redFlags: number
  greenFlags: number
  userVote: 'red' | 'green' | null
}

// Products  
export type ProductCategory = 'Make-Up' | 'Skin Care' | 'Clothes' | 'Gym'

export interface ProductComment {
  id: number
  username: string
  avatarColor: string
  text: string
}

export interface ProductPost {
  id: number
  username: string
  avatarColor: string
  productName: string
  brand: string
  imageUrl: string
  category: ProductCategory
  userRating: number
  communityRatings: number[]
  description: string
  comments: ProductComment[]
  createdAt: number
}

// Ayuditas para generar datos random y otras cosas

export const AVATAR_COLORS = ['#fd6fae', '#c60017', '#fc007b', '#ffc1d8', '#ff6b6b']

export const getRandomColor = (): string =>
  AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

export const getAvgRating = (post: ProductPost): number => {
  const all = [post.userRating, ...post.communityRatings]
  return all.reduce((a, b) => a + b, 0) / all.length
}

export const formatRating = (r: number): string => r.toFixed(1)

export const CATEGORIES: ProductCategory[] = ['Make-Up', 'Skin Care', 'Clothes', 'Gym']

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  'Make-Up': makeupIcon,
  'Skin Care': skinCareIcon,
  'Clothes': clothesIcon,
  'Gym': gymIcon,
}
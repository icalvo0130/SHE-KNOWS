export type PostType = 'girl-talk' | 'men-review' | 'product'

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

export interface ProductComment {
  id: number
  username: string
  avatarColor: string
  text: string
}

export type ProductCategory = 'Make-Up' | 'Skin Care' | 'Clothes' | 'Gym'

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
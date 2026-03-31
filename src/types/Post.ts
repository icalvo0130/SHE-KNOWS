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
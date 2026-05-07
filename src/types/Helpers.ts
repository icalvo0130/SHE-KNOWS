import clothesIcon from '../assets/clothes.png'
import gymIcon from '../assets/gym.png'
import makeupIcon from '../assets/make-up.png'
import skinCareIcon from '../assets/skin-care.png'
import type { ProductCategory, ProductPost } from './Post'

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
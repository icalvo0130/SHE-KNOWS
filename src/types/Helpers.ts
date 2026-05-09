import clothesIcon from '../assets/clothes.png'
import gymIcon from '../assets/gym.png'
import makeupIcon from '../assets/make-up.png'
import skinCareIcon from '../assets/skin-care.png'
import type { ProductCategory } from './Post'

// Calcula el promedio de rating dado el rating del autor y el promedio comunitario
export const getAvgRating = (userRating: number, avgRating: number, communityCount: number): number => {
  if (communityCount === 0) return userRating
  return avgRating
}

export const formatRating = (r: number): string => r.toFixed(1)

export const CATEGORIES: ProductCategory[] = ['Make-Up', 'Skin Care', 'Clothes', 'Gym']

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  'Make-Up': makeupIcon,
  'Skin Care': skinCareIcon,
  'Clothes': clothesIcon,
  'Gym': gymIcon,
}

// Dominios institucionales permitidos para el registro
export const ALLOWED_DOMAINS = ['icesi.edu.co', 'javerianacali.edu.co']

export const isInstitutionalEmail = (email: string): boolean => {
  const parts = email.split('@')
  if (parts.length !== 2) return false
  return ALLOWED_DOMAINS.includes(parts[1])
}

export const ADJECTIVES = [
  'rosy', 'golden', 'sparkly', 'velvet', 'cherry', 'crystal', 'coral',
  'lavender', 'peony', 'opal', 'sunny', 'dreamy', 'glittery', 'silky',
  'breezy', 'dewy', 'misty', 'starry', 'blush', 'ivory',
]
export const NOUNS = [
  'butterfly', 'blossom', 'starlet', 'moonrise', 'petal', 'diamond',
  'tiara', 'dewdrop', 'sparkle', 'dahlia', 'magnolia', 'stardust',
  'pixie', 'glimmer', 'aurora', 'willow', 'ember', 'clover', 'pearl', 'rose',
]

export const generateUsername = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 999) + 1
  return `${adj}${noun}${num}`
}
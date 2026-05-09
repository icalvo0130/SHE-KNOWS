import clothesIcon from '../assets/clothes.png'
import gymIcon from '../assets/gym.png'
import makeupIcon from '../assets/make-up.png'
import skinCareIcon from '../assets/skin-care.png'
import type { ProductCategory } from './Post'

// Calcula el promedio de rating dado el rating del autor y el promedio comunitario
export const getAvgRating = (userRating: number, avgRating: number, communityCount: number): number => {
  // Si no hay votos de la comunidad, usa el rating del autor
  if (communityCount === 0) return userRating
  // Si hay votos de la comunidad, usa el promedio comunitario
  return avgRating
}

// Formatea el rating a un decimal
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

// Valida que el email sea institucional
export const isInstitutionalEmail = (email: string): boolean => {
  // Separa el email en [usuario, dominio]
  const parts = email.split('@')
  // Si no tiene exactamente dos partes, no es un email valido
  if (parts.length !== 2) return false
  // Verifica que el dominio este en la lista permitida
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
  // Elige un adjetivo aleatorio
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  // Elige un sustantivo aleatorio
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  // Genera un numero entre 1 y 999
  const num = Math.floor(Math.random() * 999) + 1
  // Combina los tres componentes en un username unico y bonito
  return `${adj}${noun}${num}`
}
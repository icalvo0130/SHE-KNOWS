import type { ProductPost } from '../../types/Post'

// Datos base que usa la seccion de productos
const NOW = Date.now()
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000

// Productos de ejemplo que llenan la pagina al inicio
export const initialPosts: ProductPost[] = [
  {
    id: 1,
    username: 'SoftVenom',
    avatarColor: '#fc007b',
    productName: 'Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f2e?w=600&q=80',
    category: 'Make-Up',
    userRating: 3,
    communityRatings: [4, 3, 4],
    description: 'Buena cobertura pero ligeramente oxidado después de unas horas.',
    comments: [],
    createdAt: NOW - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    productName: 'Fit Me Matte + Poreless Foundation',
    brand: 'Maybelline',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f2e?w=600&q=80',
    category: 'Make-Up',
    userRating: 4,
    communityRatings: [5, 4],
    description: 'Me encanta la textura, dura todo el día sin retoques.',
    comments: [],
    createdAt: NOW - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 3,
    username: 'CherryOracle',
    avatarColor: '#c60017',
    productName: 'Yoga Leggings High Waist',
    brand: 'Gymshark',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    category: 'Gym',
    userRating: 5,
    communityRatings: [5, 5, 4],
    description: 'Perfectos para el gym, no se transparentan y aguantan cualquier ejercicio.',
    comments: [],
    createdAt: NOW - ONE_WEEK - 1000,
  },
]
import { createContext, useState, useEffect, useContext } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../data/firebase'
import { supabase } from '../data/supabase'
import type { AuthContextType } from '../types/Auth'
import type { UserProfile } from '../types/Post'



export const AuthContext = createContext<AuthContextType | null>(null)

// Adjetivos para generar nombres de usuario lindos
const ADJECTIVES = [
  'rosy', 'golden', 'sparkly', 'velvet', 'cherry', 'crystal', 'coral',
  'lavender', 'peony', 'opal', 'sunny', 'dreamy', 'glittery', 'silky',
  'breezy', 'dewy', 'misty', 'starry', 'blush', 'ivory',
]
// Sustantivos para generar nombres de usuario lindos
const NOUNS = [
  'butterfly', 'blossom', 'starlet', 'moonrise', 'petal', 'diamond',
  'tiara', 'dewdrop', 'sparkle', 'dahlia', 'magnolia', 'stardust',
  'pixie', 'glimmer', 'aurora', 'willow', 'ember', 'clover', 'pearl', 'rose',
]

// Genera un nombre de usuario combinando un adjetivo, sustantivo y numero aleatorio
const generateUsername = (): string => {
  // Elige un adjetivo al azar de la lista
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  // Elige un sustantivo al azar de la lista
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  // Genera un numero aleatorio entre 1 y 999
  const num = Math.floor(Math.random() * 999) + 1
  // Combina todo en un username unico
  return `${adj}${noun}${num}`
}

// Crea un avatar bonito usando la API de dicebear y un nombre de usuario aleatorio
const fetchRandomProfile = async (): Promise<{ username: string; avatar_url: string }> => {
  // Genera una semilla aleatoria para que cada avatar sea diferente
  const seed = Math.random().toString(36).substring(2, 12)
  // Define los colores que puede usar el avatar
  const bgColors = 'ffcdd2,f8bbd0,fce4ec,f3e5f5,e1bee7,ffe0b2,fff9c4'
  return {
    username: generateUsername(),
    // Construccion de la URL del avatar con los parametros personalizados
    avatar_url: `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=${bgColors}`,
  }
}

// Busca el perfil de la usuaria en Supabase, o lo crea si es la primera vez que se registra
const getOrCreateProfile = async (firebaseUid: string): Promise<UserProfile | null> => {
  // Intenta buscar el perfil existente en la base de datos
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .single()

  // Si hay un error diferente a no encontrar nada, reporta el error
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching profile:', fetchError)
    return null
  }

  // Si el perfil ya existe, lo devolvemos
  if (existing) return existing as UserProfile

  // Si no existe, generamos un nuevo perfil
  const { username, avatar_url } = await fetchRandomProfile()

  // Insertamos el nuevo perfil en la base de datos
  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ firebase_uid: firebaseUid, username, avatar_url })
    .select()
    .single()

  // Si hay un error al crear el perfil, lo reporta
  if (insertError) {
    console.error('Error creating profile:', insertError)
    return null
  }

  // Devolvemos el perfil creado
  return created as UserProfile
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Almacena el usuario de Firebase si esta autenticado
  const [user, setUser] = useState<User | null>(null)
  // Almacena el perfil de la usuaria desde Supabase
  const [profile, setProfile] = useState<UserProfile | null>(null)
  // Indica si se esta cargando la informacion del usuario
  const [loading, setLoading] = useState(true)

  // Escucha cambios en el estado de autenticacion de Firebase
  useEffect(() => {
    // Se ejecuta automaticamente cuando el usuario se autentica o cierra sesion
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Actualiza el usuario actual
      setUser(currentUser)
      // Si hay un usuario autenticado, obtiene o crea su perfil
      if (currentUser) {
        const p = await getOrCreateProfile(currentUser.uid)
        setProfile(p)
      } else {
        // Si no hay usuario, limpia el perfil
        setProfile(null)
      }
      // Indica que ya termino de cargar
      setLoading(false)
    })
    // Limpia el listener al desmontar el componente
    return () => unsubscribe()
  }, [])

  // Autentica a la usuaria con email y contraseña
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  // Registra a una nueva usuaria con email y contraseña
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  // Cierra la sesion de la usuaria actual
  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
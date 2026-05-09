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

// Generador de usernames lindos
const ADJECTIVES = [
  'rosy', 'golden', 'sparkly', 'velvet', 'cherry', 'crystal', 'coral',
  'lavender', 'peony', 'opal', 'sunny', 'dreamy', 'glittery', 'silky',
  'breezy', 'dewy', 'misty', 'starry', 'blush', 'ivory',
]
const NOUNS = [
  'butterfly', 'blossom', 'starlet', 'moonrise', 'petal', 'diamond',
  'tiara', 'dewdrop', 'sparkle', 'dahlia', 'magnolia', 'stardust',
  'pixie', 'glimmer', 'aurora', 'willow', 'ember', 'clover', 'pearl', 'rose',
]

const generateUsername = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num = Math.floor(Math.random() * 999) + 1
  return `${adj}${noun}${num}`
}

// Genera avatar y username lindo
const fetchRandomProfile = async (): Promise<{ username: string; avatar_url: string }> => {
  const seed = Math.random().toString(36).substring(2, 12)
  const bgColors = 'ffcdd2,f8bbd0,fce4ec,f3e5f5,e1bee7,ffe0b2,fff9c4'
  return {
    username: generateUsername(),
    avatar_url: `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=${bgColors}`,
  }
}

// Busca el perfil de la usuaria en Supabase, o lo crea si es la primera vez
const getOrCreateProfile = async (firebaseUid: string): Promise<UserProfile | null> => {
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching profile:', fetchError)
    return null
  }

  if (existing) return existing as UserProfile

  const { username, avatar_url } = await fetchRandomProfile()

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ firebase_uid: firebaseUid, username, avatar_url })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating profile:', insertError)
    return null
  }

  return created as UserProfile
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const p = await getOrCreateProfile(currentUser.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

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
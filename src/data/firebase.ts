import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDQhHIyQnSOtFIpbIGlRI77vu4vOxuzLEE',
  authDomain: 'she-knows-93ed2.firebaseapp.com',
  projectId: 'she-knows-93ed2',
  storageBucket: 'she-knows-93ed2.firebasestorage.app',
  messagingSenderId: '7653534197',
  appId: '1:7653534197:web:1788f1a48b8786589518bc',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
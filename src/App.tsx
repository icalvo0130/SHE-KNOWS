import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/header/Header'
import { NavBar } from './components/navbar/NavBar'
import { GirlTalk } from './pages/GirlTalk/GirlTalk'
import { MenReview } from './pages/MenReview/MenReview'
import { Products } from './pages/Products/Products'
import { CategoryFeed } from './pages/Products/categoryFeed'
import { TopRated } from './pages/Products/toprated'
import { Profile } from './pages/Profile/Profile'
import { Login } from './pages/Login/Login'
import { Register } from './pages/Register/Register'
import { Welcome } from './pages/Welcome/Welcome'
import { NotFound } from './pages/NotFound/NotFound'
import { GirlTalkProvider } from './context/GirlTalkContext'
import { MenReviewProvider } from './context/Menreviewcontext'
import { ProductsProvider } from './context/Productscontext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectecRoute'
import './App.css'

const AUTH_ROUTES = ['/', '/login', '/register']

function App() {
  // Obtiene la ruta actual
  const location = useLocation()
  // Verifica si estamos en una pagina de autenticacion
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    // Envuelve toda la app en los proveedores de contexto
    <AuthProvider>
      <GirlTalkProvider>
        <MenReviewProvider>
          <ProductsProvider>
            <div className="app">
              {/* Muestra el header solo si no estamos en una pagina de autenticacion */}
              {!isAuthPage && <Header />}
              {/* Muestra la barra de navegacion solo si no estamos en una pagina de autenticacion */}
              {!isAuthPage && <NavBar />}
              {/* Ajusta el estilo del main segun si es pagina de auth o no */}
              <main className={isAuthPage ? 'app__main app__main--auth' : 'app__main'}>
                <Routes>
                  {/* Rutas publicas que no requieren autenticacion */}
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rutas privadas que requieren estar autenticado */}
                  <Route path="/girl-talk" element={<ProtectedRoute><GirlTalk /></ProtectedRoute>} />
                  <Route path="/men-review" element={<ProtectedRoute><MenReview /></ProtectedRoute>} />
                  <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                  <Route path="/products/:category" element={<ProtectedRoute><CategoryFeed /></ProtectedRoute>} />
                  <Route path="/products/:category/top-rated" element={<ProtectedRoute><TopRated /></ProtectedRoute>} />

                  {/* Perfil propio y perfil de otras usuarias */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                  {/* Ruta para paginas no encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </ProductsProvider>
        </MenReviewProvider>
      </GirlTalkProvider>
    </AuthProvider>
  )
}

export default App
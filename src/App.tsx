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
import './App.css'

// Rutas donde no se muestra header ni navbar
const AUTH_ROUTES = ['/', '/login', '/register']

function App() {
  const location = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(location.pathname)

  return (
    <GirlTalkProvider>
      <MenReviewProvider>
        <ProductsProvider>
          <div className="app">
            {!isAuthPage && <Header />}
            {!isAuthPage && <NavBar />}
            <main className={isAuthPage ? 'app__main app__main--auth' : 'app__main'}>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/girl-talk" element={<GirlTalk />} />
                <Route path="/men-review" element={<MenReview />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<CategoryFeed />} />
                <Route path="/products/:category/top-rated" element={<TopRated />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ProductsProvider>
      </MenReviewProvider>
    </GirlTalkProvider>
  )
}

export default App
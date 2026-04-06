import { Route, Routes } from 'react-router-dom'
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
import { NotFound } from './pages/NotFound/NotFound'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <NavBar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<GirlTalk />} />
          <Route path="/girl-talk" element={<GirlTalk />} />
          <Route path="/men-review" element={<MenReview />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<CategoryFeed />} />
          <Route path="/products/:category/top-rated" element={<TopRated />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
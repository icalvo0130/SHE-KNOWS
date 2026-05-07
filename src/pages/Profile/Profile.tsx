import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { ProductsContext } from '../../context/Productscontext'
import { Flag, Star, MessageSquare, Heart } from 'lucide-react'
import './Profile.css'

// Pestanas del perfil
type ProfileTab = 'Girl Talk' | 'Rate a man' | 'Rate a Product'
const TABS: ProfileTab[] = ['Girl Talk', 'Rate a man', 'Rate a Product']

// Nombre de la usuaria en sesion (placeholder hasta conectar Firebase)
const CURRENT_USER = 'CherryOracle'
const CURRENT_AVATAR_COLOR = '#c60017'

export const Profile = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTab>('Girl Talk')

  const { posts: girlTalkPosts, handleLike } = useContext(GirlTalkContext)!
  const { posts: menReviewPosts } = useContext(MenReviewContext)!
  const { posts: productPosts } = useContext(ProductsContext)!

  // Filtra solo los posts del usuario actual
  const myGirlTalkPosts = girlTalkPosts.filter((p) => p.username === CURRENT_USER)
  const myMenReviewPosts = menReviewPosts.filter((p) => p.username === CURRENT_USER)
  const myProductPosts = productPosts.filter((p) => p.username === CURRENT_USER)

  const handleLogout = () => {
    // Aqui se desconectara Firebase en la rama feature/auth
    navigate('/')
  }

  return (
    <div className="profile">
      {/* Cabecera con avatar y boton de salir */}
      <div className="profile__header">
        <button className="profile__logout" onClick={handleLogout}>
          Log Out
        </button>
        <div className="profile__avatar-wrap">
          <div className="profile__avatar" style={{ backgroundColor: CURRENT_AVATAR_COLOR }} />
        </div>
      </div>

      {/* Nombre de usuario */}
      <p className="profile__username">{CURRENT_USER}</p>

      {/* Pestanas de tipo de contenido */}
      <div className="profile__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`profile__tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido segun la pestana activa */}
      <div className="profile__feed">
        {activeTab === 'Girl Talk' && (
          myGirlTalkPosts.length === 0
            ? <p className="profile__empty">No posts yet.</p>
            : myGirlTalkPosts.map((post) => (
              <div key={post.id} className="profile__post-card">
                <div className="profile__post-header">
                  <div className="profile__post-avatar" style={{ backgroundColor: post.avatarColor }} />
                  <span className="profile__post-username">{post.username}</span>
                </div>
                <p className="profile__post-text">{post.text}</p>
                <div className="profile__post-actions">
                  <span className="profile__post-action">
                    <MessageSquare size={14} /> {post.comments.length}
                  </span>
                  <button
                    className={`profile__post-action profile__post-like ${post.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={14} fill={post.liked ? 'currentColor' : 'none'} /> {post.likes}
                  </button>
                </div>
              </div>
            ))
        )}

        {activeTab === 'Rate a man' && (
          myMenReviewPosts.length === 0
            ? <p className="profile__empty">No posts yet.</p>
            : myMenReviewPosts.map((post) => (
              <div key={post.id} className="profile__post-card">
                <div className="profile__post-header">
                  <div className="profile__post-avatar" style={{ backgroundColor: post.avatarColor }} />
                  <span className="profile__post-username">{post.username}</span>
                </div>
                <p className="profile__post-man-name">{post.manName}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.manName} className="profile__post-img" />
                )}
                <p className="profile__post-text">{post.description}</p>
                <div className="profile__post-actions">
                  <span className="profile__post-action green">
                    <Flag size={14} color="#2e7d32" fill="#2e7d32" /> {post.greenFlags}
                  </span>
                  <span className="profile__post-action red">
                    <Flag size={14} color="#e53935" fill="#e53935" /> {post.redFlags}
                  </span>
                </div>
              </div>
            ))
        )}

        {activeTab === 'Rate a Product' && (
          myProductPosts.length === 0
            ? <p className="profile__empty">No posts yet.</p>
            : myProductPosts.map((post) => (
              <div key={post.id} className="profile__post-card">
                <div className="profile__post-header">
                  <div className="profile__post-avatar" style={{ backgroundColor: post.avatarColor }} />
                  <span className="profile__post-username">{post.username}</span>
                </div>
                <p className="profile__post-man-name">{post.productName}</p>
                <p className="profile__post-brand">{post.brand}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.productName} className="profile__post-img" />
                )}
                <p className="profile__post-text">{post.description}</p>
                <div className="profile__post-actions">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      color="#e0a800"
                      fill={s <= post.userRating ? '#e0a800' : 'none'}
                    />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
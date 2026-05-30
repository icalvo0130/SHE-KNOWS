import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { ProductsContext } from '../../context/Productscontext'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../data/supabase'
import { Flag, ArrowLeft, Trash2 } from 'lucide-react'
import { PostCard } from '../../components/PostCard/PostCard'
import { ProductCard } from '../../components/ProductsCard/ProductCard'
import type { UserProfile } from '../../types/Post'
import './Profile.css'
import '../MenReview/MenReview.css'

import topRatedBanner from '../../assets/TopRated.png'
import productsBanner from '../../assets/Products.png'
import menReviewBanner from '../../assets/MenReviewPic.png'
import girlTalkBanner from '../../assets/girltalkbanner..png'

type ProfileTab = 'Girl Talk' | 'Rate a man' | 'Rate a Product'
const TABS: ProfileTab[] = ['Girl Talk', 'Rate a man', 'Rate a Product']

export const Profile = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId?: string }>()

  const auth = useContext(AuthContext)
  const { posts: girlTalkPosts, handleLike, handleComment: handleGirlTalkComment, deletePost: deleteGirlTalk } = useContext(GirlTalkContext)!
  const { posts: menReviewPosts, handleVote, deletePost: deleteMenReview } = useContext(MenReviewContext)!
  const { posts: productPosts, handleComment: handleProductComment, deletePost: deleteProduct } = useContext(ProductsContext)!

  const [activeTab, setActiveTab] = useState<ProfileTab>('Girl Talk')

  const isOwnProfile = !userId || userId === auth?.profile?.id
  // Indica el perfil que estamos visitando (si no es el propio)
  const [visitedProfile, setVisitedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Si estamos viendo el perfil de otra usuaria, lo traemos desde Supabase
    if (!isOwnProfile && userId) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          // Si la consulta fue exitosa, guardamos el perfil visitado
          if (!error && data) setVisitedProfile(data as UserProfile)
        })
    } else {
      // Si es el propio perfil, no necesitamos datos externos
      setVisitedProfile(null)
    }
    // Se vuelve a ejecutar cuando cambia el id de la ruta o si es el propio perfil
  }, [userId, isOwnProfile])

  // Perfil que se muestra en la pagina: propio o el visitado
  const shownProfile = isOwnProfile ? auth?.profile : visitedProfile
  // Id a usar para filtrar posts (puede ser el propio o el del usuario visitado)
  const targetId = isOwnProfile ? auth?.profile?.id : userId

  // Filtra los posts de cada feed para mostrar solo los que pertenecen al usuario objetivo
  const myGirlTalkPosts = girlTalkPosts.filter((p) => p.user_id === targetId)
  const myMenReviewPosts = menReviewPosts.filter((p) => p.user_id === targetId)
  const myProductPosts = productPosts.filter((p) => p.user_id === targetId)

  const handleLogout = async () => {
    await auth?.logout()
    navigate('/')
  }

  const handleDeleteMenReview = async (id: string) => {
    if (!window.confirm('Delete this review?')) return
    await deleteMenReview(id)
  }

  return (
    <div className="profile">
      <div className="profile__layout">
        <div className="profile__feed">
          {/* Cabecera con avatar grande y nombre al lado */}
          <div className="profile__header-area">
            {!isOwnProfile && (
              <button className="profile__back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} /> Back
              </button>
            )}

            <div className="profile__user-info-row">
              <div className="profile__avatar-container">
                {shownProfile?.avatar_url ? (
                  <img src={shownProfile.avatar_url} alt={shownProfile.username} className="profile__avatar" />
                ) : (
                  <div className="profile__avatar" />
                )}
              </div>
              <p className="profile__username">{shownProfile?.username ?? ''}</p>
            </div>

            {isOwnProfile && (
              <button className="profile__logout" onClick={handleLogout}>
                Log Out <span className="profile__logout-icon">➜</span>
              </button>
            )}
          </div>

          {/* Username para mobile — aparece debajo del header rojo, encima de los tabs */}

          <div className="profile__tabs">            {TABS.map((tab) => (
              <button
                key={tab}
                className={`profile__tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="profile__posts">
            {/* Girl Talk — usa PostCard igual que el feed */}
            {activeTab === 'Girl Talk' && (
              myGirlTalkPosts.length === 0
                ? <p className="profile__empty">No posts yet.</p>
                : myGirlTalkPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleGirlTalkComment}
                    onDelete={deleteGirlTalk}
                  />
                ))
            )}

            {/* Rate a man — usa el mismo review-card del feed de MenReview */}
            {activeTab === 'Rate a man' && (
              myMenReviewPosts.length === 0
                ? <p className="profile__empty">No posts yet.</p>
                : myMenReviewPosts.map((post) => (
                  <div key={post.id} className="review-card">
                    <div className="review-card__header">
                      {post.avatar_url ? (
                        <img src={post.avatar_url} alt={post.username} className="review-card__avatar" />
                      ) : (
                        <div className="review-card__avatar" />
                      )}
                      <button
                        className="review-card__username-btn"
                        onClick={() =>
                          post.user_id === auth?.profile?.id
                            ? navigate('/profile')
                            : navigate(`/profile/${post.user_id}`)
                        }
                      >
                        {post.username}
                      </button>
                      {isOwnProfile && (
                        <button
                          className="review-card__delete-btn"
                          onClick={() => handleDeleteMenReview(post.id)}
                          aria-label="Delete review"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <span className="review-card__man-name">{post.manName}</span>

                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.manName} className="review-card__image" />
                    )}

                    <p className="review-card__description">{post.description}</p>

                    <div className="review-card__votes">
                      <button
                        className={`review-card__vote-btn ${post.userVote === 'red' ? 'voted-red' : ''}`}
                        onClick={() => handleVote(post.id, 'red')}
                      >
                        <Flag size={16} color="#e53935" fill={post.userVote === 'red' ? '#e53935' : 'none'} />
                        {post.redFlags}
                      </button>
                      <button
                        className={`review-card__vote-btn ${post.userVote === 'green' ? 'voted-green' : ''}`}
                        onClick={() => handleVote(post.id, 'green')}
                      >
                        <Flag size={16} color="#2e7d32" fill={post.userVote === 'green' ? '#2e7d32' : 'none'} />
                        {post.greenFlags}
                      </button>
                    </div>
                  </div>
                ))
            )}

            {/* Rate a Product — usa ProductCard igual que el feed */}
            {activeTab === 'Rate a Product' && (
              myProductPosts.length === 0
                ? <p className="profile__empty">No posts yet.</p>
                : myProductPosts.map((post) => (
                  <ProductCard
                    key={post.id}
                    post={post}
                    onComment={handleProductComment}
                    onDelete={deleteProduct}
                  />
                ))
            )}
          </div>
        </div>

        {/* Right Sidebar Banners */}
        <aside className="profile__sidebar">
          <p className="profile__sidebar-title">Don't miss this..</p>
          <div className="profile__sidebar-banners">
            <img src={topRatedBanner} alt="Top Rated" className="profile__banner-img" />
            <img src={productsBanner} alt="Products We Trust" className="profile__banner-img" />
            <img src={menReviewBanner} alt="Men Under Review" className="profile__banner-img" />
            <img src={girlTalkBanner} alt="Girl Talk" className="profile__banner-img" />
          </div>
        </aside>
      </div>
    </div>
  )
}
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { ProductsContext } from '../../context/Productscontext'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../data/supabase'
import { Flag, Star, MessageSquare, Heart, ArrowLeft } from 'lucide-react'
import type { UserProfile } from '../../types/Post'
import './Profile.css'

type ProfileTab = 'Girl Talk' | 'Rate a man' | 'Rate a Product'
const TABS: ProfileTab[] = ['Girl Talk', 'Rate a man', 'Rate a Product']

export const Profile = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId?: string }>()

  const auth = useContext(AuthContext)
  const { posts: girlTalkPosts, handleLike } = useContext(GirlTalkContext)!
  const { posts: menReviewPosts } = useContext(MenReviewContext)!
  const { posts: productPosts } = useContext(ProductsContext)!

  const [activeTab, setActiveTab] = useState<ProfileTab>('Girl Talk')

  // Si hay userId en la URL y es diferente al usuario actual, estamos viendo el perfil de otra
  const isOwnProfile = !userId || userId === auth?.profile?.id
  const [visitedProfile, setVisitedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (!isOwnProfile && userId) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) setVisitedProfile(data as UserProfile)
        })
    } else {
      setVisitedProfile(null)
    }
  }, [userId, isOwnProfile])

  const shownProfile = isOwnProfile ? auth?.profile : visitedProfile
  const targetId = isOwnProfile ? auth?.profile?.id : userId

  const myGirlTalkPosts = girlTalkPosts.filter((p) => p.user_id === targetId)
  const myMenReviewPosts = menReviewPosts.filter((p) => p.user_id === targetId)
  const myProductPosts = productPosts.filter((p) => p.user_id === targetId)

  const handleLogout = async () => {
    await auth?.logout()
    navigate('/')
  }

  return (
    <div className="profile">
      {/* Cabecera con avatar */}
      <div className="profile__header">
        {!isOwnProfile && (
          <button className="profile__back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
        )}
        {isOwnProfile && (
          <button className="profile__logout" onClick={handleLogout}>
            Log Out
          </button>
        )}
        <div className="profile__avatar-wrap">
          {shownProfile?.avatar_url ? (
            <img
              src={shownProfile.avatar_url}
              alt={shownProfile.username}
              className="profile__avatar"
            />
          ) : (
            <div className="profile__avatar" />
          )}
        </div>
      </div>

      <p className="profile__username">{shownProfile?.username ?? ''}</p>

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

      <div className="profile__feed">
        {activeTab === 'Girl Talk' && (
          myGirlTalkPosts.length === 0
            ? <p className="profile__empty">No posts yet.</p>
            : myGirlTalkPosts.map((post) => (
              <div key={post.id} className="profile__post-card">
                <div className="profile__post-header">
                  <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
                  <span className="profile__post-username">{post.username}</span>
                </div>
                <p className="profile__post-text">{post.text}</p>
                <div className="profile__post-actions">
                  <span className="profile__post-action">
                    <MessageSquare size={14} /> {post.comments.length}
                  </span>
                  <button
                    className={`profile__post-action profile__post-like ${post.liked ? 'liked' : ''}`}
                    onClick={() => isOwnProfile && handleLike(post.id)}
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
                  <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
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
                  <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
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
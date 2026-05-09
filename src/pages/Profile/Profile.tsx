import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import { MenReviewContext } from '../../context/Menreviewcontext'
import { ProductsContext } from '../../context/Productscontext'
import { AuthContext } from '../../context/AuthContext'
import { supabase } from '../../data/supabase'
import { Flag, Star, MessageSquare, Heart, ArrowLeft, Trash2 } from 'lucide-react'
import type { UserProfile } from '../../types/Post'
import './Profile.css'

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
  const { posts: girlTalkPosts, handleLike, deletePost: deleteGirlTalk } = useContext(GirlTalkContext)!
  const { posts: menReviewPosts, deletePost: deleteMenReview } = useContext(MenReviewContext)!
  const { posts: productPosts, deletePost: deleteProduct } = useContext(ProductsContext)!

  const [activeTab, setActiveTab] = useState<ProfileTab>('Girl Talk')

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

          <div className="profile__posts">
            {activeTab === 'Girl Talk' && (
              myGirlTalkPosts.length === 0
                ? <p className="profile__empty">No posts yet.</p>
                : myGirlTalkPosts.map((post) => (
                  <div key={post.id} className="profile__post-card">
                    <div className="profile__post-header">
                      {post.avatar_url ? (
                         <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
                      ) : (
                         <div className="profile__post-avatar empty" />
                      )}
                      <span className="profile__post-username">{post.username}</span>
                      {isOwnProfile && (
                        <button className="profile__post-delete" onClick={() => deleteGirlTalk(post.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
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
                      {post.avatar_url ? (
                         <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
                      ) : (
                         <div className="profile__post-avatar empty" />
                      )}
                      <span className="profile__post-username">{post.username}</span>
                      {isOwnProfile && (
                        <button className="profile__post-delete" onClick={() => deleteMenReview(post.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    {/* According to the mockup, the feed format looks similar to Girl Talk even for Rate a Man? 
                        The user mockup shows generic text for the posts. We'll show the standard text. */}
                    <p className="profile__post-text">{post.description}</p>
                    <div className="profile__post-actions">
                      <span className="profile__post-action">
                        <MessageSquare size={14} /> {post.comments.length}
                      </span>
                      <button className="profile__post-action profile__post-like">
                        <Heart size={14} fill="none" /> 760
                      </button>
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
                      {post.avatar_url ? (
                         <img src={post.avatar_url} alt={post.username} className="profile__post-avatar" />
                      ) : (
                         <div className="profile__post-avatar empty" />
                      )}
                      <span className="profile__post-username">{post.username}</span>
                      {isOwnProfile && (
                        <button className="profile__post-delete" onClick={() => deleteProduct(post.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="profile__post-text">{post.description}</p>
                    <div className="profile__post-actions">
                      <span className="profile__post-action">
                        <MessageSquare size={14} /> {post.comments.length}
                      </span>
                      <button className="profile__post-action profile__post-like">
                        <Heart size={14} fill="none" /> 760
                      </button>
                    </div>
                  </div>
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
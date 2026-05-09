import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '../../components/PostCard/PostCard'
import { GirlTalkContext } from '../../context/GirlTalkContext'
import girlTalkBanner from '../../assets/girltalkbanner..png'
import topRatedImg from '../../assets/TopRated.png'
import productsTrustImg from '../../assets/Products.png'
import menReviewImg from '../../assets/MenReviewPic.png'
import './GirlTalk.css'

export const GirlTalk = () => {
  const { posts, handleLike, handleComment, deletePost } = useContext(GirlTalkContext)!

  return (
    <div className="girl-talk">
      {/* Zona principal con mensajes y barra lateral */}
      <div className="girl-talk__layout">
        {/* Lista de mensajes y banner principal */}
        <div className="girl-talk__feed">
          <div className="girl-talk__banner">
            <img src={girlTalkBanner} alt="Girl Talk" />
          </div>

          {/* Mensajes de la comunidad */}
          <div className="girl-talk__posts">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onDelete={deletePost}
              />
            ))}
          </div>
        </div>

        {/* Accesos rapidos a otras secciones */}
        <aside className="girl-talk__sidebar">
          <p className="girl-talk__sidebar-title">Don&apos;t miss this..</p>
          <Link to="/products" className="girl-talk__sidebar-card">
            <img src={topRatedImg} alt="Top Rated" />
          </Link>
          <Link to="/products" className="girl-talk__sidebar-card">
            <img src={productsTrustImg} alt="Products We Trust" />
          </Link>
          <Link to="/men-review" className="girl-talk__sidebar-card">
            <img src={menReviewImg} alt="Men Under Review" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
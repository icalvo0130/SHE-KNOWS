import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '../../components/PostCard/PostCard'
import type { GirlTalkPost } from '../../types/Post'
import girlTalkBanner from '../../assets/GirlTalkPic.png'
import topRatedImg from '../../assets/TopRated.png'
import productsTrustImg from '../../assets/Products.png'
import menReviewImg from '../../assets/MenReviewPic.png'
import './GirlTalk.css'

const AVATAR_COLORS = ['#fd6fae', '#c60017', '#fc007b', '#ffc1d8', '#ff6b6b', '#e91e8c']
const getRandomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

const initialPosts: GirlTalkPost[] = [
  {
    id: 1,
    username: 'VelvetLuna',
    avatarColor: '#fd6fae',
    text: 'He said he \u201cdoesn\u2019t believe in labels\u201d but acts jealous when I go out. Make it make sense.',
    likes: 15,
    liked: false,
    comments: [
      { id: 1, username: 'CherryOracle', avatarColor: '#c60017', text: 'Red flag wrapped in a riddle \uD83D\uDEA9' },
    ],
  },
  {
    id: 2,
    username: 'CherryOracle',
    avatarColor: '#c60017',
    text: "I\u2019m going to my first Pilates class tomorrow and I\u2019m terrified. Do I need to be flexible already or do I just show up and pretend?",
    likes: 15,
    liked: false,
    comments: [],
  },
  {
    id: 3,
    username: 'SoftVenom',
    avatarColor: '#fc007b',
    text: 'I urgently need a healthy snack I can eat in questionable quantities without guilt. Does that even exist or is it a myth?',
    likes: 15,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    username: 'SoftVenom',
    avatarColor: '#ffc1d8',
    text: "Has anyone experienced the horror of using your boyfriend\u2019s bathroom and it won\u2019t flush. I am currently living this nightmare. Immediate solutions appreciated.",
    likes: 9,
    liked: false,
    comments: [],
  },
]

let nextId = initialPosts.length + 1
let nextCommentId = 10

type GirlTalkProps = {
  newPostText?: string
}

export const GirlTalk = ({ newPostText }: GirlTalkProps) => {
  const [posts, setPosts] = useState<GirlTalkPost[]>(() => {
    if (newPostText) {
      return [
        {
          id: nextId++,
          username: 'AnonymousCat',
          avatarColor: getRandomColor(),
          text: newPostText,
          likes: 0,
          liked: false,
          comments: [],
        },
        ...initialPosts,
      ]
    }
    return initialPosts
  })

  const addPost = (text: string) => {
    const newPost: GirlTalkPost = {
      id: nextId++,
      username: 'AnonymousCat',
      avatarColor: getRandomColor(),
      text,
      likes: 0,
      liked: false,
      comments: [],
    }
    setPosts((prev) => [newPost, ...prev])
  }

  // Expose addPost via a ref-like pattern using window for sibling communication
  // (will be replaced with Context later)
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__addGirlTalkPost = addPost
  }

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
  }

  const handleComment = (postId: number, text: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { id: nextCommentId++, username: 'AnonymousCat', avatarColor: getRandomColor(), text },
              ],
            }
          : post
      )
    )
  }

  return (
    <div className="girl-talk">
      <div className="girl-talk__layout">
        <div className="girl-talk__feed">
          <div className="girl-talk__banner">
            <img src={girlTalkBanner} alt="Girl Talk" />
          </div>

          <div className="girl-talk__posts">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        </div>

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
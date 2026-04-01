import { useState, useEffect, useRef } from 'react'
import type { ProductCategory, ProductPost } from '../../../types/Post'
import '../../Popup/Popup.css'
import './ReviewProductForm.css'

type ReviewProductFormProps = {
  onClose: () => void
}

/* Makeup API product shape (only fields we use) */
interface MakeupApiProduct {
  id: number
  name: string
  brand: string
  image_link: string
  product_type: string
}

const CATEGORIES: ProductCategory[] = ['Make-Up', 'Skin Care', 'Clothes', 'Gym']

const AVATAR_COLORS = ['#fd6fae', '#c60017', '#fc007b', '#ffc1d8', '#ff6b6b']
const getRandomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

const StarFilledIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const StarEmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
)

export const ReviewProductForm = ({ onClose }: ReviewProductFormProps) => {
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [description, setDescription] = useState('')

  const [suggestions, setSuggestions] = useState<MakeupApiProduct[]>([])
  const [loadingApi, setLoadingApi] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const canPost =
    productName.trim() !== '' &&
    brand.trim() !== '' &&
    category !== '' &&
    rating > 0 &&
    description.trim() !== ''

  /* Fetch from Makeup API when user types */
  useEffect(() => {
    if (productName.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    searchTimeout.current = setTimeout(() => {
      setLoadingApi(true)
      setApiError(false)
      fetch(
        `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${encodeURIComponent(productName)}`
      )
        .then((res) => {
          if (!res.ok) throw new Error('API error')
          return res.json()
        })
        .then((data: MakeupApiProduct[]) => {
          // Also search by name if brand search returns nothing
          const byBrand = data.slice(0, 8)
          setSuggestions(byBrand)
          setShowSuggestions(true)
          setLoadingApi(false)
        })
        .catch(() => {
          // Try searching all products and filter client-side
          fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
            .then((r) => r.json())
            .then((all: MakeupApiProduct[]) => {
              const filtered = all
                .filter(
                  (p) =>
                    p.name.toLowerCase().includes(productName.toLowerCase()) ||
                    (p.brand && p.brand.toLowerCase().includes(productName.toLowerCase()))
                )
                .slice(0, 8)
              setSuggestions(filtered)
              setShowSuggestions(true)
            })
            .catch(() => {
              setApiError(true)
            })
            .finally(() => setLoadingApi(false))
        })
    }, 400)

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [productName])

  const handleSelectSuggestion = (product: MakeupApiProduct) => {
    setProductName(product.name)
    setBrand(product.brand || '')
    setImageUrl(product.image_link || '')
    setLocalImageUrl(null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLocalImageUrl(ev.target?.result as string)
      setImageUrl('')
    }
    reader.readAsDataURL(file)
  }

  const handlePost = () => {
    if (!canPost) return

    const newPost: ProductPost = {
      id: Date.now(),
      username: 'AnonymousCat',
      avatarColor: getRandomColor(),
      productName: productName.trim(),
      brand: brand.trim(),
      imageUrl: localImageUrl ?? imageUrl,
      category: category as ProductCategory,
      userRating: rating,
      communityRatings: [],
      description: description.trim(),
      comments: [],
      createdAt: Date.now(),
    }

    const addPost = (window as unknown as Record<string, unknown>).__addProductPost as
      | ((p: ProductPost) => void)
      | undefined
    if (addPost) addPost(newPost)
    onClose()
  }

  const displayImage = localImageUrl ?? imageUrl

  return (
    <>
      {/* Mobile header */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>Cancel</button>
        <span className="Popup__mobile-header-title">Post</span>
        <button
          className="Popup__mobile-header-post"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>

      <h2 className="review-product-form__title">Review a product</h2>
      <button className="Popup__close" onClick={onClose}>✕</button>

      <div className="review-product-form__grid">
        {/* ---- Left column ---- */}
        <div className="review-product-form__col">

          {/* Step 1: Product name + brand + picture */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">1</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">Product name</p>

              <div className="review-product-form__autocomplete">
                <input
                  className="review-product-form__input"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search or type a product..."
                  autoComplete="off"
                />

                {showSuggestions && (
                  <div className="review-product-form__suggestions">
                    {loadingApi && (
                      <p className="review-product-form__loading">Searching...</p>
                    )}
                    {!loadingApi && apiError && (
                      <p className="review-product-form__loading">
                        API not available — fill fields manually ✍️
                      </p>
                    )}
                    {!loadingApi && !apiError && suggestions.length === 0 && (
                      <p className="review-product-form__loading">No results — fill manually</p>
                    )}
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        className="review-product-form__suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(s)}
                      >
                        <img
                          src={s.image_link}
                          alt={s.name}
                          className="review-product-form__suggestion-img"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <div className="review-product-form__suggestion-info">
                          <p className="review-product-form__suggestion-name">{s.name}</p>
                          <p className="review-product-form__suggestion-brand">{s.brand}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand sub-field */}
              <div className="review-product-form__sub-field">
                <p className="review-product-form__sub-label">Brand</p>
                <div className="review-product-form__select-wrap">
                  <input
                    className="review-product-form__input"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
              </div>

              {/* Picture sub-field */}
              <div className="review-product-form__sub-field">
                <p className="review-product-form__sub-label">Picture</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  className="review-product-form__upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon />
                  {displayImage ? 'Change picture' : 'Upload picture'}
                </button>
                {displayImage && (
                  <img
                    src={displayImage}
                    alt="preview"
                    className="review-product-form__preview-img"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Category */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">2</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">Category</p>
              <div className="review-product-form__select-wrap">
                <select
                  className="review-product-form__select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Right column ---- */}
        <div className="review-product-form__col">

          {/* Step 3 (desktop) / Step 3 (mobile): Rating */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">3</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">Your rating</p>
              <div className="review-product-form__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="review-product-form__star"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} stars`}
                  >
                    {star <= (hoverRating || rating) ? <StarFilledIcon /> : <StarEmptyIcon />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4 (desktop) / Step 4 (mobile): Description */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">4</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">What did you think about it?</p>
              <textarea
                className="review-product-form__textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your honest review..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="review-product-form__footer">
        <button
          className="review-product-form__post-btn"
          onClick={handlePost}
          disabled={!canPost}
        >
          Post
        </button>
      </div>
    </>
  )
}
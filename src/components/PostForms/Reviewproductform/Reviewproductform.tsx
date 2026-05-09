import { useState, useEffect, useRef, useContext } from 'react'
import { X, Upload, Star, ChevronDown } from 'lucide-react'
import { supabase } from '../../../data/supabase'
import { AuthContext } from '../../../context/AuthContext'
import type { ProductCategory, ProductPost } from '../../../types/Post'
import '../../Popup/Popup.css'
import './Reviewproductform.css'

type ReviewProductFormProps = {
  onClose: () => void
  onPost: (post: Omit<ProductPost, 'id' | 'user_id' | 'username' | 'avatar_url' | 'avgRating' | 'communityRatingCount' | 'comments' | 'createdAt'>) => Promise<void>
}

interface MakeupApiProduct {
  id: number
  name: string
  brand: string
  image_link: string
  product_type: string
}

const CATEGORIES: ProductCategory[] = ['Make-Up', 'Skin Care', 'Clothes', 'Gym']

export const ReviewProductForm = ({ onClose, onPost }: ReviewProductFormProps) => {
  const auth = useContext(AuthContext)

  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [category, setCategory] = useState<ProductCategory | ''>('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [description, setDescription] = useState('')
  const [suggestions, setSuggestions] = useState<MakeupApiProduct[]>([])
  const [loadingApi, setLoadingApi] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Solo deja publicar cuando todo lo necesario esta listo
  const canPost = productName.trim() !== '' && brand.trim() !== '' && category !== '' && rating > 0 && description.trim() !== '' && !uploading

  // Busca sugerencias en la API de makeup mientras se escribe el nombre
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
      fetch(`https://makeup-api.herokuapp.com/api/v1/products.json?brand=${encodeURIComponent(productName)}`)
        .then((res) => { if (!res.ok) throw new Error(); return res.json() })
        .then((data: MakeupApiProduct[]) => {
          setSuggestions(data.slice(0, 8))
          setShowSuggestions(true)
          setLoadingApi(false)
        })
        .catch(() => {
          fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
            .then((r) => r.json())
            .then((all: MakeupApiProduct[]) => {
              const filtered = all.filter((p) =>
                p.name.toLowerCase().includes(productName.toLowerCase()) ||
                (p.brand && p.brand.toLowerCase().includes(productName.toLowerCase()))
              ).slice(0, 8)
              setSuggestions(filtered)
              setShowSuggestions(true)
            })
            .catch(() => setApiError(true))
            .finally(() => setLoadingApi(false))
        })
    }, 400)
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [productName])

  // Usa una sugerencia de la API y rellena varios campos automaticamente
  const handleSelectSuggestion = (product: MakeupApiProduct) => {
    setProductName(product.name)
    setBrand(product.brand || '')
    setImageUrl(product.image_link || '')
    setImageFile(null)
    setImagePreview(null)
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Guarda el archivo y genera una vista previa local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImageUrl('')
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Sube la imagen seleccionada al bucket de Supabase y retorna la URL publica
  const uploadImage = async (): Promise<string> => {
    if (!imageFile || !auth?.profile) return imageUrl
    const ext = imageFile.name.split('.').pop()
    const path = `products/${auth.profile.id}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, imageFile, { upsert: false })

    if (error) {
      console.error('Error uploading image:', error)
      return imageUrl
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handlePost = async () => {
    if (!canPost) return
    setUploading(true)

    const finalImageUrl = await uploadImage()

    await onPost({
      productName: productName.trim(),
      brand: brand.trim(),
      imageUrl: finalImageUrl,
      category: category as ProductCategory,
      userRating: rating,
      description: description.trim(),
    })

    setUploading(false)
    onClose()
  }

  const displayImage = imagePreview ?? imageUrl

  return (
    <>
      {/* Barra de acciones en celular */}
      <div className="Popup__mobile-header">
        <button className="Popup__mobile-header-cancel" onClick={onClose}>Cancel</button>
        <span className="Popup__mobile-header-title">Post</span>
        <button className="Popup__mobile-header-post" onClick={handlePost} disabled={!canPost}>Post</button>
      </div>

      {/* Titulo de la ventana */}
      <h2 className="review-product-form__title">Review a product</h2>
      <button className="Popup__close" onClick={onClose}><X size={20} /></button>

      {/* Campos principales del formulario en dos columnas */}
      <div className="review-product-form__grid">
        <div className="review-product-form__col">
          {/* Paso uno con datos y foto */}
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
                    {loadingApi && <p className="review-product-form__loading">Searching...</p>}
                    {!loadingApi && apiError && <p className="review-product-form__loading">API not available — fill fields manually</p>}
                    {!loadingApi && !apiError && suggestions.length === 0 && <p className="review-product-form__loading">No results — fill manually</p>}
                    {suggestions.map((s) => (
                      <button key={s.id} className="review-product-form__suggestion-item" onMouseDown={() => handleSelectSuggestion(s)}>
                        <img src={s.image_link} alt={s.name} className="review-product-form__suggestion-img" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        <div className="review-product-form__suggestion-info">
                          <p className="review-product-form__suggestion-name">{s.name}</p>
                          <p className="review-product-form__suggestion-brand">{s.brand}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="review-product-form__sub-field">
                <p className="review-product-form__sub-label">Brand</p>
                <input className="review-product-form__input" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" />
              </div>

              <div className="review-product-form__sub-field">
                <p className="review-product-form__sub-label">Picture</p>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                <button className="review-product-form__upload-btn" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={18} />
                  {displayImage ? 'Change picture' : 'Upload picture'}
                </button>
                {displayImage && <img src={displayImage} alt="preview" className="review-product-form__preview-img" />}
              </div>
            </div>
          </div>

          {/* Paso dos con la categoria */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">2</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">Category</p>
              <div className="review-product-form__select-wrap">
                <select className="review-product-form__select" value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className="review-product-form__chevron" />
              </div>
            </div>
          </div>
        </div>

        <div className="review-product-form__col">
          {/* Paso tres con la nota */}
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
                    <Star size={32} color="#e0a800" fill={star <= (hoverRating || rating) ? '#e0a800' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paso cuatro con la descripcion */}
          <div className="review-product-form__step">
            <div className="review-product-form__step-num">4</div>
            <div className="review-product-form__step-content">
              <p className="review-product-form__step-label">What did you think about it?</p>
              <textarea className="review-product-form__textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Share your honest review..." />
            </div>
          </div>
        </div>
      </div>

      {/* Boton final para publicar */}
      <div className="review-product-form__footer">
        <button className="review-product-form__post-btn" onClick={handlePost} disabled={!canPost}>
          {uploading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </>
  )
}
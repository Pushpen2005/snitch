import { useState, useRef } from 'react'
import { useProduct } from '../hook/useProduct.js'
import { useNavigate, Link } from 'react-router'

export default function CreateProduct() {
  const { handleCreateProduct } = useProduct()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', priceAmount: '', priceCurrency: 'USD' })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (images.length + selectedFiles.length > 7) {
        alert('You can only upload up to 7 images.')
        return
      }
      setImages(prev => [...prev, ...selectedFiles])
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
      setPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('priceAmount', form.priceAmount)
      formData.append('priceCurrency', form.priceCurrency)
      images.forEach(img => formData.append('images', img))
      await handleCreateProduct(formData)
      navigate('/seller/products')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif", paddingTop: '5rem', paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F1 100%)',
        borderBottom: '1px solid rgba(208,197,178,0.4)',
        paddingTop: '2rem', paddingBottom: '1.75rem',
        paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Link
            to="/seller/products"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#C9A84C', marginBottom: '1rem',
              textDecoration: 'none',
            }}
          >
            ← Back to Products
          </Link>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800, color: '#231A03',
            lineHeight: 1.15, letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}>List New Product</h1>
          <p style={{ fontSize: '0.9375rem', color: '#7E7665' }}>
            Drop your latest fashion items into the catalog.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem clamp(1.5rem, 6vw, 5rem)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start' }}>

            {/* Left — Product Info */}
            <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

              {/* Product Title */}
              <GoldInputField label="Product Title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Oversized Obsidian Hoodie" />

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7665' }}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Detail the fit, fabric, and feel..."
                  rows={5}
                  style={{
                    padding: '0.875rem 1rem',
                    background: '#FFFFFF',
                    border: '1px solid rgba(208,197,178,0.5)',
                    borderRadius: '0.75rem',
                    color: '#231A03',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    caretColor: '#C9A84C',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(208,197,178,0.5)'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Price & Currency */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <GoldInputField label="Price Amount" name="priceAmount" type="number" value={form.priceAmount} onChange={handleChange} placeholder="0.00" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7665' }}>Currency</label>
                    <select
                      name="priceCurrency"
                      value={form.priceCurrency}
                      onChange={handleChange}
                      style={{
                        padding: '0.875rem 1rem',
                        background: '#FFFFFF',
                        border: '1px solid rgba(208,197,178,0.5)',
                        borderRadius: '0.75rem',
                        color: '#231A03',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9375rem',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C9A84C'}
                      onBlur={e => e.target.style.borderColor = 'rgba(208,197,178,0.5)'}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                      <option value="JPY">JPY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Media */}
            <div style={{ flex: '0 1 320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7665' }}>Product Media</label>
                <span style={{
                  fontSize: '0.6875rem', fontWeight: 700,
                  color: images.length >= 7 ? '#BA1A1A' : '#C9A84C',
                  fontFamily: "'Inter', sans-serif",
                }}>{images.length} / 7</span>
              </div>

              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  height: '140px',
                  borderRadius: '1rem',
                  border: '2px dashed rgba(201,168,76,0.4)',
                  background: 'rgba(201,168,76,0.04)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.75rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.04)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'rgba(201,168,76,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: '#231A03' }}>Click to upload</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', color: '#9E9488', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>JPEG, PNG up to 10MB</p>
                </div>
              </div>
              <input type="file" multiple accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleImageChange} />

              {/* Previews */}
              {previews.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem' }}>
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.625rem', overflow: 'hidden', border: '1px solid rgba(208,197,178,0.4)' }}
                      className="preview-thumb"
                    >
                      <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.2s',
                          border: 'none', cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                      >
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="14" height="14" stroke="#BA1A1A" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(208,197,178,0.4)' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', maxWidth: '400px', padding: '1.125rem', fontSize: '0.875rem' }}
            >
              {loading ? 'Creating Drop...' : 'Create Drop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Gold Input Field ── */
function GoldInputField({ label, name, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={name} style={{
        fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: focused ? '#C9A84C' : '#7E7665', transition: 'color 0.2s',
      }}>{label}</label>
      <input
        id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          padding: '0.875rem 1rem',
          background: '#FFFFFF',
          border: `1px solid ${focused ? '#C9A84C' : 'rgba(208,197,178,0.5)'}`,
          borderRadius: '0.75rem',
          color: '#231A03',
          fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem',
          outline: 'none', transition: 'all 0.2s',
          caretColor: '#C9A84C',
          boxShadow: focused ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
        }}
      />
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useProduct } from '../hook/useProduct'
import { useDispatch } from 'react-redux'
import { addItem } from '../../cart/state/cart.slice'

export default function ProductPage() {
  const { id } = useParams()
  const { handleGetProductById } = useProduct()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const data = await handleGetProductById(id)
        setProduct(data)
      } catch (err) {
        console.error('Failed to fetch product', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FFF8F1', paddingTop: '5rem' }}>
        <div className="gold-spinner" />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#FFF8F1', paddingTop: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#231A03', marginBottom: '1rem' }}>Product Not Found</h2>
        <Link to="/" style={{ color: '#C9A84C', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>← Back to Home</Link>
      </div>
    )
  }

  const currency = product.price?.currency || 'INR'
  const currencySymbol = { USD: '$', EUR: '€', GBP: '£', INR: '₹' }[currency] ?? currency

  const handleAddToCart = () => {
    const variant = product.variants?.[0]
    dispatch(addItem({
      product: product._id,
      variantId: variant?._id ?? 'default',
      title: product.title,
      image: product.images?.[0]?.url,
      price: product.price?.amount,
      currency: product.price?.currency || 'INR',
      quantity,
      size: selectedSize,
      color: variant?.attributes?.color,
    }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif", paddingTop: '5rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem clamp(1.5rem, 4vw, 3rem)' }}>

        {/* Back link */}
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#7E7665', marginBottom: '2.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
          onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
        >
          ← Back to Collection
        </Link>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
          {/* Left: Image Gallery */}
          <div style={{ flex: '0 0 min(480px, 100%)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Main Image */}
            <div style={{
              aspectRatio: '4/5',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              background: '#FAF5EC',
              border: '1px solid rgba(208,197,178,0.4)',
              boxShadow: '0 8px 32px rgba(35,26,3,0.08)',
            }}>
              <img
                src={product.images?.[activeImage]?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3'}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              />
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: '72px', height: '88px', flexShrink: 0,
                      borderRadius: '0.75rem', overflow: 'hidden',
                      border: `2px solid ${activeImage === idx ? '#C9A84C' : 'rgba(208,197,178,0.4)'}`,
                      opacity: activeImage === idx ? 1 : 0.65,
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: activeImage === idx ? '0 0 12px rgba(201,168,76,0.3)' : 'none',
                      padding: 0,
                    }}
                  >
                    <img src={img.url} alt={`View ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.3125rem 0.875rem',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '9999px', width: 'fit-content',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A07830' }}>New Arrival</span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 800, color: '#231A03', lineHeight: 1.15,
                letterSpacing: '-0.01em', marginBottom: '0.875rem',
              }}>
                {product.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#C9A84C' }}>
                  {currencySymbol}{product.price?.amount}
                </span>
                <span style={{
                  padding: '0.25rem 0.75rem', borderRadius: '9999px',
                  background: 'rgba(45,106,79,0.08)',
                  border: '1px solid rgba(45,106,79,0.2)',
                  fontSize: '0.75rem', fontWeight: 700, color: '#2D6A4F',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  ✓ In Stock
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p style={{
                fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: '#7E7665', marginBottom: '0.625rem',
              }}>Description</p>
              <p style={{ fontSize: '0.9375rem', color: '#4D4637', lineHeight: 1.75 }}>
                {product.description}
              </p>
            </div>

            {/* Gold divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />

            {/* Size Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7665' }}>Select Size</p>
                <button style={{ fontSize: '0.75rem', color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Size Guide</button>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '48px', height: '48px',
                      borderRadius: '0.625rem',
                      border: selectedSize === size ? 'none' : '1.5px solid rgba(208,197,178,0.6)',
                      background: selectedSize === size ? 'linear-gradient(135deg, #C9A84C, #A07830)' : '#FFFFFF',
                      color: selectedSize === size ? '#FFFFFF' : '#4D4637',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem', fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: selectedSize === size ? '0 4px 12px rgba(201,168,76,0.3)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7E7665', marginBottom: '0.875rem' }}>Quantity</p>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                border: '1.5px solid rgba(208,197,178,0.6)',
                borderRadius: '9999px', overflow: 'hidden', background: '#FFFFFF',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '44px', height: '44px', background: 'none', border: 'none',
                    color: '#4D4637', cursor: 'pointer', fontSize: '1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4D4637'}
                >−</button>
                <span style={{
                  width: '44px', textAlign: 'center', fontWeight: 700,
                  color: '#231A03', fontSize: '0.9375rem', borderLeft: '1px solid rgba(208,197,178,0.4)', borderRight: '1px solid rgba(208,197,178,0.4)',
                }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '44px', height: '44px', background: 'none', border: 'none',
                    color: '#4D4637', cursor: 'pointer', fontSize: '1.25rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4D4637'}
                >+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, minWidth: '180px', padding: '1rem 1.5rem',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  background: addedToCart ? 'linear-gradient(135deg, #2D6A4F, #1A4434)' : 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
                  color: '#fff', border: 'none', borderRadius: '9999px',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 4px 24px rgba(201,168,76,0.20)',
                }}
              >
                {addedToCart ? (
                  <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg> Added!</>
                ) : (
                  <><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> Add to Cart</>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  padding: '1rem 1.5rem',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', color: '#A07830',
                  border: '1.5px solid rgba(201,168,76,0.5)', borderRadius: '9999px',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.8125rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                Buy Now
              </button>
            </div>

            {/* Feature Pills */}
            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {['Free Shipping', 'Easy Returns', 'Authentic'].map(f => (
                <span key={f} style={{
                  padding: '0.375rem 0.875rem',
                  background: 'rgba(201,168,76,0.07)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '9999px',
                  fontSize: '0.75rem', fontWeight: 600,
                  color: '#7E7665',
                }}>✓ {f}</span>
              ))}
            </div>

            {/* Details */}
            <div style={{ borderTop: '1px solid rgba(208,197,178,0.5)', paddingTop: '1.5rem' }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Shipping', value: 'Free standard shipping on all orders.' },
                  { label: 'Returns', value: '30-day return policy. No questions asked.' },
                  { label: 'Authenticity', value: '100% genuine, curated by Snitch.' }
                ].map(item => (
                  <li key={item.label} style={{ display: 'flex', gap: '1.5rem' }}>
                    <span style={{ width: '80px', flexShrink: 0, fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9E9488' }}>{item.label}</span>
                    <span style={{ fontSize: '0.875rem', color: '#4D4637' }}>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '1rem 1.5rem',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(208,197,178,0.4)',
        display: 'flex', gap: '0.875rem',
        boxShadow: '0 -8px 30px rgba(35,26,3,0.06)',
        zIndex: 100,
      }}
        className="mobile-sticky-bar"
      >
        <button
          onClick={handleAddToCart}
          style={{
            width: '52px', height: '52px', borderRadius: '50%',
            border: '1.5px solid rgba(201,168,76,0.4)',
            background: addedToCart ? 'rgba(45,106,79,0.1)' : 'rgba(201,168,76,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: addedToCart ? '#2D6A4F' : '#C9A84C', cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.3s',
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
        <button
          onClick={handleBuyNow}
          style={{ flex: 1, height: '52px', fontSize: '0.875rem',
            background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
            color: '#fff', border: 'none', borderRadius: '9999px',
            fontFamily: "'Inter', sans-serif", fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          Buy Now
        </button>
      </div>

      <style>{`
        @media (min-width: 640px) { .mobile-sticky-bar { display: none !important; } }
      `}</style>
    </div>
  )
}

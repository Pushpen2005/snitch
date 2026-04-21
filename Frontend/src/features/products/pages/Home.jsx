import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import ProductCard from '../component/ProductCard'
import { useNavigate } from 'react-router'

export default function Home() {
  const products = useSelector(state => state.product.products) || []
  const loading = useSelector(state => state.product.loading)
  const user = useSelector(state => state.auth.user)
  const { handleGetAllProducts } = useProduct()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === 'seller') {
      navigate('/seller/products')
      return
    }
    handleGetAllProducts()
  }, [user, navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Hero Section ── */}
      <div style={{
        paddingTop: '6rem',
        paddingBottom: '4rem',
        paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F1 100%)',
        borderBottom: '1px solid rgba(208,197,178,0.4)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle warm glow blobs */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '500px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: '20%',
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.3125rem 1rem',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.25)',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C' }} />
            <span style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A07830',
            }}>New Collection</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800, color: '#231A03', lineHeight: 1.1,
                letterSpacing: '-0.02em', marginBottom: '1rem',
              }}>
                Latest{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #C9A84C, #A07830)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Drops
                </span>
              </h1>
              <p style={{
                maxWidth: '480px', fontSize: '1rem', color: '#7E7665',
                lineHeight: 1.7, fontWeight: 400,
              }}>
                Discover the newest additions to our collection. Premium quality, unparalleled style, crafted for the fashion-forward.
              </p>
            </div>

            {/* Product count badge */}
            {products.length > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: '#FFFFFF',
                borderRadius: '9999px',
                border: '1px solid rgba(208,197,178,0.5)',
                boxShadow: '0 2px 8px rgba(35,26,3,0.06)',
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#C9A84C', fontFamily: "'Playfair Display', serif" }}>{products.length}</span>
                <span style={{ fontSize: '0.8125rem', color: '#7E7665', fontWeight: 500 }}>styles available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '3rem clamp(1.5rem, 6vw, 5rem)',
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8rem 0' }}>
            <div className="gold-spinner" />
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            background: '#FFFFFF',
            borderRadius: '2rem',
            border: '1.5px dashed rgba(201,168,76,0.3)',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(201,168,76,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#231A03', marginBottom: '0.75rem' }}>
              More Beauty Arriving Soon
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#7E7665', maxWidth: '320px', margin: '0 auto' }}>
              Check back soon for our upcoming exclusive drops.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

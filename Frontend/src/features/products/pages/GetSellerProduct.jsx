import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct.js'
import ProductCard from '../component/ProductCard.jsx'
import { Link, useNavigate } from 'react-router'

export default function GetSellerProduct() {
  const { handleGetProducts, handleDeleteProduct } = useProduct()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await handleGetProducts(user?._id)
        setProducts(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleDelete = async (productToDelete) => {
    try {
      const id = productToDelete._id || productToDelete
      await handleDeleteProduct(id)
      setProducts(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (product) => {
    navigate(`/seller/product/${product._id}/details`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif", paddingTop: '5rem', paddingBottom: '4rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F1 100%)',
        borderBottom: '1px solid rgba(208,197,178,0.4)',
        paddingTop: '2.5rem',
        paddingBottom: '2rem',
        paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
        paddingRight: 'clamp(1.5rem, 6vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '400px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              {/* Label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.25rem 0.875rem',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: '9999px', marginBottom: '0.875rem',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A07830' }}>Seller Dashboard</span>
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800, color: '#231A03',
                lineHeight: 1.1, letterSpacing: '-0.02em',
                marginBottom: '0.625rem',
              }}>Your Drops</h1>
              <p style={{ fontSize: '0.9375rem', color: '#7E7665', maxWidth: '480px', lineHeight: 1.6 }}>
                Manage your exclusive collections. Edit details, update pricing, or remove items.
              </p>
            </div>

            <Link
              to="/seller/create-product"
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Product
            </Link>
          </div>

          {/* Stats row */}
          {products.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {[
                { icon: '📦', value: products.length, label: 'Products' },
                { icon: '✨', value: 'Active', label: 'Status' },
              ].map(stat => (
                <div key={stat.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 1.25rem',
                  background: '#FFFFFF',
                  borderRadius: '9999px',
                  border: '1px solid rgba(208,197,178,0.5)',
                  boxShadow: '0 2px 8px rgba(35,26,3,0.05)',
                }}>
                  <span>{stat.icon}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#C9A84C' }}>{stat.value}</span>
                  <span style={{ fontSize: '0.8125rem', color: '#7E7665' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem clamp(1.5rem, 6vw, 5rem)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
            <div className="gold-spinner" />
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '6rem 2rem',
            background: '#FFFFFF', borderRadius: '2rem',
            border: '1.5px dashed rgba(201,168,76,0.3)',
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(201,168,76,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
              <svg width="32" height="32" fill="none" stroke="#C9A84C" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#231A03', marginBottom: '0.625rem' }}>No Drops Yet</h3>
            <p style={{ fontSize: '0.9375rem', color: '#7E7665', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem' }}>Your catalog is empty. Start adding your collection.</p>
            <Link to="/seller/create-product" className="btn-primary" style={{ textDecoration: 'none' }}>
              Create Your First Drop
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} role="seller" onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

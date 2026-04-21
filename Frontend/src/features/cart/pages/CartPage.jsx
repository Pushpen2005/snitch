import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { selectCartItems, selectCartTotal, selectCartCount, removeItem, updateQuantity, clearCart } from '../state/cart.slice'
import { useCart } from '../hook/useCart'

const sym = c => ({ USD: '$', EUR: '€', GBP: '£', INR: '₹' }[c] ?? c)

export default function CartPage() {
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { handleGetCart } = useCart()
  useEffect(() => { 
    if (items.length === 0) {
      handleGetCart()
    }
  }, [])

  const tax = Math.round(total * 0.18)
  const grandTotal = total + tax

  /* ── Empty State ── */
  if (items.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: '#FFF8F1', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '2rem', padding: '2rem', paddingTop: '6rem', position: 'relative',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Dot pattern bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Icon circle */}
          <div style={{
            width: '112px', height: '112px', borderRadius: '50%',
            background: 'rgba(201,168,76,0.07)',
            border: '1px solid rgba(201,168,76,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
          }}>
            <svg width="48" height="48" fill="none" stroke="#C9A84C" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#231A03', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Your Cart is Empty
          </h1>
          <p style={{ color: '#7E7665', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '340px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Looks like you haven't added anything yet. Explore our curated drops below.
          </p>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
            color: '#fff', fontFamily: "'Inter', sans-serif",
            fontWeight: 700, fontSize: '0.8125rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(201,168,76,0.25)',
            textDecoration: 'none',
          }}>
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{
        paddingTop: '5rem',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F1 100%)',
        borderBottom: '1px solid rgba(208,197,178,0.4)',
        padding: '5rem clamp(1.5rem, 6vw, 5rem) 2rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.25rem 0.875rem',
              background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '9999px', marginBottom: '0.875rem',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C' }} />
              <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A07830' }}>
                {count} {count === 1 ? 'item' : 'items'} selected
              </span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#231A03', letterSpacing: '-0.02em' }}>
              Shopping Cart
            </h1>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: '#9E9488', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s', padding: '0.25rem 0',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#BA1A1A'}
            onMouseLeave={e => e.currentTarget.style.color = '#9E9488'}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '2.5rem clamp(1.5rem, 6vw, 5rem)',
        display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap',
      }}>

        {/* ── LEFT: Item List ── */}
        <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item, idx) => (
            <CartItem
              key={`${item.product}-${item.variantId}-${idx}`}
              item={item}
              onRemove={() => dispatch(removeItem({ product: item.product, variantId: item.variantId }))}
              onQtyChange={(qty) => dispatch(updateQuantity({ product: item.product, variantId: item.variantId, quantity: qty }))}
              onNavigate={() => navigate(`/product/${item.product}`)}
            />
          ))}

          {/* Continue Shopping */}
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontSize: '0.875rem', fontWeight: 600, color: '#7E7665',
            textDecoration: 'none', marginTop: '0.5rem', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#A07830'}
            onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={{ width: '100%', maxWidth: '380px', flexShrink: 0, position: 'sticky', top: '5.5rem' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '1.5rem',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 4px 32px rgba(35,26,3,0.08)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '1.75rem 1.875rem 1.25rem', borderBottom: '1px solid rgba(208,197,178,0.3)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.375rem', fontWeight: 700, color: '#231A03' }}>
                Order Summary
              </h2>
            </div>

            {/* Line items */}
            <div style={{ padding: '1.5rem 1.875rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <SummaryRow label={`Subtotal (${items.reduce((a, i) => a + i.quantity, 0)} items)`} value={`₹${total.toLocaleString()}`} />
              <SummaryRow label="Shipping" value="Free" valueColor="#2D6A4F" />
              <SummaryRow label="Tax (18% GST)" value={`₹${tax.toLocaleString()}`} />

              {/* Gold divider */}
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)', margin: '0.25rem 0' }} />

              {/* Grand Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9E9488', display: 'block', marginBottom: '0.25rem' }}>
                    Grand Total
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#231A03' }}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#9E9488' }}>Incl. all taxes</span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ padding: '0 1.875rem 1.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => navigate('/checkout')}
                style={{
                  width: '100%', padding: '1rem',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
                  color: '#fff', border: 'none', borderRadius: '9999px',
                  fontFamily: "'Inter', sans-serif", fontWeight: 700,
                  fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,168,76,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.25)' }}
              >
                Proceed to Checkout
              </button>
              <Link to="/" style={{
                display: 'block', width: '100%', padding: '0.875rem',
                textAlign: 'center', borderRadius: '9999px',
                border: '1.5px solid rgba(201,168,76,0.4)',
                color: '#A07830', fontFamily: "'Inter', sans-serif",
                fontWeight: 700, fontSize: '0.8125rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Continue Shopping
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ borderTop: '1px solid rgba(208,197,178,0.3)', padding: '1.25rem 1.875rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[
                { icon: '↩', label: 'Free Returns' },
                { icon: '🔒', label: 'Secure Pay' },
                { icon: '✦', label: 'Authentic' },
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', textAlign: 'center' }}>
                  <span style={{ color: '#C9A84C', fontSize: '1rem' }}>{b.icon}</span>
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9E9488' }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Cart Item Row ── */
function CartItem({ item, onRemove, onQtyChange, onNavigate }) {
  const symbol = sym(item.currency)
  const lineTotal = (Number(item.price) * item.quantity).toLocaleString()

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '1.25rem',
      border: '1px solid rgba(208,197,178,0.25)',
      boxShadow: '0 2px 16px rgba(35,26,3,0.05)',
      overflow: 'hidden', display: 'flex',
      transition: 'box-shadow 0.3s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(35,26,3,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(35,26,3,0.05)'}
    >
      {/* Product image */}
      <div
        onClick={onNavigate}
        style={{
          width: '140px', flexShrink: 0,
          background: '#FAF5EC', overflow: 'hidden', cursor: 'pointer',
        }}
      >
        <img
          src={item.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80'}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '3/4', transition: 'transform 0.5s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Details */}
      <div style={{ flex: 1, padding: '1.25rem 1.375rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <h3
              onClick={onNavigate}
              style={{
                fontFamily: "'Playfair Display', serif", fontSize: '1.0625rem',
                fontWeight: 700, color: '#231A03', cursor: 'pointer',
                transition: 'color 0.2s', marginBottom: '0.5rem', lineHeight: 1.3,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#A07830'}
              onMouseLeave={e => e.currentTarget.style.color = '#231A03'}
            >
              {item.title}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {item.color && <Tag label={item.color} />}
              {item.size && <Tag label={`Size ${item.size}`} />}
            </div>
          </div>
          <button
            onClick={onRemove}
            style={{
              color: '#D0C5B2', background: 'none', border: 'none',
              cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#BA1A1A'}
            onMouseLeave={e => e.currentTarget.style.color = '#D0C5B2'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Bottom: price + qty + total */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9E9488', display: 'block', marginBottom: '0.125rem' }}>
              Unit Price
            </span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#231A03' }}>
              {symbol}{Number(item.price).toLocaleString()}
            </span>
          </div>

          {/* Qty stepper */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            border: '1px solid rgba(208,197,178,0.6)', borderRadius: '9999px',
            overflow: 'hidden', background: '#FDFAF6',
          }}>
            <button
              onClick={() => onQtyChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={{
                width: '36px', height: '36px', background: 'none', border: 'none',
                color: '#7E7665', cursor: 'pointer', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s', opacity: item.quantity <= 1 ? 0.3 : 1,
              }}
              onMouseEnter={e => { if (item.quantity > 1) e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
            >−</button>
            <span style={{
              width: '32px', textAlign: 'center', fontFamily: "'Playfair Display', serif",
              fontSize: '1.0625rem', fontWeight: 700, color: '#231A03',
              borderLeft: '1px solid rgba(208,197,178,0.4)', borderRight: '1px solid rgba(208,197,178,0.4)',
            }}>{item.quantity}</span>
            <button
              onClick={() => onQtyChange(item.quantity + 1)}
              style={{
                width: '36px', height: '36px', background: 'none', border: 'none',
                color: '#7E7665', cursor: 'pointer', fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
            >+</button>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9E9488', display: 'block', marginBottom: '0.125rem' }}>
              Total
            </span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#C9A84C' }}>
              {symbol}{lineTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Tag({ label }) {
  return (
    <span style={{
      fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: '#7E7665',
      background: '#FAF5EC', padding: '0.25rem 0.625rem',
      borderRadius: '9999px', border: '1px solid rgba(208,197,178,0.4)',
    }}>
      {label}
    </span>
  )
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.875rem', color: '#4D4637', fontWeight: 500 }}>{label}</span>
      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: valueColor || '#231A03', fontSize: '0.9375rem' }}>
        {value}
      </span>
    </div>
  )
}

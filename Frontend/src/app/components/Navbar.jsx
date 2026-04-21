import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hook/useAuth'
import { selectCartCount } from '../../features/cart/state/cart.slice'
import Searchbar from './Searchbar'

export default function Navbar() {
  const user = useSelector(state => state.auth.user)
  const cartCount = useSelector(selectCartCount)
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogoutClick = async () => {
    await handleLogout()
    navigate('/login')
  }

  const userName = user?.fullname || user?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid rgba(208,197,178,0.5)',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 20px rgba(35,26,3,0.06)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
          }}
        >
          {/* Gold S Monogram */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: '1.0625rem',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(201,168,76,0.3)',
            }}
          >
            S
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.05em',
              color: '#231A03',
            }}
          >
            SNITCH
          </span>
        </Link>

        {/* Nav Links + Search (desktop) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flex: 1,
            justifyContent: 'center',
          }}
          className="hidden-mobile"
        >
          {user?.role === 'buyer' ? (
            <>
              <NavLink to="/" label="Home" current={location.pathname} />
              <NavLink to="/cart" label="Collections" current={location.pathname} />
              <Searchbar />
            </>
          ) : user?.role === 'seller' ? (
            <>
              <NavLink to="/seller/products" label="Your Drops" current={location.pathname} />
              <NavLink to="/seller/create-product" label="List Product" current={location.pathname} />
            </>
          ) : null}
        </div>

        {/* Auth / User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart icon — buyer only */}
          {user?.role === 'buyer' && (
            <Link
              to="/cart"
              style={{ position: 'relative', color: '#4D4637', display: 'flex', alignItems: 'center' }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-10px',
                  minWidth: '18px', height: '18px',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
                  color: '#fff', borderRadius: '9999px',
                  fontSize: '0.625rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* User info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  paddingLeft: '1rem',
                  borderLeft: '1px solid rgba(208,197,178,0.6)',
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#231A03',
                      lineHeight: 1.2,
                    }}
                  >
                    {userName}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      color: '#C9A84C',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {user?.role || 'customer'}
                  </div>
                </div>

                {/* Avatar */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {userInitial}
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogoutClick}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#7E7665',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                    padding: '0.25rem 0',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <Link
                to="/login"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#4D4637',
                  transition: 'color 0.2s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#4D4637'}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1.25rem',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
                  color: '#fff',
                  borderRadius: '9999px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 10px rgba(201,168,76,0.25)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(201,168,76,0.25)' }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, label, current }) {
  const isActive = current === to
  return (
    <Link
      to={to}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.875rem',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? '#C9A84C' : '#4D4637',
        letterSpacing: '0.02em',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '2px',
        transition: 'color 0.2s',
        borderBottom: isActive ? '2px solid #C9A84C' : '2px solid transparent',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C' }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#4D4637' }}
    >
      {label}
    </Link>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import ContinueWithGoogle from '../components/ContinueWithGoogle'
import GoldInputField, { EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../components/GoldInputField'
import { useAuth } from '../hook/useAuth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { handleLogin } = useAuth()
  const error = useSelector(state => state.auth.error)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const user = await handleLogin({ email: form.email, password: form.password })
      if (user.role === 'seller') {
        navigate('/seller/products')
      } else {
        navigate('/')
      }
    } catch {
      // error is stored in Redux state and shown in UI
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: '#FFF8F1' }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        style={{
          flex: '0 0 42%',
          background: '#FAF5EC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(208,197,178,0.4)',
        }}
        className="brand-panel"
      >
        {/* Dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        {/* Warm glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '3rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A84C 0%, #A07830 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.125rem', color: '#fff',
              boxShadow: '0 4px 16px rgba(201,168,76,0.3)',
            }}>S</div>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800,
              fontSize: '1.375rem', letterSpacing: '0.04em', color: '#231A03',
            }}>SNITCH</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
            fontWeight: 800, color: '#231A03', lineHeight: 1.15, letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}>
            Welcome<br />
            <span style={{ color: '#C9A84C' }}>Back.</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#7E7665', lineHeight: 1.6, maxWidth: '280px', marginBottom: '2.5rem' }}>
            Step back into your style universe. Your next favourite drop awaits.
          </p>

          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(90deg, #C9A84C, transparent)', marginBottom: '2rem' }} />

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {['Exclusive streetwear drops', 'Premium fashion from top sellers', 'Curated for the style-conscious'].map(perk => (
              <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#C9A84C', fontSize: '0.75rem', fontWeight: 700 }}>✦</span>
                <span style={{ fontSize: '0.875rem', color: '#4D4637', fontWeight: 500 }}>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ height: '1px', width: '32px', background: 'rgba(201,168,76,0.4)', marginBottom: '0.875rem' }} />
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.6875rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9E9488',
          }}>The Future of Fashion is Yours</p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 4rem', background: '#FFFFFF',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2rem',
            fontWeight: 700, color: '#231A03', marginBottom: '0.5rem',
          }}>
            Sign In
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#7E7665', marginBottom: '2.5rem' }}>
            New to Snitch?{' '}
            <Link to="/register" style={{ color: '#C9A84C', fontWeight: 600 }}>
              Create account
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <GoldInputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              icon={<EmailIcon />}
            />

            <GoldInputField
              label="Password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<LockIcon />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9488', padding: '0.25rem', transition: 'color 0.2s', display: 'flex' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9E9488'}
                >
                  {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {/* Inline error message */}
            {error && (
              <p style={{
                fontSize: '0.8125rem', color: '#BA1A1A', fontWeight: 500,
                padding: '0.625rem 1rem',
                background: 'rgba(186,26,26,0.05)',
                border: '1px solid rgba(186,26,26,0.2)',
                borderRadius: '0.5rem',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(208,197,178,0.6)' }} />
              <span style={{ fontSize: '0.8125rem', color: '#9E9488', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(208,197,178,0.6)' }} />
            </div>

            <ContinueWithGoogle />

          </form>

          <p style={{
            textAlign: 'center', fontSize: '0.6875rem', color: '#9E9488',
            marginTop: '2rem', lineHeight: 1.6,
          }}>
            By signing in you agree to our{' '}
            <span style={{ color: '#C9A84C', cursor: 'pointer' }}>Terms of Service</span>{' '}
            &amp;{' '}
            <span style={{ color: '#C9A84C', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth.js'
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx'
import GoldInputField, { PersonIcon, EmailIcon, PhoneIcon, LockIcon, EyeIcon, EyeOffIcon } from '../components/GoldInputField.jsx'

export default function Register() {
  const { handleRegister } = useAuth()
  const [form, setForm] = useState({ fullname: '', email: '', contact: '', password: '', isSeller: false })
  const [showPwd, setShowPwd] = useState(false)
  const error = useSelector(state => state.auth.error)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await handleRegister({
        email: form.email, contact: form.contact,
        password: form.password, fullname: form.fullname, isSeller: form.isSeller
      })
      if (user?.role === 'seller') {
        navigate('/seller/products')
      } else {
        navigate('/')
      }
    } catch {
      // error is stored in Redux state and shown in UI
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", background: '#FFF8F1' }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        style={{
          flex: '0 0 40%',
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
        {/* Glows */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
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
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800, color: '#231A03', lineHeight: 1.15,
            letterSpacing: '-0.02em', marginBottom: '0.5rem',
          }}>
            Wear What<br />
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>You Mean.</em>
          </h1>

          <div style={{ height: '2px', width: '48px', background: 'linear-gradient(90deg, #C9A84C, transparent)', margin: '1.5rem 0' }} />

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            {[
              { val: '50K+', label: 'Active Users' },
              { val: '1200+', label: 'Brand Drops' },
              { val: '4.9★', label: 'Rating' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.375rem', fontWeight: 700, color: '#C9A84C' }}>{s.val}</div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9E9488' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Exclusive streetwear drops', 'Sell your own collection', 'Join thousands of style icons'].map(perk => (
              <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#C9A84C', fontSize: '0.75rem', fontWeight: 700 }}>✦</span>
                <span style={{ fontSize: '0.875rem', color: '#4D4637', fontWeight: 500 }}>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ height: '1px', width: '32px', background: 'rgba(201,168,76,0.4)', marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9E9488' }}>
            The future of fashion is yours
          </p>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 4rem', background: '#FFFFFF', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '2rem',
            fontWeight: 700, color: '#231A03', marginBottom: '0.5rem',
          }}>
            Create Account
          </h2>
          <p style={{ fontSize: '0.9375rem', color: '#7E7665', marginBottom: '2.5rem' }}>
            Already on Snitch?{' '}
            <Link to="/login" style={{ color: '#C9A84C', fontWeight: 600 }}>Sign In</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <GoldInputField label="Full Name" name="fullname" value={form.fullname} onChange={handleChange} placeholder="John Doe" icon={<PersonIcon />} />
            <GoldInputField label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" icon={<EmailIcon />} />
            <GoldInputField label="Contact Number" name="contact" type="tel" value={form.contact} onChange={handleChange} placeholder="+91 98765 43210" icon={<PhoneIcon />} />
            <GoldInputField
              label="Password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              icon={<LockIcon />}
              rightElement={
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E9488', padding: '0.25rem', display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9E9488'}
                >
                  {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {/* Seller Toggle */}
            <label
              htmlFor="isSeller"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                borderRadius: '0.75rem',
                background: form.isSeller ? 'rgba(201,168,76,0.06)' : '#FFF8F1',
                border: `1.5px solid ${form.isSeller ? 'rgba(201,168,76,0.4)' : 'rgba(208,197,178,0.4)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={form.isSeller ? '#C9A84C' : '#9E9488'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
              </svg>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#231A03', marginBottom: '0.125rem' }}>I want to sell on Snitch</p>
                <p style={{ fontSize: '0.8125rem', color: '#7E7665' }}>List your collections &amp; earn</p>
              </div>
              {/* Toggle switch */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input id="isSeller" name="isSeller" type="checkbox" checked={form.isSeller} onChange={handleChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                <div style={{
                  width: '48px', height: '26px', borderRadius: '9999px', transition: 'all 0.3s',
                  background: form.isSeller ? 'linear-gradient(90deg, #C9A84C, #A07830)' : '#D0C5B2',
                  boxShadow: form.isSeller ? '0 0 10px rgba(201,168,76,0.3)' : 'none',
                }} />
                <div style={{
                  position: 'absolute', top: '4px', transition: 'all 0.3s',
                  left: form.isSeller ? 'calc(100% - 22px)' : '4px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }} />
              </div>
            </label>

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

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(208,197,178,0.6)' }} />
              <span style={{ fontSize: '0.8125rem', color: '#9E9488', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(208,197,178,0.6)' }} />
            </div>

            <ContinueWithGoogle />

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', marginTop: '0.25rem' }}
            >
              Create Account
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: '#9E9488', lineHeight: 1.6 }}>
              By signing up you agree to our{' '}
              <span style={{ color: '#C9A84C', cursor: 'pointer' }}>Terms of Service</span>{' '}
              &amp;{' '}
              <span style={{ color: '#C9A84C', cursor: 'pointer' }}>Privacy Policy</span>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}
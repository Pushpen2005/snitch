import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../../features/products/hook/useProduct'

/* ── Debounce helper ── */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function Searchbar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const debouncedQuery = useDebounce(query, 300)
  const { handleSearchProducts } = useProduct()
  const navigate = useNavigate()
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  /* ── Fetch on debounced query change ── */
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    let cancelled = false
    setLoading(true)
    handleSearchProducts(debouncedQuery)
      .then(data => {
        if (!cancelled) {
          setResults(data?.products || [])
          setOpen(true)
          setActiveIdx(-1)
        }
      })
      .catch(() => { if (!cancelled) setResults([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedQuery])

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Keyboard navigation ── */
  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && results[activeIdx]) {
        goToProduct(results[activeIdx]._id)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const goToProduct = (id) => {
    setOpen(false)
    setQuery('')
    setResults([])
    navigate(`/product/${id}`)
  }

  const sym = (c) => ({ USD: '$', EUR: '€', GBP: '£', INR: '₹' }[c] ?? c)

  return (
    <>
      <style>{`
        .sb-wrapper { position: relative; width: 100%; max-width: 380px; min-width: 200px; }

        .sb-input-row {
          display: flex; align-items: center; gap: 0.625rem;
          background: #FFFFFF;
          border: 1.5px solid rgba(208,197,178,0.6);
          border-radius: 9999px;
          padding: 0 1rem; height: 40px;
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .sb-input-row.focused {
          border-color: #C9A84C;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }

        .sb-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Inter', sans-serif; font-size: 0.875rem; color: #231A03;
          caret-color: #C9A84C;
        }
        .sb-input::placeholder { color: #B0A899; }

        .sb-icon { color: #B0A899; display: flex; align-items: center; flex-shrink: 0; transition: color 0.2s; }
        .sb-input-row.focused .sb-icon { color: #C9A84C; }

        .sb-clear {
          background: none; border: none; cursor: pointer; padding: 0;
          color: #B0A899; display: flex; align-items: center;
          transition: color 0.2s; flex-shrink: 0;
        }
        .sb-clear:hover { color: #231A03; }

        /* Dropdown */
        .sb-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 2000;
          background: #FFFFFF;
          border: 1px solid rgba(208,197,178,0.5);
          border-radius: 1.25rem;
          box-shadow: 0 16px 48px rgba(35,26,3,0.13), 0 4px 16px rgba(35,26,3,0.06);
          overflow: hidden;
          animation: sbFadeIn 0.18s ease;
        }
        @keyframes sbFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Spinner ring */
        .sb-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(201,168,76,0.25);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: sbSpin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes sbSpin { to { transform: rotate(360deg); } }

        /* Result item */
        .sb-item {
          display: flex; align-items: center; gap: 0.875rem;
          padding: 0.75rem 1rem; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(208,197,178,0.2);
        }
        .sb-item:last-child { border-bottom: none; }
        .sb-item.active, .sb-item:hover { background: #FFF8F1; }

        .sb-thumb {
          width: 44px; height: 54px; border-radius: 0.5rem;
          object-fit: cover; background: #FAF5EC; flex-shrink: 0;
          border: 1px solid rgba(208,197,178,0.3);
        }
        .sb-thumb-placeholder {
          width: 44px; height: 54px; border-radius: 0.5rem;
          background: linear-gradient(135deg, #FAF5EC, #FFF2DB);
          border: 1px solid rgba(208,197,178,0.3); flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }

        .sb-item-info { flex: 1; min-width: 0; }
        .sb-item-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.9375rem; font-weight: 700; color: #231A03;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          line-height: 1.3; margin-bottom: 0.2rem;
        }
        .sb-item-desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem; color: #9E9488;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-item-price {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; color: #C9A84C;
          flex-shrink: 0; white-space: nowrap;
        }

        /* Footer row */
        .sb-footer {
          padding: 0.625rem 1rem;
          background: linear-gradient(180deg, #FDFAF6, #FFF8F1);
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(208,197,178,0.3);
        }
        .sb-footer-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em; color: #9E9488;
        }
        .sb-footer-count {
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem; color: #C9A84C; font-weight: 700;
        }

        /* Empty state */
        .sb-empty {
          padding: 2rem 1rem; text-align: center;
        }
        .sb-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; color: #231A03; margin-bottom: 0.25rem;
        }
        .sb-empty-sub {
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem; color: #9E9488;
        }
      `}</style>

      <div className="sb-wrapper" ref={wrapperRef}>
        {/* ── Input ── */}
        <div className={`sb-input-row${focused ? ' focused' : ''}`}>
          <span className="sb-icon">
            {loading ? (
              <div className="sb-spinner" />
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            )}
          </span>

          <input
            ref={inputRef}
            className="sb-input"
            type="text"
            placeholder="Search drops…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true)
              if (results.length > 0) setOpen(true)
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />

          {query && (
            <button
              className="sb-clear"
              onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Dropdown ── */}
        {open && (
          <div className="sb-dropdown">
            {results.length === 0 ? (
              <div className="sb-empty">
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✦</div>
                <div className="sb-empty-title">No results found</div>
                <div className="sb-empty-sub">Try a different keyword</div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '0.625rem 1rem 0', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.2), transparent)' }} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C9A84C' }}>
                    Matching Drops
                  </span>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2))' }} />
                </div>

                {/* Results list */}
                {results.slice(0, 6).map((product, idx) => {
                  const price = product.price?.amount
                  const currency = sym(product.price?.currency || 'INR')
                  const imgUrl = product.images?.[0]?.url

                  return (
                    <div
                      key={product._id}
                      className={`sb-item${activeIdx === idx ? ' active' : ''}`}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onMouseLeave={() => setActiveIdx(-1)}
                      onClick={() => goToProduct(product._id)}
                    >
                      {imgUrl ? (
                        <img src={imgUrl} alt={product.title} className="sb-thumb" />
                      ) : (
                        <div className="sb-thumb-placeholder">
                          <svg width="18" height="18" fill="none" stroke="#D0C5B2" strokeWidth="1.4" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path strokeLinecap="round" d="M3 9l4-4 4 4 4-4 4 4" />
                          </svg>
                        </div>
                      )}
                      <div className="sb-item-info">
                        <div className="sb-item-title">{product.title}</div>
                        <div className="sb-item-desc">
                          {product.description?.slice(0, 48) || 'Premium fashion item'}…
                        </div>
                      </div>
                      {price && (
                        <div className="sb-item-price">
                          {currency}{Number(price).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Footer */}
                <div className="sb-footer">
                  <span className="sb-footer-label">
                    Results for "{debouncedQuery}"
                  </span>
                  <span className="sb-footer-count">
                    {results.length} found
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

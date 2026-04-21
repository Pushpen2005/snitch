import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const ProductCard = ({ product, role = 'user', onEdit, onDelete }) => {
  const navigate = useNavigate()
  const [wished, setWished] = useState(false)
 
  const imageUrl =
    product?.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  const price = product?.price?.amount || '999'
  const currency = product?.price?.currency || 'INR'
  const currencySymbol =
    currency === 'USD' ? '$' :
    currency === 'EUR' ? '€' :
    currency === 'GBP' ? '£' :
    currency === 'INR' ? '₹' : currency

  const handleNavigateToDetails = () => navigate(`/seller/product/${product?._id}/details`)
  const handleUserNavigate = () => navigate(`/product/${product?._id}`)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');

        .pc-card {
          width: 100%;
          background: #FDFAF6;
          position: relative;
          overflow: hidden;
          transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s;
          cursor: default;
        }
        .pc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 64px rgba(60,40,10,0.13), 0 8px 24px rgba(60,40,10,0.07);
        }

        /* Image */
        .pc-image-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          background: #EDE7DA;
          cursor: pointer;
        }
        .pc-image-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.8s cubic-bezier(.4,0,.2,1), filter 0.5s;
        }
        .pc-card:hover .pc-image-wrap img {
          transform: scale(1.07);
          filter: brightness(0.92);
        }

        /* Label strip */
        .pc-label-strip {
          position: absolute; top: 1rem; left: 0;
          background: #231A03; color: #C9A84C;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 0.35rem 1.25rem 0.35rem 0.85rem;
          clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          z-index: 2;
        }

        /* Wishlist button */
        .pc-wish-btn {
          position: absolute; top: 1rem; right: 1rem; z-index: 2;
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(253,250,246,0.88);
          border: 1px solid rgba(201,168,76,0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s; color: #9E9488;
          backdrop-filter: blur(4px);
        }
        .pc-wish-btn:hover { background: #FDFAF6; border-color: #C9A84C; color: #C9A84C; transform: scale(1.1); }
        .pc-wish-btn.wished { color: #C9284C; border-color: #C9284C; }

        /* Quick add overlay (user) */
        .pc-overlay-actions {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(to top, rgba(35,26,3,0.72) 0%, transparent 100%);
          padding: 2rem 1.25rem 1.25rem;
          display: flex; align-items: flex-end; justify-content: flex-end;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.35s, transform 0.35s;
          pointer-events: none;
        }
        .pc-card:hover .pc-overlay-actions { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .pc-quick-add {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
          color: #FDFAF6; border: 1px solid rgba(253,250,246,0.5);
          background: transparent; padding: 0.5rem 1.1rem; cursor: pointer;
          transition: all 0.25s; white-space: nowrap;
        }
        .pc-quick-add:hover { background: #FDFAF6; color: #231A03; }

        /* Seller icon overlay */
        .pc-seller-overlay {
          position: absolute; top: 1rem; right: 1rem; z-index: 2;
          display: flex; gap: 0.4rem;
          opacity: 0; transform: translateY(-4px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .pc-card:hover .pc-seller-overlay { opacity: 1; transform: translateY(0); }
        .pc-icon-btn {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); border: 1px solid;
        }
        .pc-icon-btn.edit { background: rgba(253,250,246,0.9); border-color: rgba(201,168,76,0.4); color: #A07830; }
        .pc-icon-btn.edit:hover { background: #FDFAF6; }
        .pc-icon-btn.del  { background: rgba(253,250,246,0.9); border-color: rgba(186,26,26,0.3); color: #BA1A1A; }
        .pc-icon-btn.del:hover  { background: #FDFAF6; }

        /* Card body */
        .pc-body { padding: 1.5rem 1.25rem 1.75rem; }
        .pc-category {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 0.5rem; display: block;
        }

        /* Tags */
        .pc-tags { margin-bottom: 0.6rem; }
        .pc-tag {
          display: inline-block;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          color: #A07830; background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.2);
          padding: 0.2rem 0.55rem; margin-right: 0.3rem; margin-bottom: 0.3rem;
        }

        /* Rating */
        .pc-rating { display: flex; align-items: center; gap: 5px; margin-bottom: 0.85rem; }
        .pc-stars { display: flex; gap: 2px; }
        .pc-star { width: 10px; height: 10px; fill: #C9A84C; }
        .pc-star.empty { fill: #D0C5B2; }
        .pc-rating-count {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; letter-spacing: 0.1em; color: #9E9488;
        }

        /* Title */
        .pc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 600; color: #231A03;
          line-height: 1.2; margin-bottom: 0.5rem; cursor: pointer;
          transition: color 0.2s;
        }
        .pc-title:hover { color: #A07830; }
        .pc-title em { font-style: italic; font-weight: 300; }

        /* Description */
        .pc-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem; font-style: italic; color: #7E7665; line-height: 1.65;
          margin-bottom: 1.25rem;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Divider */
        .pc-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(201,168,76,0.2), rgba(201,168,76,0.05));
          margin: 1rem 0;
        }

        /* Footer */
        .pc-footer { display: flex; align-items: center; justify-content: space-between; }
        .pc-price-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: #9E9488; display: block; margin-bottom: 2px;
        }
        .pc-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem; font-weight: 600; color: #231A03; line-height: 1;
        }
        .pc-price-currency { font-size: 0.9rem; font-weight: 300; vertical-align: super; margin-right: 1px; }

        /* View button */
        .pc-view-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
          color: #A07830; border: 1px solid rgba(201,168,76,0.35);
          background: transparent; padding: 0.5rem 1rem; cursor: pointer;
          transition: all 0.25s; text-decoration: none; display: inline-block;
          position: relative; overflow: hidden;
        }
        .pc-view-btn:hover { color: #FDFAF6; border-color: transparent; background: linear-gradient(135deg, #C9A84C, #A07830); }

        /* Status dot */
        .pc-status {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .pc-status.active { color: #5F8A5F; }
        .pc-status.inactive { color: #9E9488; }

        /* Seller bottom actions */
        .pc-seller-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; margin-top: 1.25rem; }
        .pc-seller-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
          padding: 0.55rem; border: 1px solid; cursor: pointer; transition: all 0.2s; background: transparent;
        }
        .pc-seller-btn.edit { color: #A07830; border-color: rgba(201,168,76,0.35); }
        .pc-seller-btn.edit:hover { background: rgba(201,168,76,0.08); }
        .pc-seller-btn.del  { color: #BA1A1A; border-color: rgba(186,26,26,0.25); }
        .pc-seller-btn.del:hover  { background: rgba(186,26,26,0.06); }
      `}</style>

      <div className="pc-card">
        {/* ── IMAGE ── */}
        <div
          className="pc-image-wrap"
          onClick={role === 'user' ? handleUserNavigate : handleNavigateToDetails}
        >
          <img src={imageUrl} alt={product?.title || 'Product'} />

          {/* Label strip */}
          <div className="pc-label-strip">New Arrival</div>

          {/* Wishlist (user only) */}
          {role === 'user' && (
            <button
              className={`pc-wish-btn${wished ? ' wished' : ''}`}
              onClick={e => { e.stopPropagation(); setWished(p => !p) }}
            >
              <svg width="14" height="14" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Quick add overlay (user) */}
          {role === 'user' && (
            <div className="pc-overlay-actions">
              <button className="pc-quick-add" onClick={e => e.stopPropagation()}>
                + Add to Cart
              </button>
            </div>
          )}

          {/* Seller icon overlay */}
          {role === 'seller' && (
            <div className="pc-seller-overlay">
              {onEdit && (
                <button className="pc-icon-btn edit" onClick={e => { e.stopPropagation(); onEdit(product) }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button className="pc-icon-btn del" onClick={e => { e.stopPropagation(); onDelete(product) }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="pc-body">
          <span className="pc-category">
            {product?.category || 'Collection'} · {new Date().getFullYear()}
          </span>

          {/* Tags */}
          {product?.tags?.length > 0 && (
            <div className="pc-tags">
              {product.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="pc-tag">{tag}</span>
              ))}
            </div>
          )}

          {/* Rating */}
          {product?.rating && (
            <div className="pc-rating">
              <div className="pc-stars">
                {[1, 2, 3, 4, 5].map(n => (
                  <svg key={n} className={`pc-star${n > Math.round(product.rating) ? ' empty' : ''}`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="pc-rating-count">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            className="pc-title"
            onClick={role === 'user' ? handleUserNavigate : handleNavigateToDetails}
          >
            {product?.title || 'Premium Fashion Item'}
          </h3>

          {/* Description */}
          <p className="pc-desc">
            {product?.description || 'A premium fashion piece crafted for the style-conscious.'}
          </p>

          <div className="pc-divider" />

          {/* Footer */}
          <div className="pc-footer">
            <div>
              <span className="pc-price-label">
                {role === 'seller' ? 'Listed Price' : 'Retail Price'}
              </span>
              <span className="pc-price">
                <span className="pc-price-currency">{currencySymbol}</span>
                {price}
              </span>
            </div>

            {role === 'user' ? (
              <Link to={`/product/${product?._id}`} className="pc-view-btn">
                View Details
              </Link>
            ) : (
              <span className={`pc-status ${product?.isActive ? 'active' : 'inactive'}`}>
                ● {product?.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>

          {/* Seller bottom actions */}
          {role === 'seller' && (
            <div className="pc-seller-actions">
              <button className="pc-seller-btn edit" onClick={() => onEdit && onEdit(product)}>
                Edit Listing
              </button>
              <button className="pc-seller-btn del" onClick={() => onDelete && onDelete(product)}>
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductCard
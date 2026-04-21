import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct.js';

export default function SellerProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        handleGetProductById, handleGetProductVariants,
        handleAddProductVariant, handleUpdateProductVariant, handleDeleteProductVariant
    } = useProduct();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ priceAmount: '', priceCurrency: 'USD', stock: '', attributes: { color: '', size: '' } });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productData, variantsData] = await Promise.all([
                handleGetProductById(id),
                handleGetProductVariants(id).catch(() => [])
            ]);
            setProduct(productData);
            const safeVariants = Array.isArray(variantsData)
                ? variantsData
                : variantsData?.product?.variants || variantsData?.variants || [];
            setVariants(safeVariants);
        } catch (err) {
            console.error(err);
            setError('Failed to load product details.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['color', 'size'].includes(name)) {
            setFormData(prev => ({ ...prev, attributes: { ...prev.attributes, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({ priceAmount: '', priceCurrency: 'USD', stock: '', attributes: { color: '', size: '' } });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEditClick = (variant) => {
        setFormData({
            priceAmount: variant.price?.amount || '',
            priceCurrency: variant.price?.currency || 'USD',
            stock: variant.stock || 0,
            attributes: variant.attributes || { color: '', size: '' }
        });
        setEditingId(variant._id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const dataToSubmit = {
                price: { amount: Number(formData.priceAmount), currency: formData.priceCurrency },
                stock: Number(formData.stock),
                attributes: { color: formData.attributes.color, size: formData.attributes.size }
            };
            if (editingId) {
                await handleUpdateProductVariant(id, editingId, dataToSubmit);
            } else {
                await handleAddProductVariant(id, dataToSubmit);
            }
            await fetchData();
            resetForm();
        } catch (err) {
            console.error(err);
            alert('Failed to save variant.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (variantId) => {
        if (!window.confirm('Are you sure you want to delete this variant?')) return;
        try {
            await handleDeleteProductVariant(id, variantId);
            await fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to delete variant.');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FFF8F1', paddingTop: '5rem' }}>
            <div className="gold-spinner" />
        </div>
    );

    if (error || !product) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFF8F1', paddingTop: '5rem', gap: '1rem' }}>
            <p style={{ color: '#BA1A1A', fontSize: '1rem' }}>{error || 'Product not found'}</p>
            <button onClick={() => navigate('/seller/products')} className="btn-secondary" style={{ fontSize: '0.8125rem' }}>Back to Products</button>
        </div>
    );

    const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    return (
        <div style={{ minHeight: '100vh', background: '#FFF8F1', fontFamily: "'Inter', sans-serif", paddingTop: '5rem', paddingBottom: '4rem' }}>
            {/* Back nav */}
            <div style={{
                background: '#FFFFFF', borderBottom: '1px solid rgba(208,197,178,0.4)',
                padding: '1rem clamp(1.5rem, 6vw, 5rem)',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <button
                        onClick={() => navigate('/seller/products')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: '#7E7665',
                            background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                        onMouseLeave={e => e.currentTarget.style.color = '#7E7665'}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Drops
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem clamp(1.5rem, 6vw, 5rem)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>

                    {/* LEFT — Product Overview */}
                    <div style={{
                        background: '#FFFFFF', borderRadius: '1.5rem',
                        border: '1px solid rgba(208,197,178,0.4)',
                        boxShadow: '0 4px 24px rgba(35,26,3,0.06)',
                        overflow: 'hidden',
                        position: 'sticky', top: '5.5rem',
                    }}>
                        <div style={{ aspectRatio: '4/5', background: '#FAF5EC' }}>
                            <img src={mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.375rem', fontWeight: 700, color: '#231A03',
                                marginBottom: '0.5rem', lineHeight: 1.3,
                            }}>{product.title}</h2>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 700, color: '#C9A84C', marginBottom: '0.75rem' }}>
                                {product.price?.currency === 'USD' ? '$' : product.price?.currency === 'INR' ? '₹' : ''}{product.price?.amount || '0'}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#7E7665', lineHeight: 1.65 }}>{product.description}</p>
                        </div>
                    </div>

                    {/* RIGHT — Variants */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem',
                            paddingBottom: '1.25rem', borderBottom: '1px solid rgba(208,197,178,0.4)',
                        }}>
                            <div>
                                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700, color: '#231A03', marginBottom: '0.375rem' }}>Product Variants</h1>
                                <p style={{ fontSize: '0.9375rem', color: '#7E7665' }}>Manage SKUs, stock levels, and specific pricing.</p>
                            </div>
                            <button
                                onClick={() => { resetForm(); setShowForm(!showForm); }}
                                className={showForm ? 'btn-ghost' : 'btn-primary'}
                                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                            >
                                {showForm ? 'Cancel' : '+ Add Variant'}
                            </button>
                        </div>

                        {/* Variant Form */}
                        {showForm && (
                            <form onSubmit={handleSubmit} style={{
                                background: '#FFFFFF', borderRadius: '1.25rem',
                                border: '1.5px solid rgba(201,168,76,0.3)',
                                padding: '1.75rem',
                                boxShadow: '0 4px 24px rgba(201,168,76,0.08)',
                            }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem', color: '#C9A84C', marginBottom: '1.5rem' }}>
                                    {editingId ? 'Edit Variant' : 'New Variant Details'}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    {[
                                        { label: 'Color', name: 'color', value: formData.attributes.color, placeholder: 'e.g. Red' },
                                        { label: 'Size', name: 'size', value: formData.attributes.size, placeholder: 'e.g. M' },
                                        { label: 'Stock Quantity', name: 'stock', value: formData.stock, type: 'number', placeholder: '0' },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7665', marginBottom: '0.5rem' }}>{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                name={field.name}
                                                required
                                                value={field.value}
                                                onChange={handleInputChange}
                                                placeholder={field.placeholder}
                                                style={{
                                                    width: '100%', padding: '0.75rem 1rem',
                                                    background: '#FFF8F1', border: '1px solid rgba(208,197,178,0.5)',
                                                    borderRadius: '0.625rem', color: '#231A03',
                                                    fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem',
                                                    outline: 'none', transition: 'border-color 0.2s',
                                                    boxSizing: 'border-box',
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(208,197,178,0.5)'}
                                            />
                                        </div>
                                    ))}
                                    {/* Price */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7E7665', marginBottom: '0.5rem' }}>Price</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="number" name="priceAmount" required value={formData.priceAmount} onChange={handleInputChange} placeholder="0"
                                                style={{ flex: 2, padding: '0.75rem 1rem', background: '#FFF8F1', border: '1px solid rgba(208,197,178,0.5)', borderRadius: '0.625rem', color: '#231A03', fontFamily: "'Inter', sans-serif", fontSize: '0.9375rem', outline: 'none' }}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(208,197,178,0.5)'}
                                            />
                                            <select
                                                name="priceCurrency" value={formData.priceCurrency} onChange={handleInputChange}
                                                style={{ flex: 1, padding: '0.75rem 0.5rem', background: '#FFF8F1', border: '1px solid rgba(208,197,178,0.5)', borderRadius: '0.625rem', color: '#231A03', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}
                                                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(208,197,178,0.5)'}
                                            >
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="JPY">JPY</option>
                                                <option value="INR">INR</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                    <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
                                    <button type="submit" disabled={formLoading} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                        {formLoading ? 'Saving...' : editingId ? 'Update Variant' : 'Create Variant'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Variants List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {variants.length === 0 && !showForm ? (
                                <div style={{
                                    textAlign: 'center', padding: '4rem 2rem',
                                    background: '#FFFFFF', borderRadius: '1.25rem',
                                    border: '1.5px dashed rgba(208,197,178,0.5)',
                                }}>
                                    <p style={{ color: '#7E7665', fontSize: '0.9375rem', marginBottom: '1rem' }}>No variants added yet.</p>
                                    <button onClick={() => setShowForm(true)} style={{ color: '#C9A84C', fontSize: '0.875rem', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Add your first variant →
                                    </button>
                                </div>
                            ) : (
                                variants.map(variant => (
                                    <VariantRow key={variant._id} variant={variant} onEdit={handleEditClick} onDelete={handleDelete} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VariantRow({ variant, onEdit, onDelete }) {
    const [hovered, setHovered] = useState(false);
    const currencySymbol = variant.price?.currency === 'USD' ? '$' : variant.price?.currency === 'EUR' ? '€' : variant.price?.currency === 'GBP' ? '£' : variant.price?.currency === 'INR' ? '₹' : variant.price?.currency;
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                padding: '1.125rem 1.5rem',
                background: '#FFFFFF', borderRadius: '1rem',
                border: hovered ? '1.5px solid rgba(201,168,76,0.35)' : '1.5px solid rgba(208,197,178,0.3)',
                boxShadow: hovered ? '0 4px 20px rgba(35,26,3,0.08)' : '0 1px 6px rgba(35,26,3,0.04)',
                transition: 'all 0.2s',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '0.625rem',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <svg width="18" height="18" fill="none" stroke="#C9A84C" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <div>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', color: '#231A03', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        {variant.attributes?.color} — {variant.attributes?.size}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#7E7665' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
                            {currencySymbol}{variant.price?.amount}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: variant.stock > 0 ? '#2D6A4F' : '#BA1A1A', display: 'inline-block' }} />
                            {variant.stock} in stock
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
                <button
                    onClick={() => onEdit(variant)}
                    style={{
                        padding: '0.5rem 1rem', borderRadius: '9999px',
                        background: 'rgba(201,168,76,0.08)', border: '1.5px solid rgba(201,168,76,0.3)',
                        color: '#A07830', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.08)'}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(variant._id)}
                    style={{
                        padding: '0.5rem 1rem', borderRadius: '9999px',
                        background: 'rgba(186,26,26,0.06)', border: '1.5px solid rgba(186,26,26,0.2)',
                        color: '#BA1A1A', fontFamily: "'Inter', sans-serif",
                        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(186,26,26,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(186,26,26,0.06)'}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
